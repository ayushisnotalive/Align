package com.align.app.data.location

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.longPreferencesKey
import com.align.app.domain.location.LocationRepository
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.CancellationTokenSource
import dagger.hilt.android.qualifiers.ApplicationContext
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.postgrest.rpc
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.serialization.Serializable
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

/**
 * Location repository implementation.
 *
 * Security (AGENTS.md §DATABASE RULES):
 * - Raw GPS is sent to set_location() on the server, which rounds to ~1 km.
 * - The client only stores the timestamp of the last update, never coordinates.
 * - Location is fetched via FusedLocationProvider (coarse sufficient for our use).
 */
@Singleton
class LocationRepositoryImpl @Inject constructor(
    @ApplicationContext private val context: Context,
    private val fusedClient: FusedLocationProviderClient,
    private val postgrest: Postgrest,
    private val dataStore: DataStore<Preferences>,
) : LocationRepository {

    companion object {
        private val LAST_LOCATION_UPDATE = longPreferencesKey("last_location_update_ms")
        private const val TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000L
    }

    private val _hasPermission = MutableStateFlow(checkPermission())
    override val hasLocationPermission: Flow<Boolean> = _hasPermission.asStateFlow()

    fun refreshPermissionState() {
        _hasPermission.value = checkPermission()
    }

    private fun checkPermission(): Boolean {
        return ContextCompat.checkSelfPermission(
            context, Manifest.permission.ACCESS_COARSE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED
    }

    @Serializable
    private data class SetLocationParams(
        val p_lat: Double,
        val p_lng: Double,
        val p_perm_state: String,
    )

    override suspend fun updateLocation(): Result<Unit> = runCatching {
        if (!checkPermission()) {
            throw SecurityException("Location permission not granted")
        }

        val location = getCurrentLocation()

        // Call set_location() RPC — the server rounds to ~1 km
        postgrest.rpc(
            "set_location",
            SetLocationParams(
                p_lat = location.first,
                p_lng = location.second,
                p_perm_state = "granted",
            )
        )

        // Persist the timestamp (but never the coordinates)
        dataStore.edit { prefs ->
            prefs[LAST_LOCATION_UPDATE] = System.currentTimeMillis()
        }

        _hasPermission.value = true
    }

    override suspend fun isLocationFresh(): Boolean {
        var lastUpdate = 0L
        dataStore.data.collect { prefs ->
            lastUpdate = prefs[LAST_LOCATION_UPDATE] ?: 0L
            return@collect
        }
        return (System.currentTimeMillis() - lastUpdate) < TWENTY_FOUR_HOURS_MS
    }

    @Suppress("MissingPermission") // Permission is checked before calling this
    private suspend fun getCurrentLocation(): Pair<Double, Double> =
        suspendCancellableCoroutine { cont ->
            val cts = CancellationTokenSource()
            fusedClient.getCurrentLocation(Priority.PRIORITY_BALANCED_POWER_ACCURACY, cts.token)
                .addOnSuccessListener { location ->
                    if (location != null) {
                        cont.resume(Pair(location.latitude, location.longitude))
                    } else {
                        cont.resumeWithException(Exception("Could not get location"))
                    }
                }
                .addOnFailureListener { e ->
                    cont.resumeWithException(e)
                }
            cont.invokeOnCancellation { cts.cancel() }
        }
}
