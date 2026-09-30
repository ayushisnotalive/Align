---
phase: 12
title: Release
status: planned
---

# Phase 12: Release

## Goal
Prepare the app for production deployment, configure Expo Application Services (EAS) for builds, set up necessary deployment scripts, and prepare app store metadata templates.

## Requirements
### 1. Build Configuration 🏗️
- Create/update `eas.json` with development, preview, and production profiles.
- Update `app.json` with proper Android package names, iOS bundle identifiers, and version codes.
- Ensure Expo plugins (like `expo-notifications` and `expo-location`) are properly configured for production builds.

### 2. Production Database Scripts 🗄️
- Create a `deploy-prod.sh` script to help the user link a production Supabase project and push the entire migration history.
- Ensure all environment variables are documented in a `.env.example` file.

### 3. App Store Metadata 📝
- Generate a `STORE_METADATA.md` file with suggested App Store / Play Store titles, short descriptions, full descriptions, and keyword tags for the dating app.

## Implementation Steps
### 1. 🪚 Build Config
- Update `/app/app.json` to inject standard production values.
- Create `/app/eas.json` with production build profiles.

### 2. 🪚 Database Deployment Script
- Create `/supabase/deploy-prod.sh` with instructions and `supabase link` commands.
- Create `/app/.env.example` with Supabase URL and Anon Key placeholders.

### 3. 🪚 Store Metadata
- Write `/STORE_METADATA.md` with marketing copy for "Align".
