-- Admin: gerenciar flashcards (US-023). Admins add cards to a lesson (one at a
-- time or many at once, from a Markdown import), edit and remove them. Every
-- write goes through the functions below, which check the caller's role.
-- Editing keeps students' review history; removing is a soft delete (US-010).

-- Every live lesson, in trail, module and lesson order, with its card count:
-- the admin picks the lesson to manage from here.
create function public.admin_list_flashcard_lessons()
returns table (
  trail_id uuid,
  trail_name text,
  module_id uuid,
  module_title text,
  lesson_id uuid,
  lesson_title text,
  card_count integer
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'admin only' using errcode = '42501';
  end if;

  return query
  select
    t.id,
    t.name,
    m.id,
    m.title,
    l.id,
    l.title,
    (
      select count(*)::integer from public.flashcards f
      where f.lesson_id = l.id and f.deleted_at is null
    )
  from public.lessons l
  join public.modules m on m.id = l.module_id
  join public.trails t on t.id = m.trail_id
  where l.deleted_at is null and m.deleted_at is null
  order by t.name, m.position, l.position;
end;
$$;

-- Appends the cards (a JSON array of {front, back}, 1 to 200) to the end of the
-- lesson, in the given order, all or none. Returns how many were added.
create function public.admin_add_flashcards(p_lesson_id uuid, p_cards jsonb)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_next integer;
  v_count integer;
begin
  if not public.is_admin() then
    raise exception 'admin only' using errcode = '42501';
  end if;

  if jsonb_typeof(p_cards) is distinct from 'array'
    or jsonb_array_length(p_cards) not between 1 and 200
  then
    raise exception 'between 1 and 200 cards per call' using errcode = '22023';
  end if;

  -- Locks the lesson so concurrent imports can't take the same positions.
  perform 1
  from public.lessons l
  join public.modules m on m.id = l.module_id
  where l.id = p_lesson_id and l.deleted_at is null and m.deleted_at is null
  for update of l;

  if not found then
    raise exception 'lesson not found' using errcode = 'P0002';
  end if;

  select coalesce(max(f.position), 0) into v_next
  from public.flashcards f
  where f.lesson_id = p_lesson_id;

  -- Missing sides arrive as null and fail the not-null constraint.
  insert into public.flashcards (lesson_id, front, back, position)
  select p_lesson_id, btrim(card ->> 'front'), btrim(card ->> 'back'), v_next + ordinality
  from jsonb_array_elements(p_cards) with ordinality as cards (card, ordinality);

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- Rewrites a card. Students keep its box and next review date (US-023).
create function public.admin_update_flashcard(p_flashcard_id uuid, p_front text, p_back text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'admin only' using errcode = '42501';
  end if;

  update public.flashcards
  set front = btrim(p_front), back = btrim(p_back)
  where id = p_flashcard_id and deleted_at is null;

  if not found then
    raise exception 'flashcard not found' using errcode = 'P0002';
  end if;
end;
$$;

-- Takes the card out of its lesson and out of every student's reviews. Soft
-- delete: the review history stays in the database.
create function public.admin_delete_flashcard(p_flashcard_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'admin only' using errcode = '42501';
  end if;

  update public.flashcards
  set deleted_at = now()
  where id = p_flashcard_id and deleted_at is null;

  if not found then
    raise exception 'flashcard not found' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function
  public.admin_list_flashcard_lessons(),
  public.admin_add_flashcards(uuid, jsonb),
  public.admin_update_flashcard(uuid, text, text),
  public.admin_delete_flashcard(uuid)
  from public, anon;
grant execute on function
  public.admin_list_flashcard_lessons(),
  public.admin_add_flashcards(uuid, jsonb),
  public.admin_update_flashcard(uuid, text, text),
  public.admin_delete_flashcard(uuid)
  to authenticated;
