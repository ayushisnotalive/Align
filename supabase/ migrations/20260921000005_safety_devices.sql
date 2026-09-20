create table public.blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);
create index blocks_blocked_idx on public.blocks (blocked_id);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_id uuid not null references public.profiles(id) on delete cascade,
  context text not null check (context in ('profile','message','photo','request','live')),
  context_ref_id text,
  reason text not null check (char_length(reason) between 3 and 500),
  status text not null default 'open' check (status in ('open','reviewing','actioned','dismissed')),
  handled_by uuid references public.admins(id),
  created_at timestamptz not null default now()
);
create index reports_target_idx on public.reports (target_id);
create index reports_status_idx on public.reports (status, created_at);

-- Hashes only (never raw phone/device/email) so banned users cannot re-register
create table public.bans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  phone_hash text, device_hash text, email_hash text,
  reason text not null,
  expires_at timestamptz,               -- NULL = permanent
  created_by uuid references public.admins(id),
  created_at timestamptz not null default now()
);
create index bans_phone_idx on public.bans (phone_hash);
create index bans_device_idx on public.bans (device_hash);
create index bans_email_idx on public.bans (email_hash);

create table public.audit_log (
  id bigint generated always as identity primary key,
  admin_id uuid references public.admins(id),
  action text not null,
  target_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.user_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  install_id uuid not null,
  device_hash text,
  model text, os_version text, app_version text, locale text, timezone text,
  push_token text unique,
  platform text not null default 'android' check (platform in ('android','ios')),
  integrity_verdict text,
  last_ip inet,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique (user_id, install_id)
);
create index user_devices_user_idx on public.user_devices (user_id);
create index user_devices_hash_idx on public.user_devices (device_hash);

create table public.auth_events (
  id bigint generated always as identity primary key,
  user_id uuid,
  device_id uuid references public.user_devices(id) on delete set null,
  event text not null check (event in ('otp_sent','login','otp_failed','logout','token_refresh')),
  ip inet,
  created_at timestamptz not null default now()
);
create index auth_events_created_idx on public.auth_events (created_at);

create table public.app_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  device_id uuid references public.user_devices(id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  city_id int references public.cities(id)
);
create index app_sessions_user_idx on public.app_sessions (user_id, started_at desc);

create table public.profile_views (
  id bigint generated always as identity primary key,
  viewer_id uuid not null references public.profiles(id) on delete cascade,
  viewed_id uuid not null references public.profiles(id) on delete cascade,
  duration_ms int not null check (duration_ms >= 0),
  source text not null default 'discover' check (source in ('discover','college','live')),
  created_at timestamptz not null default now()
);
create index profile_views_created_idx on public.profile_views (created_at);

create table public.analytics_events (
  id bigint generated always as identity primary key,
  user_id uuid,
  event text not null,
  props jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index analytics_events_event_idx on public.analytics_events (event, created_at);