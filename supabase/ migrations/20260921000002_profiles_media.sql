-- PUBLIC-ish profile data. Other users never read this table directly (see RLS).
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text check (char_length(first_name) between 1 and 40),
  gender_id int references public.lookup_values(id),
  pronoun_id int references public.lookup_values(id),
  orientation_id int references public.lookup_values(id),
  orientation_visible boolean not null default true,
  interested_in int[] not null default '{}',
  occupation text check (char_length(occupation) <= 80),
  employer text check (char_length(employer) <= 80),
  school text check (char_length(school) <= 80),
  education_id int references public.lookup_values(id),
  bio text check (char_length(bio) <= 500),
  height_cm smallint check (height_cm between 100 and 250),
  hometown_city_id int references public.cities(id),
  show_zodiac boolean not null default true,
  is_blue_tick boolean not null default false,
  blue_tick_at timestamptz,
  profile_complete boolean not null default false,   -- server-computed only
  onboarding_step smallint not null default 0,
  status text not null default 'active' check (status in ('active','paused','banned','pending_deletion')),
  last_active_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index profiles_status_complete_idx on public.profiles (status, profile_complete);
create index profiles_hometown_idx on public.profiles (hometown_city_id);

-- PRIVATE data: only the owner (and admins) can read.
create table public.profile_private (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  last_name text check (char_length(last_name) between 1 and 40),
  email citext unique,
  email_verified_at timestamptz,
  phone text,
  dob date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Every S3 object is described here; files themselves live in S3.
create table public.media (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('profile_photo','chat_image','face_check')),
  bucket text not null,
  s3_key text not null unique,
  mime_type text not null,
  size_bytes int not null check (size_bytes > 0),
  width smallint, height smallint, blurhash text,
  moderation_status text not null default 'pending' check (moderation_status in ('pending','ok','rejected')),
  purge_after timestamptz,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index media_owner_idx on public.media (owner_id, kind);
create index media_purge_idx on public.media (purge_after) where purge_after is not null;

-- Ordered profile gallery
create table public.photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  media_id uuid not null unique references public.media(id) on delete cascade,
  position smallint not null check (position between 1 and 6),
  unique (user_id, position) deferrable initially deferred
);
create index photos_user_idx on public.photos (user_id);

-- Optional answers. A missing row = the user skipped.
create table public.user_attributes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  attribute_id smallint not null references public.attribute_definitions(id),
  option_id int not null references public.lookup_values(id),
  visibility text not null default 'public' check (visibility in ('public','matches_only','hidden')),
  updated_at timestamptz not null default now(),
  primary key (user_id, attribute_id, option_id)
);
create index user_attributes_filter_idx on public.user_attributes (attribute_id, option_id);

create table public.user_interests (
  user_id uuid not null references public.profiles(id) on delete cascade,
  interest_id smallint not null references public.interests(id),
  primary key (user_id, interest_id)
);

-- Self-declared college, chosen from the list
create table public.user_colleges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  college_id int not null references public.colleges(id),
  course text check (char_length(course) <= 80),
  study_year smallint check (study_year between 1 and 8),
  grad_year smallint check (grad_year between 2000 and 2100),
  is_current boolean not null default true,
  show_on_profile boolean not null default true,
  created_at timestamptz not null default now()
);
create unique index user_colleges_one_current on public.user_colleges (user_id) where is_current;
create index user_colleges_college_idx on public.user_colleges (college_id) where is_current;

-- College missing from the list
create table public.college_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 150),
  state_id smallint not null references public.states(id),
  city_id int not null references public.cities(id),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_college_id int references public.colleges(id),
  created_at timestamptz not null default now()
);

-- Blue tick = an approved 'email' row AND an approved 'face' row
create table public.verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('email','face')),
  status text not null default 'pending' check (status in ('pending','approved','rejected','expired')),
  provider text check (provider in ('aws_rekognition','manual','email_otp')),
  provider_ref text,
  match_score numeric,
  media_id uuid references public.media(id) on delete set null,
  attempts smallint not null default 0,
  reviewed_by uuid references public.admins(id),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index verifications_user_idx on public.verifications (user_id, type);

-- Email OTP challenges (phone OTP lives in Supabase Auth). Never store the code itself.
create table public.otp_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  purpose text not null check (purpose in ('email_verify','email_change')),
  target text not null,
  code_hash text not null,
  attempts smallint not null default 0,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);
create index otp_challenges_user_idx on public.otp_challenges (user_id, created_at desc);