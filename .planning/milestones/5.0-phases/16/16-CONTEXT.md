# Phase 16: Play Store Launch Readiness & UI Polish - Context

## Problem Statement
For Google Play Store submission and end-user distribution, the app must satisfy specific Google Play Console requirements and developer ergonomics:
1. **Missing `android.versionCode`**:
   Google Play Console mandates a positive integer `versionCode` (e.g. `1`) in `app.json` (`expo.android.versionCode`). Uploading an `.aab` bundle without `versionCode` results in a fatal rejection.
2. **Missing Root `package.json`**:
   Currently, `package.json` is located exclusively at `Align/app/package.json`. Running standard developer tools (`npm start`, `npx expo start`, `npm run android`) from the project root fails unless `--prefix app` is supplied.
3. **Route & Modal Animations Polish**:
   Modals (`edit-profile`, `discovery-settings`, `verification`) should have explicit presentation configs in `_layout.tsx` for native modal transition feel.
4. **Android Permissions & Privacy Compliance**:
   Ensure `app.json` contains appropriate usage strings and plugins (`expo-location`, `expo-image`, `expo-splash-screen`, `expo-secure-store`).

## Desired Outcome
- `app/app.json` has `versionCode: 1`, explicit permission configs, and valid assets.
- Root `package.json` proxies scripts to `app/`.
- Smooth modal transitions registered in `app/src/app/_layout.tsx`.
- All TypeScript validations pass with 0 errors.
