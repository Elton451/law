-- Hardens the case-study flow (US-017, US-018):
--   1. At most one unfinished attempt per student and trail, enforced by the
--      database, so concurrent starts can't leave orphan attempts behind.
--   2. "Gerar outro teste" swaps the attempt in one transaction: if no new
--      attempt can be started, the current one (and its text) is kept.
--   3. Answer keys unlock per attempt, not per case: retaking a case already
--      submitted no longer ships its answer key with the new attempt.

-- 1. One unfinished attempt per trail -------------------------------------------

-- Copied from the case so the unique index below can see it. The composite key
-- keeps it in sync: it must always be the trail of the attempt's case.
alter table public.case_studies
  add constraint case_studies_id_trail_id_key unique (id, trail_id);

alter table public.case_attempts add column trail_id uuid;

update public.case_attempts a
set trail_id = c.trail_id
from public.case_studies c
where c.id = a.case_study_id;

alter table public.case_attempts
  alter column trail_id set not null,
  add constraint case_attempts_case_trail_fkey
    foreign key (case_study_id, trail_id)
    references public.case_studies (id, trail_id) on delete restrict;

-- Duplicates left by the race this migration fixes. Only the newest one was ever
-- reachable (start_case_attempt resumed it), so the older ones are orphans.
delete from public.case_attempts a
using public.case_attempts newer
where a.submitted_at is null
  and newer.submitted_at is null
  and newer.user_id = a.user_id
  and newer.trail_id = a.trail_id
  and (newer.started_at, newer.id) > (a.started_at, a.id);

create unique index case_attempts_one_open_per_trail
  on public.case_attempts (user_id, trail_id)
  where submitted_at is null;

-- Same contract as before: starts a training attempt in a trail and returns its
-- id, or null when the trail has no active case; resumes the student's
-- unfinished attempt in that trail if there is one.
create or replace function public.start_case_attempt(
  p_trail_id uuid,
  p_exclude_case_id uuid default null
)
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
  where a.user_id = v_user and a.trail_id = p_trail_id and a.submitted_at is null;

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
  insert into public.case_attempts (user_id, case_study_id, trail_id, time_limit_minutes)
  values (v_user, v_case, p_trail_id, 60)
  on conflict (user_id, trail_id) where submitted_at is null do nothing
  returning id into v_attempt;

  -- A concurrent call opened one first: resume it.
  if v_attempt is null then
    select a.id into v_attempt
    from public.case_attempts a
    where a.user_id = v_user and a.trail_id = p_trail_id and a.submitted_at is null;
  end if;

  return v_attempt;
end;
$$;

-- 2. "Gerar outro teste" in one step -------------------------------------------

-- Discards the student's own unfinished attempt and starts another in the same
-- trail, skipping that case when there's another one. All or nothing.
create function public.restart_case_attempt(p_attempt_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_trail uuid;
  v_case uuid;
  v_attempt uuid;
begin
  delete from public.case_attempts
  where id = p_attempt_id and user_id = auth.uid() and submitted_at is null
  returning trail_id, case_study_id into v_trail, v_case;

  if not found then
    raise exception 'attempt not found or already submitted' using errcode = 'P0002';
  end if;

  v_attempt := public.start_case_attempt(v_trail, v_case);

  -- Raising rolls the delete back, so the student keeps the current attempt.
  if v_attempt is null then
    raise exception 'no active case in this trail' using errcode = 'P0002';
  end if;

  return v_attempt;
end;
$$;

-- Replaced by restart_case_attempt: discarding alone left the student with no attempt.
drop function public.discard_case_attempt(uuid);

-- 3. Answer keys per attempt -----------------------------------------------------

drop policy "Students can read answer keys of cases they submitted"
  on public.case_study_answer_keys;
revoke select on table public.case_study_answer_keys from authenticated;

-- The answer key for one of the student's own submitted attempts; no row otherwise.
create function public.get_case_answer_key(p_attempt_id uuid)
returns setof public.case_study_answer_keys
language sql
stable
security definer
set search_path = ''
as $$
  select k.*
  from public.case_study_answer_keys k
  join public.case_attempts a on a.case_study_id = k.case_study_id
  where a.id = p_attempt_id
    and a.user_id = (select auth.uid())
    and a.submitted_at is not null;
$$;

revoke execute on function
  public.restart_case_attempt(uuid),
  public.get_case_answer_key(uuid)
  from public, anon;
grant execute on function
  public.restart_case_attempt(uuid),
  public.get_case_answer_key(uuid)
  to authenticated;
