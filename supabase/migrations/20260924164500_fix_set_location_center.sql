-- Fix for c.location bug in set_location()
create or replace function public.set_location(
  p_lat double precision,
  p_lng double precision,
  p_perm_state text
)
returns void
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := auth.uid();
  raw_pt geography(Point, 4326);
  rounded_pt geography(Point, 4326);
  v_city_id int;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  
  if p_lat is not null and p_lng is not null then
    raw_pt := st_point(p_lng, p_lat)::geography;
    -- Snapping to grid of 0.01 degrees (roughly 1.11 km at equator)
    rounded_pt := st_setsrid(st_snaptogrid(raw_pt::geometry, 0.01), 4326)::geography;
    
    -- Find nearest active city within 50km
    select c.id into v_city_id
    from public.cities c
    where c.is_active = true and st_dwithin(c.center, rounded_pt, 50000)
    order by st_distance(c.center, rounded_pt) asc
    limit 1;
  end if;

  insert into public.user_location (user_id, coarse_point, detected_city_id, permission_state)
  values (uid, rounded_pt, v_city_id, p_perm_state)
  on conflict (user_id) do update set
    coarse_point = coalesce(excluded.coarse_point, public.user_location.coarse_point),
    detected_city_id = coalesce(excluded.detected_city_id, public.user_location.detected_city_id),
    permission_state = excluded.permission_state,
    updated_at = now();
end $$;
