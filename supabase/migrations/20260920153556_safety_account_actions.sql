-- 15. block_user(), unmatch(), pause_account(), request_deletion()
-- Safety and account lifecycle functions.
-- All use auth.uid(), security definer, set search_path.

-- ============================================================
-- block_user(target_id)
-- ============================================================
-- Inserts a block, removes any active match, hides from future feeds.
create or replace function public.block_user(
  p_target_id uuid
)
returns void
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := auth.uid();
  v_match_id uuid;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  if uid = p_target_id then raise exception 'cannot block yourself'; end if;

  -- Check target exists
  if not exists (select 1 from public.profiles where id = p_target_id) then
    raise exception 'user not found';
  end if;

  -- Insert block (idempotent via on conflict)
  insert into public.blocks (blocker_id, blocked_id)
  values (uid, p_target_id)
  on conflict (blocker_id, blocked_id) do nothing;

  -- If there's an active match, unmatch it
  select id into v_match_id
  from public.matches
  where user_a = least(uid, p_target_id)
    and user_b = greatest(uid, p_target_id)
    and status = 'active';

  if v_match_id is not null then
    update public.matches
    set status = 'unmatched', unmatched_by = uid
    where id = v_match_id;
  end if;

  -- Expire any pending message requests between the two users
  update public.message_requests
  set status = 'expired'
  where status = 'pending'
    and ((sender_id = uid and receiver_id = p_target_id)
      or (sender_id = p_target_id and receiver_id = uid));
end $$;


-- ============================================================
-- unmatch(match_id)
-- ============================================================
-- Sets match status to 'unmatched', records who did it.
create or replace function public.unmatch(
  p_match_id uuid
)
returns void
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := auth.uid();
  v_match public.matches;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;

  select * into v_match
  from public.matches
  where id = p_match_id and status = 'active'
  for update;

  if not found then
    raise exception 'match not found or already unmatched';
  end if;

  -- Must be a participant
  if uid not in (v_match.user_a, v_match.user_b) then
    raise exception 'not your match';
  end if;

  update public.matches
  set status = 'unmatched', unmatched_by = uid
  where id = p_match_id;
end $$;


-- ============================================================
-- pause_account()
-- ============================================================
-- Sets profile status to 'paused'. User disappears from feeds.
-- Can be resumed by calling resume_account().
create or replace function public.pause_account()
returns void
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;

  update public.profiles
  set status = 'paused'
  where id = uid and status = 'active';

  if not found then
    raise exception 'account cannot be paused (not active)';
  end if;
end $$;


-- ============================================================
-- resume_account()
-- ============================================================
-- Resumes a paused account.
create or replace function public.resume_account()
returns void
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;

  update public.profiles
  set status = 'active'
  where id = uid and status = 'paused';

  if not found then
    raise exception 'account is not paused';
  end if;
end $$;


-- ============================================================
-- request_deletion()
-- ============================================================
-- Marks the account for deletion with a 14-day grace period.
-- During grace: profile status = 'pending_deletion', invisible in feeds.
-- A Phase 8 cron job handles the actual purge.
create or replace function public.request_deletion()
returns uuid
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := auth.uid();
  v_profile public.profiles;
  new_id uuid;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;

  select * into v_profile from public.profiles where id = uid;
  if v_profile.status = 'pending_deletion' then
    raise exception 'deletion already requested';
  end if;
  if v_profile.status = 'banned' then
    raise exception 'account is banned';
  end if;

  -- Set profile status
  update public.profiles
  set status = 'pending_deletion'
  where id = uid;

  -- Cancel any existing pending deletion (in case they previously cancelled and re-request)
  update public.deletion_requests
  set status = 'cancelled'
  where user_id = uid and status = 'pending';

  -- Create new deletion request
  insert into public.deletion_requests (user_id)
  values (uid)
  returning id into new_id;

  -- Remove from live presence
  delete from public.live_presence where user_id = uid;

  return new_id;
end $$;


-- ============================================================
-- cancel_deletion()
-- ============================================================
-- Cancels a pending deletion and restores the account.
create or replace function public.cancel_deletion()
returns void
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;

  -- Must be in pending_deletion status
  if not exists (
    select 1 from public.profiles where id = uid and status = 'pending_deletion'
  ) then
    raise exception 'no pending deletion';
  end if;

  -- Cancel the deletion request
  update public.deletion_requests
  set status = 'cancelled'
  where user_id = uid and status = 'pending';

  -- Restore profile
  update public.profiles
  set status = 'active'
  where id = uid;
end $$;


-- Grants: only authenticated users
revoke all on function public.block_user(uuid) from public, anon;
revoke all on function public.unmatch(uuid) from public, anon;
revoke all on function public.pause_account() from public, anon;
revoke all on function public.resume_account() from public, anon;
revoke all on function public.request_deletion() from public, anon;
revoke all on function public.cancel_deletion() from public, anon;

grant execute on function public.block_user(uuid) to authenticated;
grant execute on function public.unmatch(uuid) to authenticated;
grant execute on function public.pause_account() to authenticated;
grant execute on function public.resume_account() to authenticated;
grant execute on function public.request_deletion() to authenticated;
grant execute on function public.cancel_deletion() to authenticated;
