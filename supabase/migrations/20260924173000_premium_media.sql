-- 1. Monetization: Swipes & Super Likes
ALTER TABLE public.swipes
ADD COLUMN IF NOT EXISTS super_like boolean DEFAULT false;

-- 2. Monetization: User Credits (Super likes, Boosts, Rewinds balance)
CREATE TABLE public.user_credits (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  super_likes integer DEFAULT 0,
  boosts integer DEFAULT 0,
  rewinds integer DEFAULT 0,
  is_premium boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own credits" ON public.user_credits FOR SELECT USING (auth.uid() = user_id);

-- 3. Monetization: Profile Boosts
CREATE TABLE public.profile_boosts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  ends_at timestamptz NOT NULL
);

ALTER TABLE public.profile_boosts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own boosts" ON public.profile_boosts FOR SELECT USING (auth.uid() = user_id);

-- 4. Rich Chat & Media
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS read_at timestamptz,
ADD COLUMN IF NOT EXISTS type text DEFAULT 'text', -- 'text', 'image', 'audio', 'video'
ADD COLUMN IF NOT EXISTS media_url text,
ADD COLUMN IF NOT EXISTS reaction text;

-- 5. Gamification: Push Notifications
CREATE TABLE public.push_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  device_platform text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own push tokens" ON public.push_tokens FOR ALL USING (auth.uid() = user_id);
