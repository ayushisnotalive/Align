-- Migration: 3 Premium Tiers (Plus, Gold, Diamond) with Full Feature Support

-- 1. Insert/Update the 3 Premium Plans
insert into public.plans (id, price_inr, duration_days, features, is_active)
values 
(
  'plus',
  199,
  30,
  jsonb_build_object(
    'tier', 'plus',
    'name', 'Align Plus',
    'tagline', 'Spark your campus connection',
    'badge', 'PLUS',
    'color', '#4E31E8',
    'accent_color', '#6366F1',
    'icon', 'flash',
    'price_monthly', 199,
    'price_quarterly', 499,
    'unlimited_likes', true,
    'rewind', true,
    'incognito', true,
    'passport', true,
    'weekly_boosts', 1,
    'ad_free', true,
    'feature_list', jsonb_build_array(
      'Unlimited Daily Swipes & Likes',
      'Rewind Unlimited Swipes (Bring back missed profiles)',
      '1 Free Campus Profile Boost per week (10x visibility)',
      'Campus Passport (Explore and match in any city or college)',
      'Incognito Mode (Only be seen by people you like)',
      '100% Ad-Free Experience'
    )
  ),
  true
),
(
  'gold',
  399,
  30,
  jsonb_build_object(
    'tier', 'gold',
    'name', 'Align Gold',
    'tagline', 'See who likes you & smart photo AI',
    'badge', 'GOLD 👑',
    'color', '#F59E0B',
    'accent_color', '#D97706',
    'icon', 'trophy',
    'price_monthly', 399,
    'price_quarterly', 899,
    'unlimited_likes', true,
    'rewind', true,
    'incognito', true,
    'passport', true,
    'weekly_boosts', 3,
    'ad_free', true,
    'see_who_likes_you', true,
    'photo_analytics', true,
    'super_likes_per_day', 5,
    'priority_messages_per_day', 5,
    'read_receipts', true,
    'top_picks', true,
    'feature_list', jsonb_build_array(
      'Everything in Align Plus, and more:',
      'See Who Liked You (Instant unblur secret admirers)',
      'Smart Photo AI (Photo analytics & % like performance)',
      '5 Free Super Likes per day (Stand out with gold border)',
      '5 Direct Message Requests daily before matching',
      'Daily Curated Top Picks (Matched by major & passions)',
      'Message Read Receipts in Chat'
    )
  ),
  true
),
(
  'diamond',
  699,
  30,
  jsonb_build_object(
    'tier', 'diamond',
    'name', 'Align Diamond',
    'tagline', 'The pinnacle of VIP college dating & networking',
    'badge', 'DIAMOND 💎',
    'color', '#06B6D4',
    'accent_color', '#8B5CF6',
    'icon', 'diamond',
    'price_monthly', 699,
    'price_quarterly', 1599,
    'unlimited_likes', true,
    'rewind', true,
    'incognito', true,
    'passport', true,
    'weekly_boosts', 5,
    'ad_free', true,
    'see_who_likes_you', true,
    'photo_analytics', true,
    'super_likes_per_day', 10,
    'priority_messages_per_day', 10,
    'read_receipts', true,
    'top_picks', true,
    'priority_likes', true,
    'message_before_match', true,
    'ai_wingman', true,
    'campus_crush_radar', true,
    'ghost_mode', true,
    'vip_profile_frame', true,
    'fest_vip_pass', true,
    'feature_list', jsonb_build_array(
      'Everything in Plus & Gold, and VIP privileges:',
      'Priority Likes (Always shown at the very top of decks)',
      'Message Before Match (Attach personal note to 10 daily likes)',
      'AI Wingman (Witty openers, rizz coaching & conversation assist)',
      'Campus Crush Radar (Live proximity alerts for campus matches)',
      'VIP Prismatic Hologram Frame & Profile Badge',
      'Ghost Mode (View profiles completely invisibly)',
      'VIP College Fest Pass (Exclusive invites & perks at partner fests)'
    )
  ),
  true
)
on conflict (id) do update set
  price_inr = excluded.price_inr,
  duration_days = excluded.duration_days,
  features = excluded.features,
  is_active = excluded.is_active;

-- 2. Add boost tracking table if not exists
create table if not exists public.user_boosts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  started_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 minutes')
);
create index if not exists user_boosts_active_idx on public.user_boosts (user_id, expires_at);

-- 3. Function to get all active plans
create or replace function public.get_available_plans()
returns jsonb
language sql security definer set search_path = public as $$
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'id', p.id,
      'price_inr', p.price_inr,
      'duration_days', p.duration_days,
      'features', p.features,
      'is_active', p.is_active
    ) order by p.price_inr asc
  ), '[]'::jsonb)
  from public.plans p
  where p.is_active = true;
$$;
grant execute on function public.get_available_plans() to authenticated, anon;

-- 4. Function to get user's active subscription with tier details
create or replace function public.get_user_subscription(p_user_id uuid default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := coalesce(p_user_id, auth.uid());
  v_sub record;
  v_is_admin boolean := false;
  v_plan record;
begin
  if uid is null then
    return jsonb_build_object('has_subscription', false, 'tier', null, 'is_admin', false);
  end if;

  -- Check admin privilege
  select exists (select 1 from public.admins where id = uid) into v_is_admin;

  -- Check active subscription
  select s.id, s.plan_id, s.status, s.started_at, s.expires_at, p.features
  into v_sub
  from public.subscriptions s
  join public.plans p on p.id = s.plan_id
  where s.user_id = uid and s.status = 'active' and s.expires_at > now()
  order by s.expires_at desc
  limit 1;

  if found then
    return jsonb_build_object(
      'has_subscription', true,
      'tier', v_sub.plan_id,
      'plan_id', v_sub.plan_id,
      'started_at', v_sub.started_at,
      'expires_at', v_sub.expires_at,
      'is_admin', v_is_admin,
      'features', v_sub.features
    );
  end if;

  -- Admins get Diamond VIP perks automatically for testing/moderation
  if v_is_admin then
    select * into v_plan from public.plans where id = 'diamond';
    return jsonb_build_object(
      'has_subscription', true,
      'tier', 'diamond',
      'plan_id', 'diamond',
      'started_at', now(),
      'expires_at', now() + interval '365 days',
      'is_admin', true,
      'features', coalesce(v_plan.features, '{}'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'has_subscription', false,
    'tier', null,
    'plan_id', null,
    'is_admin', false,
    'features', '{}'::jsonb
  );
end $$;
grant execute on function public.get_user_subscription(uuid) to authenticated;

-- 5. Function to activate/switch a subscription (sandbox/checkout RPC)
create or replace function public.activate_subscription(p_plan_id text, p_duration_days int default 30)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_plan record;
  v_new_sub_id uuid;
  v_expires_at timestamptz := now() + (p_duration_days || ' days')::interval;
begin
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  select * into v_plan from public.plans where id = p_plan_id and is_active = true;
  if not found then
    raise exception 'plan % not found or inactive', p_plan_id;
  end if;

  -- Deactivate previous active subscriptions
  update public.subscriptions
  set status = 'cancelled'
  where user_id = auth.uid() and status = 'active';

  -- Insert new active subscription
  insert into public.subscriptions (user_id, plan_id, status, started_at, expires_at)
  values (auth.uid(), p_plan_id, 'active', now(), v_expires_at)
  returning id into v_new_sub_id;

  return public.get_user_subscription(auth.uid());
end $$;
grant execute on function public.activate_subscription(text, int) to authenticated;

-- 6. Function to cancel active subscription
create or replace function public.cancel_user_subscription()
returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;

  update public.subscriptions
  set status = 'cancelled'
  where user_id = auth.uid() and status = 'active';

  return true;
end $$;
grant execute on function public.cancel_user_subscription() to authenticated;

-- 7. Fix get_who_likes_me to use swiper_id column correctly
drop function if exists public.get_who_likes_me(int, int);
create or replace function public.get_who_likes_me(p_limit int default 20, p_offset int default 0)
returns table (
  profile_id uuid,
  first_name text,
  age int,
  school text,
  s3_key text,
  avatar_url text,
  direction text,
  swiped_at timestamptz,
  is_blurred boolean
)
language plpgsql security definer set search_path = public as $$
declare
  v_sub jsonb;
  v_tier text;
  v_can_see boolean := false;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;

  v_sub := public.get_user_subscription(auth.uid());
  v_tier := v_sub->>'tier';

  -- Gold and Diamond tiers can view unblurred
  if v_tier in ('gold', 'diamond') then
    v_can_see := true;
  end if;

  return query
  select 
    p.id as profile_id,
    case when v_can_see then p.first_name else 'Student' end as first_name,
    case when v_can_see then pd.age else 21 end as age,
    case when v_can_see then coalesce(pd.university_college, p.school) else 'College Campus' end as school,
    case when v_can_see then m.s3_key else null end as s3_key,
    case when v_can_see then pd.avatar_url else null end as avatar_url,
    s.direction,
    s.created_at as swiped_at,
    (not v_can_see) as is_blurred
  from public.swipes s
  join public.profiles p on p.id = s.swiper_id
  left join public.profile_details pd on pd.user_id = p.id
  left join public.photos ph on ph.user_id = p.id and ph.position = 1
  left join public.media m on m.id = ph.media_id
  where s.target_id = auth.uid()
    and s.direction in ('like', 'super')
    and not exists (
      select 1 from public.swipes s2 
      where s2.swiper_id = auth.uid() and s2.target_id = s.swiper_id
    )
  order by s.created_at desc
  limit p_limit offset p_offset;
end $$;
grant execute on function public.get_who_likes_me(int, int) to authenticated;

-- 8. Rewind last swipe RPC
create or replace function public.rewind_last_swipe()
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_sub jsonb;
  v_tier text;
  v_last_swipe record;
  v_target_profile record;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;

  v_sub := public.get_user_subscription(auth.uid());
  v_tier := v_sub->>'tier';

  if v_tier is null then
    raise exception 'Rewind is a Premium feature. Upgrade to Plus, Gold, or Diamond to rewind.' using errcode = '45000';
  end if;

  select * into v_last_swipe
  from public.swipes
  where swiper_id = auth.uid()
  order by created_at desc
  limit 1;

  if not found then
    return jsonb_build_object('success', false, 'message', 'No recent swipe found to rewind');
  end if;

  -- Delete this swipe so user can see profile again
  delete from public.swipes where id = v_last_swipe.id;

  -- Return target profile info
  select id, first_name into v_target_profile from public.profiles where id = v_last_swipe.target_id;

  return jsonb_build_object(
    'success', true, 
    'rewound_id', v_last_swipe.target_id,
    'first_name', v_target_profile.first_name,
    'direction', v_last_swipe.direction
  );
end $$;
grant execute on function public.rewind_last_swipe() to authenticated;

-- 9. Boost Profile RPC
create or replace function public.boost_user_profile()
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_sub jsonb;
  v_tier text;
  v_active_boost record;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;

  v_sub := public.get_user_subscription(auth.uid());
  v_tier := v_sub->>'tier';

  if v_tier is null then
    raise exception 'Campus Boost is a Premium feature. Upgrade to Plus, Gold, or Diamond.' using errcode = '45000';
  end if;

  -- Check if already active
  select * into v_active_boost from public.user_boosts
  where user_id = auth.uid() and expires_at > now()
  order by expires_at desc limit 1;

  if found then
    return jsonb_build_object('success', true, 'already_active', true, 'expires_at', v_active_boost.expires_at);
  end if;

  -- Insert new 30-minute boost
  insert into public.user_boosts (user_id, started_at, expires_at)
  values (auth.uid(), now(), now() + interval '30 minutes')
  returning expires_at into v_active_boost.expires_at;

  return jsonb_build_object('success', true, 'already_active', false, 'expires_at', v_active_boost.expires_at);
end $$;
grant execute on function public.boost_user_profile() to authenticated;
