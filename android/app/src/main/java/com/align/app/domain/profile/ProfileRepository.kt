package com.align.app.domain.profile

interface ProfileRepository {
    suspend fun updatePlaces(hometownCityId: Int?, placeCityIds: List<Int>): Result<Unit>
    suspend fun updateAttributes(attributes: List<UserAttribute>): Result<Unit>
    suspend fun submitCollegeVerification(collegeId: Int, mediaId: String): Result<Unit>
    
    // Additional fetching methods
    suspend fun getProfile(): Result<Profile>
    suspend fun searchColleges(query: String): Result<List<College>>
    
    // Onboarding methods
    suspend fun getOnboardingStep(): Result<Int>
    suspend fun updateOnboardingStep(step: Int): Result<Unit>
    suspend fun updateBasicInfo(firstName: String, dob: String, genderId: Int, pronounId: Int?, orientationId: Int): Result<Unit>
    suspend fun getLookupValues(listKey: String): Result<List<LookupValue>>
}

data class LookupValue(
    val id: Int,
    val code: String,
    val label: String
)

data class UserAttribute(
    val attributeId: Int,
    val optionId: Int,
    val visibility: String
)

data class Profile(
    val id: String,
    val firstName: String,
    val bio: String?,
    val isComplete: Boolean = false
)

data class College(
    val id: Int,
    val name: String,
    val cityId: Int? = null,
    val stateId: Int? = null
)
