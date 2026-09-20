-- 16. Signup ban check
-- Before-user-created hook function.
-- Checks the bans table by phone hash. If an active ban exists, the signup is rejected.
-- This function is called by Supabase Auth as a before-user-created hook.
-- Enable in Dashboard > Auth > Hooks > Before User Created.

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
  -- Extract phone from the event payload
  v_phone := event->'user'->>'phone';

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

-- Grant to supabase_auth_admin (the role Supabase Auth uses for hooks)
-- and revoke from public/anon/authenticated since this is only for the auth system
revoke all on function public.check_signup_ban(jsonb) from public, anon, authenticated;
grant execute on function public.check_signup_ban(jsonb) to supabase_auth_admin;
