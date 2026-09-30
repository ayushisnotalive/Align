# Phase 3: Profile & Verification

## Overview
Finalize the user onboarding flow, ensure profile editing is functional, implement photo uploads via S3 Edge Functions, and create the College Verification flow (Upload ID).

## Requirements Addressed
- **3.1:** Onboarding steps (ensuring `step1` to `step5` successfully write to DB and mark `profile_complete`).
- **3.2:** Profile edit & College picker.
- **3.3:** Photo gallery (S3 edge functions).
- **3.4:** College verification screen (Upload ID, submit).

## Context & Current State
- The `(onboarding)` screens already exist in the UI (`step1-profile.tsx` through `step5-attributes.tsx`).
- `edit-profile.tsx` exists.
- The `location-gate.tsx` RPC bug was just patched, so users can reach onboarding.

## Tasks

### Task 3.1: Finalize Onboarding Flow
- **Description:** Ensure `step1` through `step5` correctly update the `profiles`, `user_attributes`, and `user_colleges` tables. At the end of `step5`, the `profile_complete` flag should be set to `true`, routing the user to `/(tabs)/discover`.
- **Implementation:**
  - Audit `step1-profile.tsx` to ensure `first_name`, `dob`, `gender_id` etc., are being saved.
  - Audit `step4-places.tsx` and `step5-attributes.tsx` to ensure `user_attributes` are correctly upserted.
  - Ensure the final submit in onboarding updates `profiles.profile_complete = true`.

### Task 3.2: Profile Edit & College Picker
- **Description:** Verify and complete the `edit-profile.tsx` functionality. Users must be able to update their bio, attributes, and college.
- **Implementation:**
  - Verify that `edit-profile.tsx` fetches the current user's profile and attributes.
  - Ensure updating fields correctly maps back to the Supabase tables.

### Task 3.3: Photo Gallery & S3 Uploads
- **Description:** Wire up `step2-photos.tsx` to upload images using Supabase Storage (or S3 edge functions).
- **Implementation:**
  - Ensure `expo-image-picker` is correctly configured for selecting images.
  - Upload selected images to the Supabase `media` bucket (or directly via S3 Edge Function if configured).
  - Insert records into the `media` and `photos` tables.
  - Handle image deletion and reordering (if applicable).

### Task 3.4: College Verification Screen
- **Description:** Build the college verification flow where users upload a photo of their Student ID.
- **Implementation:**
  - Create `app/src/app/(onboarding)/college-verify.tsx` (or similar screen).
  - Use `expo-image-picker` to take/select a photo of the ID.
  - Upload to a secure bucket (or standard media with `moderation_status = pending`).
  - Create a record in `verifications` table with `type = 'manual'` (or similar depending on DB schema for college verification).
  - Note: In PRD, college ID photos are deleted after review. Ensure it flags appropriately.

## Must Haves
- Users cannot reach `/(tabs)` without completing all mandatory onboarding steps.
- Uploaded photos must successfully display in the app via public URLs or signed URLs.
- College verification submission must insert a row into the database so admins can review it.

## Verification
- Run through the entire onboarding flow from a fresh account.
- Successfully upload at least 1 profile photo.
- Submit a college verification ID.
- Verify that `profile_complete` becomes `true` and the app routes to the Home/Discover tab.
