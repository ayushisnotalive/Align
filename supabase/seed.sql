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
