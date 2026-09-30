---
phase: 5
title: Matches & Chat
status: planned
---

# Phase 5: Matches & Chat

## Goal
Implement the Matches tab (`matches.tsx`) to pull actual matches and conversations from the Supabase backend. Create a real-time `chat/[id].tsx` screen for live messaging between users, fully replacing mock data with Supabase Realtime subscriptions.

## Requirements
- **Match Feed:** Pull mutual matches where the user is either `user1_id` or `user2_id`.
- **Chat Feed:** Show active conversations with the most recent message.
- **Chat UI:** A dedicated chat screen (`chat/[id].tsx`) displaying messages in real-time.
- **Real-time:** Use Supabase Realtime subscriptions to listen for new matches in `matches.tsx` and new messages in `chat/[id].tsx`.
- **Photo Fetching:** Ensure profile photos of the match are fetched correctly.

## Implementation Steps

### 1. 🪚 Build `chat/[id].tsx` (Chat Interface)
- Create `app/src/app/chat/[id].tsx`.
- Build a chat UI (GiftedChat or custom message bubbles) with a message input bar.
- Use `supabase.from('messages').select(...)` to load the chat history for the match `id`.
- Implement `sendMessage` function that `insert`s a message row into the `messages` table.
- Set up a Realtime subscription on `messages` to append new messages when `payload.new.match_id === id`.

### 2. 🪚 Wire `matches.tsx` to Backend
- Remove `MOCK_NEW_MATCHES` and `MOCK_CONVERSATIONS`.
- Fetch `matches` using `supabase.rpc('get_matches')` or raw select, depending on what views exist for matches (or fetch `matches` where `user1_id = session.user.id` or `user2_id = session.user.id`).
- Set up Realtime subscriptions on the `matches` and `messages` tables to auto-refresh the feed when a new match is created or a new message is received.

### 3. 🧪 Verification
- Create two test accounts, swipe right on each other to form a match.
- Verify the match appears in `matches.tsx`.
- Click the match, verify routing to `chat/[id].tsx`.
- Send messages back and forth (using two simulators or browsers), verifying real-time delivery without needing to refresh.
