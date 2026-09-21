---
task: "Fix photo upload screen: implement getProfilePhotos, deletePhoto, wire photos table insert, fix continue button"
status: in-progress
---

# Quick Plan: Fix Photo Upload Screen

## Problem
Photos upload to S3 bucket successfully but:
1. Uploaded images don't appear on screen
2. Continue button doesn't work properly
3. Expected flow: upload → see photo → add more → continue

## Root Causes

### RC1: `getProfilePhotos()` is a TODO stub
Returns `emptyList()` always — after upload, the reload returns nothing.

### RC2: `uploadImage()` doesn't insert into `photos` table
The media row goes into `public.media` but the ordered gallery join table `public.photos` never gets a row. Even with a working query, nothing would be found.

### RC3: `deletePhoto()` is a TODO stub
Returns success but never deletes anything.

### RC4: No optimistic UI for uploaded photos
User sees nothing until the full upload+reload cycle completes.

## Tasks

### Task 1: Implement full upload pipeline in MediaRepositoryImpl
- After S3 upload + media row insert, get back the generated UUID
- Insert into `photos` table with auto-incrementing position
- Add `MediaInsertResponse`, `PhotoInsertRow`, `PhotoWithMediaDto`, `MediaDto` DTOs
- **files**: `data/media/MediaRepositoryImpl.kt`
- **verify**: Upload photo → check both media and photos rows exist

### Task 2: Implement `getProfilePhotos()` query
- Query `photos` table with embedded `media(id, s3_key, kind, moderation_status)` join
- Order by position ascending
- Map to `MediaItem` domain objects
- **files**: `data/media/MediaRepositoryImpl.kt`

### Task 3: Implement `deletePhoto()` and `reorderPhotos()`
- Delete from photos table (media row stays for purge job)
- Reorder by updating position on each photo row
- **files**: `data/media/MediaRepositoryImpl.kt`

### Task 4: Add optimistic preview in ViewModel
- On upload start, immediately add a local MediaItem with `content://` URI
- Show loading overlay on optimistic entries
- Remove on failure, replace with server data on success
- **files**: `ui/profile/ProfileViewModel.kt`

### Task 5: Fix PhotoGalleryScreen
- Fix `PickMultipleVisualMedia(0)` crash when gallery is full
- Handle both `content://` URIs and HTTPS URLs in AsyncImage
- Disable delete button for uploading photos
- Disable continue button during active uploads
- **files**: `ui/profile/PhotoGalleryScreen.kt`
