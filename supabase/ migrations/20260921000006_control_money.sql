create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('terms','privacy','location','sensitive_data','face_biometric')),
  version text not null,
  granted boolean not null,
  created_at timestamptz not null default now()
);
create index consents_user_idx on public.consents (user_id, type, created_at desc);

create table public.deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  requested_at timestamptz not null default now(),
  purge_at timestamptz not null default (now() + interval '14 days'),
  status text not null default 'pending' check (status in ('pending','cancelled','done'))
);

create table public.daily_usage (
  user_id uuid not null references public.profiles(id) on delete cascade,
  day date not null default current_date,
  swipes_used int not null default 0,
  requests_used int not null default 0,
  live_sessions_used int not null default 0,
  bonus_swipes int not null default 0,
  primary key (user_id, day)
);

create table public.feature_flags (
  key text primary key,
  enabled boolean not null default false,
  rollout_percent smallint not null default 100 check (rollout_percent between 0 and 100),
  updated_at timestamptz not null default now()
);

create table public.plans (
  id text primary key,
  price_inr int not null check (price_inr >= 0),
  duration_days int not null check (duration_days > 0),
  features jsonb not null default '{}'::jsonb,
  is_active boolean not null default false
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id text not null references public.plans(id),
  status text not null default 'active' check (status in ('active','expired','cancelled')),
  play_purchase_token text unique,
  started_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index subscriptions_user_idx on public.subscriptions (user_id, status);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('match','message','request','verification','system')),
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);