---
phase: 15
title: Error Resilience & Log Cleanliness
status: planned
---

# Phase 15: Error Resilience & Log Cleanliness

## Goal
Eliminate redbox-inducing `console.error` and yellowbox `console.warn` calls across the React Native app, fix the crash/error in `likes.tsx`, fix the `otherUserId` TypeScript compile error in `chat/[id].tsx`, and establish a centralized `logger.ts` for safe, production-ready logging.

## Tasks

### Plan 1: Centralized Safe Logger Utility
- Create `app/src/utils/logger.ts` with:
  - `debug(tag, ...args)`: Dev-only console.log
  - `info(tag, ...args)`: Dev-only console.info
  - `warn(tag, ...args)`: Safe warning (using `console.log` in dev or filtered)
  - `error(tag, err, options)`: Safe error logging that never triggers Expo RedBox overlays unless explicitly specified. Integrates with Analytics/Sentry scaffold without raw `console.error`.

### Plan 2: Fix `likes.tsx` Data Fetching & Photo Enrichment
- File: `app/src/app/(tabs)/likes.tsx`
- Ensure `fetchData` guards on `session?.user?.id`.
- Change `user_credits` query to use `.maybeSingle()` instead of `.single()`.
- Query `photos` for admirers to enrich profile pictures (falling back to `FALLBACK_AVATAR` only if no photo uploaded).
- Add pull-to-refresh (`refreshing`, `onRefresh`) support to `FlatList`.
- Handle RPC errors gracefully with `logger.warn` and set empty state instead of crashing.

### Plan 3: Fix `chat/[id].tsx` and `matches.tsx` (TS2304 Resolution & Clean Logging)
- Files: `app/src/app/chat/[id].tsx`, `app/src/app/(tabs)/matches.tsx`
- In `matches.tsx`, pass `otherUserId: item.other_user_id` in `handleOpenChat`.
- In `chat/[id].tsx`, extract `otherUserId` from route params or fetch from `matches` table as fallback.
- Replace raw `console.error` calls in `chat/[id].tsx` and `matches.tsx` with `logger` calls and user alerts.

### Plan 4: App-wide Console Error/Warn Cleanup
- Sweep and replace all remaining raw `console.error` and `console.warn` calls in:
  - `app/src/app/(tabs)/discover.tsx`
  - `app/src/app/discovery-settings.tsx`
  - `app/src/app/verification.tsx`
  - `app/src/app/location-gate.tsx`
  - `app/src/app/edit-profile.tsx`
  - `app/src/app/(onboarding)/step2-photos.tsx`
  - `app/src/app/(onboarding)/step3-college.tsx`
  - `app/src/hooks/use-live-feed.ts`
  - `app/src/utils/analytics.ts`

### Plan 5: Verification & Typecheck
- Run `npx tsc --noEmit` in `app` and ensure 0 TypeScript compilation errors.
- Verify clean runtime execution without redboxes.
