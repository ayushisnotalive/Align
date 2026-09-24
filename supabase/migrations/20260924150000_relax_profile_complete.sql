-- Relax profile completeness for MVP testing
CREATE OR REPLACE FUNCTION public.profile_is_complete(p public.profiles) RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE ok boolean;
BEGIN
  IF p.first_name IS NULL THEN
    RETURN false;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM public.profile_private pp
    WHERE pp.user_id = p.id AND pp.dob IS NOT NULL
  ) INTO ok;
  
  RETURN ok;
END $$;
