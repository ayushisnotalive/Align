package com.align.app.domain.auth

import kotlinx.coroutines.flow.Flow

/**
 * Auth repository contract. The UI layer only sees this interface;
 * the Supabase implementation lives in the data layer (AGENTS.md §ARCHITECTURE).
 *
 * Security (AGENTS.md §3):
 * - Phone numbers and OTPs are NEVER logged or persisted outside Supabase Auth.
 * - Session tokens are stored in EncryptedSharedPreferences (excluded from backup).
 */
interface AuthRepository {

    /** Emits the current auth state. Observed by splash routing. */
    val authState: Flow<AuthState>

    /**
     * Send OTP to [email]. Also collects [phone] to be attached to user metadata.
     * @return Result wrapping the email on success or an error message.
     */
    suspend fun sendOtp(email: String, phone: String): Result<String>

    /**
     * Verify the OTP code for the given email.
     * On success the session is automatically persisted.
     */
    suspend fun verifyOtp(email: String, code: String): Result<Unit>

    /** Sign out and clear stored session. */
    suspend fun signOut(): Result<Unit>

    /** Restore session from encrypted storage on app start. */
    suspend fun restoreSession()
}
