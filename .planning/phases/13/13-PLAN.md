---
phase: 13
title: Polish & Bug Fixes
status: planned
---

# Phase 13: Polish & Bug Fixes

## Goal
Address code quality issues, wiring gaps, and minor bugs discovered during the cross-phase audit. This is a hardening pass focused on things that would break or confuse a real user.

## Findings from Audit

### Bug Fixes (Critical)
1. **College feed like/pass buttons are dead** — `college.tsx` renders like/pass `TouchableOpacity` buttons but neither has an `onPress` handler wired to the swipe RPC. A user tapping "like" on a college profile does nothing.

### Code Quality
2. **`getImageUrl` duplicated 3×** — identical helper in `discover.tsx`, `likes.tsx`, `college.tsx`. Extract to a shared utility.
3. **`collegeSearch` in `step3-college.tsx` never used** — the text input captures a value but there is no autocomplete/dropdown hooked up. At minimum, the `collegeSearch` value should be used to look up the `college_id` before inserting into `verifications`.

### Config Fixes (already applied)
4. ✅ `app.json` name/slug/scheme updated from "app" to "Align"/"align".

## Implementation Plan

### Plan 1: Wire college feed swipe buttons
- File: `app/src/app/(tabs)/college.tsx`
- Add `onPress` handlers to the like and pass `TouchableOpacity` buttons that call `supabase.rpc('swipe', ...)` with the profile id, and show a match alert on mutual like.

### Plan 2: Extract shared `getImageUrl` utility
- Create `app/src/utils/media.ts` with the shared `getImageUrl` function.
- Update `discover.tsx`, `likes.tsx`, and `college.tsx` to import from the shared utility.

### Plan 3: Commit app.json fix
- Already applied. Just needs to be committed as part of this phase.
