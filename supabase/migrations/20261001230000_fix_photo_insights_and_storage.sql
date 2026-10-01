-- Fix photo insights RPC and setup public Supabase storage for user photos

-- 1. Ensure photos storage bucket exists and is public
insert into storage.buckets (id, name, public) 
values ('photos', 'photos', true) 
on conflict (id) do update set public = true;

-- 2. Storage policies for photos bucket
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Public Photo Access' and tablename = 'objects') then
    create policy "Public Photo Access" on storage.objects for select using (bucket_id = 'photos');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Auth Users Upload Photos' and tablename = 'objects') then
    create policy "Auth Users Upload Photos" on storage.objects for insert to authenticated with check (bucket_id = 'photos');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Auth Users Update Photos' and tablename = 'objects') then
    create policy "Auth Users Update Photos" on storage.objects for update to authenticated using (bucket_id = 'photos');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Auth Users Delete Photos' and tablename = 'objects') then
    create policy "Auth Users Delete Photos" on storage.objects for delete to authenticated using (bucket_id = 'photos');
  end if;
end $$;

-- 3. Redefine get_user_photo_insights with public.admins check and auto-linking
create or replace function public.get_user_photo_insights(p_user_id uuid default null)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := coalesce(p_user_id, auth.uid());
  v_is_pro boolean := false;
  v_total_likes int := 0;
  v_max_likes int := 0;
  v_current_count int := 0;
  v_result jsonb;
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  -- Check if user is pro (from active subscription or admin table)
  select exists (
    select 1 from public.subscriptions 
    where user_id = uid and status = 'active'
  ) or exists (
    select 1 from public.admins 
    where id = uid
  ) into v_is_pro;

  -- Count existing photos
  select count(*) into v_current_count from public.photos where user_id = uid;

  -- Auto-link any unlinked profile photos from media into photos table if slots available
  if v_current_count < 6 then
    insert into public.photos (user_id, media_id, position)
    select m.owner_id, m.id,
           (v_current_count + row_number() over (order by m.created_at asc))::smallint
    from public.media m
    where m.owner_id = uid
      and m.kind = 'profile_photo'
      and m.deleted_at is null
      and not exists (
        select 1 from public.photos p where p.media_id = m.id
      )
    limit (6 - v_current_count);
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

  return coalesce(v_result, jsonb_build_object('is_pro', v_is_pro, 'total_likes', 0, 'photos', '[]'::jsonb));
end $$;

grant execute on function public.get_user_photo_insights(uuid) to authenticated;
