# Align — Dating App (Beta)

React Native Expo app on Supabase, with media on AWS S3.

## Docs
- `prd.md` — what we are building and why
- `todo.md` — phase-by-phase task list (work top to bottom)
- `.cursorrules` — rules the AI agent must follow
- `supabase/migrations/` — the database schema (source of truth)

## Prerequisites
- Node 20+ and the Supabase CLI (`npm i -g supabase` or use `npx supabase`)
- Expo CLI (`npm install -g eas-cli`)
- Docker Desktop (only needed for local `supabase start` / `db reset`)
- Accounts: Supabase, AWS, Firebase (FCM), Google Play Console
- An SMS provider for phone OTP (India needs DLT registration; start early)

## First-time setup
1. **Create two Supabase projects:** `app-dev` and `app-prod`.
2. **Enable in each project:** Authentication > Phone provider (use test numbers in dev).
3. **Environment files**
   - `cp .env.example .env` and `cp .env.example supabase/.env`, then fill dev values.
   - For Expo, you may also need a `.env` inside the `app/` directory (e.g. `EXPO_PUBLIC_SUPABASE_URL`).
   - Confirm `.gitignore` is committed BEFORE adding any secret.
4. **Link the CLI to dev and push the schema**
```bash
   supabase login
   supabase init                 # once; creates supabase/config.toml
   supabase link --project-ref <DEV_REF>
   supabase db push              # applies supabase/migrations/*.sql in order
```
   `supabase db push` also fills the `supabase_migrations.schema_migrations`
   tracking table. You never edit that table yourself.
5. **Enable pg_cron** (Dashboard > Database > Extensions) for expiry and retention jobs.
6. **AWS setup**
   - S3: one media bucket (private, served through CloudFront) and one face bucket
     (private, lifecycle rule deletes objects after 1 day).
   - IAM user limited to those buckets and Rekognition. Put keys ONLY in
     `supabase/.env`, then:
```bash
     supabase secrets set --env-file supabase/.env
```
7. **Firebase (optional if using Expo push):** add the app for FCM push if manually managing.
8. **Run the app:** cd into `app/` and run `npm start` (or `npx expo start`).

## How Supabase learns your schema
It only knows what is in migration files. Every schema change = a new file:
```bash
supabase migration new add_something      # creates a timestamped .sql file
# write SQL in it, then:
supabase db push                          # dev
```
Never edit a migration that has already been pushed; add a new one.
Never change tables by hand in the dashboard.

## Migration order
```
20260921000001_extensions_reference.sql
20260921000002_profiles_media.sql
20260921000003_location_discovery.sql
20260921000004_matching_messaging_live.sql
20260921000005_safety_devices.sql
20260921000006_control_money.sql
20260921000007_functions_triggers.sql
20260921000008_rls_grants.sql
20260921000009_seed_reference.sql
```
Later migrations (server functions like swipe, get_feed, go_live) are added
in Phase 1 and Phase 6 of `todo.md`.

## Useful commands
```bash
supabase db push                     # apply new migrations to linked project
supabase db reset                    # local only: rebuild from migrations + seed.sql
supabase functions deploy <name>     # deploy an Edge Function
supabase secrets set --env-file supabase/.env
supabase db lint                     # catch SQL issues
```

## Security in one paragraph
The client app is untrusted. It holds only the Supabase URL and anon key.
All rules (age, limits, location freshness, matching, blocks) are enforced by
RLS, column-level grants, and security-definer functions. Private fields live
in `profile_private`. Face selfies are deleted within 24 hours. Never commit `.env`.

## Troubleshooting
- `permission denied for table X`: expected if the client tries a write we block; use the RPC.
- Empty feed: check the test user has `profile_complete = true` and fresh location.
- OTP not arriving in India: check DLT template/sender ID approval.
- Migration failed halfway: fix the SQL in a NEW file only if it was applied;
  if it never applied, edit it and push again.