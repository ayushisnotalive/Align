---
phase: 9
title: Premium Expansion
status: planned
---

# Phase 9: Premium Expansion

## Goal
Implement additional premium features from the `MISSING_FEATURES.md` list, specifically the "Who Likes You" grid and Advanced Filters. (Voice notes require significant audio recording libraries, so we will focus on the UI/UX for the "Who Likes You" grid and Filters first).

## Requirements
### 1. Who Likes You Grid 💖
- A new screen (tab or accessible from Matches/Profile) that shows a grid of users who have swiped right on the current user, where `is_mutual` is false.
- For free users, the grid should be blurred out with a "Subscribe to Premium" overlay.
- For premium users, the grid shows clear profiles and allows tapping to instantly match.

### 2. Advanced Filters 🎯
- Enhance the `discovery_settings` table to include advanced filters like `min_height`, `max_height`, `education_levels`, etc.
- Update `get_feed` RPC to respect these advanced filters if the user is premium.
- Update the UI in `/discovery-settings` (or a dedicated filter screen) to allow premium users to set these filters.

## Implementation Steps

### 1. 🪚 Schema Updates
- Ensure `discovery_settings` has fields for `advanced_filters` (JSONB) or specific columns.
- Ensure we can efficiently query inbound likes. (Create a new RPC `get_who_likes_me`).

### 2. 🪚 Backend RPCs
- Create `get_who_likes_me` RPC returning profiles that have `swiped_right` on the user, excluding mutual matches.
- Update `get_feed` RPC to parse and apply `advanced_filters` (e.g., checking `profile_details.height` or `profile_details.education_level`).

### 3. 🪚 Who Likes You Screen
- Create a new tab or screen (`/who-likes-me.tsx`).
- Render a 2-column grid of profiles.
- If `user_credits.is_premium` is false, apply a heavy blur (`expo-blur`) and show a paywall lock.
- If true, allow tapping a profile to view it or instantly match.

### 4. 🪚 Advanced Filters UI
- Add advanced filter toggles/sliders to `/discovery-settings`.
- Lock them behind a premium check, alerting the user to upgrade if they try to use them.
