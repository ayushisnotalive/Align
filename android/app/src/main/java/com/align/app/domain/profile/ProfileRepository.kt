package com.align.app.domain.profile

interface ProfileRepository {
    suspend fun updatePlaces(hometownCityId: Int?, placeCityIds: List<Int>): Result<Unit>
    suspend fun updateAttributes(attributes: List<UserAttribute>): Result<Unit>
    suspend fun submitCollegeVerification(collegeId: Int, mediaId: String): Result<Unit>
    
    // Additional fetching methods
    suspend fun getProfile(): Result<Profile>
}

data class UserAttribute(
    val attributeId: Int,
    val optionId: Int,
    val visibility: String
)

data class Profile(
    val id: String,
    val firstName: String,
    val bio: String?,
    // other fields omitted for brevity
)
