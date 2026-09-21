---
quick_id: 260921-ijv
slug: wire-appnavgraph-add-profile-screen-rout
description: Wire AppNavGraph: add profile screen routes + fix Phase 3 todo formatting
date: 2026-09-21
---

# Quick Task: Wire AppNavGraph + Phase 3 Tracking

## Task 1: Wire AppNavGraph with Phase 3 profile routes
**Files:** `android/app/src/main/java/com/align/app/ui/AppNavGraph.kt`
**Action:**
- Add Routes: PROFILE_EDIT, PHOTO_GALLERY, COLLEGE_PICKER, COLLEGE_VERIFICATION, ATTRIBUTES, PLACES_PICKER, HOMETOWN_PICKER
- Wire all composable() destinations to the new profile screens from Phase 3
- Replace the ProfileScreen() stub with ProfileEditScreen() pointing to sub-routes
- Keep DiscoverScreen, CollegeScreen, ExploreScreen, MatchesScreen, ChatsScreen as stubs (Phase 4+)

**Verify:** File compiles, no unresolved references to non-existent routes

## Task 2: Fix Phase 3 todo.md formatting (strikethrough completed items)
**Files:** `.planning/todo.md`
**Action:**
- Apply `~~strikethrough~~ — **Done 2026-09-21**` format to completed Phase 3 items (matching the style of Phase 0, 1, 2 completed items)

## Task 3: Update STATE.md and ROADMAP.md
**Files:** `.planning/STATE.md`, `.planning/ROADMAP.md`
**Action:**
- STATE.md: update current_phase to 3, update status note
- ROADMAP.md: mark Phase 2 as [x], mark Phase 3 as [/]
