-- Content hierarchy: Trilha → Módulos → Lições (docs/README.md), plus the
-- per-student lesson completions that trail progress is computed from (US-006, US-007).

create table public.trails (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  created_at timestamptz not null default now()
);

-- The 7 trails are fixed and managed only in the database (no CRUD, US-006).
-- The slug is the stable key the frontend maps to each trail's color.
insert into public.trails (slug, name) values
  ('administrativo', 'Administrativo'),
  ('civil', 'Civil'),
  ('constitucional', 'Constitucional'),
  ('empresarial', 'Empresarial'),
  ('penal', 'Penal'),
  ('trabalhista', 'Trabalhista'),
  ('tributario', 'Tributário');

-- `deleted_at` = soft delete, so removing content never erases students' progress (US-021).
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  trail_id uuid not null references public.trails (id) on delete cascade,
  title text not null,
  description text,
  position integer not null,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);
create index modules_trail_id_idx on public.modules (trail_id);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  title text not null,
  position integer not null,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);
create index lessons_module_id_idx on public.lessons (module_id);

create table public.lesson_completions (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create index lesson_completions_lesson_id_idx on public.lesson_completions (lesson_id);

-- Read-only for the app for now. Admin writes arrive with the admin panel (US-021),
-- and completions are written by the lesson logic (US-007 to US-009).
alter table public.trails enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_completions enable row level security;

revoke all on table public.trails, public.modules, public.lessons, public.lesson_completions from anon;
revoke insert, update, delete, truncate, references, trigger
  on table public.trails, public.modules, public.lessons, public.lesson_completions
  from authenticated;

create policy "Signed-in users can read trails"
  on public.trails for select to authenticated using (true);

create policy "Signed-in users can read live modules"
  on public.modules for select to authenticated using (deleted_at is null);

create policy "Signed-in users can read live lessons"
  on public.lessons for select to authenticated using (deleted_at is null);

create policy "Users can read their own completions"
  on public.lesson_completions for select to authenticated
  using ((select auth.uid()) = user_id);

-- Trails in alphabetical order with the signed-in student's progress.
-- `security invoker`: runs under the caller's RLS, so it only ever counts their own completions.
create function public.get_trails_with_progress()
returns table (
  id uuid,
  slug text,
  name text,
  total_lessons integer,
  completed_lessons integer
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    t.id,
    t.slug,
    t.name,
    count(l.id)::integer as total_lessons,
    count(c.lesson_id)::integer as completed_lessons
  from public.trails t
  left join public.modules m on m.trail_id = t.id and m.deleted_at is null
  left join public.lessons l on l.module_id = m.id and l.deleted_at is null
  left join public.lesson_completions c
    on c.lesson_id = l.id and c.user_id = (select auth.uid())
  group by t.id
  order by t.name;
$$;

revoke execute on function public.get_trails_with_progress() from public, anon;
grant execute on function public.get_trails_with_progress() to authenticated;
