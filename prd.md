# PRD: Align Beta v1

## 1. Goal
Ship a secure, working Android dating app to a closed beta (200-500 users, one
campus/city first) in 14 days, and learn whether users return by day 7.

## 2. Who it is for
Adults 18+ in India. Everyone can join. College is a primary tab, not a requirement.

## 3. Scope
**In beta:** phone OTP login, mandatory location, full profile, Discover, College,
Explore (Live Relationship Space), matches, chat, message requests, block/report,
blue tick (email + face), push notifications, feature flags.
**Out of beta (flags only):** ads, payments/subscriptions, video calls, boosts.
**Never:** hookup branding, sexual imagery, exact-location display.

## 4. Core rules
- Login: phone + OTP. Session persists until uninstall.
- No location permission = no app. Server rejects feed calls without fresh location.
- Age 18+ enforced by a database trigger.
- College: pick from the list, then submit a college ID photo (and optional college
  email). An admin approves or rejects. Only approved colleges appear on the profile
  and in the College tab. Max 3 rejected attempts per 30 days. ID photos are deleted
  within days of review and need their own consent (college_id_proof).--- college req for missing college + college setted once can only be change after 6 months once it is set.
- Users set up to 3 explicit places (state + city) and a radius (km).

## 5. Profile fields
**Required (no skip):** first name, last name, phone (from login), email, DOB,
gender, pronouns, orientation, occupation, employer, school ("N/A" allowed),
education level, bio, 3-6 photos.
**Optional (skippable, editable later, each with visibility public / matches only / hidden):**
political views, religion, smoking, drinking, cannabis/substances, diet, sleep pattern,
pets, living situation, family plans, ethnicity, health badge, love language,
social battery, texting style, relationship goal, relationship type.
Height is an optional profile field. Zodiac is computed from DOB (not asked).
Hometown (city) is optional and powers the Explore hometown filter.

## 6. Tabs and features
| Tab | What it does |
|---|---|
| Discover | Everyone. Scope = my places and/or radius. Filters: age, gender, verified only, attributes. Swipe like/pass. |
| College | Verified-declared college users. Scope: my college / my city / my state. |
| Explore | Live Relationship Space (section 7). |
| Matches | Mutual likes, unmatch. |
| Chats | Realtime chat (text + image), message requests (2/day, 150 chars, accept/ignore/report). |
| Profile (avatar, top-right) | Edit profile, places, college, discovery settings, privacy, blue tick, pause, delete. |

## 7. Explore: Live Relationship Space
- Tap "Go live" for 30 / 60 / 120 minutes with a goal and optional relationship type.
- **Goals (one):** Long-term partner · Long-term, open to short · Short-term, open to long ·
  Short-term fun · New friends · Still figuring it out.
- **Relationship type (optional, multi):** Monogamy · Ethical non-monogamy (ENM) ·
  Open relationship · Polyamory · Open to exploring.
- **Hometown** is a filter chip, not a goal.
- Live = heartbeat within 3 minutes. One active session per user, max 5 per day.
- Visible only within the viewer's scope, after blocks, age and gender preferences.
- "Say hi" = a like with source `live`; mutual = normal match.
- Empty state must be friendly ("No one live right now, be the first").

## 8. Blue tick
Email OTP (hashed code, 10 min expiry, 5 attempts) + live face check compared with the
primary photo (AWS Rekognition via Edge Function). Selfie deleted within 24h.
Tick is granted only when BOTH pass. Requires separate face-data consent.
Fallback if late: email OTP + manual admin face review.

## 9. Design system (60-30-10)
| Share | Role | Light | Dark |
|---|---|---|---|
| 60% | Backgrounds | #FFF8F5 | #14111A |
| 30% | Cards, bars, chips, inputs | #F3E4E8 | #221C2E |
| 10% | Accent (CTA, like, live dot, selected tab, tick ring) | #FF4D6D | #FF6B85 |
Text: #1E1A24 light / #F5EFF7 dark. Colors defined only in `ui/theme`.

## 10. Data and privacy
- Public name = first name only. Last name, email, DOB, phone are private.
- Location: coarse (~1 km) point rounded on the server; show "about X km".
- City-per-day history, 90-day retention. Device data limited to install id,
  model, OS, app version, locale, timezone, push token, Play Integrity verdict.
- Not collected: IMEI, MAC, Wi-Fi name, battery, advertising ID (until ads launch).
- Sensitive fields and face data need explicit consent rows. Never used for ads.
- Account deletion: 14-day grace, then all personal rows and S3 objects purged.
- Retention jobs: profile_views 90d, auth_events 180d, location_history 90d.

## 11. Non-functional requirements
- Feed query under 300 ms at 10k profiles (spatial + composite indexes).
- Chat delivery under 2 s on normal networks.
- No secrets in the APK or repo. RLS on 100% of tables.
- Crash-free sessions above 99% in beta.

## 12. Success metrics
Verified signups/day · day-1 and day-7 retention · matches per user ·
messages per match · reports per 100 users · % completing onboarding.

## 13. Risks and mitigations
| Risk | Plan |
|---|---|
| Empty app (cold start) | Launch one campus/city; seed personally |
| Fake profiles / minors | Blue tick, age trigger, reports, bans by phone/device/email hash |
| Harassment | Message request limits, block/report everywhere, admin queue |
| Play policy rejection | Neutral wording, UGC moderation, Data Safety form done honestly |
| SMS/DLT delay | Start registration on day 1 |
| Play testing requirements for new accounts | Check current rules on day 1 |
| Quota lockouts in Antigravity | Sonnet by default, commit often, keep a fallback plan |

## 14. Open decisions
- App name and package id
- Whether unverified users appear in College tab (recommended: verified-badge users first)
- Final city/college seed source and cleaning