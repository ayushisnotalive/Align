# Milestones

## v1.0 Production Release (Shipped: 2026-09-30)

**Phases completed:** 14 phases across 4 milestones, 14 plans complete

**Key accomplishments:**
- **Live space & Explore map**: Interactive MapView with geospatial search (`st_dwithin`), location clustering, and privacy Ghost Mode.
- **Comprehensive Profile Expansion**: 35+ demographic, lifestyle, intention attributes, and unified modal selectors.
- **Monetization & Rich Chat**: Super Likes, Boosts, Rewind, chat media sharing to Supabase storage, and realtime message reactions.
- **Inbound Admirers & Advanced Filters**: Dedicated "Who Likes You" blurred paywall grid and strict filtering.
- **Safety & Moderation**: User blocking (bidirectionally enforced in feed and matches), report submissions, blue tick selfie verification, and admin moderation portal.
- **Hardening & Automation**: Strict RLS policies on all tables, automated data retention/purge cron jobs via `pg_cron`.
- **Production Readiness**: EAS build profiles, automated Supabase prod deploy script, App Store/Play Store marketing metadata.
- **Polish & Incognito**: Incognito mode for anonymous browsing, college feed swipe buttons wired to RPC, and shared media utilities.

---

## v5.0 Play Store Production Launch & Hardening (Shipped: 2026-09-30)

**Phases completed:** 2 phases (Phase 15, Phase 16), 2 plans complete

**Key accomplishments:**
- **Error Resilience & Safe Logging**: Eradicated intrusive RedBox and Yellowbox popups by replacing raw `console.error` and `console.warn` across 13 screens/modules with centralized `logger.ts`.
- **Likes Feed Crash Fix**: Fixed `likes.tsx` data fetching by guarding on authenticated session state and converting credit check to `.maybeSingle()`, preventing `PGRST116` errors.
- **Chat Parameter Wiring**: Fixed `chat/[id].tsx` compile error (`TS2304: Cannot find name 'otherUserId'`) and properly passed `other_user_id` from matches list.
- **Google Play Store Compliance**: Configured `android.versionCode: 1` in `app.json`, verified adaptive icons and permissions, and added modal presentation transitions.
- **Workspace Ergonomics**: Created root proxy `package.json` enabling `npm start`, `npm run android`, and `npm run tsc` directly from project root.

---
