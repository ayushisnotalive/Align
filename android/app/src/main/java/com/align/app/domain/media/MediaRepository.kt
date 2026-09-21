package com.align.app.domain.media

import android.net.Uri

interface MediaRepository {
    /**
     * Uploads an image to the media store via Edge Function presigned URL.
     * Handles EXIF stripping, resizing, and OkHttp upload.
     * 
     * @param uri The local URI of the image to upload
     * @param kind "profile_photo", "chat_image", or "college_id"
     * @return Result containing the URL of the uploaded image
     */
    suspend fun uploadImage(uri: Uri, kind: String): Result<String>
    
    /**
     * Retrieves the current user's profile photos from the media table.
     */
    suspend fun getProfilePhotos(): Result<List<MediaItem>>
    
    /**
     * Reorders photos.
     */
    suspend fun reorderPhotos(photoIds: List<String>): Result<Unit>
    
    /**
     * Deletes a photo.
     */
    suspend fun deletePhoto(mediaId: String): Result<Unit>
}

data class MediaItem(
    val id: String,
    val s3Key: String,
    val url: String,
    val position: Int
)
