-- =================================================================================
-- Phase 6: Live Space RPCs
-- =================================================================================

-- 1. go_live()
-- Starts a live session for 2 hours, upserts live_presence, logs to live_sessions_log.
create or replace function public.go_live(
  p_goal_code text,
  p_type_codes text[] default '{}'
) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_user_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Upsert into live_presence (1 session max per user)
  insert into public.live_presence (user_id, goal_code, type_codes, expires_at, last_heartbeat)
  values (v_user_id, p_goal_code, p_type_codes, now() + interval '2 hours', now())
  on conflict (user_id) do update set
    goal_code = excluded.goal_code,
    type_codes = excluded.type_codes,
    expires_at = excluded.expires_at,
    last_heartbeat = excluded.last_heartbeat;

  -- Log the session start
  insert into public.live_sessions_log (user_id, goal_code, started_at)
  values (v_user_id, p_goal_code, now());

end $$;
grant execute on function public.go_live(text, text[]) to authenticated;


-- 2. heartbeat()
-- Updates the last_heartbeat timestamp in live_presence.
create or replace function public.heartbeat() returns void
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_user_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  update public.live_presence
  set last_heartbeat = now()
  where user_id = v_user_id;
end $$;
grant execute on function public.heartbeat() to authenticated;


-- 3. stop_live()
-- Deletes from live_presence and marks live_sessions_log as 'stopped'.
create or replace function public.stop_live() returns void
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_user_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Delete presence
  delete from public.live_presence where user_id = v_user_id;

  -- Update log
  update public.live_sessions_log
  set ended_at = now(), ended_reason = 'stopped'
  where user_id = v_user_id and ended_at is null;
end $$;
grant execute on function public.stop_live() to authenticated;


-- 4. get_live_feed(radius_km)
-- Retrieves active live sessions. Simplified for now.
create or replace function public.get_live_feed(
  p_radius_km float default 50
)
returns table (
  user_id uuid,
  name text,
  goal_code text,
  type_codes text[],
  expires_at timestamptz
)
language sql security definer set search_path = public, extensions as $$
  select 
    lp.user_id,
    p.first_name,
    lp.goal_code,
    lp.type_codes,
    lp.expires_at
  from public.live_presence lp
  join public.profiles p on p.id = lp.user_id
  where lp.expires_at > now()
    and lp.user_id != auth.uid();
$$;
grant execute on function public.get_live_feed(float) to authenticated;


-- 5. pg_cron job for cleanup
-- Needs pg_cron extension which is enabled in Phase 1. 
-- Will run every minute to delete expired or stale sessions.
-- Note: pg_cron setup often requires superuser on standard postgres, but in Supabase 
-- you can use pg_net or cron schema. 
-- For this mock, we just define the SQL that a cron job would run.
create or replace function public.cleanup_stale_live_presence() returns void
language plpgsql security definer as $$
begin
  -- Mark as expired
  update public.live_sessions_log lsl
  set ended_at = now(), ended_reason = 'expired'
  from public.live_presence lp
  where lp.user_id = lsl.user_id 
    and lsl.ended_at is null
    and lp.expires_at <= now();

  -- Mark as stale (no heartbeat for 5 mins)
  update public.live_sessions_log lsl
  set ended_at = now(), ended_reason = 'stale'
  from public.live_presence lp
  where lp.user_id = lsl.user_id 
    and lsl.ended_at is null
    and lp.last_heartbeat < now() - interval '5 minutes'
    and lp.expires_at > now();

  -- Delete them all
  delete from public.live_presence
  where expires_at <= now() or last_heartbeat < now() - interval '5 minutes';
end $$;

-- In a real Supabase env, we would do:
-- select cron.schedule('cleanup-live', '* * * * *', 'select public.cleanup_stale_live_presence()');
