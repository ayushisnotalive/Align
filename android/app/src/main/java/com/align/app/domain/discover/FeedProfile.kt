package com.align.app.domain.discover

import com.align.app.domain.media.MediaItem

data class FeedProfile(
    val id: String,
    val firstName: String,
    val bio: String?,
    val age: Int,
    val distanceKm: Double,
    val heightCm: Int?,
    val isBlueTick: Boolean,
    val occupation: String?,
    val employer: String?,
    val school: String?,
    val college: FeedCollege?,
    val photos: List<MediaItem>
)

data class FeedCollege(
    val collegeName: String,
    val course: String?,
    val studyYear: Int?,
    val verified: Boolean
)
