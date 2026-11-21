create table profiles(id uuid primary key references auth.users on delete cascade, name text, role text not null default 'player' check (role in ('player','master')));
create table characters(id uuid primary key default gen_random_uuid(), owner uuid not null default auth.uid() references profiles(id) on delete cascade, data jsonb not null, created_at timestamptz default now());

create function is_master() returns boolean language sql security definer stable set search_path=public as $$ select exists(select 1 from profiles where id=auth.uid() and role='master') $$;
create function new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into profiles(id,name) values (new.id, coalesce(new.raw_user_meta_data->>'name', new.email)); return new; end $$;
create trigger on_signup after insert on auth.users for each row execute function new_user();

alter table profiles enable row level security;
alter table characters enable row level security;
create policy "ver perfil" on profiles for select using (id=auth.uid() or is_master());
create policy "ver ficha" on characters for select using (owner=auth.uid() or is_master());
create policy "criar ficha" on characters for insert with check (owner=auth.uid() or is_master());
create policy "editar ficha" on characters for update using (owner=auth.uid() or is_master());
create policy "apagar ficha" on characters for delete using (owner=auth.uid() or is_master());
alter publication supabase_realtime add table characters;
