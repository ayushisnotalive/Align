package com.align.app.domain.discover

interface DiscoverRepository {
    suspend fun getFeed(mode: String, scope: String? = null, cursor: String? = null, limit: Int = 20): Result<List<FeedProfile>>
    suspend fun swipe(targetId: String, isLike: Boolean): Result<Unit>
    suspend fun getDiscoverySettings(): Result<DiscoverySettings>
    suspend fun updateDiscoverySettings(settings: DiscoverySettingsUpdate): Result<Unit>
}

data class DiscoverySettings(
    val mode: String,
    val radiusKm: Int,
    val minAge: Int,
    val maxAge: Int,
    val showGenders: List<Int>,
    val verifiedOnly: Boolean,
    val collegeScope: String,
    val showMe: Boolean
)

data class DiscoverySettingsUpdate(
    val mode: String? = null,
    val radiusKm: Int? = null,
    val minAge: Int? = null,
    val maxAge: Int? = null,
    val showGenders: List<Int>? = null,
    val verifiedOnly: Boolean? = null,
    val collegeScope: String? = null,
    val showMe: Boolean? = null
)
