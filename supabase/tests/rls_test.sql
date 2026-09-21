begin;

-- Plan number of tests
select plan(16);

-- Create dummy users
insert into auth.users (id, aud, role, email, phone) values 
('00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'test1@test.com', '+911111111111'),
('00000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'test2@test.com', '+912222222222');

-- Act as user 1
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';

-- ===== EXISTING TESTS (Phase 1B) =====

-- 1. user A cannot read user B's private data
select is_empty(
  $$ select * from public.profile_private where user_id = '00000000-0000-0000-0000-000000000002' $$,
  'user A cannot read user B private data'
);

-- 2. client cannot set user_colleges.verified or verification_status
select throws_like(
  $$ update public.user_colleges set verified = true where user_id = '00000000-0000-0000-0000-000000000001' $$,
  '%permission denied%',
  'client cannot update user_colleges.verified directly'
);
select throws_like(
  $$ update public.user_colleges set verification_status = 'approved' where user_id = '00000000-0000-0000-0000-000000000001' $$,
  '%permission denied%',
  'client cannot update user_colleges.verification_status directly'
);

-- 3. client cannot insert/update verifications
select throws_like(
  $$ insert into public.verifications (user_id, type) values ('00000000-0000-0000-0000-000000000001', 'college_id') $$,
  '%permission denied%',
  'client cannot insert verifications'
);
select throws_like(
  $$ update public.verifications set status = 'approved' $$,
  '%permission denied%',
  'client cannot update verifications'
);

-- 4. non-admin calling admin_review_college_verification fails
select throws_like(
  $$ select public.admin_review_college_verification('00000000-0000-0000-0000-000000000001'::uuid, true, null) $$,
  '%forbidden%',
  'non-admin calling admin_review_college_verification fails'
);

-- 5. submit_college_verification fails without consent / without own college_id upload
select throws_like(
  $$ select public.submit_college_verification('00000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000003'::uuid) $$,
  '%college not found%',
  'submit_college_verification enforces ownership or existence'
);

-- ===== NEW TESTS (Phase 1C) =====

-- 6. client cannot insert swipes directly (RLS blocks — no insert policy)
select throws_like(
  $$ insert into public.swipes (swiper_id, target_id, direction) 
     values ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'like') $$,
  '%permission denied%',
  'client cannot insert swipes directly'
);

-- 7. client cannot insert matches directly (RLS blocks — no insert policy)
select throws_like(
  $$ insert into public.matches (user_a, user_b, origin) 
     values ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'swipe') $$,
  '%permission denied%',
  'client cannot insert matches directly'
);

-- 8. client cannot insert message_requests directly (RLS blocks — no insert policy)
select throws_like(
  $$ insert into public.message_requests (sender_id, receiver_id, body) 
     values ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'hi') $$,
  '%permission denied%',
  'client cannot insert message_requests directly'
);

-- 9. client cannot insert live_presence directly (RLS blocks — no policies at all)
select throws_like(
  $$ insert into public.live_presence (user_id, goal_code, expires_at) 
     values ('00000000-0000-0000-0000-000000000001', 'long_term', now() + interval '1 hour') $$,
  '%permission denied%',
  'client cannot insert live_presence directly'
);

-- 10. client cannot insert daily_usage directly (RLS blocks — select-only policy)
select throws_like(
  $$ insert into public.daily_usage (user_id, day) 
     values ('00000000-0000-0000-0000-000000000001', current_date) $$,
  '%permission denied%',
  'client cannot insert daily_usage directly'
);

-- 11. send_message_request fails with incomplete profile (profile_complete = false by default)
select throws_like(
  $$ select public.send_message_request('00000000-0000-0000-0000-000000000002'::uuid, 'hello') $$,
  '%profile incomplete%',
  'send_message_request rejects incomplete profile'
);

-- 12. get_feed fails with incomplete profile
select throws_like(
  $$ select public.get_feed('discover') $$,
  '%profile incomplete%',
  'get_feed rejects incomplete profile'
);

-- ===== BAN CHECK TESTS =====

-- Reset to superuser to call the function (it's only granted to supabase_auth_admin)
reset role;

-- 13. Signup ban check allows clean phone
-- (We test the function directly since we can't trigger auth hooks in pgTAP)
select is(
  (public.check_signup_ban('{"user": {"user_metadata": {"phone": "+919999999999"}}}'::jsonb))->>'decision',
  'continue',
  'clean phone number is allowed to sign up'
);

-- 14. Signup ban check rejects banned phone
-- Reset to superuser to call the function (it's only granted to supabase_auth_admin)
-- and to insert the ban
reset role;

-- First insert a ban for a known phone hash
insert into public.bans (phone_hash, reason, created_by)
values (
  encode(digest('+918888888888', 'sha256'), 'hex'),
  'test ban',
  null
);

select is(
  (public.check_signup_ban('{"user": {"user_metadata": {"phone": "+918888888888"}}}'::jsonb))->>'decision',
  'reject',
  'banned phone number is rejected at signup'
);

select * from finish();

rollback;
