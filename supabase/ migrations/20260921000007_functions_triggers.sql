-- Generic updated_at
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_profile_private_updated before update on public.profile_private
  for each row execute function public.set_updated_at();
create trigger trg_discovery_updated before update on public.discovery_settings
  for each row execute function public.set_updated_at();
create trigger trg_user_location_updated before update on public.user_location
  for each row execute function public.set_updated_at();

-- Helper checks used by RLS (security definer so policies stay simple)
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public, extensions as $$
  select exists (select 1 from public.admins where id = auth.uid());
$$;

create or replace function public.are_matched(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = public, extensions as $$
  select exists (
    select 1 from public.matches m
    where m.status = 'active'
      and m.user_a = least(a, b) and m.user_b = greatest(a, b)
      and not exists (
        select 1 from public.blocks x
        where (x.blocker_id = a and x.blocked_id = b) or (x.blocker_id = b and x.blocked_id = a)
      )
  );
$$;

-- True if caller is in this match, it is active, and nobody blocked anybody
create or replace function public.can_chat(p_match uuid) returns boolean
language sql stable security definer set search_path = public, extensions as $$
  select exists (
    select 1 from public.matches m
    where m.id = p_match and m.status = 'active'
      and auth.uid() in (m.user_a, m.user_b)
      and not exists (
        select 1 from public.blocks x
        where (x.blocker_id = m.user_a and x.blocked_id = m.user_b)
           or (x.blocker_id = m.user_b and x.blocked_id = m.user_a)
      )
  );
$$;

-- 18+ rule (server-side, cannot be bypassed from the app)
create or replace function public.enforce_min_age() returns trigger
language plpgsql as $$
begin
  if new.dob is not null then
    if new.dob > (current_date - interval '18 years')::date then
      raise exception 'You must be 18 or older' using errcode = 'check_violation';
    end if;
    if new.dob < date '1900-01-01' then
      raise exception 'Invalid date of birth' using errcode = 'check_violation';
    end if;
  end if;
  return new;
end $$;

-- Changing email clears verification and the blue tick
create or replace function public.profile_private_before_write() returns trigger
language plpgsql security definer set search_path = public, extensions as $$
begin
  if tg_op = 'UPDATE' and new.email is distinct from old.email then
    new.email_verified_at := null;
    update public.profiles set is_blue_tick = false, blue_tick_at = null where id = new.user_id;
  end if;
  return new;
end $$;

create trigger trg_profile_private_age before insert or update on public.profile_private
  for each row execute function public.enforce_min_age();
create trigger trg_profile_private_email before insert or update on public.profile_private
  for each row execute function public.profile_private_before_write();

-- Max 3 places per user
create or replace function public.limit_user_places() returns trigger
language plpgsql as $$
begin
  if (select count(*) from public.user_places where user_id = new.user_id) >= 3 then
    raise exception 'You can save at most 3 places' using errcode = 'check_violation';
  end if;
  return new;
end $$;
create trigger trg_user_places_limit before insert on public.user_places
  for each row execute function public.limit_user_places();

-- profile_complete is computed by the server. The client can never set it.
create or replace function public.profile_is_complete(p public.profiles) returns boolean
language plpgsql stable security definer set search_path = public, extensions as $$
declare ok boolean;
begin
  if p.first_name is null or p.gender_id is null or p.pronoun_id is null
     or p.orientation_id is null or p.occupation is null or p.employer is null
     or p.school is null or p.education_id is null or p.bio is null then
    return false;
  end if;
  select exists (
    select 1 from public.profile_private pp
    where pp.user_id = p.id and pp.last_name is not null
      and pp.email is not null and pp.dob is not null
  ) into ok;
  if not ok then return false; end if;
  return (
    select count(*) from public.photos ph
    join public.media m on m.id = ph.media_id
    where ph.user_id = p.id and m.moderation_status = 'ok' and m.deleted_at is null
  ) >= 3;
end $$;

create or replace function public.profiles_before_write() returns trigger
language plpgsql security definer set search_path = public, extensions as $$
begin
  new.profile_complete := public.profile_is_complete(new);
  return new;
end $$;
create trigger trg_profiles_complete before insert or update on public.profiles
  for each row execute function public.profiles_before_write();

-- Re-run the completeness check when related rows change
create or replace function public.touch_profile(uid uuid) returns void
language sql security definer set search_path = public, extensions as $$
  update public.profiles set updated_at = now() where id = uid;
$$;

create or replace function public.touch_after_private() returns trigger
language plpgsql security definer set search_path = public, extensions as $$
begin perform public.touch_profile(new.user_id); return new; end $$;
create trigger trg_touch_private after insert or update on public.profile_private
  for each row execute function public.touch_after_private();

create or replace function public.touch_after_photos() returns trigger
language plpgsql security definer set search_path = public, extensions as $$
begin perform public.touch_profile(coalesce(new.user_id, old.user_id)); return coalesce(new, old); end $$;
create trigger trg_touch_photos after insert or update or delete on public.photos
  for each row execute function public.touch_after_photos();

create or replace function public.touch_after_media() returns trigger
language plpgsql security definer set search_path = public, extensions as $$
begin perform public.touch_profile(new.owner_id); return new; end $$;
create trigger trg_touch_media after update of moderation_status, deleted_at on public.media
  for each row execute function public.touch_after_media();

-- New auth user -> create their rows automatically
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public, extensions as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.profile_private (user_id, phone) values (new.id, new.phone);
  insert into public.discovery_settings (user_id) values (new.id);
  insert into public.user_location (user_id) values (new.id);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();