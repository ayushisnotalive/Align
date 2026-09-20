package com.align.app.domain.location

import kotlinx.coroutines.flow.Flow

/**
 * Location repository contract.
 *
 * Security (AGENTS.md §DATABASE RULES):
 * - Location is coarse (~1 km), rounded on the SERVER by set_location().
 * - Raw GPS coordinates are sent to the server but never stored on the client.
 * - The client only persists the permission state and last-update timestamp.
 */
interface LocationRepository {

    /** Whether the app has location permission. */
    val hasLocationPermission: Flow<Boolean>

    /**
     * Get the current device location and call set_location() on the server.
     * @return Result wrapping success or an error.
     */
    suspend fun updateLocation(): Result<Unit>

    /** Check if location was updated within the last 24 hours. */
    suspend fun isLocationFresh(): Boolean
}
