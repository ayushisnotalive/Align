# Phase 6 Context: Explore (Live space)

## Features to Implement
- **Interactive Map View**: A map interface (`react-native-maps` or Expo equivalent) showing nearby active users.
- **Location Fuzzing / Clustering**: Users are shown on a snapped grid (which we already implemented in `set_location.sql` as `coarse_point` with a ~1km grid). Map should group/cluster users if too many are in the same area.
- **Privacy Controls (Ghost Mode)**: A toggle for users to hide their location from the map entirely while still being able to use the app.
- **Filtering**: Ability to filter the map by college, online status, or distance.
- **Marker Interactions**: Tapping a user's map marker opens a mini-profile preview (photo, name, age) with quick actions.
- **Direct Map Actions**: Ability to send a "wave" or "ping" directly from the map, or transition into a chat if a match exists.
- **Heatmap (Optional/Future)**: Visual hotspots indicating areas of high user activity.

## User Information Taken & Displayed
- **Precise Coordinates (Lat/Lng)**: Collected locally on the device but safely snapped to `coarse_point` in the database to prevent stalking.
- **Detected City/Region**: For broader filtering.
- **Last Active Timestamp**: To determine if the user should appear on the live map.
- **Profile Data**: First photo thumbnail, first name, age, and college for the marker preview.
- **Location Permission State**: Used to prompt users who haven't granted location access yet.

## Design Preferences
- Dark mode optimized map style.
- Smooth animations when zooming to clusters or opening the mini-profile bottom sheet.
- Emphasize safety (e.g., clear indicators when Ghost Mode is active).
