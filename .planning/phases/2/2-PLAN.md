# Phase 2: Auth and Location Gate

## Overview
Implement the core authentication flow (Email OTP + Phone collection), secure session storage, mandatory location permissions, and the initial splash routing sequence.

## Requirements Addressed
- **2.1:** Login UI (Email + Phone) & Supabase Auth (Email OTP).
- **2.2:** Session persists via encrypted storage (Expo SecureStore).
- **2.3:** Splash routing (login -> consents -> location gate -> onboarding -> home).
- **2.4:** Location permission screen + Location updater (expo-location background task, calls set_location).
- **2.5:** Consent screens (terms, privacy, location) write to DB.

## Tasks

### Task 2.1: Session Management & Splash Routing
- **Description:** Implement persistent storage for Supabase sessions using `expo-secure-store`. Update the splash/entry screen to conditionally route users based on session state and onboarding completion.
- **Implementation:**
  - Create `app/src/utils/supabase.ts` (if not exists) and configure `@supabase/supabase-js` with `expo-secure-store` custom storage adapter.
  - Implement a routing guard in `app/index.tsx` or an `_layout.tsx` that checks session status.
  - State machine logic: 
    - No Session -> `/login`
    - Session + Missing Consents -> `/consents`
    - Session + No Location -> `/location-gate`
    - Session + Needs Onboarding -> `/(onboarding)`
    - Complete -> `/(tabs)`

### Task 2.2: Login UI & OTP Auth
- **Description:** Build the Login screen collecting both Email and Phone, then sending an OTP to the Email. Verify the OTP and establish a session.
- **Implementation:**
  - Create `/login` screen (using `app/src/theme/colors.ts` and `Typography` components).
  - Form: Email input, Phone input, Send OTP button.
  - Handle Supabase `auth.signInWithOtp({ email })`.
  - Create `/verify` screen (or inline state): Enter 6-digit OTP.
  - Handle Supabase `auth.verifyOtp({ email, token, type: 'magiclink' })` (or 'email').
  - Note: Phone number is collected but not verified via SMS yet (per PRD).

### Task 2.3: Consents Screen
- **Description:** Build a screen to capture mandatory user consents (Terms, Privacy Policy) and write the state to the user's database record.
- **Implementation:**
  - Create `/consents` screen.
  - Display checkboxes or toggle switches for Terms of Service and Privacy Policy.
  - On Submit, update the `profiles` (or `users`) table with `consented_at = now()`.

### Task 2.4: Location Gate & Background Updater
- **Description:** Mandatory location permission screen. App must not proceed without it. Implement a background task to update location.
- **Implementation:**
  - Create `/location-gate` screen.
  - Use `expo-location` to request foreground/background location permissions.
  - If denied, show blocking UI ("Location is required to use Align").
  - If granted, fetch current location and call Supabase RPC `set_location`.
  - Register a background location task using `TaskManager.defineTask` to periodically push location updates to Supabase (if needed, or just refresh on app open).

## Must Haves
- User cannot bypass the login screen without a valid session.
- User cannot bypass the location gate without granting location permissions.
- Phone number must be stored alongside the user profile upon registration.
- Sensitive environment variables (Supabase URL, Anon Key) must be loaded securely.

## Verification
- Test clean install: should show login.
- Test OTP flow: valid email should receive OTP and successfully log in.
- Test closing the app and reopening: should persist session and jump to location gate (or home if already configured).
- Test location denial: should block progression.
