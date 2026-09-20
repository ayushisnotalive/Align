# Align

**Developer-facing Success Metric:** App runs on device end-to-end (signup to match to chat) securely.
**Target Runtime:** claude

<goals>
Build a modern dating app focused on verified college students.
Core loop: Signup (phone OTP) -> Verify College -> Discover/College feeds -> Swipe -> Match -> Chat/Live.
</goals>

<non_goals>
Web platform (Android only for now).
</non_goals>

<decisions>
- Architecture: Android Clean Architecture (data, domain, ui, di) with Jetpack Compose.
- Backend: Supabase (Auth, Postgres, Realtime, Storage, Edge Functions).
- Security: RLS heavily used; all mutations via `security definer` RPCs.
- Session: EncryptedSharedPreferences (allowBackup=false).
</decisions>

<constraints>
- Min SDK 26, Target SDK 35
- 60-30-10 theme ratio
</constraints>
