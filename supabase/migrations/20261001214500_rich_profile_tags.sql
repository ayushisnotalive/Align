-- Add Tinder-style lifestyle, communication, ideal date, and rich tag columns to profile_details
ALTER TABLE public.profile_details 
  ADD COLUMN IF NOT EXISTS communication_style text,
  ADD COLUMN IF NOT EXISTS ideal_date text,
  ADD COLUMN IF NOT EXISTS lifestyle_vibe text,
  ADD COLUMN IF NOT EXISTS personality_tags text[];
