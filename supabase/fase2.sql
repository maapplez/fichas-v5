create table catalog(id uuid primary key default gen_random_uuid(), kind text not null, name text not null, level int, description text not null default '', source text not null default 'Própria', data jsonb not null default '{}', created_by uuid not null default auth.uid() references profiles(id), created_at timestamptz default now());
alter table catalog enable row level security;
create policy "ver catálogo" on catalog for select using (auth.uid() is not null);
create policy "criar item" on catalog for insert with check (created_by=auth.uid());
create policy "editar item" on catalog for update using (created_by=auth.uid() or is_master());
create policy "apagar item" on catalog for delete using (created_by=auth.uid() or is_master());
