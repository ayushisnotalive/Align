# Phase 15: Error Resilience & Log Cleanliness - Context

## Problem Statement
1. **Redbox Crash in `likes.tsx:42`**:
   `console.error('Error fetching likes:', err)` is triggered when `fetchData` runs on unauthenticated or cold state. `session?.user.id` is accessed before checking if `session?.user` is present, `user_credits` uses `.single()` which throws `PGRST116` if no credit row exists, and `supabase.rpc('get_who_likes_me')` fails if called without valid auth session.
2. **Missing Photos in Likes Feed**:
   `get_who_likes_me` returns `public.profiles` which lacks photos, so inbound admirer photos show fallback avatars even if photos exist.
3. **Pervasive `console.error` and `console.warn`**:
   Over 20 raw `console.error` and `console.warn` statements are littered across screens (`matches.tsx`, `discover.tsx`, `chat/[id].tsx`, `discovery-settings.tsx`, `verification.tsx`, `location-gate.tsx`, `edit-profile.tsx`, `step2-photos.tsx`, `step3-college.tsx`, `use-live-feed.ts`, `analytics.ts`). In React Native Expo, these display intrusive full-screen Redbox and bottom toast Yellowbox overlays on devices and emulators.
4. **TypeScript Bug in `chat/[id].tsx`**:
   `otherUserId` is referenced on lines 288 and 292 without being declared in scope, causing compilation failure (`TS2304: Cannot find name 'otherUserId'`).

## Desired Outcome
- Centralized `logger.ts` utility providing safe logging with configurable development verbosity and zero intrusive RedBoxes for routine operational/network errors.
- Robust data fetching in `likes.tsx` with authentication guards, `.maybeSingle()`, and enriched photo lookups.
- All raw `console.error` and `console.warn` replaced with `logger` calls and graceful UI failure states.
- Clean TypeScript compilation with 0 errors across the entire app.
