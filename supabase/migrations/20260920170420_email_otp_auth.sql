-- Switch from phone to email OTP for authentication

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public, extensions as $$
begin
  insert into public.profiles (id) values (new.id);
  -- Extract phone from raw_user_meta_data and use new.email
  insert into public.profile_private (user_id, phone, email) 
  values (new.id, new.raw_user_meta_data->>'phone', new.email);
  insert into public.discovery_settings (user_id) values (new.id);
  insert into public.user_location (user_id) values (new.id);
  return new;
end $$;

-- The hook function receives the user data as a JSON payload and must return
-- a JSON response. Returning an error blocks the signup.
create or replace function public.check_signup_ban(event jsonb)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_phone text;
  v_phone_hash text;
  v_ban public.bans;
begin
  -- Extract phone from the event payload user metadata
  v_phone := event->'user'->'user_metadata'->>'phone';

  if v_phone is null or v_phone = '' then
    -- No phone to check, allow signup
    return jsonb_build_object(
      'decision', 'continue'
    );
  end if;

  -- Hash the phone number for comparison against the bans table
  -- Using SHA-256 for consistent hashing
  v_phone_hash := encode(digest(v_phone, 'sha256'), 'hex');

  -- Check for active ban
  select * into v_ban
  from public.bans
  where phone_hash = v_phone_hash
    and (expires_at is null or expires_at > now())
  order by created_at desc
  limit 1;

  if found then
    -- Ban found — reject the signup
    return jsonb_build_object(
      'decision', 'reject',
      'message', 'This phone number is not allowed to sign up.'
    );
  end if;

  -- No active ban — allow signup
  return jsonb_build_object(
    'decision', 'continue'
  );
end $$;
