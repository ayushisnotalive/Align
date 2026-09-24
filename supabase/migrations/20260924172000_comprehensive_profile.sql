CREATE TABLE public.profile_details (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Basic Info / Demographics
  legal_first_name text,
  display_nickname text,
  dob date,
  age integer,
  biological_sex text,
  gender_identity text,
  sexual_orientation text,
  pronouns text,
  
  -- Location (non-GPS)
  home_city text,
  neighborhood text,
  work_location text,
  
  -- Physical Traits
  height_cm integer,
  body_type text,
  
  -- Education & Work
  educational_attainment text,
  university_college text,
  graduation_year integer,
  current_occupation text,
  employer_company text,
  industry text,
  
  -- Lifestyle & Habits
  languages_spoken text[],
  religious_beliefs text,
  political_views text,
  ethnicity text,
  family_plans text,
  pet_ownership text[],
  drinking_frequency text,
  smoking_habits text,
  weed_consumption text,
  other_drug_use text,
  workout_habits text,
  dietary_lifestyle text,
  sleep_schedule text,
  
  -- Personality & Quirks
  zodiac_sign text,
  mbti_personality text,
  love_language text,
  
  -- Interests
  interests text[],
  
  -- Prompts & Bio
  bio text,
  prompt_answers jsonb DEFAULT '[]'::jsonb,
  
  -- Integrations
  spotify_anthem_id text,
  instagram_username text,
  
  -- Verification & Safety
  is_verified boolean DEFAULT false,
  device_verification_code text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profile_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profile details"
  ON public.profile_details FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile details"
  ON public.profile_details FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile details"
  ON public.profile_details FOR UPDATE
  USING (auth.uid() = user_id);

-- Dating Preferences expansion
ALTER TABLE public.discovery_settings
ADD COLUMN IF NOT EXISTS target_gender_preference text[],
ADD COLUMN IF NOT EXISTS target_age_min integer DEFAULT 18,
ADD COLUMN IF NOT EXISTS target_age_max integer DEFAULT 100,
ADD COLUMN IF NOT EXISTS relationship_goals text[];
