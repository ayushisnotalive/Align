---
phase: 11
title: Hardening
status: planned
---

# Phase 11: Hardening

## Goal
Prepare the app for production by purging stale data (e.g., location), auditing Row Level Security (RLS) policies, and hardening security settings.

## Requirements
### 1. Data Retention & Purge 🧹
- Create a Supabase pg_cron job to run daily and purge `user_location` data that is older than 3 days.
- Automatically delete `live_sessions_log` older than 7 days.
- Ensure temporary data (like old OTP challenges) is cleaned up.

### 2. Security Hardening 🔒
- Review and lock down any missing RLS policies for newer tables (like `reports`, `blocks`, `discovery_settings`).
- Ensure sensitive fields in `profile_private` are fully restricted to the user.
- Add constraints where missing (e.g., limiting the length of reasons in reports).

### 3. Cleanup & Final Polish ✨
- Remove any lingering console logs or unused mock data files that are no longer relevant.
- Ensure edge case error handling in frontend API calls (e.g., matching or fetching feeds).

## Implementation Steps
### 1. 🪚 SQL Migration: Cleanup Jobs
- Create a new migration file `20260925010000_hardening_cron.sql`.
- Enable `pg_cron` extension.
- Create cron schedules using `cron.schedule()` to delete stale records from `user_location`, `live_sessions_log`, and `otp_challenges`.

### 2. 🪚 SQL Migration: RLS Hardening
- Create a new migration file `20260925010500_hardening_rls.sql`.
- Audit RLS on `blocks`, `reports`, `profile_details`.
- Apply strict `select` and `insert` policies for authenticated users.

### 3. 🪚 Frontend Cleanup
- Run a quick scan over main TSX files (`discover.tsx`, `chat/[id].tsx`, etc.) to remove `console.log` statements and ensure `Alert.alert` is used for user-facing errors.
