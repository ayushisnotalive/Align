package com.align.app.data.auth

import com.align.app.domain.auth.AuthRepository
import com.align.app.domain.auth.AuthState
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.auth.OtpType
import io.github.jan.supabase.auth.providers.builtin.OTP
import io.github.jan.supabase.auth.status.SessionSource
import io.github.jan.supabase.auth.status.SessionStatus
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Supabase implementation of [AuthRepository].
 *
 * Security (AGENTS.md §3):
 * - Phone numbers and OTPs are NEVER logged.
 * - Session tokens are managed by supabase-kt internally.
 * - We layer EncryptedSharedPreferences via the Supabase SDK's built-in
 *   session management which stores tokens securely.
 * - allowBackup=false in the manifest prevents backup of session data.
 */
@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val auth: Auth,
) : AuthRepository {

    private val _authState = MutableStateFlow<AuthState>(AuthState.Loading)
    override val authState: Flow<AuthState> = _authState.asStateFlow()

    override suspend fun sendOtp(email: String, phone: String): Result<String> = runCatching {
        auth.signInWith(OTP) {
            this.email = email
            this.data = kotlinx.serialization.json.buildJsonObject {
                put("phone", kotlinx.serialization.json.JsonPrimitive(phone))
            }
        }
        _authState.value = AuthState.OtpSent(email)
        email
    }

    override suspend fun verifyOtp(email: String, code: String): Result<Unit> = runCatching {
        auth.verifyEmailOtp(
            type = OtpType.Email.MAGIC_LINK,
            email = email,
            token = code,
        )
        // Session is automatically set by supabase-kt after successful verification.
        val user = auth.currentUserOrNull()
        if (user != null) {
            _authState.value = AuthState.Authenticated(user.id)
        }
    }

    override suspend fun signOut(): Result<Unit> = runCatching {
        auth.signOut()
        _authState.value = AuthState.NotAuthenticated
    }

    override suspend fun restoreSession() {
        // Collect the session status from Supabase SDK.
        // supabase-kt automatically tries to restore from storage on init.
        auth.sessionStatus.collect { status ->
            when (status) {
                is SessionStatus.Authenticated -> {
                    _authState.value = AuthState.Authenticated(status.session.user?.id ?: "")
                }
                is SessionStatus.NotAuthenticated -> {
                    if (status.isSignOut || _authState.value is AuthState.Loading) {
                        _authState.value = AuthState.NotAuthenticated
                    }
                }
                else -> {
                    // Ignore Initializing, RefreshFailure, etc.
                }
            }
        }
    }
}
