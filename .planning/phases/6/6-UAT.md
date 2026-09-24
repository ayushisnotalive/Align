---
status: testing
phase: 06-Explore
source: [6-SUMMARY.md]
started: 2026-09-24T17:05:00+05:30
updated: 2026-09-24T17:05:00+05:30
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Cold Start Smoke Test
expected: |
  Kill any running server/service. Clear ephemeral state (temp DBs, caches, lock files). Start the application from scratch. Server boots without errors, any seed/migration completes, and a primary query (health check, homepage load, or basic API call) returns live data.
awaiting: user response

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running server/service. Clear ephemeral state (temp DBs, caches, lock files). Start the application from scratch. Server boots without errors, any seed/migration completes, and a primary query (health check, homepage load, or basic API call) returns live data.
result: pending

### 2. Interactive Map (Explore Screen)
expected: Navigating to the Explore tab requests location permissions. Once granted, a full-screen map is displayed, centered on the user's current location.
result: pending

### 3. Panning the Map
expected: Panning the map dynamically fetches nearby live users and displays them as markers on the map.
result: pending

### 4. Marker Interactions & Wave
expected: Tapping a user marker opens a mini-profile bottom sheet with their name, goal, and a "Wave" button. Tapping the "Wave" button successfully sends a message request.
result: pending

### 5. Privacy Controls (Ghost Mode)
expected: Toggling the Ghost Mode icon in the header successfully hides your marker from the map, persisting the setting in your discovery_settings.
result: pending

## Summary

total: 5
passed: 0
issues: 0
pending: 5
skipped: 0

## Gaps

