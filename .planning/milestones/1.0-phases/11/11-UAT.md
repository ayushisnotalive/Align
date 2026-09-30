---
status: complete
phase: 11-hardening
source: [11-SUMMARY.md]
started: 2026-09-25T22:40:00+05:30
updated: 2026-09-30T17:35:00+05:30
---

## Current Test
number: 2
name: Cron Jobs installed
expected: Check that pg_cron jobs are active in DB.
awaiting: none

## Tests

### 1. RLS Policies applied
expected: Verify that accessing `blocks` or `reports` from an unauthenticated or non-matching user session fails with RLS errors.
result: passed

### 2. Cron Jobs installed
expected: Check that `pg_cron` jobs `purge-stale-locations`, `purge-live-sessions`, and `purge-otp-challenges` are active in the database.
result: passed

## Summary

total: 2
passed: 2
issues: 0
pending: 0
skipped: 0

## Gaps
None
