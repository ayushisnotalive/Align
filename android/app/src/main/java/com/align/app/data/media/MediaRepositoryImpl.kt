package com.align.app.data.media

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import com.align.app.domain.media.MediaItem
import com.align.app.domain.media.MediaRepository
import dagger.hilt.android.qualifiers.ApplicationContext
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.functions.Functions
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.auth.Auth
import io.ktor.client.call.body
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.ByteArrayOutputStream
import javax.inject.Inject

@Serializable
data class PresignedRequest(
    val kind: String,
    val contentType: String,
    val size: Int
)

@Serializable
data class PresignedResponse(
    val url: String,
    val key: String
)

@Serializable
data class MediaRow(
    val owner_id: String,
    val kind: String,
    val bucket: String,
    val s3_key: String,
    val mime_type: String,
    val size_bytes: Int,
    val width: Int,
    val height: Int
)

/** Response DTO when inserting a media row (server returns the generated id). */
@Serializable
data class MediaInsertResponse(
    val id: String,
    val s3_key: String
)

/** DTO for inserting into the photos gallery join table. */
@Serializable
data class PhotoInsertRow(
    val user_id: String,
    val media_id: String,
    val position: Int
)

/** DTO for reading photos joined with media. */
@Serializable
data class PhotoWithMediaDto(
    val id: String,
    val media_id: String,
    val position: Int,
    val media: MediaDto? = null
)

@Serializable
data class MediaDto(
    val id: String,
    val s3_key: String,
    val kind: String,
    @SerialName("moderation_status") val moderationStatus: String = "pending"
)

class MediaRepositoryImpl @Inject constructor(
    @ApplicationContext private val context: Context,
    private val supabase: SupabaseClient,
    private val functions: Functions,
    private val postgrest: Postgrest,
    private val auth: Auth
) : MediaRepository {

    private val okHttpClient = OkHttpClient()

    override suspend fun uploadImage(uri: Uri, kind: String): Result<String> = withContext(Dispatchers.IO) {
        try {
            val user = auth.currentUserOrNull() ?: return@withContext Result.failure(Exception("Not authenticated"))

            // 1. Read and compress bitmap, strip EXIF by re-encoding
            val inputStream = context.contentResolver.openInputStream(uri)
                ?: return@withContext Result.failure(Exception("Cannot open uri"))
                
            val originalBitmap = BitmapFactory.decodeStream(inputStream)
            inputStream.close()
            
            val scaledBitmap = scaleBitmap(originalBitmap, 1080)
            
            val outputStream = ByteArrayOutputStream()
            scaledBitmap.compress(Bitmap.CompressFormat.JPEG, 85, outputStream)
            val byteArray = outputStream.toByteArray()
            
            val width = scaledBitmap.width
            val height = scaledBitmap.height
            val size = byteArray.size
            val contentType = "image/jpeg"
            
            scaledBitmap.recycle()
            if (originalBitmap !== scaledBitmap) originalBitmap.recycle()

            // 2. Request Presigned URL from Edge Function
            val presignedRequest = PresignedRequest(kind, contentType, size)
            val response = functions.invoke("presigned-upload", presignedRequest)
            val presignedData: PresignedResponse = response.body()
            
            // 3. Upload to AWS S3 using OkHttp
            val requestBody = byteArray.toRequestBody(contentType.toMediaTypeOrNull())
            val request = Request.Builder()
                .url(presignedData.url)
                .put(requestBody)
                .build()
                
            val okResponse = okHttpClient.newCall(request).execute()
            if (!okResponse.isSuccessful) {
                return@withContext Result.failure(Exception("Failed to upload to S3: ${okResponse.code}"))
            }
            
            // 4. Insert row into public.media and get back the generated UUID
            val mediaRow = MediaRow(
                owner_id = user.id,
                kind = kind,
                bucket = "default",
                s3_key = presignedData.key,
                mime_type = contentType,
                size_bytes = size,
                width = width,
                height = height
            )
            
            val insertedMedia = postgrest["media"].insert(mediaRow) {
                select()
            }.decodeSingle<MediaInsertResponse>()
            
            // 5. If profile_photo, also insert into the photos gallery join table
            if (kind == "profile_photo") {
                // Get current max position to append at the end
                val currentPhotos = postgrest["photos"].select {
                    filter { eq("user_id", user.id) }
                }.decodeList<PhotoInsertRow>()
                
                val nextPosition = (currentPhotos.maxOfOrNull { it.position } ?: 0) + 1
                
                postgrest["photos"].insert(
                    PhotoInsertRow(
                        user_id = user.id,
                        media_id = insertedMedia.id,
                        position = nextPosition
                    )
                )
            }
            
            Result.success(presignedData.url.substringBefore("?")) // Basic URL without query params
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getProfilePhotos(): Result<List<MediaItem>> = withContext(Dispatchers.IO) {
        try {
            val user = auth.currentUserOrNull() ?: return@withContext Result.failure(Exception("Not authenticated"))
            
            // Query photos table joined with media to get s3_key for URL construction
            val photos = postgrest["photos"].select(
                columns = io.github.jan.supabase.postgrest.query.Columns.raw("id, media_id, position, media(id, s3_key, kind, moderation_status)")
            ) {
                filter { eq("user_id", user.id) }
                order("position", io.github.jan.supabase.postgrest.query.Order.ASCENDING)
            }.decodeList<PhotoWithMediaDto>()
            
            val mediaItems = photos.mapNotNull { photo ->
                val media = photo.media ?: return@mapNotNull null
                MediaItem(
                    id = photo.id,
                    s3Key = media.s3_key,
                    url = buildPublicUrl(media.s3_key),
                    position = photo.position
                )
            }
            
            Result.success(mediaItems)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun reorderPhotos(photoIds: List<String>): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val user = auth.currentUserOrNull() ?: return@withContext Result.failure(Exception("Not authenticated"))
            
            photoIds.forEachIndexed { index, photoId ->
                postgrest["photos"].update({
                    set("position", index + 1)
                }) {
                    filter {
                        eq("id", photoId)
                        eq("user_id", user.id)
                    }
                }
            }
            
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun deletePhoto(mediaId: String): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val user = auth.currentUserOrNull() ?: return@withContext Result.failure(Exception("Not authenticated"))
            
            // Delete from photos table (cascade will not handle this since we're
            // deleting the photo row, not the media row — but the photos FK
            // on media_id has ON DELETE CASCADE, so deleting media will cascade).
            // We delete from photos first, then media.
            postgrest["photos"].delete {
                filter {
                    eq("id", mediaId)
                    eq("user_id", user.id)
                }
            }
            
            // Note: The mediaId here is actually the photos.id, not media.id.
            // For now, media rows stay (orphaned media can be cleaned up by a purge job).
            // A more complete implementation would look up the media_id from photos first.
            
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    /**
     * Constructs the public URL for an S3 object.
     * In production this would use a CloudFront CDN URL.
     * For now, constructs a direct S3 URL using the bucket name.
     */
    private fun buildPublicUrl(s3Key: String): String {
        // TODO: Replace with CloudFront CDN URL when available
        // For now, use the presigned URL pattern or a direct S3 public URL
        // The bucket may not be publicly readable, so we construct a URL that
        // the app can display. In development, this may need to be a signed URL.
        return "https://s3.amazonaws.com/align-media/$s3Key"
    }

    private fun scaleBitmap(bitmap: Bitmap, maxDimension: Int): Bitmap {
        val width = bitmap.width
        val height = bitmap.height
        if (width <= maxDimension && height <= maxDimension) return bitmap

        val ratio = width.toFloat() / height.toFloat()
        val finalWidth: Int
        val finalHeight: Int
        if (ratio > 1) {
            finalWidth = maxDimension
            finalHeight = (maxDimension / ratio).toInt()
        } else {
            finalHeight = maxDimension
            finalWidth = (maxDimension * ratio).toInt()
        }
        return Bitmap.createScaledBitmap(bitmap, finalWidth, finalHeight, true)
    }
}
