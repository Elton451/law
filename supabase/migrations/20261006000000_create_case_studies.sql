-- Estudo de caso (US-015, US-017, US-018, US-019): concrete cases, their answer
-- keys, and each student's attempts.

create type public.case_origin as enum ('oab', 'autoral');

create table public.case_studies (
  id uuid primary key default gen_random_uuid(),
  -- `restrict`: cases with attempts are deactivated, never deleted (US-020, US-024).
  trail_id uuid not null references public.trails (id) on delete restrict,
  title text not null,
  statement text not null,
  origin public.case_origin not null,
  -- e.g. 'XXXV Exame'; required for OAB cases, absent for authored ones.
  exam_edition text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint case_studies_exam_edition_matches_origin
    check ((origin = 'oab') = (exam_edition is not null))
);
create index case_studies_trail_id_idx on public.case_studies (trail_id) where is_active;

-- Kept apart from `case_studies` so RLS can hide it until the student submits.
create table public.case_study_answer_keys (
  case_study_id uuid primary key references public.case_studies (id) on delete cascade,
  piece text not null,
  addressing text not null,
  qualification text not null,
  grounds text not null,
  requests text not null,
  closing text not null
);

create table public.case_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  case_study_id uuid not null references public.case_studies (id) on delete restrict,
  -- Copied at start, so changing the setting later (US-014) never alters a running timer.
  time_limit_minutes integer not null check (time_limit_minutes between 30 and 90),
  -- Server time: the timer counts from here, so a reload never restarts it (US-018).
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  identified_piece text not null default '',
  addressing text not null default '',
  qualification text not null default '',
  grounds text not null default '',
  requests text not null default '',
  closing text not null default '',
  constraint case_attempts_answer_lengths check (
    char_length(identified_piece) <= 200
    and char_length(addressing) <= 20000
    and char_length(qualification) <= 20000
    and char_length(grounds) <= 20000
    and char_length(requests) <= 20000
    and char_length(closing) <= 20000
  )
);
create index case_attempts_user_case_idx on public.case_attempts (user_id, case_study_id);
create index case_attempts_case_study_id_idx on public.case_attempts (case_study_id);

-- Reads go through RLS; every write goes through the functions below, so the
-- client can never set its own start time, time limit or submission time.
alter table public.case_studies enable row level security;
alter table public.case_study_answer_keys enable row level security;
alter table public.case_attempts enable row level security;

revoke all on table public.case_studies, public.case_study_answer_keys, public.case_attempts
  from anon;
revoke insert, update, delete, truncate, references, trigger
  on table public.case_studies, public.case_study_answer_keys, public.case_attempts
  from authenticated;

-- Active cases, plus deactivated ones the student already attempted (their history).
create policy "Signed-in users can read active or attempted cases"
  on public.case_studies for select to authenticated
  using (
    is_active
    or exists (
      select 1 from public.case_attempts a
      where a.case_study_id = case_studies.id and a.user_id = (select auth.uid())
    )
  );

-- The answer key only unlocks after the student submits an attempt at that case.
create policy "Students can read answer keys of cases they submitted"
  on public.case_study_answer_keys for select to authenticated
  using (
    exists (
      select 1 from public.case_attempts a
      where a.case_study_id = case_study_answer_keys.case_study_id
        and a.user_id = (select auth.uid())
        and a.submitted_at is not null
    )
  );

create policy "Students can read their own attempts"
  on public.case_attempts for select to authenticated
  using ((select auth.uid()) = user_id);

-- Starts a training attempt in a trail and returns its id, or null when the trail
-- has no active case. Resumes the student's unfinished attempt in that trail if
-- there is one. Prefers cases the student hasn't submitted yet (US-017);
-- `p_exclude_case_id` skips the case just discarded ("Gerar outro teste").
create function public.start_case_attempt(p_trail_id uuid, p_exclude_case_id uuid default null)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_attempt uuid;
  v_case uuid;
begin
  if v_user is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select a.id into v_attempt
  from public.case_attempts a
  join public.case_studies c on c.id = a.case_study_id
  where a.user_id = v_user and a.submitted_at is null and c.trail_id = p_trail_id
  order by a.started_at desc
  limit 1;

  if v_attempt is not null then
    return v_attempt;
  end if;

  select c.id into v_case
  from public.case_studies c
  where c.trail_id = p_trail_id
    and c.is_active
    and c.id is distinct from p_exclude_case_id
  order by
    exists (
      select 1 from public.case_attempts a
      where a.case_study_id = c.id and a.user_id = v_user and a.submitted_at is not null
    ),
    random()
  limit 1;

  -- The excluded case may be the trail's only one.
  if v_case is null then
    select c.id into v_case
    from public.case_studies c
    where c.trail_id = p_trail_id and c.is_active
    limit 1;
  end if;

  if v_case is null then
    return null;
  end if;

  -- 60 min is the default exam time (US-014). Read it from the student's
  -- settings once that story lands.
  insert into public.case_attempts (user_id, case_study_id, time_limit_minutes)
  values (v_user, v_case, 60)
  returning id into v_attempt;

  return v_attempt;
end;
$$;

-- Autosaves the answers of the student's own unfinished attempt (US-017).
create function public.save_case_draft(p_attempt_id uuid, p_answers jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.case_attempts
  set
    identified_piece = coalesce(p_answers ->> 'identified_piece', ''),
    addressing = coalesce(p_answers ->> 'addressing', ''),
    qualification = coalesce(p_answers ->> 'qualification', ''),
    grounds = coalesce(p_answers ->> 'grounds', ''),
    requests = coalesce(p_answers ->> 'requests', ''),
    closing = coalesce(p_answers ->> 'closing', '')
  where id = p_attempt_id and user_id = auth.uid() and submitted_at is null;

  if not found then
    raise exception 'attempt not found or already submitted' using errcode = 'P0002';
  end if;
end;
$$;

-- Saves the final answers and stamps the submission time (US-017, US-018).
create function public.submit_case_attempt(p_attempt_id uuid, p_answers jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.save_case_draft(p_attempt_id, p_answers);

  update public.case_attempts
  set submitted_at = now()
  where id = p_attempt_id and user_id = auth.uid() and submitted_at is null;
end;
$$;

-- Throws away the student's own unfinished attempt ("Gerar outro teste", US-017).
create function public.discard_case_attempt(p_attempt_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.case_attempts
  where id = p_attempt_id and user_id = auth.uid() and submitted_at is null;
end;
$$;

revoke execute on function
  public.start_case_attempt(uuid, uuid),
  public.save_case_draft(uuid, jsonb),
  public.submit_case_attempt(uuid, jsonb),
  public.discard_case_attempt(uuid)
  from public, anon;
grant execute on function
  public.start_case_attempt(uuid, uuid),
  public.save_case_draft(uuid, jsonb),
  public.submit_case_attempt(uuid, jsonb),
  public.discard_case_attempt(uuid)
  to authenticated;
