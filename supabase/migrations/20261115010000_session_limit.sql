-- At most two signed-in devices per user (RN13, SB12/US26).
--
-- auth.sessions is the source of truth: one row per browser profile (tabs of
-- the same profile share it), deleted by sign-out and by revocation, which
-- also invalidates its refresh tokens. A revoked session's access token stays
-- cryptographically valid until it expires, so its id is recorded here and
-- checked on writes, and the app uses it to tell the person why they were
-- signed out.
--
-- PENDENTE D05: which session to revoke. Implements the PROPOSTA: the one with
-- the oldest login.

create table public.revoked_sessions (
  session_id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  reason text not null check (reason in ('device_limit', 'ended_by_user')),
  revoked_at timestamptz not null default now()
);
create index revoked_sessions_user_id_idx on public.revoked_sessions (user_id);

-- Only reachable through the functions below.
alter table public.revoked_sessions enable row level security;
revoke all on table public.revoked_sessions from anon, authenticated;

-- The session the current request's JWT belongs to.
create function public.current_session_id()
returns uuid
language sql
stable
set search_path = ''
as $$
  select nullif(auth.jwt() ->> 'session_id', '')::uuid;
$$;

-- True when the request comes from a session revoked by the device limit or
-- ended from another device. Use it to refuse writes ("no treino, não
-- sobrescrever o rascunho a partir do dispositivo revogado").
create function public.session_is_revoked()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.revoked_sessions
    where session_id = public.current_session_id()
  );
$$;

-- Called by the app after sign-in and periodically. Returns 'revoked' if this
-- session was already revoked; otherwise keeps it plus the most recent other
-- session, revokes the rest, and returns 'active'. Idempotent.
create function public.register_session()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_session uuid := public.current_session_id();
begin
  if v_user is null or v_session is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  if public.session_is_revoked() then
    return 'revoked';
  end if;

  -- Serializes concurrent logins of the same user, so two new devices can't
  -- both see room for themselves.
  perform 1 from public.profiles where id = v_user for update;

  insert into public.revoked_sessions (session_id, user_id, reason)
  select s.id, v_user, 'device_limit'
  from auth.sessions s
  where s.user_id = v_user
    and s.id <> v_session
    and s.id not in (
      select k.id from auth.sessions k
      where k.user_id = v_user and k.id <> v_session
      order by k.created_at desc
      limit 1
    )
  on conflict (session_id) do nothing;

  delete from auth.sessions s
  using public.revoked_sessions r
  where r.session_id = s.id and r.user_id = v_user;

  return 'active';
end;
$$;

-- The caller's signed-in devices, for "Minha conta" (U10).
create function public.list_my_sessions()
returns table (
  id uuid,
  created_at timestamptz,
  last_active_at timestamptz,
  user_agent text,
  is_current boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    s.id,
    s.created_at,
    coalesce(s.refreshed_at at time zone 'UTC', s.updated_at, s.created_at),
    s.user_agent,
    s.id = public.current_session_id()
  from auth.sessions s
  where s.user_id = auth.uid()
    and not exists (select 1 from public.revoked_sessions r where r.session_id = s.id)
  order by s.created_at desc;
$$;

-- Signs out one of the caller's other devices.
create function public.end_session(p_session_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null or public.session_is_revoked() then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  if p_session_id = public.current_session_id() then
    raise exception 'use sign-out for the current session' using errcode = '22023';
  end if;

  if not exists (select 1 from auth.sessions where id = p_session_id and user_id = v_user) then
    raise exception 'session not found' using errcode = 'P0002';
  end if;

  insert into public.revoked_sessions (session_id, user_id, reason)
  values (p_session_id, v_user, 'ended_by_user')
  on conflict (session_id) do nothing;

  delete from auth.sessions where id = p_session_id and user_id = v_user;
end;
$$;

revoke execute on function
  public.session_is_revoked(),
  public.register_session(),
  public.list_my_sessions(),
  public.end_session(uuid)
  from public, anon;
grant execute on function
  public.session_is_revoked(),
  public.register_session(),
  public.list_my_sessions(),
  public.end_session(uuid)
  to authenticated;

-- A revoked device can't keep saving the piece being written (US26).
create or replace function public.save_case_draft(p_attempt_id uuid, p_answers jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.session_is_revoked() then
    raise exception 'session revoked' using errcode = '42501';
  end if;

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

-- Completes (Google) or edits (Minha conta) the caller's own profile. The
-- offer may be kept as is even after it closed; switching needs an open one.
create function public.update_profile(p_name text, p_uf text, p_offer_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_name text := btrim(coalesce(p_name, ''));
  v_uf text := upper(btrim(coalesce(p_uf, '')));
begin
  if v_user is null or public.session_is_revoked() then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  if char_length(v_name) not between 2 and 100 then
    raise exception 'invalid name' using errcode = '22023';
  end if;
  if not public.is_valid_uf(v_uf) then
    raise exception 'invalid uf' using errcode = '22023';
  end if;
  if p_offer_id is null
     or (
       p_offer_id is distinct from (select offer_id from public.profiles where id = v_user)
       and not public.offer_is_open(p_offer_id)
     ) then
    raise exception 'invalid offer' using errcode = '22023';
  end if;

  update public.profiles
  set name = v_name, uf = v_uf, offer_id = p_offer_id
  where id = v_user;
end;
$$;

revoke execute on function public.update_profile(text, text, uuid) from public, anon;
grant execute on function public.update_profile(text, text, uuid) to authenticated;
