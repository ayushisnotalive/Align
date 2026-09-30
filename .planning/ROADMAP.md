# Roadmap

## Completed Milestones

### Milestone 1: App Foundation & Database (Shipped)
- [x] Phase 1: Database & Security (`auth`, `location`, `schema`)

### Milestone 2: MVP Features (Shipped)
- [x] Phase 2: Auth and Location Gate (`splash`, `login`, `consents`)
- [x] Phase 3: Profile & Verification (`onboarding`, `S3`, `college_verify`)
- [x] Phase 4: Discover & College (`feeds`, `swipe`)
- [x] Phase 5: Matches & Chat (`matches`, `realtime`)

### Milestone 3: Expansion & Safety (Shipped)
- [x] Phase 6: Explore (Live space) (`live`, `map`)
- [x] Phase 7: Comprehensive Profile (`profile_expansion`, `onboarding`)
- [x] Phase 8: Premium & Gamification (`premium`, `rich_media`, `gamification`)
- [x] Phase 9: Premium Expansion (`who_likes_you`, `advanced_filters`)
- [x] Phase 10: Safety & Admin (`block`, `admin`, `blue_tick`)
- [x] Phase 11: Hardening (`tests`, `purge`)

### Milestone 4: Production (Shipped: 2026-09-30)
- [x] Phase 12: Release (`play_console`, `prod_db`)
- [x] Phase 13: Polish & Bug Fixes (`audit_fixes`, `code_quality`)
- [x] Phase 14: Messaging & Incognito (`reactions`, `media_share`, `incognito`)

## Milestone 5: Play Store Production Launch & Hardening
- [ ] Phase 15: Error Resilience & Log Cleanliness (`logging`, `error_handling`, `likes_fix`)
- [ ] Phase 16: Play Store Launch Readiness & UI Polish (`play_store`, `android_manifest`, `ui_polish`)

### Phase 15: Error Resilience & Log Cleanliness (`logging`, `error_handling`, `likes_fix`)
Fix `likes.tsx` data fetching and photo mapping. Centralize logging with `logger.ts` to eliminate raw console.error/warn redboxes. Add robust fallbacks for unauthenticated/offline states across tabs and onboarding.

### Phase 16: Play Store Launch Readiness & UI Polish (`play_store`, `android_manifest`, `ui_polish`)
Ensure Play Store compliance: add Android `versionCode: 1`, verify asset icons/splash, provide root `package.json` proxy scripts, verify permissions, and validate build readiness.

