---
phase: 6
verified: 2026-09-30T17:23:00Z
status: passed
score: 5/5 must-haves verified
is_re_verification: false
---

# Phase 6: Explore (Live space) Verification

## Must-Haves

### Truths
| Truth | Status | Evidence |
|---|---|---|
| Live Space geospatial RPC queries active users within radius | ✓ VERIFIED | `20260924171000_live_space_map_fix_coords.sql` defines `get_live_feed` with `st_dwithin` and `st_x`/`st_y` |
| Interactive Map renders in Explore tab | ✓ VERIFIED | `app/src/app/(tabs)/explore.tsx` renders full-screen `MapView` with active markers |
| Panning fetches nearby live users | ✓ VERIFIED | `handleRegionChangeComplete` triggers `fetchFeed` with coordinates |
| User can tap marker and send wave request | ✓ VERIFIED | Tapping marker shows bottom sheet and sends `send_message_request` |
| Ghost mode hides user from live feed | ✓ VERIFIED | `discovery_settings.ghost_mode` toggles and is enforced in `get_live_feed` RPC |

### Artifacts
| Path | Exists | Substantive | Wired |
|---|---|---|---|
| app/src/app/(tabs)/explore.tsx | ✓ | ✓ | ✓ |
| app/src/hooks/use-live-feed.ts | ✓ | ✓ | ✓ |
| supabase/migrations/20260924171000_live_space_map_fix_coords.sql | ✓ | ✓ | ✓ |

### Key Links
| From | To | Via | Status |
|---|---|---|---|
| explore.tsx | use-live-feed.ts | `useLiveFeed` hook | ✓ WIRED |
| use-live-feed.ts | supabase RPC `get_live_feed` | `supabase.rpc` | ✓ WIRED |
| explore.tsx | supabase RPC `send_message_request` | `supabase.rpc` | ✓ WIRED |
| explore.tsx | `discovery_settings` | `supabase.from('discovery_settings')` | ✓ WIRED |

## Verdict
Phase 6 goals are fully implemented and verified against the codebase.
