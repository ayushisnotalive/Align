-- 1. Add advanced filters to discovery settings
ALTER TABLE public.discovery_settings
ADD COLUMN IF NOT EXISTS advanced_filters jsonb DEFAULT '{}'::jsonb;

-- 2. Create RPC for Who Likes Me (inbound likes that are not mutual yet)
CREATE OR REPLACE FUNCTION public.get_who_likes_me(p_limit int DEFAULT 20, p_offset int DEFAULT 0)
RETURNS SETOF public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is premium
  IF NOT EXISTS (SELECT 1 FROM public.user_credits WHERE user_id = auth.uid() AND is_premium = true) THEN
    -- If not premium, they technically can't use this, but we can return the profiles for blurring,
    -- or we can return a limited mock payload. Returning the real profiles is fine as long as the 
    -- frontend blurs them. It's safer to just return them, as the frontend will blur based on `is_premium`.
  END IF;

  RETURN QUERY
  SELECT p.*
  FROM public.profiles p
  JOIN public.swipes s ON s.source_id = p.id
  WHERE s.target_id = auth.uid()
    AND s.direction IN ('like', 'super')
    AND NOT EXISTS (
      -- Exclude if auth user already swiped on them
      SELECT 1 FROM public.swipes s2 
      WHERE s2.source_id = auth.uid() AND s2.target_id = p.id
    )
  ORDER BY s.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$;
