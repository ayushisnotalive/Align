package com.align.app.data.profile

import com.align.app.domain.profile.College
import com.align.app.domain.profile.LookupValue
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
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonObject
import javax.inject.Inject

@Serializable
data class ProfileUpdateDto(
    val hometown_city_id: Int? = null,
    val places: List<Int>? = null,
    val onboarding_step: Int? = null,
    val first_name: String? = null,
    val gender_id: Int? = null,
    val pronoun_id: Int? = null,
    val orientation_id: Int? = null,
    val occupation: String? = null,
    val employer: String? = null,
    val school: String? = null,
    val education_id: Int? = null,
    val bio: String? = null
)

@Serializable
data class ProfilePrivateUpdateDto(
    val dob: String? = null,
    val last_name: String? = null,
    val email: String? = null
)

@Serializable
data class OnboardingStepDto(
    val onboarding_step: Int
)

@Serializable
data class AttributeRow(
    val user_id: String,
    val attribute_id: Int,
    val option_id: Int,
    val visibility: String
)

@Serializable
data class CollegeDto(
    val id: Int,
    val name: String,
    val city_id: Int? = null,
    val state_id: Int? = null
) {
    fun toDomain() = College(id = id, name = name, cityId = city_id, stateId = state_id)
}

class ProfileRepositoryImpl @Inject constructor(
    private val postgrest: Postgrest,
    private val auth: Auth
) : ProfileRepository {

    override suspend fun updatePlaces(hometownCityId: Int?, placeCityIds: List<Int>): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val user = auth.currentUserOrNull() ?: return@withContext Result.failure(Exception("Not authenticated"))
            
            postgrest["profiles"]
                .update(ProfileUpdateDto(hometown_city_id = hometownCityId, places = placeCityIds)) {
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
            val params = buildJsonObject {
                put("p_college_id", JsonPrimitive(collegeId))
                put("p_media_id", kotlinx.serialization.json.JsonPrimitive(mediaId))
            }
            postgrest.rpc("submit_college_verification", params)
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getProfile(): Result<Profile> = withContext(Dispatchers.IO) {
        // Dummy implementation for now
        Result.success(Profile(id = "", firstName = "", bio = ""))
    }
    
    override suspend fun searchColleges(query: String): Result<List<College>> = withContext(Dispatchers.IO) {
        try {
            val dtos = postgrest["colleges"].select {
                if (query.isNotBlank()) {
                    filter { ilike("name", "%$query%") }
                }
                limit(50)
            }.decodeList<CollegeDto>()
            Result.success(dtos.map { it.toDomain() })
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun getOnboardingStep(): Result<Int> = withContext(Dispatchers.IO) {
        try {
            val user = auth.currentUserOrNull() ?: return@withContext Result.failure(Exception("Not authenticated"))
            val dto = postgrest["profiles"].select(columns = Columns.list("onboarding_step")) {
                filter { eq("id", user.id) }
                single()
            }.decodeAs<OnboardingStepDto>()
            Result.success(dto.onboarding_step)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun updateOnboardingStep(step: Int): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val user = auth.currentUserOrNull() ?: return@withContext Result.failure(Exception("Not authenticated"))
            postgrest["profiles"].update(ProfileUpdateDto(onboarding_step = step)) {
                filter { eq("id", user.id) }
            }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun updateBasicInfo(
        firstName: String,
        lastName: String,
        email: String,
        dob: String, 
        genderId: Int, 
        pronounId: Int?, 
        orientationId: Int
    ): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val user = auth.currentUserOrNull() ?: return@withContext Result.failure(Exception("Not authenticated"))
            // Update public.profiles
            postgrest["profiles"].update(ProfileUpdateDto(
                first_name = firstName,
                gender_id = genderId,
                pronoun_id = pronounId,
                orientation_id = orientationId
            )) {
                filter { eq("id", user.id) }
            }
            
            // Update public.profile_private
            postgrest["profile_private"].update(ProfilePrivateUpdateDto(
                dob = dob,
                last_name = lastName,
                email = email
            )) {
                filter { eq("user_id", user.id) } // private table uses user_id
            }
            
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun updateWorkAndEducation(
        occupation: String,
        employer: String,
        school: String,
        educationId: Int?
    ): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val user = auth.currentUserOrNull() ?: return@withContext Result.failure(Exception("Not authenticated"))
            postgrest["profiles"].update(ProfileUpdateDto(
                occupation = occupation.takeIf { it.isNotBlank() },
                employer = employer.takeIf { it.isNotBlank() },
                school = school.takeIf { it.isNotBlank() },
                education_id = educationId
            )) {
                filter { eq("id", user.id) }
            }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun updateBio(bio: String): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val user = auth.currentUserOrNull() ?: return@withContext Result.failure(Exception("Not authenticated"))
            postgrest["profiles"].update(ProfileUpdateDto(
                bio = bio.takeIf { it.isNotBlank() }
            )) {
                filter { eq("id", user.id) }
            }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun getLookupValues(listKey: String): Result<List<LookupValue>> = withContext(Dispatchers.IO) {
        try {
            val dtos = postgrest["lookup_values"].select {
                filter {
                    eq("list_key", listKey)
                    eq("is_active", true)
                }
            }.decodeList<LookupValueDto>()
            Result.success(dtos.map { LookupValue(it.id, it.code, it.label) })
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

@Serializable
data class LookupValueDto(
    val id: Int,
    val code: String,
    val label: String
)
