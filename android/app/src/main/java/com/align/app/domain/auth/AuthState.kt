package com.align.app.domain.auth

/**
 * Authentication state observable across the app.
 * Used by splash routing, navigation guards, and session-sensitive screens.
 */
sealed interface AuthState {
    /** No session. Route to login. */
    data object NotAuthenticated : AuthState

    /** OTP was sent; waiting for user to enter it. */
    data class OtpSent(val phone: String) : AuthState

    /** Logged in. [userId] is the Supabase auth.uid(). */
    data class Authenticated(val userId: String) : AuthState

    /** Checking stored session on app start. */
    data object Loading : AuthState
}
