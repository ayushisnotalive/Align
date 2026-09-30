---
status: complete
phase: 06-Explore
source: [6-SUMMARY.md]
started: 2026-09-24T17:05:00+05:30
updated: 2026-09-30T17:35:00+05:30
---

## Current Test
number: 5
name: Privacy Controls (Ghost Mode)
expected: Toggling Ghost Mode persists setting and hides user from map.
awaiting: none

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running server/service. Clear ephemeral state (temp DBs, caches, lock files). Start the application from scratch. Server boots without errors, any seed/migration completes, and a primary query (health check, homepage load, or basic API call) returns live data.
result: passed

### 2. Interactive Map (Explore Screen)
expected: Navigating to the Explore tab requests location permissions. Once granted, a full-screen map is displayed, centered on the user's current location.
result: passed

### 3. Panning the Map
expected: Panning the map dynamically fetches nearby live users and displays them as markers on the map.
result: passed

### 4. Marker Interactions & Wave
expected: Tapping a user marker opens a mini-profile bottom sheet with their name, goal, and a "Wave" button. Tapping the "Wave" button successfully sends a message request.
result: passed

### 5. Privacy Controls (Ghost Mode)
expected: Toggling the Ghost Mode icon in the header successfully hides your marker from the map, persisting the setting in your discovery_settings.
result: passed

## Summary

total: 5
passed: 5
issues: 0
pending: 0
skipped: 0

## Gaps
None
