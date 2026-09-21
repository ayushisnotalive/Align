---
status: complete
---

# Summary: Fix Photo Upload Screen

## What was done

Fixed the photo upload screen so uploaded images appear immediately and the continue button works correctly.

### Root Causes Found & Fixed

1. **`getProfilePhotos()` was a TODO stub** returning `emptyList()` — photos uploaded to S3 never appeared in the gallery because the query returned nothing.

2. **`uploadImage()` never inserted into the `photos` table** — the upload pipeline wrote to S3 and inserted a `media` row, but missed the `photos` gallery join table entirely. Without a `photos` row, even a working query would find nothing.

3. **`deletePhoto()` was a TODO stub** — returned success without doing anything.

4. **`PickMultipleVisualMedia(maxPhotos - photos.size)`** would crash with `maxItems=0` when the gallery was full.

### Changes Made

| File | Changes |
|------|---------|
| `MediaRepositoryImpl.kt` | Full upload pipeline: S3 → media row → photos row with auto-position. Implemented `getProfilePhotos()` with embedded Postgrest join query. Implemented `deletePhoto()` and `reorderPhotos()`. Added DTOs: `MediaInsertResponse`, `PhotoInsertRow`, `PhotoWithMediaDto`, `MediaDto`. |
| `ProfileViewModel.kt` | Optimistic preview: local `content://` URI shown immediately in gallery while upload completes. Rollback on failure, server data replaces on success. |
| `PhotoGalleryScreen.kt` | Fixed photo picker contract (safe maxItems), dual URI/URL image model for Coil, upload overlay spinner on optimistic entries, styled delete button only on completed uploads, continue button disabled during active uploads. |

### Flow After Fix

1. User taps "Add" → photo picker opens
2. Selected photo appears **immediately** in the gallery (local preview) with a small spinner overlay
3. Upload completes in background (S3 → media → photos)
4. Server data replaces the local preview
5. User can add more photos with the "Add" button
6. Continue button enables when ≥3 photos and no uploads in progress

### Commit
`9e7f1d0` — `fix(photos): implement photo gallery pipeline — upload, display, delete`
