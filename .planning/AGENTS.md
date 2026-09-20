# PROJECT RULES: Dating app (Android + Supabase). Read prd.md and todo.md first.

## ROLE AND WORKFLOW
- Solo developer, 14-day beta. Work on ONE small task at a time from todo.md.
- Never touch files outside the task. Never refactor unrelated code.
- Before writing code: state the plan in 3-5 lines. After: list files changed.
- Ask before adding any dependency. Prefer official libraries.
- Commit-sized changes only. If a task needs more than ~300 lines, split it.
- If a requirement is unclear or conflicts with prd.md, STOP and ask.
- Never invent tables/columns. The schema source of truth is supabase/migrations/.

## STACK
- Android: Kotlin, Jetpack Compose (Material3), minSdk 26, Hilt, Navigation Compose,
  Coroutines + Flow, MVVM + Clean Architecture (packages: data, domain, ui, di).
- Backend: Supabase (Auth phone OTP, Postgres + PostGIS, Realtime, Edge Functions).
- Media: AWS S3 + CloudFront. Face check: AWS Rekognition (Edge Function only).
- Push: FCM.

## ARCHITECTURE
- Composables -> ViewModel -> domain repository INTERFACE -> data implementation.
- Supabase/AWS code lives ONLY in the data layer. Screens never import Supabase.
- One StateFlow<UiState> per screen; events as functions; no logic in composables.
- Every screen has loading, empty, and error states.

## SECURITY (Clerk-style client practices)
1. The client is untrusted. Enforce every rule on the server (RLS, Postgres
   functions, Edge Functions). Client checks are UX only.
2. Never trust a user id sent from the client. Server uses auth.uid().
3. Tokens: keep the session in encrypted storage (EncryptedSharedPreferences/
   DataStore + Keystore). Exclude it from Android auto-backup
   (android:allowBackup=false or dataExtractionRules). Never log tokens, OTPs,
   phone numbers, emails, locations or message text.
4. Secrets: NO service-role key, AWS keys, or FCM keys in the app, repo, or
   BuildConfig. Only SUPABASE_URL and SUPABASE_ANON_KEY (public by design) come
   from local.properties. Server secrets go through `supabase secrets set`.
5. Network: HTTPS only, cleartextTrafficPermitted=false in network_security_config.
   Validate every deep link and intent extra. No WebView unless approved.
6. Least privilege: new tables get RLS + explicit grants in the SAME migration.
7. Validate input twice (client for UX, server for truth): lengths, types,
   enums, file mime/size, age >= 18.
8. Rate limit anything abusable (OTP, swipes, message requests, uploads).
9. Release builds: R8 on, debuggable=false, Play Integrity check on sensitive calls.
10. Use FLAG_SECURE on verification/selfie screens. Do not cache selfies on disk.
11. Errors shown to users are generic; details go to a non-PII crash log.

## DATABASE RULES
- Change schema ONLY via new files in supabase/migrations/ named
  YYYYMMDDHHMMSS_description.sql. Never edit an applied migration; add a new one.
- Never change tables by hand in the dashboard.
- Every table: RLS enabled, deny by default, policies in the migration.
- Client cannot write: swipes, matches, message_requests, live_presence,
  daily_usage, verifications, user_location. Those go through security-definer
  functions with `set search_path = public, extensions`.
- Private data lives in profile_private. Other users' profiles are read ONLY
  through RPCs (get_feed, get_profile) or a matched-user policy. No scraping paths.
- Location: store only coarse (~1 km) points, rounded on the SERVER.
- Sensitive attributes (religion, politics, ethnicity, health, orientation,
  face data) need consent rows and are never used for ads.
- College is trusted ONLY when user_colleges.verified = true. Every College-tab query,
college filter, and public "college" display must check verified. Never set the
verification columns from the client; only submit_college_verification() and the
admin review function may change them.

## DESIGN SYSTEM (60-30-10)
- 60% dominant background, 30% secondary surfaces, 10% accent. Values live ONLY
  in ui/theme (Color.kt, Theme.kt). No raw hex or Color(...) in screens.
- Accent (#FF4D6D light / #FF6B85 dark) only for primary CTA, like, live dot,
  selected tab, blue-tick ring. Never more than ~10% of a screen.
- Light and dark from day one. 4dp grid. 16dp card radius. One font family.

## ENVIRONMENT
- Two Supabase projects: dev and prod. Default to dev. Never run destructive SQL on prod.
- Feature flags (ads_enabled, video_calls, paid_plans) stay false in beta.

## DON'T
- No hard-coded strings for dropdown options; load from lookup_values.
- No exact GPS storage, no IMEI/MAC/Wi-Fi name/battery collection.
- No hookup labeling or sexual imagery in copy, UI, or store listing.
- No TODO-later security shortcuts. If it touches auth, RLS, storage or face
  data, say so and explain the code in comments.