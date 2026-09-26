-- 1. Enable pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Purge stale locations
-- user_location table holds coarse_point. We can delete anything older than 3 days.
SELECT cron.schedule(
  'purge-stale-locations',
  '0 2 * * *', -- Every day at 2:00 AM
  $$
    DELETE FROM public.user_location 
    WHERE updated_at < now() - interval '3 days';
  $$
);

-- 3. Purge old live sessions
-- live_sessions_log tracks past sessions, keeping them forever is costly.
SELECT cron.schedule(
  'purge-live-sessions',
  '0 3 * * *', -- Every day at 3:00 AM
  $$
    DELETE FROM public.live_sessions_log 
    WHERE started_at < now() - interval '7 days';
  $$
);

-- 4. Purge stale OTP challenges
-- OTPs are short-lived. Delete anything older than 1 hour.
SELECT cron.schedule(
  'purge-otp-challenges',
  '0 * * * *', -- Every hour
  $$
    DELETE FROM public.otp_challenges 
    WHERE created_at < now() - interval '1 hour';
  $$
);
