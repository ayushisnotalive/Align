# Phase 6 Plan: Explore (Live space)

## Context
Implement an interactive map view showing other active users in real time, location clustering (using `coarse_point`), privacy controls (Ghost Mode), and marker interactions.

## Phase Tasks

### 1. Backend RPCs for Live Space
- **Description**: Create a Supabase SQL migration for `go_live`, `heartbeat`, and `get_live_feed` RPC functions.
  - `heartbeat`: updates the user's `last_active` timestamp.
  - `get_live_feed`: takes map bounding box coordinates or a radius and returns nearby users who are recently active (and haven't enabled Ghost Mode).
- **Files to create/modify**: `supabase/migrations/2026xxxx_live_space_rpcs.sql`

### 2. Map Screen Foundation (`react-native-maps`)
- **Description**: Create the Explore screen UI. Integrate `react-native-maps` to render a dark-mode styled map. Center the map initially on the user's own `coarse_point`.
- **Files to create/modify**: `src/app/(tabs)/explore.tsx`

### 3. Fetch and Render Live Users
- **Description**: Wire up the `get_live_feed` Supabase RPC to fetch users whenever the map is panned. Render custom map markers with user thumbnail photos. Ensure clustering/fuzzing is respected.
- **Files to create/modify**: `src/app/(tabs)/explore.tsx`, `src/components/MapMarker.tsx`

### 4. Mini-Profile Bottom Sheet & Interactions
- **Description**: Implement a bottom sheet that slides up when a marker is tapped. Show the user's photo, name, age, and college. Add a "Wave" or "Ping" button that sends a message request.
- **Files to create/modify**: `src/app/(tabs)/explore.tsx`, `src/components/MiniProfileSheet.tsx`

### 5. Privacy Controls & Filters
- **Description**: Add a floating action button or header icon to access map settings. Implement "Ghost Mode" (which updates a DB flag to hide the user from `get_live_feed`). Add filters for College and Distance.
- **Files to create/modify**: `src/app/(tabs)/explore.tsx`, `src/components/ExploreFilters.tsx`

### 6. End-to-End Verification
- **Description**: Verify the heartbeat system keeps the user online, Ghost Mode successfully hides the user, and map panning fetches new data correctly.
