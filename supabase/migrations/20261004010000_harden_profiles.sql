-- Supabase grants full table privileges to `anon` and `authenticated` by default,
-- so today RLS is the only thing stopping writes to `profiles`. Remove the grants
-- too, so a future UPDATE policy (e.g. for editing the name, US-013) can't
-- accidentally let users change their own `role`. Grant column-level
-- `update (name)` when that feature lands.
revoke all on table public.profiles from anon;
revoke insert, update, delete, truncate, references, trigger
  on table public.profiles from authenticated;

-- The sign-up form limits the name, but the Auth API can be called directly
-- with any metadata. Enforce the same rule in the database.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, btrim(coalesce(new.raw_user_meta_data ->> 'name', '')));
  return new;
end;
$$;

alter table public.profiles
  add constraint profiles_name_length check (char_length(name) between 2 and 100);
