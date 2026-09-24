-- =================================================================================
-- Phase 8: Account Pausing and Deletion
-- =================================================================================

-- 1. request_deletion()
-- Puts the account into a 14-day grace period.
DROP FUNCTION IF EXISTS public.request_deletion();
create or replace function public.request_deletion() returns void
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  update public.profiles
  set status = 'deletion_requested',
      deletion_requested_at = now()
  where id = uid;
end $$;


-- 2. pause_account()
-- Hides the user from discovery and live feeds.
create or replace function public.pause_account() returns void
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  update public.profiles
  set status = 'paused'
  where id = uid and status = 'active';
end $$;


-- 3. unpause_account()
-- Resumes the account.
create or replace function public.unpause_account() returns void
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  update public.profiles
  set status = 'active'
  where id = uid and status = 'paused';
end $$;


-- 4. process_account_deletions()
-- A cron job that actually deletes accounts where the 14 day grace period has passed.
create or replace function public.process_account_deletions() returns void
language plpgsql security definer as $$
begin
  -- Delete all profiles where deletion_requested_at is older than 14 days
  -- Because of ON DELETE CASCADE on foreign keys (assuming we set them up properly), 
  -- this will wipe their swipes, matches, messages, live presence, blocks, etc.
  
  delete from public.profiles
  where status = 'deletion_requested' 
    and deletion_requested_at < now() - interval '14 days';
    
  -- We would also need to delete the user from auth.users.
  -- Supabase doesn't allow standard postgres roles to easily delete from auth.users.
  -- Typically, this is done via a Supabase Edge Function running with a Service Role key,
  -- triggered by a webhook or cron. We handle the public schema cleanup here.
end $$;
