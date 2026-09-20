package com.align.app.data.consent

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import com.align.app.domain.consent.ConsentRepository
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.postgrest
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.serialization.Serializable
import javax.inject.Inject

/**
 * Data model for the `consents` table.
 */
@Serializable
data class ConsentRow(
    val user_id: String, // Or omit if using RLS and a trigger, but Supabase SDK needs it if we insert directly, wait, usually auth.uid() is used in a Postgres function or default column value.
    // Actually, we can just insert without user_id if there's a default, or we can fetch the user ID from Auth.
    val terms_accepted: Boolean,
    val privacy_accepted: Boolean,
    val location_accepted: Boolean
)

@Serializable
data class ConsentInsert(
    val consent_type: String,
    val version: String,
    val ip_address: String? = null // client IP is usually captured on server, but we can pass null
)

class ConsentRepositoryImpl @Inject constructor(
    private val supabaseClient: SupabaseClient,
    private val dataStore: DataStore<Preferences>
) : ConsentRepository {

    private val CONSENTS_COMPLETED = booleanPreferencesKey("consents_completed")

    override suspend fun saveConsents(
        termsAccepted: Boolean,
        privacyAccepted: Boolean,
        locationAccepted: Boolean
    ): Result<Unit> = runCatching {
        // Phase 2 requires writing to `consents` table.
        // We insert rows for each consent type.
        val consents = mutableListOf<ConsentInsert>()
        
        if (termsAccepted) consents.add(ConsentInsert("terms", "v1"))
        if (privacyAccepted) consents.add(ConsentInsert("privacy", "v1"))
        if (locationAccepted) consents.add(ConsentInsert("location", "v1"))
        
        if (consents.isNotEmpty()) {
            supabaseClient.postgrest["consents"].insert(consents)
        }
        
        setLocalConsentCompleted(true)
    }

    override suspend fun hasAcceptedAllConsents(): Boolean {
        return dataStore.data.map { prefs ->
            prefs[CONSENTS_COMPLETED] ?: false
        }.first()
    }

    override suspend fun setLocalConsentCompleted(completed: Boolean) {
        dataStore.edit { prefs ->
            prefs[CONSENTS_COMPLETED] = completed
        }
    }
}
