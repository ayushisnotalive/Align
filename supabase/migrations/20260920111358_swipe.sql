-- 12. swipe()
-- Swipe logic with checks for daily limits, blocks, profile completeness, and location freshness.
create or replace function public.swipe(
  p_target_id uuid,
  p_direction text,
  p_source text default 'discover'
)
returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := auth.uid();
  v_is_mutual boolean := false;
  v_match_id uuid;
  v_profile public.profiles;
  v_loc public.user_location;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  if uid = p_target_id then raise exception 'cannot swipe yourself'; end if;
  if p_direction not in ('like','pass','super') then raise exception 'invalid direction'; end if;

  -- 1. Check profile completeness
  select * into v_profile from public.profiles where id = uid;
  if not v_profile.profile_complete then
    raise exception 'profile incomplete';
  end if;

  -- 2. Check fresh location (within 24 hours)
  select * into v_loc from public.user_location where user_id = uid;
  if v_loc is null or v_loc.updated_at < (now() - interval '24 hours') then
    raise exception 'location not fresh';
  end if;

  -- 3. Check blocks (if I blocked them or they blocked me, abort silently or throw)
  if exists (
    select 1 from public.blocks 
    where (blocker_id = uid and blocked_id = p_target_id)
       or (blocker_id = p_target_id and blocked_id = uid)
  ) then
    raise exception 'user blocked';
  end if;

  -- 4. Daily limits for likes (we will omit the exact daily_usage table check for now unless specified, 
  --    but normally we would increment and check public.daily_usage)
  --    Assume simple 50/day limit on likes.
  if p_direction = 'like' then
    if (
      select count(*) from public.swipes 
      where swiper_id = uid and direction = 'like' 
        and created_at > (now() - interval '24 hours')
    ) >= 50 then
      raise exception 'daily like limit reached';
    end if;
  end if;

  -- 5. Insert swipe
  insert into public.swipes (swiper_id, target_id, direction, source)
  values (uid, p_target_id, p_direction, p_source)
  on conflict (swiper_id, target_id) do update 
    set direction = excluded.direction, source = excluded.source, created_at = now();

  -- 6. Check for mutual match if this is a positive swipe
  if p_direction in ('like','super') then
    if exists (
      select 1 from public.swipes 
      where swiper_id = p_target_id and target_id = uid 
        and direction in ('like','super')
    ) then
      v_is_mutual := true;
      
      -- Insert into matches (user_a is always the smaller UUID to enforce uniqueness)
      insert into public.matches (user_a, user_b, origin, status)
      values (least(uid, p_target_id), greatest(uid, p_target_id), 'swipe', 'active')
      on conflict (user_a, user_b) do update 
        set status = 'active', unmatched_by = null, created_at = now()
      returning id into v_match_id;
      
      -- Emit notifications
      insert into public.notifications (user_id, type, data)
      values (p_target_id, 'match', jsonb_build_object('match_id', v_match_id, 'partner_id', uid));
      
      insert into public.notifications (user_id, type, data)
      values (uid, 'match', jsonb_build_object('match_id', v_match_id, 'partner_id', p_target_id));
    end if;
  end if;

  return v_is_mutual;
end $$;
