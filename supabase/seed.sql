-- Seed 10 Dummy Users
-- These users will be inserted into auth.users and the trigger will create their profiles
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000000', 'aa653361-5b2a-4ec3-9738-efa7d925258f', 'authenticated', 'authenticated', 'dummy1@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', '64487184-a42d-4062-a3d2-493f7745fb85', 'authenticated', 'authenticated', 'dummy2@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', 'cc1d3f9e-bf5c-41f8-8a7b-9c6d764442f2', 'authenticated', 'authenticated', 'dummy3@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', 'b2eedf24-a257-4e09-bfaa-9499a48b4a5c', 'authenticated', 'authenticated', 'dummy4@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', 'd0ca734e-2030-4b63-af79-bf3db0207033', 'authenticated', 'authenticated', 'dummy5@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', '6681eb70-8ceb-4e11-b306-cb3292e00279', 'authenticated', 'authenticated', 'dummy6@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', 'b0020da4-3312-4935-92e3-e8ef8703726e', 'authenticated', 'authenticated', 'dummy7@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', 'e5fa5c3b-3988-4f08-87a9-fa51efff9986', 'authenticated', 'authenticated', 'dummy8@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', '615e1ca0-8d91-4027-a70c-91d8700cde92', 'authenticated', 'authenticated', 'dummy9@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', '9f5531c6-8419-4a3c-bb03-d6fea3c6b724', 'authenticated', 'authenticated', 'dummy10@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at) VALUES
('655a02ee-61c5-40f4-87c6-5e97fe8e1063', 'aa653361-5b2a-4ec3-9738-efa7d925258f', 'aa653361-5b2a-4ec3-9738-efa7d925258f', format('{"sub":"%s"}', 'aa653361-5b2a-4ec3-9738-efa7d925258f')::jsonb, 'email', now(), now(), now()),
('ebb74715-9df7-4e14-af27-d8355e1b9433', '64487184-a42d-4062-a3d2-493f7745fb85', '64487184-a42d-4062-a3d2-493f7745fb85', format('{"sub":"%s"}', '64487184-a42d-4062-a3d2-493f7745fb85')::jsonb, 'email', now(), now(), now()),
('f9a612e4-21c4-4ce5-b0f5-23c209cdd02e', 'cc1d3f9e-bf5c-41f8-8a7b-9c6d764442f2', 'cc1d3f9e-bf5c-41f8-8a7b-9c6d764442f2', format('{"sub":"%s"}', 'cc1d3f9e-bf5c-41f8-8a7b-9c6d764442f2')::jsonb, 'email', now(), now(), now()),
('d1865a15-5b52-4b5b-b205-aaaed9f99bb7', 'b2eedf24-a257-4e09-bfaa-9499a48b4a5c', 'b2eedf24-a257-4e09-bfaa-9499a48b4a5c', format('{"sub":"%s"}', 'b2eedf24-a257-4e09-bfaa-9499a48b4a5c')::jsonb, 'email', now(), now(), now()),
('8879019c-2b59-4d28-b284-7303309c2102', 'd0ca734e-2030-4b63-af79-bf3db0207033', 'd0ca734e-2030-4b63-af79-bf3db0207033', format('{"sub":"%s"}', 'd0ca734e-2030-4b63-af79-bf3db0207033')::jsonb, 'email', now(), now(), now()),
('fdaa9107-6259-416e-a291-17018306b7d6', '6681eb70-8ceb-4e11-b306-cb3292e00279', '6681eb70-8ceb-4e11-b306-cb3292e00279', format('{"sub":"%s"}', '6681eb70-8ceb-4e11-b306-cb3292e00279')::jsonb, 'email', now(), now(), now()),
('73aecb97-1f88-4aa6-844c-ed41967cf1fa', 'b0020da4-3312-4935-92e3-e8ef8703726e', 'b0020da4-3312-4935-92e3-e8ef8703726e', format('{"sub":"%s"}', 'b0020da4-3312-4935-92e3-e8ef8703726e')::jsonb, 'email', now(), now(), now()),
('3099443e-81e2-48c6-824a-50b4726c7374', 'e5fa5c3b-3988-4f08-87a9-fa51efff9986', 'e5fa5c3b-3988-4f08-87a9-fa51efff9986', format('{"sub":"%s"}', 'e5fa5c3b-3988-4f08-87a9-fa51efff9986')::jsonb, 'email', now(), now(), now()),
('6916aca4-7ddd-40fb-9d2d-809bca505c68', '615e1ca0-8d91-4027-a70c-91d8700cde92', '615e1ca0-8d91-4027-a70c-91d8700cde92', format('{"sub":"%s"}', '615e1ca0-8d91-4027-a70c-91d8700cde92')::jsonb, 'email', now(), now(), now()),
('da70a274-a8fe-4f02-91e1-d5ca7297c86e', '9f5531c6-8419-4a3c-bb03-d6fea3c6b724', '9f5531c6-8419-4a3c-bb03-d6fea3c6b724', format('{"sub":"%s"}', '9f5531c6-8419-4a3c-bb03-d6fea3c6b724')::jsonb, 'email', now(), now(), now()) ON CONFLICT (id) DO NOTHING;


-- Update their profiles
UPDATE public.profiles SET first_name='Aarav', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='aa653361-5b2a-4ec3-9738-efa7d925258f';
UPDATE public.profile_private SET last_name='Kumar', dob='2000-01-01' WHERE user_id='aa653361-5b2a-4ec3-9738-efa7d925258f';
UPDATE public.profiles SET first_name='Vivaan', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='64487184-a42d-4062-a3d2-493f7745fb85';
UPDATE public.profile_private SET last_name='Kumar', dob='2000-01-01' WHERE user_id='64487184-a42d-4062-a3d2-493f7745fb85';
UPDATE public.profiles SET first_name='Aditya', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='cc1d3f9e-bf5c-41f8-8a7b-9c6d764442f2';
UPDATE public.profile_private SET last_name='Kumar', dob='2000-01-01' WHERE user_id='cc1d3f9e-bf5c-41f8-8a7b-9c6d764442f2';
UPDATE public.profiles SET first_name='Vihaan', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='b2eedf24-a257-4e09-bfaa-9499a48b4a5c';
UPDATE public.profile_private SET last_name='Kumar', dob='2000-01-01' WHERE user_id='b2eedf24-a257-4e09-bfaa-9499a48b4a5c';
UPDATE public.profiles SET first_name='Arjun', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='d0ca734e-2030-4b63-af79-bf3db0207033';
UPDATE public.profile_private SET last_name='Kumar', dob='2000-01-01' WHERE user_id='d0ca734e-2030-4b63-af79-bf3db0207033';
UPDATE public.profiles SET first_name='Sai', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='6681eb70-8ceb-4e11-b306-cb3292e00279';
UPDATE public.profile_private SET last_name='Kumar', dob='2000-01-01' WHERE user_id='6681eb70-8ceb-4e11-b306-cb3292e00279';
UPDATE public.profiles SET first_name='Ayaan', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='b0020da4-3312-4935-92e3-e8ef8703726e';
UPDATE public.profile_private SET last_name='Kumar', dob='2000-01-01' WHERE user_id='b0020da4-3312-4935-92e3-e8ef8703726e';
UPDATE public.profiles SET first_name='Krishna', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='e5fa5c3b-3988-4f08-87a9-fa51efff9986';
UPDATE public.profile_private SET last_name='Kumar', dob='2000-01-01' WHERE user_id='e5fa5c3b-3988-4f08-87a9-fa51efff9986';
UPDATE public.profiles SET first_name='Ishaan', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='615e1ca0-8d91-4027-a70c-91d8700cde92';
UPDATE public.profile_private SET last_name='Kumar', dob='2000-01-01' WHERE user_id='615e1ca0-8d91-4027-a70c-91d8700cde92';
UPDATE public.profiles SET first_name='Shaurya', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='9f5531c6-8419-4a3c-bb03-d6fea3c6b724';
UPDATE public.profile_private SET last_name='Kumar', dob='2000-01-01' WHERE user_id='9f5531c6-8419-4a3c-bb03-d6fea3c6b724';

-- Insert locations
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('aa653361-5b2a-4ec3-9738-efa7d925258f', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('64487184-a42d-4062-a3d2-493f7745fb85', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('cc1d3f9e-bf5c-41f8-8a7b-9c6d764442f2', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('b2eedf24-a257-4e09-bfaa-9499a48b4a5c', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('d0ca734e-2030-4b63-af79-bf3db0207033', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('6681eb70-8ceb-4e11-b306-cb3292e00279', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('b0020da4-3312-4935-92e3-e8ef8703726e', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('e5fa5c3b-3988-4f08-87a9-fa51efff9986', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('615e1ca0-8d91-4027-a70c-91d8700cde92', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('9f5531c6-8419-4a3c-bb03-d6fea3c6b724', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;

-- Insert discovery_settings
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('aa653361-5b2a-4ec3-9738-efa7d925258f', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman') WHERE user_id='aa653361-5b2a-4ec3-9738-efa7d925258f';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('64487184-a42d-4062-a3d2-493f7745fb85', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman') WHERE user_id='64487184-a42d-4062-a3d2-493f7745fb85';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('cc1d3f9e-bf5c-41f8-8a7b-9c6d764442f2', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman') WHERE user_id='cc1d3f9e-bf5c-41f8-8a7b-9c6d764442f2';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('b2eedf24-a257-4e09-bfaa-9499a48b4a5c', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman') WHERE user_id='b2eedf24-a257-4e09-bfaa-9499a48b4a5c';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('d0ca734e-2030-4b63-af79-bf3db0207033', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman') WHERE user_id='d0ca734e-2030-4b63-af79-bf3db0207033';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('6681eb70-8ceb-4e11-b306-cb3292e00279', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman') WHERE user_id='6681eb70-8ceb-4e11-b306-cb3292e00279';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('b0020da4-3312-4935-92e3-e8ef8703726e', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman') WHERE user_id='b0020da4-3312-4935-92e3-e8ef8703726e';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('e5fa5c3b-3988-4f08-87a9-fa51efff9986', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman') WHERE user_id='e5fa5c3b-3988-4f08-87a9-fa51efff9986';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('615e1ca0-8d91-4027-a70c-91d8700cde92', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman') WHERE user_id='615e1ca0-8d91-4027-a70c-91d8700cde92';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('9f5531c6-8419-4a3c-bb03-d6fea3c6b724', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman') WHERE user_id='9f5531c6-8419-4a3c-bb03-d6fea3c6b724';

-- Insert user_colleges
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('aa653361-5b2a-4ec3-9738-efa7d925258f', (SELECT id FROM colleges LIMIT 1 OFFSET 0), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('64487184-a42d-4062-a3d2-493f7745fb85', (SELECT id FROM colleges LIMIT 1 OFFSET 1), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('cc1d3f9e-bf5c-41f8-8a7b-9c6d764442f2', (SELECT id FROM colleges LIMIT 1 OFFSET 2), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('b2eedf24-a257-4e09-bfaa-9499a48b4a5c', (SELECT id FROM colleges LIMIT 1 OFFSET 3), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('d0ca734e-2030-4b63-af79-bf3db0207033', (SELECT id FROM colleges LIMIT 1 OFFSET 4), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('6681eb70-8ceb-4e11-b306-cb3292e00279', (SELECT id FROM colleges LIMIT 1 OFFSET 5), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('b0020da4-3312-4935-92e3-e8ef8703726e', (SELECT id FROM colleges LIMIT 1 OFFSET 6), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('e5fa5c3b-3988-4f08-87a9-fa51efff9986', (SELECT id FROM colleges LIMIT 1 OFFSET 7), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('615e1ca0-8d91-4027-a70c-91d8700cde92', (SELECT id FROM colleges LIMIT 1 OFFSET 8), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('9f5531c6-8419-4a3c-bb03-d6fea3c6b724', (SELECT id FROM colleges LIMIT 1 OFFSET 9), 2024, true, 'approved') ON CONFLICT DO NOTHING;
-- Add 20 more users
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000000', 'bff105f7-1aed-46d7-b7d7-d8050fa3114d', 'authenticated', 'authenticated', 'dummy11@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', 'ce441dc0-71d8-46cf-b11f-bf70a28f4ed0', 'authenticated', 'authenticated', 'dummy12@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', '7077a22c-ae90-41e4-a23d-1c8a27e1bb67', 'authenticated', 'authenticated', 'dummy13@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', '1416fae6-af31-4734-80f9-a2577bc6cb8b', 'authenticated', 'authenticated', 'dummy14@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', '360ca797-71d5-4e4a-9db8-03faf12521a5', 'authenticated', 'authenticated', 'dummy15@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', '0e9ed179-964c-4631-9e5f-cc564a81a454', 'authenticated', 'authenticated', 'dummy16@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', 'f3f26ff1-0c48-41b4-98e5-21d25a0a6dab', 'authenticated', 'authenticated', 'dummy17@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', '9d3dc8cd-e086-40da-b9e9-8ef445ba1a51', 'authenticated', 'authenticated', 'dummy18@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', '8726d1f0-183f-4694-8720-89c0af2dd935', 'authenticated', 'authenticated', 'dummy19@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', '4a05ed64-d529-4db5-bc34-f5191a4fd1a2', 'authenticated', 'authenticated', 'dummy20@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', 'ae6b1dd2-89bd-400b-8ea3-19dfd59b7029', 'authenticated', 'authenticated', 'dummy21@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', 'e6afa9e3-2d13-48bc-8206-5ec226fdbc52', 'authenticated', 'authenticated', 'dummy22@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', '6b46f83e-ce54-463d-9694-b1b47821bdcb', 'authenticated', 'authenticated', 'dummy23@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', 'e9ce323a-241d-4c66-8962-81284e290dbf', 'authenticated', 'authenticated', 'dummy24@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', '11c02fcf-5f3c-48ca-ad49-195073019f6d', 'authenticated', 'authenticated', 'dummy25@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', '4f3f1592-db53-462d-8d05-64f45871efdc', 'authenticated', 'authenticated', 'dummy26@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', 'cb4aa343-bd40-47de-b41b-04bd924fa9af', 'authenticated', 'authenticated', 'dummy27@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', 'a2d844c1-613e-4b3f-9a50-80e20250875a', 'authenticated', 'authenticated', 'dummy28@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', 'f424c16c-a870-4119-89fe-48865622de66', 'authenticated', 'authenticated', 'dummy29@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', 'b5382e3d-fc9b-48e0-aa69-73c1b86d1c0d', 'authenticated', 'authenticated', 'dummy30@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at) VALUES
('a61c4ed9-99a8-4081-bf3d-322b43487d13', 'bff105f7-1aed-46d7-b7d7-d8050fa3114d', 'bff105f7-1aed-46d7-b7d7-d8050fa3114d', format('{"sub":"%s"}', 'bff105f7-1aed-46d7-b7d7-d8050fa3114d')::jsonb, 'email', now(), now(), now()),
('db235886-f45e-48ac-9839-99262bae0f51', 'ce441dc0-71d8-46cf-b11f-bf70a28f4ed0', 'ce441dc0-71d8-46cf-b11f-bf70a28f4ed0', format('{"sub":"%s"}', 'ce441dc0-71d8-46cf-b11f-bf70a28f4ed0')::jsonb, 'email', now(), now(), now()),
('f3d0cc88-ab17-4e32-a621-ee04ef1db1e4', '7077a22c-ae90-41e4-a23d-1c8a27e1bb67', '7077a22c-ae90-41e4-a23d-1c8a27e1bb67', format('{"sub":"%s"}', '7077a22c-ae90-41e4-a23d-1c8a27e1bb67')::jsonb, 'email', now(), now(), now()),
('b2ae5f7d-430e-4563-98c9-6107a3b2aba7', '1416fae6-af31-4734-80f9-a2577bc6cb8b', '1416fae6-af31-4734-80f9-a2577bc6cb8b', format('{"sub":"%s"}', '1416fae6-af31-4734-80f9-a2577bc6cb8b')::jsonb, 'email', now(), now(), now()),
('c039b96c-d16f-425c-af0e-3f0671dc4844', '360ca797-71d5-4e4a-9db8-03faf12521a5', '360ca797-71d5-4e4a-9db8-03faf12521a5', format('{"sub":"%s"}', '360ca797-71d5-4e4a-9db8-03faf12521a5')::jsonb, 'email', now(), now(), now()),
('5ea7442b-5f48-48bb-ab4e-208609231171', '0e9ed179-964c-4631-9e5f-cc564a81a454', '0e9ed179-964c-4631-9e5f-cc564a81a454', format('{"sub":"%s"}', '0e9ed179-964c-4631-9e5f-cc564a81a454')::jsonb, 'email', now(), now(), now()),
('b0751319-48f3-4471-9d8e-49b082dd2ebf', 'f3f26ff1-0c48-41b4-98e5-21d25a0a6dab', 'f3f26ff1-0c48-41b4-98e5-21d25a0a6dab', format('{"sub":"%s"}', 'f3f26ff1-0c48-41b4-98e5-21d25a0a6dab')::jsonb, 'email', now(), now(), now()),
('843bb700-1b60-4f48-a86e-cdb14033c638', '9d3dc8cd-e086-40da-b9e9-8ef445ba1a51', '9d3dc8cd-e086-40da-b9e9-8ef445ba1a51', format('{"sub":"%s"}', '9d3dc8cd-e086-40da-b9e9-8ef445ba1a51')::jsonb, 'email', now(), now(), now()),
('b041b19d-6b3b-46fa-b9cb-85b312c2ec66', '8726d1f0-183f-4694-8720-89c0af2dd935', '8726d1f0-183f-4694-8720-89c0af2dd935', format('{"sub":"%s"}', '8726d1f0-183f-4694-8720-89c0af2dd935')::jsonb, 'email', now(), now(), now()),
('5b37a52f-bd2f-4d51-a4b1-90f8bad84203', '4a05ed64-d529-4db5-bc34-f5191a4fd1a2', '4a05ed64-d529-4db5-bc34-f5191a4fd1a2', format('{"sub":"%s"}', '4a05ed64-d529-4db5-bc34-f5191a4fd1a2')::jsonb, 'email', now(), now(), now()),
('58411f7a-f85b-4051-967e-2e89b35f28f1', 'ae6b1dd2-89bd-400b-8ea3-19dfd59b7029', 'ae6b1dd2-89bd-400b-8ea3-19dfd59b7029', format('{"sub":"%s"}', 'ae6b1dd2-89bd-400b-8ea3-19dfd59b7029')::jsonb, 'email', now(), now(), now()),
('4dae5034-266d-436e-9b67-29fece9d21ed', 'e6afa9e3-2d13-48bc-8206-5ec226fdbc52', 'e6afa9e3-2d13-48bc-8206-5ec226fdbc52', format('{"sub":"%s"}', 'e6afa9e3-2d13-48bc-8206-5ec226fdbc52')::jsonb, 'email', now(), now(), now()),
('dfa73d34-6271-4fa0-b15f-00207072bce5', '6b46f83e-ce54-463d-9694-b1b47821bdcb', '6b46f83e-ce54-463d-9694-b1b47821bdcb', format('{"sub":"%s"}', '6b46f83e-ce54-463d-9694-b1b47821bdcb')::jsonb, 'email', now(), now(), now()),
('8625fcc4-ffd5-4df4-b077-bc230bd27c1d', 'e9ce323a-241d-4c66-8962-81284e290dbf', 'e9ce323a-241d-4c66-8962-81284e290dbf', format('{"sub":"%s"}', 'e9ce323a-241d-4c66-8962-81284e290dbf')::jsonb, 'email', now(), now(), now()),
('de62be30-e386-44cf-b944-9fa8314c4174', '11c02fcf-5f3c-48ca-ad49-195073019f6d', '11c02fcf-5f3c-48ca-ad49-195073019f6d', format('{"sub":"%s"}', '11c02fcf-5f3c-48ca-ad49-195073019f6d')::jsonb, 'email', now(), now(), now()),
('e999fdf6-b3fb-465b-80e1-b9ed5c8d97a0', '4f3f1592-db53-462d-8d05-64f45871efdc', '4f3f1592-db53-462d-8d05-64f45871efdc', format('{"sub":"%s"}', '4f3f1592-db53-462d-8d05-64f45871efdc')::jsonb, 'email', now(), now(), now()),
('4c3c9e63-5d9c-40bb-8211-c7a24886044a', 'cb4aa343-bd40-47de-b41b-04bd924fa9af', 'cb4aa343-bd40-47de-b41b-04bd924fa9af', format('{"sub":"%s"}', 'cb4aa343-bd40-47de-b41b-04bd924fa9af')::jsonb, 'email', now(), now(), now()),
('dd8f58f3-55e1-43eb-947a-863bdcf2901c', 'a2d844c1-613e-4b3f-9a50-80e20250875a', 'a2d844c1-613e-4b3f-9a50-80e20250875a', format('{"sub":"%s"}', 'a2d844c1-613e-4b3f-9a50-80e20250875a')::jsonb, 'email', now(), now(), now()),
('135e99b1-015b-4705-8d1c-d1c6d9f9f991', 'f424c16c-a870-4119-89fe-48865622de66', 'f424c16c-a870-4119-89fe-48865622de66', format('{"sub":"%s"}', 'f424c16c-a870-4119-89fe-48865622de66')::jsonb, 'email', now(), now(), now()),
('b346bd9f-54e7-446f-b1d0-c536703af7a3', 'b5382e3d-fc9b-48e0-aa69-73c1b86d1c0d', 'b5382e3d-fc9b-48e0-aa69-73c1b86d1c0d', format('{"sub":"%s"}', 'b5382e3d-fc9b-48e0-aa69-73c1b86d1c0d')::jsonb, 'email', now(), now(), now()) ON CONFLICT (id) DO NOTHING;

UPDATE public.profiles SET first_name='DummyName11', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='bff105f7-1aed-46d7-b7d7-d8050fa3114d';
UPDATE public.profile_private SET last_name='LastDummyName11', dob='2002-01-01' WHERE user_id='bff105f7-1aed-46d7-b7d7-d8050fa3114d';
UPDATE public.profiles SET first_name='DummyName12', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='ce441dc0-71d8-46cf-b11f-bf70a28f4ed0';
UPDATE public.profile_private SET last_name='LastDummyName12', dob='2002-01-01' WHERE user_id='ce441dc0-71d8-46cf-b11f-bf70a28f4ed0';
UPDATE public.profiles SET first_name='DummyName13', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='7077a22c-ae90-41e4-a23d-1c8a27e1bb67';
UPDATE public.profile_private SET last_name='LastDummyName13', dob='2002-01-01' WHERE user_id='7077a22c-ae90-41e4-a23d-1c8a27e1bb67';
UPDATE public.profiles SET first_name='DummyName14', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='1416fae6-af31-4734-80f9-a2577bc6cb8b';
UPDATE public.profile_private SET last_name='LastDummyName14', dob='2002-01-01' WHERE user_id='1416fae6-af31-4734-80f9-a2577bc6cb8b';
UPDATE public.profiles SET first_name='DummyName15', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='360ca797-71d5-4e4a-9db8-03faf12521a5';
UPDATE public.profile_private SET last_name='LastDummyName15', dob='2002-01-01' WHERE user_id='360ca797-71d5-4e4a-9db8-03faf12521a5';
UPDATE public.profiles SET first_name='DummyName16', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='0e9ed179-964c-4631-9e5f-cc564a81a454';
UPDATE public.profile_private SET last_name='LastDummyName16', dob='2002-01-01' WHERE user_id='0e9ed179-964c-4631-9e5f-cc564a81a454';
UPDATE public.profiles SET first_name='DummyName17', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='f3f26ff1-0c48-41b4-98e5-21d25a0a6dab';
UPDATE public.profile_private SET last_name='LastDummyName17', dob='2002-01-01' WHERE user_id='f3f26ff1-0c48-41b4-98e5-21d25a0a6dab';
UPDATE public.profiles SET first_name='DummyName18', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='9d3dc8cd-e086-40da-b9e9-8ef445ba1a51';
UPDATE public.profile_private SET last_name='LastDummyName18', dob='2002-01-01' WHERE user_id='9d3dc8cd-e086-40da-b9e9-8ef445ba1a51';
UPDATE public.profiles SET first_name='DummyName19', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='8726d1f0-183f-4694-8720-89c0af2dd935';
UPDATE public.profile_private SET last_name='LastDummyName19', dob='2002-01-01' WHERE user_id='8726d1f0-183f-4694-8720-89c0af2dd935';
UPDATE public.profiles SET first_name='DummyName20', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='4a05ed64-d529-4db5-bc34-f5191a4fd1a2';
UPDATE public.profile_private SET last_name='LastDummyName20', dob='2002-01-01' WHERE user_id='4a05ed64-d529-4db5-bc34-f5191a4fd1a2';
UPDATE public.profiles SET first_name='DummyName21', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='ae6b1dd2-89bd-400b-8ea3-19dfd59b7029';
UPDATE public.profile_private SET last_name='LastDummyName21', dob='2002-01-01' WHERE user_id='ae6b1dd2-89bd-400b-8ea3-19dfd59b7029';
UPDATE public.profiles SET first_name='DummyName22', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='e6afa9e3-2d13-48bc-8206-5ec226fdbc52';
UPDATE public.profile_private SET last_name='LastDummyName22', dob='2002-01-01' WHERE user_id='e6afa9e3-2d13-48bc-8206-5ec226fdbc52';
UPDATE public.profiles SET first_name='DummyName23', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='6b46f83e-ce54-463d-9694-b1b47821bdcb';
UPDATE public.profile_private SET last_name='LastDummyName23', dob='2002-01-01' WHERE user_id='6b46f83e-ce54-463d-9694-b1b47821bdcb';
UPDATE public.profiles SET first_name='DummyName24', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='e9ce323a-241d-4c66-8962-81284e290dbf';
UPDATE public.profile_private SET last_name='LastDummyName24', dob='2002-01-01' WHERE user_id='e9ce323a-241d-4c66-8962-81284e290dbf';
UPDATE public.profiles SET first_name='DummyName25', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='11c02fcf-5f3c-48ca-ad49-195073019f6d';
UPDATE public.profile_private SET last_name='LastDummyName25', dob='2002-01-01' WHERE user_id='11c02fcf-5f3c-48ca-ad49-195073019f6d';
UPDATE public.profiles SET first_name='DummyName26', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='4f3f1592-db53-462d-8d05-64f45871efdc';
UPDATE public.profile_private SET last_name='LastDummyName26', dob='2002-01-01' WHERE user_id='4f3f1592-db53-462d-8d05-64f45871efdc';
UPDATE public.profiles SET first_name='DummyName27', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='cb4aa343-bd40-47de-b41b-04bd924fa9af';
UPDATE public.profile_private SET last_name='LastDummyName27', dob='2002-01-01' WHERE user_id='cb4aa343-bd40-47de-b41b-04bd924fa9af';
UPDATE public.profiles SET first_name='DummyName28', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='a2d844c1-613e-4b3f-9a50-80e20250875a';
UPDATE public.profile_private SET last_name='LastDummyName28', dob='2002-01-01' WHERE user_id='a2d844c1-613e-4b3f-9a50-80e20250875a';
UPDATE public.profiles SET first_name='DummyName29', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='f424c16c-a870-4119-89fe-48865622de66';
UPDATE public.profile_private SET last_name='LastDummyName29', dob='2002-01-01' WHERE user_id='f424c16c-a870-4119-89fe-48865622de66';
UPDATE public.profiles SET first_name='DummyName30', gender_id=(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='woman' LIMIT 1), onboarding_step=5, profile_complete=true WHERE id='b5382e3d-fc9b-48e0-aa69-73c1b86d1c0d';
UPDATE public.profile_private SET last_name='LastDummyName30', dob='2002-01-01' WHERE user_id='b5382e3d-fc9b-48e0-aa69-73c1b86d1c0d';

INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('bff105f7-1aed-46d7-b7d7-d8050fa3114d', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('ce441dc0-71d8-46cf-b11f-bf70a28f4ed0', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('7077a22c-ae90-41e4-a23d-1c8a27e1bb67', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('1416fae6-af31-4734-80f9-a2577bc6cb8b', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('360ca797-71d5-4e4a-9db8-03faf12521a5', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('0e9ed179-964c-4631-9e5f-cc564a81a454', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('f3f26ff1-0c48-41b4-98e5-21d25a0a6dab', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('9d3dc8cd-e086-40da-b9e9-8ef445ba1a51', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('8726d1f0-183f-4694-8720-89c0af2dd935', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('4a05ed64-d529-4db5-bc34-f5191a4fd1a2', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('ae6b1dd2-89bd-400b-8ea3-19dfd59b7029', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('e6afa9e3-2d13-48bc-8206-5ec226fdbc52', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('6b46f83e-ce54-463d-9694-b1b47821bdcb', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('e9ce323a-241d-4c66-8962-81284e290dbf', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('11c02fcf-5f3c-48ca-ad49-195073019f6d', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('4f3f1592-db53-462d-8d05-64f45871efdc', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('cb4aa343-bd40-47de-b41b-04bd924fa9af', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('a2d844c1-613e-4b3f-9a50-80e20250875a', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('f424c16c-a870-4119-89fe-48865622de66', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;
INSERT INTO public.user_location (user_id, coarse_point, permission_state) VALUES ('b5382e3d-fc9b-48e0-aa69-73c1b86d1c0d', ST_Point(77.5946, 12.9716), 'granted') ON CONFLICT DO NOTHING;

INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('bff105f7-1aed-46d7-b7d7-d8050fa3114d', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='bff105f7-1aed-46d7-b7d7-d8050fa3114d';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('ce441dc0-71d8-46cf-b11f-bf70a28f4ed0', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='ce441dc0-71d8-46cf-b11f-bf70a28f4ed0';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('7077a22c-ae90-41e4-a23d-1c8a27e1bb67', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='7077a22c-ae90-41e4-a23d-1c8a27e1bb67';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('1416fae6-af31-4734-80f9-a2577bc6cb8b', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='1416fae6-af31-4734-80f9-a2577bc6cb8b';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('360ca797-71d5-4e4a-9db8-03faf12521a5', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='360ca797-71d5-4e4a-9db8-03faf12521a5';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('0e9ed179-964c-4631-9e5f-cc564a81a454', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='0e9ed179-964c-4631-9e5f-cc564a81a454';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('f3f26ff1-0c48-41b4-98e5-21d25a0a6dab', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='f3f26ff1-0c48-41b4-98e5-21d25a0a6dab';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('9d3dc8cd-e086-40da-b9e9-8ef445ba1a51', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='9d3dc8cd-e086-40da-b9e9-8ef445ba1a51';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('8726d1f0-183f-4694-8720-89c0af2dd935', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='8726d1f0-183f-4694-8720-89c0af2dd935';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('4a05ed64-d529-4db5-bc34-f5191a4fd1a2', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='4a05ed64-d529-4db5-bc34-f5191a4fd1a2';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('ae6b1dd2-89bd-400b-8ea3-19dfd59b7029', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='ae6b1dd2-89bd-400b-8ea3-19dfd59b7029';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('e6afa9e3-2d13-48bc-8206-5ec226fdbc52', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='e6afa9e3-2d13-48bc-8206-5ec226fdbc52';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('6b46f83e-ce54-463d-9694-b1b47821bdcb', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='6b46f83e-ce54-463d-9694-b1b47821bdcb';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('e9ce323a-241d-4c66-8962-81284e290dbf', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='e9ce323a-241d-4c66-8962-81284e290dbf';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('11c02fcf-5f3c-48ca-ad49-195073019f6d', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='11c02fcf-5f3c-48ca-ad49-195073019f6d';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('4f3f1592-db53-462d-8d05-64f45871efdc', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='4f3f1592-db53-462d-8d05-64f45871efdc';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('cb4aa343-bd40-47de-b41b-04bd924fa9af', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='cb4aa343-bd40-47de-b41b-04bd924fa9af';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('a2d844c1-613e-4b3f-9a50-80e20250875a', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='a2d844c1-613e-4b3f-9a50-80e20250875a';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('f424c16c-a870-4119-89fe-48865622de66', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='f424c16c-a870-4119-89fe-48865622de66';
INSERT INTO public.discovery_settings (user_id, mode, radius_km, min_age, max_age) VALUES ('b5382e3d-fc9b-48e0-aa69-73c1b86d1c0d', 'both', 25, 18, 30) ON CONFLICT DO NOTHING;
UPDATE public.discovery_settings SET show_genders = ARRAY(SELECT id FROM public.lookup_values WHERE list_key='gender' AND code='man') WHERE user_id='b5382e3d-fc9b-48e0-aa69-73c1b86d1c0d';

INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('bff105f7-1aed-46d7-b7d7-d8050fa3114d', (SELECT id FROM colleges LIMIT 1 OFFSET 1), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('ce441dc0-71d8-46cf-b11f-bf70a28f4ed0', (SELECT id FROM colleges LIMIT 1 OFFSET 2), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('7077a22c-ae90-41e4-a23d-1c8a27e1bb67', (SELECT id FROM colleges LIMIT 1 OFFSET 3), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('1416fae6-af31-4734-80f9-a2577bc6cb8b', (SELECT id FROM colleges LIMIT 1 OFFSET 4), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('360ca797-71d5-4e4a-9db8-03faf12521a5', (SELECT id FROM colleges LIMIT 1 OFFSET 5), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('0e9ed179-964c-4631-9e5f-cc564a81a454', (SELECT id FROM colleges LIMIT 1 OFFSET 6), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('f3f26ff1-0c48-41b4-98e5-21d25a0a6dab', (SELECT id FROM colleges LIMIT 1 OFFSET 7), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('9d3dc8cd-e086-40da-b9e9-8ef445ba1a51', (SELECT id FROM colleges LIMIT 1 OFFSET 8), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('8726d1f0-183f-4694-8720-89c0af2dd935', (SELECT id FROM colleges LIMIT 1 OFFSET 9), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('4a05ed64-d529-4db5-bc34-f5191a4fd1a2', (SELECT id FROM colleges LIMIT 1 OFFSET 0), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('ae6b1dd2-89bd-400b-8ea3-19dfd59b7029', (SELECT id FROM colleges LIMIT 1 OFFSET 1), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('e6afa9e3-2d13-48bc-8206-5ec226fdbc52', (SELECT id FROM colleges LIMIT 1 OFFSET 2), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('6b46f83e-ce54-463d-9694-b1b47821bdcb', (SELECT id FROM colleges LIMIT 1 OFFSET 3), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('e9ce323a-241d-4c66-8962-81284e290dbf', (SELECT id FROM colleges LIMIT 1 OFFSET 4), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('11c02fcf-5f3c-48ca-ad49-195073019f6d', (SELECT id FROM colleges LIMIT 1 OFFSET 5), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('4f3f1592-db53-462d-8d05-64f45871efdc', (SELECT id FROM colleges LIMIT 1 OFFSET 6), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('cb4aa343-bd40-47de-b41b-04bd924fa9af', (SELECT id FROM colleges LIMIT 1 OFFSET 7), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('a2d844c1-613e-4b3f-9a50-80e20250875a', (SELECT id FROM colleges LIMIT 1 OFFSET 8), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('f424c16c-a870-4119-89fe-48865622de66', (SELECT id FROM colleges LIMIT 1 OFFSET 9), 2024, true, 'approved') ON CONFLICT DO NOTHING;
INSERT INTO public.user_colleges (user_id, college_id, grad_year, verified, verification_status) VALUES ('b5382e3d-fc9b-48e0-aa69-73c1b86d1c0d', (SELECT id FROM colleges LIMIT 1 OFFSET 0), 2024, true, 'approved') ON CONFLICT DO NOTHING;
