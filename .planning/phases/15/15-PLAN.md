---
phase: 15
title: Error Resilience & Log Cleanliness
status: planned
---

# Phase 15: Error Resilience & Log Cleanliness

## Goal
Fix `likes.tsx` data fetching and photo mapping. Centralize logging with `logger.ts` to eliminate raw console.error/warn redboxes. Add robust fallbacks for unauthenticated/offline states across tabs and onboarding.

## Context & Architecture
Based on `15-CONTEXT.md`:
1. **Logging**: Override `console.error` and `console.warn` globally in dev to prevent full-screen redboxes while preserving logs. 
2. **Fallbacks**: Implement a global auth/offline banner in `app/src/app/_layout.tsx`.
3. **Likes Feed**: Refactor data fetching in `likes.tsx` to batch fetch profiles + their primary photo and gracefully handle missing photos.

## Execution Steps

### 1. Centralize Logging (`logger.ts`)
- **Action**: Create `app/src/utils/logger.ts`.
- **Details**: Implement a utility that overrides `console.error` and `console.warn`. In development, it should log to the console safely (without triggering redbox if possible, or just standard `LogBox.ignoreAllLogs()` / selective ignoring). In production, it suppresses them.
- **Verification**: `logger.ts` exists and intercepts errors.

### 2. Implement Global Fallbacks
- **Action**: Modify `app/src/app/_layout.tsx`.
- **Details**: 
  - Add a network listener using `@react-native-community/netinfo` (or similar, if installed, otherwise simple custom hook or just mock for now). Wait, we'll just check auth state for now and render a global overlay if auth fails unexpectedly.
  - Implement the "Session expired" overlay if auth is missing on protected routes.
- **Verification**: Ensure unauthenticated state on protected routes is handled safely.

### 3. Fix `likes.tsx` Data Fetching
- **Action**: Refactor `app/src/app/(tabs)/likes.tsx`.
- **Details**: 
  - Update the query fetching from `swipes` to properly join `profiles` and `photos` in a single query (using Supabase foreign key relationships or a custom RPC if needed).
  - Actually, `likes.tsx` already uses an RPC or queries `swipes` + `profiles`. I will ensure it fetches the first photo and maps it correctly to `getImageUrl`.
  - Add a fallback gradient for users with no photos.
- **Verification**: The Likes tab renders correctly without errors even if a user has no photos.

## Verification
- Run typechecking.
- Ensure no redboxes appear on intentional errors.
- Confirm `likes.tsx` displays profiles correctly.
