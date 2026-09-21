package com.align.app.data.discover

import com.align.app.domain.discover.DiscoverRepository
import com.align.app.domain.discover.DiscoverySettings
import com.align.app.domain.discover.DiscoverySettingsUpdate
import com.align.app.domain.discover.FeedCollege
import com.align.app.domain.discover.FeedProfile
import com.align.app.domain.media.MediaItem
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.postgrest.Postgrest
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonObject
import javax.inject.Inject

@Serializable
data class FeedProfileDto(
    val id: String,
    val first_name: String,
    val bio: String? = null,
    val age: Int,
    val distance_km: Double,
    val height_cm: Int? = null,
    val is_blue_tick: Boolean,
    val occupation: String? = null,
    val employer: String? = null,
    val school: String? = null,
    val college: FeedCollegeDto? = null,
    val photos: List<FeedPhotoDto> = emptyList()
)

@Serializable
data class FeedCollegeDto(
    val college_name: String,
    val course: String? = null,
    val study_year: Int? = null,
    val verified: Boolean
)

@Serializable
data class FeedPhotoDto(
    val media_id: String,
    val s3_key: String,
    val position: Int,
    val width: Int,
    val height: Int,
    val blurhash: String? = null
)

class DiscoverRepositoryImpl @Inject constructor(
    private val postgrest: Postgrest,
    private val auth: Auth
) : DiscoverRepository {

    override suspend fun getFeed(mode: String, scope: String?, cursor: String?, limit: Int): Result<List<FeedProfile>> = withContext(Dispatchers.IO) {
        try {
            val user = auth.currentUserOrNull() ?: return@withContext Result.failure(Exception("Not authenticated"))
            
            val params = buildJsonObject {
                put("p_mode", JsonPrimitive(mode))
                if (scope != null) put("p_scope", JsonPrimitive(scope))
                if (cursor != null) put("p_cursor", JsonPrimitive(cursor))
                put("p_limit", JsonPrimitive(limit))
            }
            
            val dtos = postgrest.rpc("get_feed", params).decodeList<FeedProfileDto>()
            
            val domainModels = dtos.map { dto ->
                FeedProfile(
                    id = dto.id,
                    firstName = dto.first_name,
                    bio = dto.bio,
                    age = dto.age,
                    distanceKm = dto.distance_km,
                    heightCm = dto.height_cm,
                    isBlueTick = dto.is_blue_tick,
                    occupation = dto.occupation,
                    employer = dto.employer,
                    school = dto.school,
                    college = dto.college?.let { 
                        FeedCollege(
                            collegeName = it.college_name,
                            course = it.course,
                            studyYear = it.study_year,
                            verified = it.verified
                        ) 
                    },
                    photos = dto.photos.map { p ->
                        MediaItem(
                            id = p.media_id,
                            s3Key = p.s3_key,
                            position = p.position,
                            // Convert s3Key to a public URL here if needed, or UI can construct it
                            url = "" // Real URL needs prefix, UI coil fetcher can handle s3Key
                        )
                    }
                )
            }
            Result.success(domainModels)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun swipe(targetId: String, isLike: Boolean): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val user = auth.currentUserOrNull() ?: return@withContext Result.failure(Exception("Not authenticated"))
            val direction = if (isLike) "like" else "pass"
            
            val params = buildJsonObject {
                put("p_target_id", JsonPrimitive(targetId))
                put("p_direction", JsonPrimitive(direction))
                put("p_source", JsonPrimitive("discover"))
            }
            
            postgrest.rpc("swipe", params)
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getDiscoverySettings(): Result<DiscoverySettings> = withContext(Dispatchers.IO) {
        try {
            val user = auth.currentUserOrNull() ?: return@withContext Result.failure(Exception("Not authenticated"))
            val dto = postgrest["discovery_settings"].select {
                filter { eq("user_id", user.id) }
                single()
            }.decodeAs<DiscoverySettingsDto>()
            Result.success(
                DiscoverySettings(
                    mode = dto.mode,
                    radiusKm = dto.radius_km,
                    minAge = dto.min_age,
                    maxAge = dto.max_age,
                    showGenders = dto.show_genders ?: emptyList(),
                    verifiedOnly = dto.verified_only,
                    collegeScope = dto.college_scope,
                    showMe = dto.show_me
                )
            )
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun updateDiscoverySettings(settings: DiscoverySettingsUpdate): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val user = auth.currentUserOrNull() ?: return@withContext Result.failure(Exception("Not authenticated"))
            postgrest["discovery_settings"].update(
                DiscoverySettingsUpdateDto(
                    mode = settings.mode,
                    radius_km = settings.radiusKm,
                    min_age = settings.minAge,
                    max_age = settings.maxAge,
                    show_genders = settings.showGenders,
                    verified_only = settings.verifiedOnly,
                    college_scope = settings.collegeScope,
                    show_me = settings.showMe
                )
            ) {
                filter { eq("user_id", user.id) }
            }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

@Serializable
data class DiscoverySettingsDto(
    val mode: String,
    val radius_km: Int,
    val min_age: Int,
    val max_age: Int,
    val show_genders: List<Int>? = null,
    val verified_only: Boolean,
    val college_scope: String,
    val show_me: Boolean
)

@Serializable
data class DiscoverySettingsUpdateDto(
    val mode: String? = null,
    val radius_km: Int? = null,
    val min_age: Int? = null,
    val max_age: Int? = null,
    val show_genders: List<Int>? = null,
    val verified_only: Boolean? = null,
    val college_scope: String? = null,
    val show_me: Boolean? = null
)