---
phase: 14
title: Messaging & Incognito
status: planned
---

# Phase 14: Messaging & Incognito

## Goal
Enhance the messaging experience with chat reactions and media sharing, and implement "Incognito Mode" (a premium feature) that allows users to browse the app invisibly, only being seen by people they explicitly swipe right on.

## Scope

### 1. Incognito Mode
- **Database**: Add `incognito_mode` (boolean) to `discovery_settings`. (We already have `ghost_mode` for the live map, but `incognito_mode` is specifically for the Discover feed).
- **Backend (RPC)**: Update `get_feed()` in a new migration. If a target user has `incognito_mode = true`, they should NOT appear in the feed UNLESS they have an existing `like` swipe on the current user (`auth.uid()`).
- **UI**: Add an Incognito Mode toggle in the Discovery Settings screen (Premium locked).

### 2. Chat Reactions
- **Backend**: The `reaction` column (text) already exists on the `messages` table.
- **UI**: 
  - Update the `onLongPress` in `chat/[id].tsx` to save reactions to Supabase.
  - Create a custom `renderMessage` or `renderBubble` wrapper in GiftedChat to display the emoji reaction (e.g., ❤️, 😂) slightly overlapping the bottom corner of the message bubble.
  - Listen for reaction updates in the realtime channel.

### 3. Media Sharing in Chat
- **Storage**: Real upload flow. Currently `chat/[id].tsx` optimistically assumes `ImagePicker` URI is a public URL.
- **UI**: 
  - Update `pickImage` to upload the image to the `align-media` Supabase bucket (using the existing presigned URL function or direct upload if authenticated).
  - Save the resulting public URL to the `messages` table (`type: 'image'`, `media_url: public_url`).
  - GiftedChat already supports rendering images, but ensure the UI gracefully handles the loading state during upload.

## Implementation Steps
1. Create a migration file (`20260928_phase14_incognito.sql`) for `incognito_mode` and the `get_feed` update.
2. Update `app/src/app/(tabs)/profile/settings.tsx` to include the Incognito Mode toggle.
3. Update `app/src/app/chat/[id].tsx` to correctly handle media uploads to Supabase storage.
4. Update `chat/[id].tsx` to render and update reactions.
