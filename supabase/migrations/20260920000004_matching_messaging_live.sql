create table public.swipes (
  id bigint generated always as identity primary key,
  swiper_id uuid not null references public.profiles(id) on delete cascade,
  target_id uuid not null references public.profiles(id) on delete cascade,
  direction text not null check (direction in ('like','pass','super')),
  source text not null default 'discover' check (source in ('discover','college','live','blind')),
  created_at timestamptz not null default now(),
  unique (swiper_id, target_id),
  check (swiper_id <> target_id)
);
create index swipes_target_idx on public.swipes (target_id, direction);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  origin text not null default 'swipe' check (origin in ('swipe','request','blind_date','live')),
  status text not null default 'active' check (status in ('active','unmatched')),
  unmatched_by uuid references public.profiles(id),
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  check (user_a < user_b),            -- one row per pair, no duplicates
  unique (user_a, user_b)
);
create index matches_a_idx on public.matches (user_a, status);
create index matches_b_idx on public.matches (user_b, status);
create index matches_last_msg_idx on public.matches (last_message_at desc);

create table public.messages (
  id bigint generated always as identity primary key,
  match_id uuid not null references public.matches(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text check (char_length(body) <= 2000),
  media_id uuid references public.media(id) on delete set null,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  check (body is not null or media_id is not null)
);
create index messages_match_idx on public.messages (match_id, created_at desc);

-- Message without a match (limited; written only by send_message_request())
create table public.message_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 150),
  status text not null default 'pending' check (status in ('pending','accepted','ignored','reported','expired')),
  match_id uuid references public.matches(id),
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now(),
  check (sender_id <> receiver_id)
);
create index message_requests_receiver_idx on public.message_requests (receiver_id, status);
create index message_requests_sender_idx on public.message_requests (sender_id, created_at);

-- Weekly blind date pairing
create table public.blind_dates (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  week_start date not null,
  a_response text not null default 'pending' check (a_response in ('pending','yes','no')),
  b_response text not null default 'pending' check (b_response in ('pending','yes','no')),
  match_id uuid references public.matches(id),
  unique (user_a, week_start),
  unique (user_b, week_start),
  check (user_a <> user_b)
);

-- Explore: Live Relationship Space (one active row per user)
create table public.live_presence (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  goal_code text not null,
  type_codes text[] not null default '{}',
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  last_heartbeat timestamptz not null default now(),
  scope_city_id int references public.cities(id),
  coarse_point geography(Point,4326)
);
create index live_presence_expires_idx on public.live_presence (expires_at);
create index live_presence_heartbeat_idx on public.live_presence (last_heartbeat);
create index live_presence_city_idx on public.live_presence (scope_city_id);
create index live_presence_point_gix on public.live_presence using gist (coarse_point);

create table public.live_sessions_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  goal_code text not null,
  started_at timestamptz not null,
  ended_at timestamptz,
  ended_reason text check (ended_reason in ('expired','stopped','stale','banned'))
);
create index live_sessions_log_user_idx on public.live_sessions_log (user_id, started_at desc);