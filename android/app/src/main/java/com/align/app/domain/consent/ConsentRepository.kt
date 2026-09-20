package com.align.app.domain.consent

/**
 * Repository interface for managing user consents.
 */
interface ConsentRepository {
    
    /**
     * Records the user's acceptance of the required consents (Terms, Privacy, Location).
     * This writes directly to the Supabase `consents` table.
     */
    suspend fun saveConsents(
        termsAccepted: Boolean,
        privacyAccepted: Boolean,
        locationAccepted: Boolean
    ): Result<Unit>
    
    /**
     * Checks if the user has already accepted all required consents locally.
     */
    suspend fun hasAcceptedAllConsents(): Boolean
    
    /**
     * Marks consents as accepted locally to bypass the consent screen on subsequent launches.
     */
    suspend fun setLocalConsentCompleted(completed: Boolean)
}
