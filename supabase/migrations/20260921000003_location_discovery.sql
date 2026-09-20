-- Explicit places the user chose (max 3, enforced by trigger in migration 7)
create table public.user_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  state_id smallint not null references public.states(id),
  city_id int not null references public.cities(id),
  label text not null default 'other' check (label in ('home','study','work','other')),
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, city_id)
);
create unique index user_places_one_primary on public.user_places (user_id) where is_primary;
create index user_places_city_idx on public.user_places (city_id);

-- Current position (COARSE, rounded on the server by set_location())
create table public.user_location (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  coarse_point geography(Point,4326),
  detected_city_id int references public.cities(id),
  permission_state text not null default 'unknown' check (permission_state in ('unknown','granted','denied','revoked')),
  updated_at timestamptz not null default now()
);
create index user_location_point_gix on public.user_location using gist (coarse_point);

-- City-per-day history, deleted after 90 days (retention job)
create table public.location_history (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  city_id int not null references public.cities(id),
  day date not null default current_date,
  unique (user_id, city_id, day)
);

create table public.discovery_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  mode text not null default 'both' check (mode in ('places','nearby','both')),
  active_place_id uuid references public.user_places(id) on delete set null,
  radius_km smallint not null default 25 check (radius_km between 5 and 100),
  min_age smallint not null default 18 check (min_age >= 18),
  max_age smallint not null default 40 check (max_age <= 99),
  show_genders int[] not null default '{}',
  college_scope text not null default 'my_college' check (college_scope in ('my_college','my_city','my_state')),
  attr_filters jsonb not null default '{}'::jsonb,
  verified_only boolean not null default false,
  show_me boolean not null default true,
  show_distance boolean not null default true,
  updated_at timestamptz not null default now(),
  check (min_age <= max_age)
);