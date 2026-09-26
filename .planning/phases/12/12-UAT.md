# Phase 12: Release - Manual UAT

## Test Cases

### 1. Build Verification
expected: Run `npx expo prebuild` and verify that Android package name (`com.align.app`), iOS bundle identifier, permissions, and `expo-location` plugins are correctly injected into the native projects.
result: [pending]

### 2. Production Database Deployment
expected: Run `./supabase/deploy-prod.sh <YOUR_PROD_PROJECT_REF>` against a fresh Supabase instance. Verify that all 15+ migrations apply cleanly and RLS policies restrict anonymous access.
result: [pending]

### 3. App Store Metadata
expected: Review `STORE_METADATA.md` and confirm it aligns with the brand vision before uploading it to App Store Connect / Google Play Console.
result: [pending]
