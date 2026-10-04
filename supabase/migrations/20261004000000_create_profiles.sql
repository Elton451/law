-- Profiles: one row per auth user, holding app data Supabase Auth doesn't store.
create type public.user_role as enum ('estudante', 'admin');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  role public.user_role not null default 'estudante',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read only their own profile. There is deliberately no insert/update
-- policy: rows are created by the trigger below, and `role` must only ever be
-- changed directly in the database (US-004).
create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- Create the profile when a user signs up. `role` is never read from user
-- metadata, since the client controls that payload.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
