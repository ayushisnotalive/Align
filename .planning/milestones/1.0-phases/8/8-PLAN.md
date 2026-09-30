---
phase: 8
title: Premium, Rich Media & Gamification
status: planned
---

# Phase 8: Premium, Rich Media & Gamification

## Goal
Implement missing top-tier dating app features including Monetization features (Super Likes, Rewind, Boosts), Rich Media Chat (Reactions, Media types), Engagement vectors (Daily Picks), and Push Notifications. 

*(Note: In-App Video & Audio calling are extreme bandwidth features; we will mock the WebRTC connection or provide the UI schema for now. Push notifications require an Expo token setup.)*

## Requirements
### 1. Monetization & Premium 💰
- **"Who Likes You":** Schema and UI to track inbound likes (`swipes` where `direction = 'right'`) masked for free users, unmasked for premium users.
- **Super Likes / Roses:** Add a `super_like` boolean to the `swipes` table. Show distinct UI for Super Liked profiles.
- **Boost / Spotlight:** A `profile_boosts` table tracking start/end times.
- **Rewind / Undo:** Support soft-deleting the last swipe from history.
- **Read Receipts:** Track `read_at` on messages.

### 2. Rich Chat & Media 💬
- **Media Support:** Extend `messages` table with `type` (text, image, audio, video) and `media_url`.
- **Reactions:** Extend `messages` table with `reaction` (string/emoji).

### 3. Engagement & Gamification 🎮
- **Daily Curated Picks ("Standouts"):** Generate a daily recommended list of users (mocked algorithm).
- **Speed Dating:** A schema/flag for "blind date" interactions.
- **Push Notifications:** Add `push_tokens` to profiles. Set up Expo notification hooks.

## Implementation Steps

### 1. 🪚 Database Schema Upgrades
- Create migration `20260924173000_premium_media.sql`.
- Add `super_like` to `swipes`.
- Add `read_at`, `type`, `media_url`, and `reaction` to `messages`.
- Create `push_tokens` table.
- Create `profile_boosts` table.
- Create `user_credits` table (to track remaining super likes/boosts).

### 2. 🪚 Premium Discovery Feed
- Update `discover.tsx` to include a "Super Like" button (star icon).
- Update the backend RPC `get_discover_feed` to fetch "Who Likes You" (if premium) and handle "Boosted" profiles dynamically.
- Add an "Undo" (Rewind) button to the discover feed.

### 3. 🪚 Rich Chat Updates
- Update `chat/[id].tsx` to support rendering Image bubbles (via `react-native-gifted-chat` native support).
- Add double-tap to react to messages.
- Show "Read" status if the message is read and receipts are enabled.

### 4. 🪚 Push Notifications Setup
- Register `expo-notifications` on startup.
- Send token to `push_tokens` backend.
