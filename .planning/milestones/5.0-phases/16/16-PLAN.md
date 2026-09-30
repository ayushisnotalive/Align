---
phase: 16
title: Play Store Launch Readiness & UI Polish
status: planned
---

# Phase 16: Play Store Launch Readiness & UI Polish

## Goal
Prepare Align for Google Play Store release: configure `android.versionCode: 1`, provide root proxy npm scripts, register modal screen animations in RootLayout, verify permissions & assets, and confirm clean compile/build state.

## Tasks

### Plan 1: Configure Play Store Android Settings in `app/app.json`
- Add `"versionCode": 1` under `expo.android`.
- Verify package identifier (`"com.align.app"`).
- Verify adaptive icons and splash configs.

### Plan 2: Root `package.json` Proxy Scripts
- Create root `package.json` forwarding `npm start`, `npm run android`, `npm run ios`, `npm run web`, `npm run lint`, and `npm test` to `--prefix app`.
- Eliminates operator friction when running commands from workspace root.

### Plan 3: UI & Navigation Presentation Polish
- In `app/src/app/_layout.tsx`:
  - Register `edit-profile`, `discovery-settings`, and `verification` screens with `presentation: 'modal'` and `animation: 'slide_from_bottom'`.

### Plan 4: Validation & Typecheck
- Run `npx tsc --noEmit` to verify type safety.
- Verify npm scripts run cleanly from the root workspace.
- Generate Phase 16 summary and verification artifacts.
