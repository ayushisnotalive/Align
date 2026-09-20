# TODO: work top to bottom. One task per prompt. Commit after each.
Model key: [G] Gemini Pro · [S] Claude Sonnet · [O] Claude Opus · [X] GPT-OSS
Rule of thumb: Sonnet by default. Opus only for RLS, auth, storage, face/ID data, stuck bugs.
New migrations: ALWAYS create with `npx supabase migration new <name>` so the timestamp is correct.
Never edit a migration after it has been pushed. Add a new one instead.

## PHASE -1 · Day 0 · Accounts and setup (start the slow items first)
- [ ] Register SMS provider + DLT sender ID/templates (slow, start now)
- [ ] Create Google Play Console account; read current testing requirements
- [ ] Create Supabase project `align-dev` (Mumbai region), save DB password in a password manager
- [ ] Copy Project URL, anon/publishable key, and project ref from the dashboard
- [ ] Enable pg_cron (Dashboard > Database > Extensions)
- [ ] Enable Phone auth + add test phone numbers with fixed OTPs (Authentication > Sign In / Providers > Phone)
- [ ] Fill `.env` (root) and `local.properties` (Android) with dev values. Confirm `git status` does NOT list them
- [ ] Rename migration files from 20260921... to 20260920... (only before the first push)
- [ ] Verify no secrets in Git: `git ls-files | grep -i env` shows only `.env.example`
- [ ] (Later, not today) AWS: 1 private bucket with prefixes media/, face/, college-id/ + IAM user + CloudFront
- [ ] (Later, not today) Firebase project + Android app for FCM
- [ ] (Later, Phase 9) Create `align-prod` Supabase project

## PHASE 0 · Day 1 · Foundation
- [ ] [G] Confirm the agent reads .cursorrules (send the first prompt at the bottom)
- [ ] [G] Android project skeleton: packages data/domain/ui/di, Hilt, Navigation
- [ ] [G] Build flavors dev/prod reading local.properties into BuildConfig
- [ ] [G] network_security_config (no cleartext), auto-backup excluded for session data
- [ ] [G] 5 bottom tabs (Discover, College, Explore, Matches, Chats) + avatar -> Profile
- [ ] [G] Theme with 60-30-10 in ui/theme, light + dark, preview screen
Done when: app runs on a real phone, tabs work, both themes look right, no secrets in Git.

## PHASE 1 · Days 2-3 · Database and security

### 1A. Push the schema (10 migration files)
- [ ] `npx supabase login`, then `npx supabase link --project-ref <DEV_REF>`
- [ ] `npx supabase db push --dry-run`, read the list, then `npx supabase db push`
- [ ] [S] If a file fails: paste the error + file to Sonnet. Edit the file only if it did not apply
- [ ] Verify in SQL Editor: tables exist, RLS is on for every table (queries in the setup guide)
- [ ] Create an email test user in Authentication > Users; confirm rows appear in
      profiles, profile_private, discovery_settings, user_location (signup trigger works)
- [ ] Verify migration 10 columns exist (`user_colleges.verified`, `verification_status`)
- [ ] Commit `supabase/` including config.toml

### 1B. Seed and tests
- [ ] [X] Seed migration (`npx supabase migration new seed_geo`): all Indian states,
      100 cities (with lat/lng), 200 colleges with is_approved = true
- [ ] [S] Write supabase/tests/rls_test.sql: user A cannot read user B's private data
- [ ] [S] Add college tests to rls_test.sql:
      - client cannot set user_colleges.verified or verification_status
      - client cannot insert/update verifications
      - non-admin calling admin_review_college_verification fails
      - submit_college_verification fails without consent / without own college_id upload
- [ ] [O] Review RLS + grants + both college admin functions. List any table unsure, any scrape path

### 1C. Server functions (one migration each, in this order)
- [ ] [S] Migration 11: set_location() (server rounds to ~1 km, resolves city, sets permission state)
- [ ] [S] Migration 12: swipe() (daily limit, blocks, profile_complete, fresh location, mutual -> match)
- [ ] [S] Migration 13: send_message_request() (2/day, 150 chars, blocks)
- [ ] [S] Migration 14: get_feed(mode, scope, filters) + get_profile()
      - College scope queries MUST filter user_colleges.verified = true
- [ ] [S] Migration 15: block_user(), unmatch(), pause_account(), request_deletion()
- [ ] [S] Migration 16: signup ban check (before-user-created hook function; enable in Auth > Hooks)
- [ ] [O] Review migrations 11-16 (auth.uid() only, search_path set, no injection, no scrape path)
Done when: rls_test.sql passes; minors rejected; client cannot insert swipes/matches;
client cannot mark a college verified.

## PHASE 2 · Days 4-5 · Auth and location gate
- [ ] [S] Phone OTP UI + AuthRepository (Supabase Auth), resend timer, errors
- [ ] [S] Session persists until uninstall (encrypted storage, excluded from backup)
- [ ] [S] Splash routing: login -> consents -> location gate -> onboarding -> home
- [ ] [S] Blocking location permission screen + settings deep link
- [ ] [S] Location updater: on open + every 15 min, calls set_location()
- [ ] [G] Consent screens (terms, privacy, location) writing to consents
Done when: kill + reopen stays logged in; denying location blocks all tabs.

## PHASE 3 · Days 5-7 · Profile, media and college verification
- [ ] [G] Required onboarding steps (resumable via onboarding_step, N/A options)
- [ ] [S] Edge Function: presigned S3 upload (auth, mime, size, photo count, kind: profile_photo | chat_image | college_id)
      - college_id goes to the private college-id/ prefix, not the public media path
- [ ] [S] Edge Function: post-upload processing (EXIF strip, resize, media row)
- [ ] [O] Review S3 + Edge Function security
- [ ] [G] Photo gallery (3-6, reorder, delete)
- [ ] [G] College picker (state > city > college search + request missing college)
- [ ] [G] "Verify your college" screen:
      - upload college ID photo, optional college email, college_id_proof consent checkbox
      - calls submit_college_verification()
      - status badge: Unverified / Pending / Verified / Rejected (+ reason)
      - hint: cover your ID number before uploading
- [ ] [G] Places picker (max 3, choose primary) + hometown
- [ ] [G] Optional attributes flow driven by attribute_definitions, Skip on each, visibility toggle
- [ ] [G] Profile edit screen (changing college = delete row, add new, starts unverified)
Done when: no Discover access without required fields + 3 approved photos; skipped = no rows;
a college shows on the profile only after admin approval.

## PHASE 4 · Days 7-8 · Discover and College
- [ ] [G] Discovery settings screen (mode, radius, ages, genders, verified only, filters)
- [ ] [S] Discover feed + swipe cards (gestures, like/pass)
- [ ] [S] College tab with scope switch (my college / my city / my state), verified colleges only
- [ ] [G] College tab empty state for unverified users: "Verify your college to join"
- [ ] [G] Empty, loading, error states
- [ ] [X] dev-only seed: 30 fake profiles in supabase/seed.sql (some with verified colleges)
Done when: results match settings on the 30 test profiles; blocked/swiped/unverified-college never appear wrongly.

## PHASE 5 · Days 9-10 · Matches, chat, requests
- [ ] [S] Matches list + match screen
- [ ] [S] Realtime chat (text, image via S3, read receipts)
- [ ] [S] Message requests UI (accept / ignore / report)
- [ ] [G] FCM push (match, message, request, verification result), no message text in payload
Done when: two phones chat live; limits enforced server-side; block hides chat.

## PHASE 6 · Day 11 · Explore (Live space)
- [ ] [S] Migration: go_live(), heartbeat(), stop_live(), get_live_feed()
- [ ] [S] pg_cron job: delete expired/stale live_presence every minute
- [ ] [S] Realtime channel live:city:{id} + 20s polling fallback
- [ ] [O] Review live functions (limits, blocks, one session per user)
- [ ] [G] Explore UI: Go live sheet, goal + type chips, hometown filter, countdown, live feed
Done when: phone B sees phone A within seconds and it vanishes on expiry.

## PHASE 7 · Day 12 · Safety, admin and blue tick
- [ ] [S] Block/report on every profile, live card, chat
- [ ] [S] Minimal admin view (web page or Supabase Studio views), restricted to the admins table:
      - reports queue, photo review, ban user
      - COLLEGE VERIFICATIONS queue using admin_pending_college_verifications()
        and admin_review_college_verification(); ID image via short-lived signed URL
- [ ] [O] Review the admin view (who can open it, signed URL expiry, audit_log entries written)
- [ ] [O] Email OTP + Rekognition liveness/compare Edge Function, selfie purge <= 24h
- [ ] [G] Blue tick UI + face_biometric consent screen (blue tick and college badge must look different)
Done when: banned phone cannot re-register; tick only after BOTH email + face pass;
an admin can approve a college and it appears on the profile.
Fallback: manual admin face review for beta.

## PHASE 8 · Day 13 · Hardening
- [ ] [O] Run the security checklist below, write a test for each item
- [ ] [S] Purge job: delete S3 objects + rows where media.purge_after < now() (college IDs, selfies)
- [ ] [S] Retention jobs (profile_views 90d, auth_events 180d, location_history 90d)
- [ ] [S] Pause + delete account (14-day grace, purge rows + S3 objects)
- [ ] [S] Analytics events + crash reporting (no PII)
- [ ] [S] Load test feed with 10k seeded profiles; add indexes if slow

### Security checklist
- [ ] A cannot read B's phone/email/last name/dob/verification rows
- [ ] A cannot read or write chats they are not in
- [ ] Client cannot insert swipes, matches, live_presence, daily_usage
- [ ] Client cannot set verified / verification_status on user_colleges
- [ ] Non-admin cannot call admin_* functions
- [ ] Unverified college user never appears in the College tab
- [ ] College ID image is deleted after review (media.purge_after honored)
- [ ] Feed rejects missing/stale location
- [ ] DOB under 18 rejected via direct API call
- [ ] Upload wrong mime / oversized / 7th photo rejected
- [ ] 3rd message request in a day rejected
- [ ] Second live session rejected
- [ ] Blocked users never appear in feed, live, or chat
- [ ] No service-role or AWS key in APK/repo (grep the built APK)
- [ ] Presigned URLs expire in minutes; face and college-id prefixes are private
- [ ] Banned phone/device cannot sign up again
- [ ] Deleted account leaves no personal data or S3 objects
- [ ] Supabase dashboard > Advisors (Security) shows no RLS warnings

## PHASE 9 · Day 14 · Release
- [ ] [G] Release build: R8, signing from secrets, prod config, flags off
- [ ] [G] Draft privacy policy + terms + Play Data Safety answers (include ID photos, face data, location). Get reviewed
- [ ] Create align-prod, then `npx supabase link --project-ref <PROD>` and `npx supabase db push`
- [ ] Add first admin to prod (insert your user id into public.admins from the SQL Editor)
- [ ] Play internal testing track, invite first testers
Done when: testers install from Play and finish signup end to end.

## DAILY ROUTINE
1. Ask [G]: "summarize repo state and what is next."
2. Send ONE task. Read the diff. Run on a real phone.
3. Commit and push. Update docs/PROGRESS.md (done, broken, next).
4. Anything touching RLS/auth/storage/face or ID data: [O] review before moving on.

## FIRST PROMPT TO SEND (paste into Antigravity, Gemini Pro)
Read .cursorrules, prd.md and todo.md fully. Do not write code yet.
Reply with: (1) a 5-line summary of the project, (2) the exact list of tasks in
PHASE 0, (3) the 60-30-10 hex codes for light and dark, (4) any conflict or
missing info you see. Wait for my go-ahead.