begin;

-- Plan number of tests
select plan(7);

-- Create dummy users
insert into auth.users (id, aud, role, email) values 
('00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'test1@test.com'),
('00000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'test2@test.com');

-- Act as user 1
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';

-- 1. user A cannot read user B's private data
select is_empty(
  $$ select * from public.profile_private where user_id = '00000000-0000-0000-0000-000000000002' $$,
  'user A cannot read user B private data'
);

-- 2. client cannot set user_colleges.verified or verification_status
-- Test update denied
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

select * from finish();

rollback;
