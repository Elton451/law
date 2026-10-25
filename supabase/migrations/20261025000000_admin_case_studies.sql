-- Admin: gerenciar casos concretos (US-024). Admins read every case (active or
-- not) with its answer key and attempt count; every write goes through the
-- functions below, which check the caller's role in `profiles` (US-004).

-- Whether the caller is the admin. `security definer` so it can read the
-- caller's profile from inside other tables' policies.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

-- The admin form limits these too; the functions can be called directly.
alter table public.case_studies
  add constraint case_studies_title_length check (char_length(btrim(title)) between 1 and 200),
  add constraint case_studies_statement_length
    check (char_length(btrim(statement)) between 1 and 20000),
  add constraint case_studies_exam_edition_length
    check (exam_edition is null or char_length(btrim(exam_edition)) between 1 and 50);

alter table public.case_study_answer_keys
  add constraint case_study_answer_keys_lengths check (
    char_length(btrim(piece)) between 1 and 200
    and char_length(btrim(addressing)) between 1 and 20000
    and char_length(btrim(qualification)) between 1 and 20000
    and char_length(btrim(grounds)) between 1 and 20000
    and char_length(btrim(requests)) between 1 and 20000
    and char_length(btrim(closing)) between 1 and 20000
  );

-- When the case's content (statement or answer key) last changed. Students who
-- submitted before that are warned their correction may not match the case
-- anymore. Toggling `is_active` is not a content change.
alter table public.case_studies
  add column content_updated_at timestamptz not null default now();
update public.case_studies set content_updated_at = created_at;

create function public.touch_case_study_content()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (new.trail_id, new.title, new.statement, new.origin, new.exam_edition)
    is distinct from (old.trail_id, old.title, old.statement, old.origin, old.exam_edition)
  then
    new.content_updated_at := now();
  end if;
  return new;
end;
$$;

create trigger case_studies_touch_content
  before update on public.case_studies
  for each row execute procedure public.touch_case_study_content();

create function public.touch_case_study_answer_key()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new is distinct from old then
    update public.case_studies set content_updated_at = now() where id = new.case_study_id;
  end if;
  return new;
end;
$$;

create trigger case_study_answer_keys_touch_case
  after update on public.case_study_answer_keys
  for each row execute procedure public.touch_case_study_answer_key();

revoke execute on function
  public.touch_case_study_content(),
  public.touch_case_study_answer_key()
  from public, anon, authenticated;

create policy "Admins can read every case"
  on public.case_studies for select to authenticated
  using ((select public.is_admin()));

-- Cases for the admin list, optionally filtered by trail and origin, newest
-- first, with how many attempts each has (those can't be deleted, only deactivated).
create function public.admin_list_case_studies(
  p_trail_id uuid default null,
  p_origin public.case_origin default null
)
returns table (
  id uuid,
  trail_id uuid,
  trail_name text,
  title text,
  origin public.case_origin,
  exam_edition text,
  is_active boolean,
  created_at timestamptz,
  attempt_count integer
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
    c.id,
    c.trail_id,
    t.name,
    c.title,
    c.origin,
    c.exam_edition,
    c.is_active,
    c.created_at,
    (select count(*)::integer from public.case_attempts a where a.case_study_id = c.id)
  from public.case_studies c
  join public.trails t on t.id = c.trail_id
  where (p_trail_id is null or c.trail_id = p_trail_id)
    and (p_origin is null or c.origin = p_origin)
  order by c.created_at desc, c.id;
end;
$$;

-- One case with its answer key, for the edit form; no row when it doesn't exist.
create function public.admin_get_case_study(p_case_id uuid)
returns table (
  id uuid,
  trail_id uuid,
  title text,
  statement text,
  origin public.case_origin,
  exam_edition text,
  is_active boolean,
  attempt_count integer,
  piece text,
  addressing text,
  qualification text,
  grounds text,
  requests text,
  closing text
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
    c.id,
    c.trail_id,
    c.title,
    c.statement,
    c.origin,
    c.exam_edition,
    c.is_active,
    (select count(*)::integer from public.case_attempts a where a.case_study_id = c.id),
    k.piece,
    k.addressing,
    k.qualification,
    k.grounds,
    k.requests,
    k.closing
  from public.case_studies c
  join public.case_study_answer_keys k on k.case_study_id = c.id
  where c.id = p_case_id;
end;
$$;

-- Creates the case (`p_case_id` null) or updates it, together with its answer
-- key, in one transaction. Returns the case id. An active case is in the
-- training draw as soon as this commits (US-024).
create function public.admin_save_case_study(p_case_id uuid, p_case jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_case uuid := p_case_id;
  v_trail uuid := (p_case ->> 'trail_id')::uuid;
  v_origin public.case_origin := (p_case ->> 'origin')::public.case_origin;
  v_edition text := case when v_origin = 'oab' then btrim(p_case ->> 'exam_edition') end;
begin
  if not public.is_admin() then
    raise exception 'admin only' using errcode = '42501';
  end if;

  if v_case is null then
    insert into public.case_studies (trail_id, title, statement, origin, exam_edition, is_active)
    values (
      v_trail,
      btrim(p_case ->> 'title'),
      btrim(p_case ->> 'statement'),
      v_origin,
      v_edition,
      coalesce((p_case ->> 'is_active')::boolean, true)
    )
    returning id into v_case;
  else
    -- Attempts are tied to their case's trail (case_attempts_case_trail_fkey).
    if exists (
      select 1 from public.case_studies c
      where c.id = v_case
        and c.trail_id is distinct from v_trail
        and exists (select 1 from public.case_attempts a where a.case_study_id = c.id)
    ) then
      raise exception 'case has attempts: its trail cannot change' using errcode = '23503';
    end if;

    update public.case_studies
    set
      trail_id = v_trail,
      title = btrim(p_case ->> 'title'),
      statement = btrim(p_case ->> 'statement'),
      origin = v_origin,
      exam_edition = v_edition,
      is_active = coalesce((p_case ->> 'is_active')::boolean, true)
    where id = v_case;

    if not found then
      raise exception 'case not found' using errcode = 'P0002';
    end if;
  end if;

  insert into public.case_study_answer_keys
    (case_study_id, piece, addressing, qualification, grounds, requests, closing)
  values (
    v_case,
    btrim(p_case ->> 'piece'),
    btrim(p_case ->> 'addressing'),
    btrim(p_case ->> 'qualification'),
    btrim(p_case ->> 'grounds'),
    btrim(p_case ->> 'requests'),
    btrim(p_case ->> 'closing')
  )
  on conflict (case_study_id) do update
  set
    piece = excluded.piece,
    addressing = excluded.addressing,
    qualification = excluded.qualification,
    grounds = excluded.grounds,
    requests = excluded.requests,
    closing = excluded.closing;

  return v_case;
end;
$$;

-- Takes the case out of (or back into) the training draw. Students keep seeing
-- deactivated cases they attempted, in their history (US-020).
create function public.admin_set_case_study_active(p_case_id uuid, p_active boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'admin only' using errcode = '42501';
  end if;

  update public.case_studies set is_active = p_active where id = p_case_id;

  if not found then
    raise exception 'case not found' using errcode = 'P0002';
  end if;
end;
$$;

-- Deletes a case nobody attempted. Cases with attempts must be deactivated
-- instead (US-024); the foreign keys would refuse anyway, this says why.
create function public.admin_delete_case_study(p_case_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'admin only' using errcode = '42501';
  end if;

  if exists (select 1 from public.case_attempts a where a.case_study_id = p_case_id) then
    raise exception 'case has attempts: deactivate it instead' using errcode = '23503';
  end if;

  delete from public.case_studies where id = p_case_id;

  if not found then
    raise exception 'case not found' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function
  public.is_admin(),
  public.admin_list_case_studies(uuid, public.case_origin),
  public.admin_get_case_study(uuid),
  public.admin_save_case_study(uuid, jsonb),
  public.admin_set_case_study_active(uuid, boolean),
  public.admin_delete_case_study(uuid)
  from public, anon;
grant execute on function
  public.is_admin(),
  public.admin_list_case_studies(uuid, public.case_origin),
  public.admin_get_case_study(uuid),
  public.admin_save_case_study(uuid, jsonb),
  public.admin_set_case_study_active(uuid, boolean),
  public.admin_delete_case_study(uuid)
  to authenticated;
