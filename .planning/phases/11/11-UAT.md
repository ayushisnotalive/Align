# Phase 11: Hardening - UAT

## Test Cases

### 1. RLS Policies applied
expected: Verify that accessing `blocks` or `reports` from an unauthenticated or non-matching user session fails with RLS errors.
result: [passed]

### 2. Cron Jobs installed
expected: Check that `pg_cron` jobs `purge-stale-locations`, `purge-live-sessions`, and `purge-otp-challenges` are active in the database.
result: [passed]
