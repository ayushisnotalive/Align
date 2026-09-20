-- 13. send_message_request()
-- Lets a user send a message request to a non-matched user.
-- Enforces: 2/day limit, 150 chars max, block check, no self-send, profile complete, fresh location.
create or replace function public.send_message_request(
  p_receiver_id uuid,
  p_body text
)
returns uuid
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := auth.uid();
  v_profile public.profiles;
  v_loc public.user_location;
  v_today_count int;
  new_id uuid;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  if uid = p_receiver_id then raise exception 'cannot send request to yourself'; end if;

  -- Body validation (1-150 chars)
  if p_body is null or char_length(trim(p_body)) < 1 then
    raise exception 'message body is required';
  end if;
  if char_length(trim(p_body)) > 150 then
    raise exception 'message body must be 150 characters or less';
  end if;

  -- Profile must be complete
  select * into v_profile from public.profiles where id = uid;
  if not v_profile.profile_complete then
    raise exception 'profile incomplete';
  end if;
  if v_profile.status <> 'active' then
    raise exception 'account is not active';
  end if;

  -- Fresh location required (within 24 hours)
  select * into v_loc from public.user_location where user_id = uid;
  if v_loc is null or v_loc.updated_at < (now() - interval '24 hours') then
    raise exception 'location not fresh';
  end if;

  -- Check receiver exists and is active
  if not exists (
    select 1 from public.profiles
    where id = p_receiver_id and status = 'active' and profile_complete
  ) then
    raise exception 'receiver not found or not active';
  end if;

  -- Block check (bidirectional)
  if exists (
    select 1 from public.blocks
    where (blocker_id = uid and blocked_id = p_receiver_id)
       or (blocker_id = p_receiver_id and blocked_id = uid)
  ) then
    raise exception 'user blocked';
  end if;

  -- Cannot send if already matched
  if exists (
    select 1 from public.matches
    where status = 'active'
      and user_a = least(uid, p_receiver_id)
      and user_b = greatest(uid, p_receiver_id)
  ) then
    raise exception 'already matched — use chat instead';
  end if;

  -- Check for existing pending request to same receiver
  if exists (
    select 1 from public.message_requests
    where sender_id = uid and receiver_id = p_receiver_id
      and status = 'pending'
  ) then
    raise exception 'you already have a pending request to this user';
  end if;

  -- 2/day rate limit
  select count(*) into v_today_count
  from public.message_requests
  where sender_id = uid
    and created_at > (now() - interval '24 hours');

  if v_today_count >= 2 then
    raise exception 'daily message request limit reached (2 per day)';
  end if;

  -- Insert the request
  insert into public.message_requests (sender_id, receiver_id, body)
  values (uid, p_receiver_id, trim(p_body))
  returning id into new_id;

  -- Notify the receiver
  insert into public.notifications (user_id, type, data)
  values (p_receiver_id, 'request',
          jsonb_build_object('request_id', new_id, 'sender_id', uid));

  return new_id;
end $$;

-- Only authenticated users can call this
revoke all on function public.send_message_request(uuid, text) from public, anon;
grant execute on function public.send_message_request(uuid, text) to authenticated;
