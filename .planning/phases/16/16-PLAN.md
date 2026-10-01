---
phase: 16
title: Play Store Launch Readiness & UI Polish
status: planned
---

# Phase 16: Play Store Launch Readiness & UI Polish

## Goal
Ensure Play Store compliance: add Android `versionCode: 1`, verify asset icons/splash, provide root `package.json` proxy scripts, verify permissions, and validate build readiness.

## Context & Architecture
Based on `16-CONTEXT.md`:
This is an infrastructure phase focused on validating build outputs and app store constraints.

## Execution Steps

### 1. Update Android Version Config
- **Action**: Modify `app/app.json`.
- **Details**: Ensure `android.versionCode` is explicitly set to `1` (or whatever the target release version is) to pass Play Console uploads.

### 2. Verify Root Proxy Scripts
- **Action**: Check `package.json`.
- **Details**: Ensure that `npm run build` or EAS proxy commands exist so `eas build` successfully triggers the inner app commands if needed.

### 3. Verify Android Permissions
- **Action**: Check `app/app.json`.
- **Details**: Ensure location, camera, and photo permissions are appropriately requested.

## Verification
- App config contains versionCode.
- Proxy scripts function correctly.
