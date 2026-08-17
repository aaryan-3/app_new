-- little space — Supabase schema
-- Run this in the Supabase SQL editor for a new project.
-- Auth: uses Supabase Auth (auth.users). Every table is row-owned and
-- protected with Row Level Security so a user can only ever see their own data.

create extension if not exists "uuid-ossp";

-- Profile (one row per user, created on first sign in)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'love',
  created_at timestamptz not null default now()
);

-- Stress check-ins
create table if not exists stress_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  level smallint not null check (level between 1 and 10),
  tags text[] not null default '{}',
  note text,
  created_at timestamptz not null default now()
);

-- Medications (the medication list itself)
create table if not exists medications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  dosage text,
  time time not null default '08:30',
  frequency text not null default 'Daily',
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

-- Medication logs (taken / skipped / later, one per medication per day)
create table if not exists medication_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  medication_id uuid not null references medications(id) on delete cascade,
  status text not null check (status in ('taken', 'skipped', 'later')),
  date date not null,
  time time not null,
  created_at timestamptz not null default now(),
  unique (medication_id, date)
);

-- Food entries
create table if not exists food_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  meal text not null check (meal in ('Breakfast', 'Lunch', 'Dinner', 'Snack')),
  description text not null,
  note text,
  time time not null,
  date date not null,
  created_at timestamptz not null default now()
);

-- Yoga / movement entries (one per day)
create table if not exists yoga_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  did_yoga boolean not null,
  duration smallint,
  type text,
  note text,
  date date not null,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

-- Daily reflections (one per day)
create table if not exists reflections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  overall_feeling smallint check (overall_feeling between 1 and 10),
  went_well text,
  was_difficult text,
  proud_of text,
  what_helped text,
  let_go_of text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

-- Favorited "For You" messages
create table if not exists favorite_messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  category text not null,
  favorited_at timestamptz not null default now(),
  unique (user_id, message)
);

-- === Row Level Security ===
-- Every table: a user can only select/insert/update/delete their own rows.

alter table profiles enable row level security;
alter table stress_entries enable row level security;
alter table medications enable row level security;
alter table medication_logs enable row level security;
alter table food_entries enable row level security;
alter table yoga_entries enable row level security;
alter table reflections enable row level security;
alter table favorite_messages enable row level security;

create policy "own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own stress entries" on stress_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own medications" on medications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own medication logs" on medication_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own food entries" on food_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own yoga entries" on yoga_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own reflections" on reflections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own favorites" on favorite_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'love'));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helpful indexes
create index if not exists idx_stress_entries_user_created on stress_entries (user_id, created_at desc);
create index if not exists idx_medication_logs_user_date on medication_logs (user_id, date);
create index if not exists idx_food_entries_user_date on food_entries (user_id, date);
create index if not exists idx_yoga_entries_user_date on yoga_entries (user_id, date);
create index if not exists idx_reflections_user_date on reflections (user_id, date);
