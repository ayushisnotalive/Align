-- Migration: Photo insights, like tracking, reordering, and smart photos
ALTER TABLE public.photos ADD COLUMN IF NOT EXISTS likes_count int not null default 0;
ALTER TABLE public.photos ADD COLUMN IF NOT EXISTS impressions_count int not null default 0;
ALTER TABLE public.swipes ADD COLUMN IF NOT EXISTS photo_id uuid references public.photos(id) on delete set null;

-- Update swipe function to accept optional p_photo_id and track photo likes
drop function if exists public.swipe(uuid, text, text);
drop function if exists public.swipe(uuid, text, text, uuid);

create or replace function public.swipe(
  p_target_id uuid,
  p_direction text,
  p_source text default 'discover',
  p_photo_id uuid default null
)
returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := auth.uid();
  v_is_mutual boolean := false;
  v_match_id uuid;
  v_profile public.profiles;
  v_loc public.user_location;
  v_target_photo_id uuid := p_photo_id;
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

  -- 3. Check blocks
  if exists (
    select 1 from public.blocks 
    where (blocker_id = uid and blocked_id = p_target_id)
       or (blocker_id = p_target_id and blocked_id = uid)
  ) then
    raise exception 'user blocked';
  end if;

  -- 4. Daily limits for likes
  if p_direction = 'like' then
    if (
      select count(*) from public.swipes 
      where swiper_id = uid and direction = 'like' 
        and created_at > (now() - interval '24 hours')
    ) >= 50 then
      raise exception 'daily like limit reached';
    end if;
  end if;

  -- If no photo_id provided, default to target user's position 1 photo
  if v_target_photo_id is null then
    select id into v_target_photo_id
    from public.photos
    where user_id = p_target_id and position = 1
    limit 1;
  end if;

  -- Track impressions & likes on target photo
  if v_target_photo_id is not null then
    update public.photos
    set impressions_count = impressions_count + 1,
        likes_count = case when p_direction in ('like','super') then likes_count + 1 else likes_count end
    where id = v_target_photo_id;
  end if;

  -- 5. Insert swipe
  insert into public.swipes (swiper_id, target_id, direction, source, photo_id)
  values (uid, p_target_id, p_direction, p_source, v_target_photo_id)
  on conflict (swiper_id, target_id) do update 
    set direction = excluded.direction, source = excluded.source, photo_id = excluded.photo_id, created_at = now();

  -- 6. Check for mutual match if this is a positive swipe
  if p_direction in ('like','super') then
    if exists (
      select 1 from public.swipes 
      where swiper_id = p_target_id and target_id = uid 
        and direction in ('like','super')
    ) then
      v_is_mutual := true;
      
      insert into public.matches (user_a, user_b, origin, status)
      values (least(uid, p_target_id), greatest(uid, p_target_id), 'swipe', 'active')
      on conflict (user_a, user_b) do update 
        set status = 'active', unmatched_by = null, created_at = now()
      returning id into v_match_id;
      
      insert into public.notifications (user_id, type, data)
      values (p_target_id, 'match', jsonb_build_object('match_id', v_match_id, 'partner_id', uid));
      
      insert into public.notifications (user_id, type, data)
      values (uid, 'match', jsonb_build_object('match_id', v_match_id, 'partner_id', p_target_id));
    end if;
  end if;

  return v_is_mutual;
end $$;

grant execute on function public.swipe(uuid, text, text, uuid) to authenticated;

-- Function to safely reorder user photos
create or replace function public.reorder_user_photos(p_photo_ids uuid[])
returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := auth.uid();
  i int;
  pid uuid;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  if p_photo_ids is null or array_length(p_photo_ids, 1) = 0 then return true; end if;

  -- Temporarily negate positions to prevent unique constraint conflict
  update public.photos
  set position = -position
  where user_id = uid;

  -- Reassign positions sequentially starting from 1
  for i in 1..array_length(p_photo_ids, 1) loop
    pid := p_photo_ids[i];
    update public.photos
    set position = i
    where id = pid and user_id = uid;
  end loop;

  -- Restore any unmentioned photos
  update public.photos
  set position = abs(position)
  where user_id = uid and position < 0;

  return true;
end $$;

grant execute on function public.reorder_user_photos(uuid[]) to authenticated;

-- Function to set a specific photo as primary (position = 1)
create or replace function public.set_primary_photo(p_photo_id uuid)
returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := auth.uid();
  v_old_pos smallint;
  v_old_primary_id uuid;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;

  select position into v_old_pos
  from public.photos
  where id = p_photo_id and user_id = uid;

  if v_old_pos is null then raise exception 'photo not found'; end if;
  if v_old_pos = 1 then return true; end if; -- already primary

  select id into v_old_primary_id
  from public.photos
  where user_id = uid and position = 1;

  -- Swap positions
  update public.photos set position = -99 where id = p_photo_id;
  if v_old_primary_id is not null then
    update public.photos set position = v_old_pos where id = v_old_primary_id;
  end if;
  update public.photos set position = 1 where id = p_photo_id;

  return true;
end $$;

grant execute on function public.set_primary_photo(uuid) to authenticated;

-- Function to get photo insights for a user
create or replace function public.get_user_photo_insights(p_user_id uuid default null)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := coalesce(p_user_id, auth.uid());
  v_is_pro boolean := false;
  v_total_likes int := 0;
  v_max_likes int := 0;
  v_result jsonb;
begin
  if auth.uid() is null then raise exception 'not authenticated' using errcode = '28000'; end if;

  -- Check if user is pro (from active subscription, or super_admin, or test bypass)
  select exists (
    select 1 from public.subscriptions 
    where user_id = auth.uid() and status = 'active'
  ) into v_is_pro;

  if not v_is_pro then
    select exists (
      select 1 from public.role_assignments ra
      join public.roles r on r.id = ra.role_id
      where ra.user_id = auth.uid() and r.name = 'super_admin'
    ) into v_is_pro;
  end if;

  -- Calculate total and max likes
  select coalesce(sum(likes_count), 0), coalesce(max(likes_count), 0)
  into v_total_likes, v_max_likes
  from public.photos
  where user_id = uid;

  select jsonb_build_object(
    'is_pro', v_is_pro,
    'total_likes', v_total_likes,
    'photos', coalesce(jsonb_agg(
      jsonb_build_object(
        'photo_id', ph.id,
        'media_id', m.id,
        's3_key', m.s3_key,
        'position', ph.position,
        'likes_count', ph.likes_count,
        'impressions_count', ph.impressions_count,
        'like_percentage', case when v_total_likes > 0 then round((ph.likes_count::numeric / v_total_likes::numeric) * 100) else 0 end,
        'is_best_performing', (ph.likes_count = v_max_likes and v_max_likes > 0)
      ) order by ph.position asc
    ), '[]'::jsonb)
  )
  into v_result
  from public.photos ph
  join public.media m on m.id = ph.media_id
  where ph.user_id = uid and m.deleted_at is null;

  return coalesce(v_result, '{"is_pro": false, "total_likes": 0, "photos": []}'::jsonb);
end $$;

grant execute on function public.get_user_photo_insights(uuid) to authenticated;
