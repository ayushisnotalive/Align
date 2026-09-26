# Phase 10: Safety & Admin - UAT

## Test Cases

### 1. Verification (Blue Tick)
expected: Navigate to "Profile" -> "Get Verified". Tap "Start Verification" and then "Submit Selfie". After a short delay, you should see a success alert. The frontend state should now reflect that you are verified. Check your profile to see if the UI indicates you have a blue tick (or check the Supabase `profiles.is_blue_tick` column).
result: [pending]

### 2. Blocking a User
expected: Navigate to a chat with a matched user. Tap the 3-dots icon (or "Report/Block" options in the header) and choose "Block". You should see a confirmation alert and be routed back. Check that the user no longer appears in your matches list.
result: [pending]

### 3. Reporting and Admin Panel
expected: In a chat, tap options and choose "Report". Navigate to "Profile" -> "Admin Panel". You should see the report listed. Tap "Ban User". The user's status should now be updated to `banned` (and they will no longer appear in feeds).
result: [pending]
