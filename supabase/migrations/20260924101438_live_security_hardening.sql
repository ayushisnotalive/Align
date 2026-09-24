-- =================================================================================
-- Phase 6: Live Security Hardening
-- =================================================================================

-- 1. Add banned user check to go_live()
-- Users with an active ban should not be able to go live
create or replace function public.go_live(
  p_goal_code text,
  p_type_codes text[] default '{}'
) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_user_id uuid;
  v_phone text;
  v_is_banned boolean;
  v_today_sessions int;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Check if user is banned
  select phone into v_phone
  from public.profile_private
  where user_id = v_user_id;

  if v_phone is not null then
    select exists(
      select 1 from public.bans
      where phone_hash = encode(digest(v_phone, 'sha256'), 'hex')
    ) into v_is_banned;

    if v_is_banned then
      raise exception 'Account is banned';
    end if;
  end if;

  -- Check daily session cap (max 5 live sessions per day)
  select count(*) into v_today_sessions
  from public.live_sessions_log
  where user_id = v_user_id
    and started_at >= current_date;

  if v_today_sessions >= 5 then
    raise exception 'Daily live session limit reached (5 per day)';
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


-- 2. Schedule the cleanup cron job for stale live_presence
-- This will run every minute to delete expired or stale sessions
-- Note: Requires pg_cron extension (enabled in Phase 1)
create extension if not exists pg_cron;
select cron.schedule(
  'cleanup_stale_live_presence',
  '* * * * *',
  'select public.cleanup_stale_live_presence()'
);


-- 3. Verify the cleanup function exists (it was defined in migration 20260923232000)
-- If it doesn't exist for some reason, create it
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
