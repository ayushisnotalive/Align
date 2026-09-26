-- Hardening RLS for new tables

-- 1. Blocks Table
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own blocks" ON public.blocks;
CREATE POLICY "Users can insert their own blocks" ON public.blocks
FOR INSERT WITH CHECK (auth.uid() = blocker_id);

DROP POLICY IF EXISTS "Users can view their own blocks" ON public.blocks;
CREATE POLICY "Users can view their own blocks" ON public.blocks
FOR SELECT USING (auth.uid() = blocker_id);

DROP POLICY IF EXISTS "Users can delete their own blocks" ON public.blocks;
CREATE POLICY "Users can delete their own blocks" ON public.blocks
FOR DELETE USING (auth.uid() = blocker_id);

-- 2. Reports Table
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own reports" ON public.reports;
CREATE POLICY "Users can insert their own reports" ON public.reports
FOR INSERT WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
CREATE POLICY "Users can view their own reports" ON public.reports
FOR SELECT USING (auth.uid() = reporter_id);

-- Admins can view all reports
DROP POLICY IF EXISTS "Admins can view all reports" ON public.reports;
CREATE POLICY "Admins can view all reports" ON public.reports
FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete reports" ON public.reports;
CREATE POLICY "Admins can delete reports" ON public.reports
FOR DELETE USING (public.is_admin());

-- 3. Discovery Settings
ALTER TABLE public.discovery_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own discovery settings" ON public.discovery_settings;
CREATE POLICY "Users can manage their own discovery settings" ON public.discovery_settings
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Profile Details
ALTER TABLE public.profile_details ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all profile details" ON public.profile_details;
CREATE POLICY "Users can view all profile details" ON public.profile_details
FOR SELECT USING (true); -- Publicly viewable by default

DROP POLICY IF EXISTS "Users can update their own profile details" ON public.profile_details;
CREATE POLICY "Users can update their own profile details" ON public.profile_details
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile details" ON public.profile_details;
CREATE POLICY "Users can insert their own profile details" ON public.profile_details
FOR INSERT WITH CHECK (auth.uid() = user_id);
