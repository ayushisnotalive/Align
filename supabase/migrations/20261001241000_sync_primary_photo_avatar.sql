-- Migration: Automatically sync primary photo with profile_details.avatar_url
-- And migrate any existing accounts with placeholder unsplash images to their real uploaded photo #1

-- 1. Helper function to compute photo public URL
create or replace function public.get_storage_photo_url(p_s3_key text)
returns text
language sql immutable as $$
  select case
    when p_s3_key is null or p_s3_key = '' then null
    when p_s3_key like 'http://%' or p_s3_key like 'https://%' then p_s3_key
    when p_s3_key like 'photos/%' then 'https://hjlnomqovcvbvmnckjdo.supabase.co/storage/v1/object/public/' || p_s3_key
    else 'https://hjlnomqovcvbvmnckjdo.supabase.co/storage/v1/object/public/photos/' || p_s3_key
  end;
$$;

-- 2. Enhanced set_primary_photo
create or replace function public.set_primary_photo(p_photo_id uuid)
returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := auth.uid();
  v_old_pos smallint;
  v_old_primary_id uuid;
  v_target_key text;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;

  select ph.position, m.s3_key into v_old_pos, v_target_key
  from public.photos ph
  left join public.media m on m.id = ph.media_id
  where ph.id = p_photo_id and ph.user_id = uid;

  if v_old_pos is null then raise exception 'photo not found'; end if;

  if v_old_pos <> 1 then
    select id into v_old_primary_id
    from public.photos
    where user_id = uid and position = 1;

    -- Swap positions
    update public.photos set position = -99 where id = p_photo_id;
    if v_old_primary_id is not null then
      update public.photos set position = v_old_pos where id = v_old_primary_id;
    end if;
    update public.photos set position = 1 where id = p_photo_id;
  end if;

  -- Ensure profile_details.avatar_url is updated to this primary photo
  if v_target_key is not null then
    insert into public.profile_details (user_id, avatar_url)
    values (uid, public.get_storage_photo_url(v_target_key))
    on conflict (user_id) do update 
      set avatar_url = public.get_storage_photo_url(v_target_key);
  end if;

  return true;
end $$;

grant execute on function public.set_primary_photo(uuid) to authenticated;

-- 3. Enhanced reorder_user_photos
create or replace function public.reorder_user_photos(p_photo_ids uuid[])
returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := auth.uid();
  i int;
  pid uuid;
  v_first_key text;
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

  -- Sync new position 1 photo with profile_details.avatar_url
  select m.s3_key into v_first_key
  from public.photos ph
  join public.media m on m.id = ph.media_id
  where ph.user_id = uid and ph.position = 1
  limit 1;

  if v_first_key is not null then
    insert into public.profile_details (user_id, avatar_url)
    values (uid, public.get_storage_photo_url(v_first_key))
    on conflict (user_id) do update 
      set avatar_url = public.get_storage_photo_url(v_first_key);
  end if;

  return true;
end $$;

grant execute on function public.reorder_user_photos(uuid[]) to authenticated;

-- 4. Trigger to auto-sync avatar_url when position 1 photo is inserted or updated
create or replace function public.trg_sync_photo_avatar()
returns trigger
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_key text;
begin
  if (NEW.position = 1) then
    select m.s3_key into v_key
    from public.media m
    where m.id = NEW.media_id;

    if v_key is not null then
      insert into public.profile_details (user_id, avatar_url)
      values (NEW.user_id, public.get_storage_photo_url(v_key))
      on conflict (user_id) do update
        set avatar_url = public.get_storage_photo_url(v_key)
        where profile_details.avatar_url is null 
           or profile_details.avatar_url like '%unsplash.com%';
    end if;
  end if;
  return NEW;
end $$;

drop trigger if exists trg_photos_sync_avatar on public.photos;
create trigger trg_photos_sync_avatar
after insert or update of position, media_id on public.photos
for each row
execute function public.trg_sync_photo_avatar();

-- 5. Fix all existing users who have uploaded photos in public.photos but still have unsplash placeholder avatars
update public.profile_details pd
set avatar_url = public.get_storage_photo_url(sq.s3_key)
from (
  select ph.user_id, m.s3_key
  from public.photos ph
  join public.media m on m.id = ph.media_id
  where ph.position = 1 and m.s3_key is not null
) sq
where pd.user_id = sq.user_id
  and (pd.avatar_url is null or pd.avatar_url like '%unsplash.com%');
