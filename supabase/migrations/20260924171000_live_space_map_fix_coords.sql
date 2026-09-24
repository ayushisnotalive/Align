drop function if exists public.get_live_feed(double precision, double precision, float);

create or replace function public.get_live_feed(
  p_lat double precision,
  p_lng double precision,
  p_radius_km float default 50
)
returns table (
  user_id uuid,
  name text,
  goal_code text,
  type_codes text[],
  expires_at timestamptz,
  lat double precision,
  lng double precision,
  city_id int
)
language sql security definer set search_path = public, extensions as $$
  select 
    lp.user_id,
    p.first_name,
    lp.goal_code,
    lp.type_codes,
    lp.expires_at,
    st_y(ul.coarse_point::geometry) as lat,
    st_x(ul.coarse_point::geometry) as lng,
    ul.detected_city_id
  from public.live_presence lp
  join public.profiles p on p.id = lp.user_id
  join public.user_location ul on ul.user_id = lp.user_id
  join public.discovery_settings ds on ds.user_id = lp.user_id
  where lp.expires_at > now()
    and lp.user_id != auth.uid()
    and ds.ghost_mode = false
    and (
      p_lat is null or p_lng is null 
      or st_dwithin(ul.coarse_point, st_point(p_lng, p_lat)::geography, p_radius_km * 1000)
    );
$$;
grant execute on function public.get_live_feed(double precision, double precision, float) to authenticated;
