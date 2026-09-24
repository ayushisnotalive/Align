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
- Architecture: React Native with Expo (TypeScript).
- State Management: Zustand + React Query.
- Backend: Supabase (Auth, Postgres, Realtime, Storage, Edge Functions).
- Security: RLS heavily used; all mutations via `security definer` RPCs.
- Storage: Expo SecureStore for session persistence.
</decisions>

<constraints>
- Cross-platform support for iOS and Android.
- 60-30-10 theme ratio.
</constraints>
