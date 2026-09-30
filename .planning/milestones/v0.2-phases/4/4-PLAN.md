# Phase 4: Discover & College

## Overview
Connect the frontend feeds (`discover.tsx` and `college.tsx`) to the Supabase backend RPCs. Implement swipe actions (Like/Pass) and ensure that filtering (Discovery Settings) applies correctly.

## Requirements Addressed
- **4.1:** Discovery settings.
- **4.2:** Discover feed (swipe cards).
- **4.3:** College feed (only verified users).

## Context & Current State
- `discover.tsx` and `college.tsx` UI components are built in the `app/src/app/(tabs)` directory.
- Database RPCs `get_feed`, `swipe`, and `get_college_feed` (or similar) are already created in the migrations.
- State constraint: "Ensure Discover feeds queries (`get_feed`) are working as expected with spatial and composite indexes."

## Tasks

### Task 4.1: Discovery Settings Integration
- **Description:** Allow users to update their Discovery preferences (Distance, Age Range, Gender) and save them to the database.
- **Implementation:**
  - Build or update the Discovery Settings modal/screen (often accessible from Profile).
  - Save preferences to `profiles` (e.g., `discovery_radius`, `discovery_min_age`, `discovery_max_age`, `interested_in`).

### Task 4.2: Discover Feed & Swiping
- **Description:** Wire up the `discover.tsx` feed to fetch profiles from `get_feed` and process swipe actions.
- **Implementation:**
  - Call `supabase.rpc('get_feed')` when `discover.tsx` mounts and when the feed runs low.
  - Implement the `handleSwipe` function to call `supabase.rpc('swipe', { target_id, is_like: true/false })`.
  - Handle the response to check for a `match` and trigger the "It's a Match!" modal if a mutual like occurs.
  - Ensure the feed handles empty states gracefully ("No more profiles in your area").

### Task 4.3: College Feed
- **Description:** Wire up the `college.tsx` feed. This feed is restricted to users who share a college context and are verified.
- **Implementation:**
  - Verify that `college.tsx` calls the appropriate feed RPC (e.g., passing `source: 'college'` to `get_feed` or calling a specific `get_college_feed` RPC).
  - Enforce that unverified users see a block/prompt to "Verify your college ID" instead of the feed.

## Must Haves
- Swipes must be recorded robustly in the backend so users are never shown the same profile twice (unless accounts are reset).
- Feed queries must be performant (utilize the `get_feed` RPC heavily optimized with spatial queries).
- The Match modal must trigger instantly on mutual like.

## Verification
- Open Discover tab -> feed loads -> swipe right -> verify row added to `swipes` table.
- Update Discovery settings (e.g. lower distance) -> verify feed refresh returns closer profiles.
- Try College tab as unverified -> verify blocked.
- Try College tab as verified -> verify feed loads.
