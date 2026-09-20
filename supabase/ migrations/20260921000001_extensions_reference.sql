-- Extensions
create extension if not exists postgis with schema extensions;
create extension if not exists pg_trgm with schema extensions;
create extension if not exists citext  with schema extensions;
create extension if not exists pgcrypto with schema extensions;

-- Admins (referenced by moderation tables)
create table public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('moderator','super_admin')),
  created_at timestamptz not null default now()
);

-- One table for every dropdown list (gender, pronoun, attr:drinking, ...)
create table public.lookup_values (
  id int generated always as identity primary key,
  list_key text not null,
  code text not null,
  label text not null,
  sort_order smallint not null default 0,
  is_active boolean not null default true,
  unique (list_key, code)
);
create index lookup_values_list_idx on public.lookup_values (list_key) where is_active;

-- The optional profile questions
create table public.attribute_definitions (
  id smallint generated always as identity primary key,
  key text not null unique,
  label text not null,
  category text not null check (category in ('beliefs','lifestyle','family','physical','personality','dating','health')),
  input_type text not null check (input_type in ('single','multi')),
  is_sensitive boolean not null default false,
  is_filterable boolean not null default false,
  sort_order smallint not null default 0,
  is_active boolean not null default true
);

create table public.states (
  id smallint generated always as identity primary key,
  country_code char(2) not null default 'IN',
  name text not null,
  code text not null unique
);

create table public.cities (
  id int generated always as identity primary key,
  state_id smallint not null references public.states(id),
  name text not null,
  center geography(Point,4326),
  is_active boolean not null default true,
  unique (state_id, name)
);
create index cities_state_idx on public.cities (state_id);
create index cities_name_trgm on public.cities using gin (name gin_trgm_ops);
create index cities_center_gix on public.cities using gist (center);

create table public.colleges (
  id int generated always as identity primary key,
  state_id smallint not null references public.states(id),
  city_id int not null references public.cities(id),
  name text not null,
  short_name text,
  type text not null default 'college' check (type in ('university','college','institute')),
  location geography(Point,4326),
  source text not null default 'seed' check (source in ('seed','user_added')),
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  unique (city_id, name)
);
create index colleges_state_idx on public.colleges (state_id);
create index colleges_city_idx on public.colleges (city_id);
create index colleges_name_trgm on public.colleges using gin (name gin_trgm_ops);
create index colleges_location_gix on public.colleges using gist (location);

create table public.interests (
  id smallint generated always as identity primary key,
  label text not null unique,
  category text
);