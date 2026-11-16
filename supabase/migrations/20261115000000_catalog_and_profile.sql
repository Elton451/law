-- Etapa 1 (docs/plano-e-decisoes.md): public catalog (SB01, SB02) and the
-- participant profile (SB03, US05).
--
-- Disciplines reuse public.trails: the same seven slugs, already referenced by
-- case studies and flashcards. Their color and image live in the frontend,
-- keyed by slug.

-- Visitors browse the seven novelos without an account (US01, US02).
grant select on table public.trails to anon;
create policy "Visitors can read trails"
  on public.trails for select to anon using (true);

-- Exam editions (calendar, SB01). Dates are only what the admin publishes:
-- never derived from promotional art. `is_demo` marks sample data, which the
-- UI must label as demonstrative (US01).
create table public.exam_editions (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique check (number > 0),
  first_phase_date date,
  second_phase_date date not null,
  timezone text not null default 'America/Sao_Paulo',
  published boolean not null default false,
  source_label text check (char_length(source_label) <= 200),
  source_url text check (source_url ~ '^https://'),
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (first_phase_date is null or first_phase_date < second_phase_date)
);

-- One offer = one discipline for one exam edition (RN01). Money in integer
-- cents. `version` is bumped on price changes so orders (Etapa 2) can pin it.
create table public.offers (
  id uuid primary key default gen_random_uuid(),
  trail_id uuid not null references public.trails (id) on delete restrict,
  exam_edition_id uuid not null references public.exam_editions (id) on delete restrict,
  price_cents integer not null check (price_cents > 0),
  active boolean not null default true,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trail_id, exam_edition_id)
);
create index offers_exam_edition_id_idx on public.offers (exam_edition_id);

alter table public.exam_editions enable row level security;
alter table public.offers enable row level security;

-- Read-only for the app. Admin management arrives with the calendar (US29).
revoke all on table public.exam_editions, public.offers from anon, authenticated;
grant select on table public.exam_editions, public.offers to anon, authenticated;

create policy "Anyone can read published exam editions"
  on public.exam_editions for select to anon, authenticated
  using (published);

create policy "Anyone can read offers of published exam editions"
  on public.offers for select to anon, authenticated
  using (
    exists (
      select 1 from public.exam_editions e
      where e.id = exam_edition_id and e.published
    )
  );

-- An offer is on sale while it's active and its edition is published and the
-- second phase hasn't happened yet, in the edition's time zone (SB01: expired
-- content is never shown as a new class for sale).
create function public.offer_is_open(p_offer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.offers o
    join public.exam_editions e on e.id = o.exam_edition_id
    where o.id = p_offer_id
      and o.active
      and e.published
      and e.second_phase_date >= (now() at time zone e.timezone)::date
  );
$$;

revoke execute on function public.offer_is_open(uuid) from public;
grant execute on function public.offer_is_open(uuid) to anon, authenticated;

-- Brazilian federative units (US05).
create function public.is_valid_uf(p_uf text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select p_uf = any (array[
    'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA',
    'PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
  ]);
$$;

-- Profile fields from SB03: full name as on the official document, UF, and the
-- chosen offer (exam + discipline). Choosing an offer grants nothing: access
-- comes only from a confirmed payment (Etapa 2).
--
-- They're nullable because a Google sign-up arrives without them; the app
-- sends such accounts to "completar cadastro" before anything else.
alter table public.profiles alter column name drop not null;
alter table public.profiles
  add column uf char(2) check (public.is_valid_uf(uf)),
  add column offer_id uuid references public.offers (id) on delete set null;
create index profiles_offer_id_idx on public.profiles (offer_id);

-- Password sign-ups must carry every field, valid (US05: validated on the
-- server, since the Auth API can be called directly with any metadata),
-- except for an offer that closed meanwhile.
-- Other providers (Google) may lack them: keep only what's valid and let the
-- participant complete the rest.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_meta jsonb := coalesce(new.raw_user_meta_data, '{}');
  v_strict boolean := coalesce(new.raw_app_meta_data ->> 'provider', 'email') = 'email';
  v_name text := btrim(coalesce(v_meta ->> 'name', v_meta ->> 'full_name', ''));
  v_uf text := upper(btrim(coalesce(v_meta ->> 'uf', '')));
  v_offer_text text := v_meta ->> 'offer_id';
  v_offer uuid;
begin
  if char_length(v_name) not between 2 and 100 then
    if v_strict then
      raise exception 'invalid name' using errcode = '22023';
    end if;
    v_name := null;
  end if;

  if not public.is_valid_uf(v_uf) then
    if v_strict then
      raise exception 'invalid uf' using errcode = '22023';
    end if;
    v_uf := null;
  end if;

  -- An offer that closed while the person was signing up keeps the account
  -- and leaves the choice empty, to be made again (SB02 → Microtextos e falhas).
  if v_offer_text ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    if public.offer_is_open(v_offer_text::uuid) then
      v_offer := v_offer_text::uuid;
    end if;
  elsif v_strict then
    raise exception 'invalid offer' using errcode = '22023';
  end if;

  insert into public.profiles (id, name, uf, offer_id)
  values (new.id, v_name, v_uf, v_offer);
  return new;
end;
$$;
