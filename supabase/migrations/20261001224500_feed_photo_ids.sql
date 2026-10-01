-- Migration: include photo_id in get_feed() photos array
create or replace function public.get_feed(
  p_mode text default 'discover',
  p_scope text default null,
  p_cursor uuid default null,
  p_limit int default 20
)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := auth.uid();
  v_profile public.profiles;
  v_loc public.user_location;
  v_ds public.discovery_settings;
  v_my_college_id int;
  v_my_college_city_id int;
  v_my_college_state_id smallint;
  v_result jsonb;
  v_effective_limit int;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;

  -- Validate mode
  if p_mode not in ('discover', 'college') then
    raise exception 'invalid mode: %', p_mode;
  end if;

  -- Validate limit
  v_effective_limit := least(greatest(coalesce(p_limit, 20), 1), 50);

  -- Load caller's profile
  select * into v_profile from public.profiles where id = uid;
  if not v_profile.profile_complete then
    raise exception 'profile incomplete';
  end if;
  if v_profile.status <> 'active' then
    raise exception 'account is not active';
  end if;

  -- Load caller's location (must be fresh)
  select * into v_loc from public.user_location where user_id = uid;
  if v_loc is null or v_loc.coarse_point is null then
    raise exception 'location required';
  end if;
  if v_loc.updated_at < (now() - interval '24 hours') then
    raise exception 'location not fresh';
  end if;

  -- Load discovery settings
  select * into v_ds from public.discovery_settings where user_id = uid;

  -- For college mode, load my verified college info
  if p_mode = 'college' then
    select uc.college_id, c.city_id, ci.state_id
    into v_my_college_id, v_my_college_city_id, v_my_college_state_id
    from public.user_colleges uc
    join public.colleges c on c.id = uc.college_id
    join public.cities ci on ci.id = c.city_id
    where uc.user_id = uid and uc.is_current and uc.verified;

    if v_my_college_id is null then
      raise exception 'you must have a verified college to use the College tab';
    end if;
  end if;

  -- Build the feed query
  select jsonb_agg(row_to_json(feed_row)::jsonb)
  into v_result
  from (
    select
      p.id,
      p.first_name,
      p.bio,
      p.height_cm,
      p.is_blue_tick,
      p.hometown_city_id,
      p.show_zodiac,
      extract(year from age(pp.dob))::int as age,
      p.gender_id,
      p.pronoun_id,
      p.orientation_id,
      p.orientation_visible,
      p.occupation,
      p.employer,
      p.school,
      p.education_id,
      p.last_active_at,
      round(st_distance(v_loc.coarse_point, ul.coarse_point)::numeric / 1000, 1) as distance_km,
      -- Profile details (avatar, dating habits, lifestyle, interests)
      pd.avatar_url,
      pd.ideal_date,
      pd.communication_style,
      pd.lifestyle_vibe,
      coalesce(pd.interests, pd.personality_tags, '{}'::text[]) as interests,
      -- College info (only if verified + shown)
      (select jsonb_build_object(
          'college_name', col.name,
          'course', uc2.course,
          'study_year', uc2.study_year,
          'verified', uc2.verified
        )
        from public.user_colleges uc2
        join public.colleges col on col.id = uc2.college_id
        where uc2.user_id = p.id and uc2.is_current
          and uc2.verified and uc2.show_on_profile
        limit 1
      ) as college,
      -- Photos with photo_id and likes_count
      (select jsonb_agg(jsonb_build_object(
          'photo_id', ph.id,
          'media_id', m.id,
          's3_key', m.s3_key,
          'position', ph.position,
          'likes_count', ph.likes_count,
          'width', m.width,
          'height', m.height,
          'blurhash', m.blurhash
        ) order by ph.position)
        from public.photos ph
        join public.media m on m.id = ph.media_id
        where ph.user_id = p.id
          and m.moderation_status = 'ok' and m.deleted_at is null
      ) as photos
    from public.profiles p
    join public.profile_private pp on pp.user_id = p.id
    join public.user_location ul on ul.user_id = p.id
    join public.discovery_settings ds_target on ds_target.user_id = p.id
    left join public.profile_details pd on pd.user_id = p.id
    where
      -- Not self
      p.id <> uid
      -- Active and complete
      and p.status = 'active'
      and p.profile_complete
      -- Fresh location
      and ul.coarse_point is not null
      and ul.updated_at > (now() - interval '24 hours')
      -- Not blocked (bidirectional)
      and not exists (
        select 1 from public.blocks b
        where (b.blocker_id = uid and b.blocked_id = p.id)
           or (b.blocker_id = p.id and b.blocked_id = uid)
      )
      -- Not already swiped
      and not exists (
        select 1 from public.swipes s
        where s.swiper_id = uid and s.target_id = p.id
      )
      -- Age filter
      and extract(year from age(pp.dob))::int between v_ds.min_age and v_ds.max_age
      -- Gender filter (empty array = no filter)
      and (v_ds.show_genders = '{}' or p.gender_id = any(v_ds.show_genders))
      -- Verified-only filter
      and (not v_ds.verified_only or p.is_blue_tick)
      -- Discover mode: radius-based proximity
      and (
        p_mode <> 'discover'
        or st_dwithin(v_loc.coarse_point, ul.coarse_point, v_ds.radius_km * 1000)
      )
      -- College mode: MUST filter user_colleges.verified = true
      and (
        p_mode <> 'college'
        or exists (
          select 1 from public.user_colleges uc3
          join public.colleges c3 on c3.id = uc3.college_id
          join public.cities ci3 on ci3.id = c3.city_id
          where uc3.user_id = p.id
            and uc3.is_current
            and uc3.verified = true
            and (
              (coalesce(p_scope, v_ds.college_scope) = 'my_college' and uc3.college_id = v_my_college_id)
              or (coalesce(p_scope, v_ds.college_scope) = 'my_city' and c3.city_id = v_my_college_city_id)
              or (coalesce(p_scope, v_ds.college_scope) = 'my_state' and ci3.state_id = v_my_college_state_id)
            )
        )
      )
      -- Keyset pagination
      and (p_cursor is null or p.id > p_cursor)
      -- User must want to be shown
      and ds_target.show_me
      -- Incognito mode logic
      and (
        not ds_target.incognito_mode
        or exists (
          select 1 from public.swipes s
          where s.swiper_id = p.id and s.target_id = uid and s.direction = 'like'
        )
      )
    order by p.id
    limit v_effective_limit
  ) feed_row;

  return coalesce(v_result, '[]'::jsonb);
end $$;

grant execute on function public.get_feed(text, text, uuid, int) to authenticated;
