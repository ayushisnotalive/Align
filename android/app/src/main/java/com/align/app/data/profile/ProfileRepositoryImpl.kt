package com.align.app.data.profile

import com.align.app.domain.profile.Profile
import com.align.app.domain.profile.ProfileRepository
import com.align.app.domain.profile.UserAttribute
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.auth.Auth
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import javax.inject.Inject

@Serializable
data class ProfileUpdateDto(
    val hometown_city_id: Int?,
    val places: List<Int>
)

@Serializable
data class AttributeRow(
    val user_id: String,
    val attribute_id: Int,
    val option_id: Int,
    val visibility: String
)

class ProfileRepositoryImpl @Inject constructor(
    private val postgrest: Postgrest,
    private val auth: Auth
) : ProfileRepository {

    override suspend fun updatePlaces(hometownCityId: Int?, placeCityIds: List<Int>): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val user = auth.currentUserOrNull() ?: return@withContext Result.failure(Exception("Not authenticated"))
            
            postgrest["profiles"]
                .update(ProfileUpdateDto(hometownCityId, placeCityIds)) {
                    filter { eq("id", user.id) }
                }
            
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun updateAttributes(attributes: List<UserAttribute>): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val user = auth.currentUserOrNull() ?: return@withContext Result.failure(Exception("Not authenticated"))
            
            val rows = attributes.map { 
                AttributeRow(
                    user_id = user.id,
                    attribute_id = it.attributeId,
                    option_id = it.optionId,
                    visibility = it.visibility
                ) 
            }
            
            postgrest["user_attributes"].upsert(rows)
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun submitCollegeVerification(collegeId: Int, mediaId: String): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val user = auth.currentUserOrNull() ?: return@withContext Result.failure(Exception("Not authenticated"))
            // Usually this would call an RPC like submit_college_verification(college_id, media_id)
            postgrest.rpc("submit_college_verification", mapOf("p_college_id" to collegeId, "p_media_id" to mediaId))
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getProfile(): Result<Profile> = withContext(Dispatchers.IO) {
        // Dummy implementation for now
        Result.success(Profile(id = "", firstName = "", bio = ""))
    }
}
