alter table public.profiles add column places jsonb not null default '[]'::jsonb;
