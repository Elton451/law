-- Flashcards (US-009) and their spaced repetition (US-010): front/back cards in
-- each lesson, and every student's Leitner box and next review date per card.

-- `deleted_at` = soft delete, like modules and lessons: removing a card never
-- erases students' review history. Editing a card keeps it too (US-023).
create table public.flashcards (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  front text not null,
  back text not null,
  position integer not null,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  constraint flashcards_lengths check (
    char_length(btrim(front)) between 1 and 2000
    and char_length(btrim(back)) between 1 and 5000
  )
);
create index flashcards_lesson_id_idx on public.flashcards (lesson_id) where deleted_at is null;

-- Leitner system (US-010): boxes 1 to 5, reviewed every 1, 3, 7, 14 and 30 days.
create table public.flashcard_reviews (
  user_id uuid not null references auth.users (id) on delete cascade,
  flashcard_id uuid not null references public.flashcards (id) on delete cascade,
  box smallint not null check (box between 1 and 5),
  -- A day, not an instant: a card due "tomorrow" is due all of tomorrow.
  due_on date not null,
  last_reviewed_at timestamptz not null default now(),
  primary key (user_id, flashcard_id)
);
create index flashcard_reviews_user_due_idx on public.flashcard_reviews (user_id, due_on);
create index flashcard_reviews_flashcard_id_idx on public.flashcard_reviews (flashcard_id);

-- Reads go through RLS; review writes only through review_flashcard below, so
-- the client can never pick its own box or due date.
alter table public.flashcards enable row level security;
alter table public.flashcard_reviews enable row level security;

revoke all on table public.flashcards, public.flashcard_reviews from anon;
revoke insert, update, delete, truncate, references, trigger
  on table public.flashcards, public.flashcard_reviews
  from authenticated;

-- Live cards of live lessons in live modules.
create policy "Signed-in users can read live flashcards"
  on public.flashcards for select to authenticated
  using (
    deleted_at is null
    and exists (
      select 1
      from public.lessons l
      join public.modules m on m.id = l.module_id
      where l.id = flashcards.lesson_id and l.deleted_at is null and m.deleted_at is null
    )
  );

create policy "Students can read their own reviews"
  on public.flashcard_reviews for select to authenticated
  using ((select auth.uid()) = user_id);

-- The student's calendar day. Study days follow America/Sao_Paulo (US-012).
create function public.study_today()
returns date
language sql
stable
set search_path = ''
as $$
  select (now() at time zone 'America/Sao_Paulo')::date;
$$;

-- Records the student's self-assessment of a card (US-009) and schedules its
-- next review (US-010). A card seen for the first time enters box 1; a correct
-- answer moves it one box up (to at most 5), a wrong one back to box 1.
-- Returns the next review date.
create function public.review_flashcard(p_flashcard_id uuid, p_correct boolean)
returns date
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_intervals constant integer[] := array[1, 3, 7, 14, 30];
  v_box smallint;
  v_due date;
begin
  if v_user is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.flashcards f
    join public.lessons l on l.id = f.lesson_id
    join public.modules m on m.id = l.module_id
    where f.id = p_flashcard_id
      and f.deleted_at is null and l.deleted_at is null and m.deleted_at is null
  ) then
    raise exception 'flashcard not found' using errcode = 'P0002';
  end if;

  select r.box into v_box
  from public.flashcard_reviews r
  where r.user_id = v_user and r.flashcard_id = p_flashcard_id
  for update;

  v_box := case when p_correct then least(coalesce(v_box, 1) + 1, 5) else 1 end;
  v_due := public.study_today() + v_intervals[v_box];

  insert into public.flashcard_reviews (user_id, flashcard_id, box, due_on)
  values (v_user, p_flashcard_id, v_box, v_due)
  on conflict (user_id, flashcard_id) do update
  set box = excluded.box, due_on = excluded.due_on, last_reviewed_at = now();

  return v_due;
end;
$$;

-- The student's cards due for review today, oldest due first, optionally only
-- from one trail. `p_limit` caps the session (at most 100).
create function public.get_due_flashcards(p_trail_id uuid default null, p_limit integer default 50)
returns table (id uuid, front text, back text)
language sql
stable
security invoker
set search_path = ''
as $$
  select f.id, f.front, f.back
  from public.flashcard_reviews r
  join public.flashcards f on f.id = r.flashcard_id
  join public.lessons l on l.id = f.lesson_id
  join public.modules m on m.id = l.module_id
  where r.user_id = (select auth.uid())
    and r.due_on <= public.study_today()
    and f.deleted_at is null and l.deleted_at is null and m.deleted_at is null
    and (p_trail_id is null or m.trail_id = p_trail_id)
  order by r.due_on, r.box, f.id
  limit least(greatest(p_limit, 1), 100);
$$;

-- How many cards the student has due today in each trail (zero included), in
-- the trails' alphabetical order (US-010).
create function public.get_flashcard_due_counts()
returns table (trail_id uuid, slug text, name text, due_count integer)
language sql
stable
security invoker
set search_path = ''
as $$
  select t.id, t.slug, t.name, count(f.id)::integer
  from public.trails t
  left join public.modules m on m.trail_id = t.id and m.deleted_at is null
  left join public.lessons l on l.module_id = m.id and l.deleted_at is null
  left join public.flashcards f on f.lesson_id = l.id and f.deleted_at is null
    and exists (
      select 1 from public.flashcard_reviews r
      where r.flashcard_id = f.id
        and r.user_id = (select auth.uid())
        and r.due_on <= public.study_today()
    )
  group by t.id
  order by t.name;
$$;

-- The trail's lessons that have flashcards, in module and lesson order, with
-- how many of their cards the student has already studied.
create function public.get_trail_flashcard_lessons(p_trail_id uuid)
returns table (
  module_id uuid,
  module_title text,
  lesson_id uuid,
  lesson_title text,
  card_count integer,
  studied_count integer
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    m.id,
    m.title,
    l.id,
    l.title,
    count(f.id)::integer,
    count(r.flashcard_id)::integer
  from public.modules m
  join public.lessons l on l.module_id = m.id and l.deleted_at is null
  join public.flashcards f on f.lesson_id = l.id and f.deleted_at is null
  left join public.flashcard_reviews r
    on r.flashcard_id = f.id and r.user_id = (select auth.uid())
  where m.trail_id = p_trail_id and m.deleted_at is null
  group by m.id, l.id
  order by m.position, l.position;
$$;

revoke execute on function
  public.study_today(),
  public.review_flashcard(uuid, boolean),
  public.get_due_flashcards(uuid, integer),
  public.get_flashcard_due_counts(),
  public.get_trail_flashcard_lessons(uuid)
  from public, anon;
grant execute on function
  public.study_today(),
  public.review_flashcard(uuid, boolean),
  public.get_due_flashcards(uuid, integer),
  public.get_flashcard_due_counts(),
  public.get_trail_flashcard_lessons(uuid)
  to authenticated;
