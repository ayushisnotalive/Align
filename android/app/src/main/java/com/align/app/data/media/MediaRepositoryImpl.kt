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
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.ByteArrayOutputStream
import javax.inject.Inject
import kotlin.math.max

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
            
            val response = functions.invoke("presigned-upload") {
                body = presignedRequest
            }
            
            val presignedData = response.data<PresignedResponse>()
            
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
            
            // 4. Insert row into public.media
            // Note: s3_key already contains the prefix based on edge function logic.
            val mediaRow = MediaRow(
                owner_id = user.id,
                kind = kind,
                bucket = "default", // or however you track bucket
                s3_key = presignedData.key,
                mime_type = contentType,
                size_bytes = size,
                width = width,
                height = height
            )
            
            postgrest["media"].insert(mediaRow)
            
            Result.success(presignedData.url.substringBefore("?")) // Basic URL without query params
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getProfilePhotos(): Result<List<MediaItem>> = withContext(Dispatchers.IO) {
        // Implementation for getting photos from the `photos` and `media` tables
        Result.success(emptyList()) // TODO: Query database
    }

    override suspend fun reorderPhotos(photoIds: List<String>): Result<Unit> = withContext(Dispatchers.IO) {
        Result.success(Unit) // TODO: Call DB RPC or upsert
    }

    override suspend fun deletePhoto(mediaId: String): Result<Unit> = withContext(Dispatchers.IO) {
        Result.success(Unit) // TODO: Delete row
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
