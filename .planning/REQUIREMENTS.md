# Requirements

## Phase 1: Database & Security
- **1.1:** Supabase configured, pg_cron enabled, email auth enabled.
- **1.2:** Database schema pushed, RLS on every table.
- **1.3:** Seed data for geo and colleges.
- **1.4:** Server RPC functions: set_location, match_users, send_message_request, get_feed, get_profile, block_user, unmatch, pause_account, request_deletion, signup ban check hook.
- **1.5:** RLS testing validates constraints.

## Phase 2: Auth and Location Gate
- **2.1:** Login UI (Email + Phone) & Supabase Auth (Email OTP).
- **2.2:** Session persists via encrypted storage (Expo SecureStore).
- **2.3:** Splash routing (login -> consents -> location gate -> onboarding -> home).
- **2.4:** Location permission screen + Location updater (expo-location background task, calls set_location).
- **2.5:** Consent screens (terms, privacy, location) write to DB.

## Phase 3: Profile & Verification
- **3.1:** Onboarding steps.
- **3.2:** Profile edit & College picker.
- **3.3:** Photo gallery (S3 edge functions).
- **3.4:** College verification screen (Upload ID, submit).

## Phase 4: Discover & College
- **4.1:** Discovery settings.
- **4.2:** Discover feed (swipe cards).
- **4.3:** College feed (only verified users).

## Phase 5: Matches & Chat
- **5.1:** Matches list & Match screen.
- **5.2:** Realtime chat (Supabase).
- **5.3:** Message requests UI.

## Phase 6: Explore (Live)
- **6.1:** Live space (go_live, heartbeat, get_live_feed).
- **6.2:** Explore UI with map/hometown filter.

## Phase 7: Safety & Admin
- **7.1:** Block/Report.
- **7.2:** Admin view (verification queue, photo review).
- **7.3:** Blue tick UI + Rekognition liveness.

## Phase 8: Hardening
- **8.1:** Security checklist tests.
- **8.2:** Cron jobs (purge S3, retention).

## Phase 9: Release
- **9.1:** App Store & Play Console setup, Release builds (EAS Build).
- **9.2:** Prod Supabase environment.
