---
phase: 10
title: Safety & Admin
status: planned
---

# Phase 10: Safety & Admin

## Goal
Implement reporting and blocking flows for user safety, provide a basic administrative moderation toolset, and implement a UI for requesting the verified "Blue Tick".

## Requirements
### 1. Blocking 🚫
- Add a "Block" button on user profiles.
- When blocked, insert a record into the `blocks` table (which already exists).
- Ensure UI actively filters out blocked users (though RPC `get_feed` already handles this, we should add optimistic UI updates).
- Hide active chats from blocked users.

### 2. Reporting 🚩
- Add a "Report" button on profiles and inside chats.
- Opens a modal to select a reason (Inappropriate photos, harassment, spam, etc.).
- Submitting inserts a record into the `reports` table.

### 3. Verification (Blue Tick) ✅
- Add a "Get Verified" button in the Profile tab.
- Simulates an AI selfie check by asking the user to mimic a pose (we will mock the actual AI validation for now).
- Upon success, update `profile_details.is_verified` and `profiles.is_blue_tick` to true.

### 4. Admin Dashboard 🛠️
- Create an Admin tab or hidden screen accessible only if `is_admin()` is true.
- Show a list of pending reports.
- Allow admins to Ban a user (updating `profiles.status` to 'banned').

## Implementation Steps

### 1. 🪚 Profile Safety Actions
- Update `app/src/app/chat/[id].tsx` header to include a 3-dots menu for "Report" and "Block".
- Update the public profile view (or wherever users view others' profiles) to include "Report" and "Block".
- Add Supabase calls to insert into `blocks` and `reports`.

### 2. 🪚 Blue Tick Verification UI
- Create `/verification.tsx`.
- Add a button in `profile.tsx` that routes here if they don't have a blue tick.
- Add a fun UI: "Take a selfie holding up ✌️". 
- Add a "Submit" button that mocks success and triggers a Supabase update to grant the blue tick.

### 3. 🪚 Admin Moderation Screen
- Create `/admin/index.tsx`.
- Create a basic flatlist fetching from `reports` joined with `profiles`.
- Add a "Ban User" button next to each report which updates `profiles.status = 'banned'`.
- Ensure it's gated on the frontend by an admin check (e.g., specific test email or a query to check an admin flag).
