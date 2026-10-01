-- Production Hardening & Fixes Migration
-- 1. Add avatar_url to profile_details
ALTER TABLE public.profile_details ADD COLUMN IF NOT EXISTS avatar_url text;

-- 2. Ensure profile_details exists for all users
INSERT INTO public.profile_details (user_id)
SELECT id FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

-- Trigger to create profile_details automatically on new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user_profile_details()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
BEGIN
  INSERT INTO public.profile_details (user_id) VALUES (new.id) ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END $$;

DROP TRIGGER IF EXISTS trg_new_user_profile_details ON auth.users;
CREATE TRIGGER trg_new_user_profile_details
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile_details();

-- 3. Check is admin RPC (callable by client)
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, extensions AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid());
$$;
GRANT EXECUTE ON FUNCTION public.check_is_admin() TO authenticated;

-- Ensure super_admin role for admin email if exists
INSERT INTO public.admins (id, role)
SELECT id, 'super_admin' FROM auth.users WHERE email = 'theayushchakraborty@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- 4. Verify Blue Tick RPC
CREATE OR REPLACE FUNCTION public.verify_user_blue_tick()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
BEGIN
  IF auth.uid() IS NULL THEN 
    RAISE EXCEPTION 'not authenticated' USING errcode = '28000'; 
  END IF;

  UPDATE public.profiles 
  SET is_blue_tick = true, blue_tick_at = now() 
  WHERE id = auth.uid();

  UPDATE public.profile_details 
  SET is_verified = true, updated_at = now() 
  WHERE user_id = auth.uid();
END $$;
GRANT EXECUTE ON FUNCTION public.verify_user_blue_tick() TO authenticated;

-- 5. Robust Student / College Verification Submission RPC
CREATE OR REPLACE FUNCTION public.submit_student_verification(
  p_college_id int,
  p_grad_year int DEFAULT 2026,
  p_media_id uuid DEFAULT null,
  p_proof_email text DEFAULT null
)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE
  uid uuid := auth.uid();
  v_user_college_id uuid;
  v_verification_id uuid;
  v_college_name text;
BEGIN
  IF uid IS NULL THEN 
    RAISE EXCEPTION 'not authenticated' USING errcode = '28000'; 
  END IF;

  -- Verify college exists
  SELECT name INTO v_college_name FROM public.colleges WHERE id = p_college_id;
  IF v_college_name IS NULL THEN
    RAISE EXCEPTION 'college not found';
  END IF;

  -- Upsert user consent
  INSERT INTO public.consents (user_id, type, granted)
  VALUES (uid, 'college_id_proof', true);

  -- Upsert user_colleges row
  SELECT id INTO v_user_college_id FROM public.user_colleges
  WHERE user_id = uid AND college_id = p_college_id;

  IF v_user_college_id IS NULL THEN
    INSERT INTO public.user_colleges (user_id, college_id, grad_year, is_current, show_on_profile, verification_status, verified)
    VALUES (uid, p_college_id, coalesce(p_grad_year, 2026), true, true, 'pending', false)
    RETURNING id INTO v_user_college_id;
  ELSE
    UPDATE public.user_colleges
    SET grad_year = coalesce(p_grad_year, grad_year),
        is_current = true,
        show_on_profile = true,
        verification_status = 'pending'
    WHERE id = v_user_college_id;
  END IF;

  -- Update profiles and profile_details with university name
  UPDATE public.profiles SET school = v_college_name WHERE id = uid;
  UPDATE public.profile_details SET university_college = v_college_name WHERE user_id = uid;

  -- Insert verification row
  INSERT INTO public.verifications (user_id, type, status, provider, media_id, user_college_id, proof_email)
  VALUES (uid, 'college_id', 'pending', 'manual', p_media_id, v_user_college_id, lower(p_proof_email))
  RETURNING id INTO v_verification_id;

  RETURN v_verification_id;
END $$;
GRANT EXECUTE ON FUNCTION public.submit_student_verification(int, int, uuid, text) TO authenticated;

-- 6. Improve admin_pending_college_verifications with LEFT JOIN on cities so no records are lost
CREATE OR REPLACE FUNCTION public.admin_pending_college_verifications(p_limit int DEFAULT 50)
RETURNS TABLE (
  verification_id uuid, 
  user_id uuid, 
  first_name text, 
  college_name text,
  city_name text, 
  proof_email text, 
  media_id uuid, 
  s3_key text,
  submitted_at timestamptz
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
BEGIN
  IF NOT public.is_admin() THEN 
    RAISE EXCEPTION 'forbidden' USING errcode = '42501'; 
  END IF;

  RETURN QUERY
    SELECT v.id, v.user_id, p.first_name, c.name, COALESCE(ci.name, 'Unknown City'), v.proof_email,
           v.media_id, m.s3_key, v.created_at
    FROM public.verifications v
    JOIN public.user_colleges uc ON uc.id = v.user_college_id
    JOIN public.colleges c ON c.id = uc.college_id
    LEFT JOIN public.cities ci ON ci.id = c.city_id
    JOIN public.profiles p ON p.id = v.user_id
    LEFT JOIN public.media m ON m.id = v.media_id
    WHERE v.type = 'college_id' AND v.status = 'pending'
    ORDER BY v.created_at DESC
    LIMIT LEAST(GREATEST(p_limit, 1), 200);
END $$;
GRANT EXECUTE ON FUNCTION public.admin_pending_college_verifications(int) TO authenticated;
