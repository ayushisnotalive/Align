package com.align.app.ui.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.align.app.domain.auth.AuthRepository
import com.align.app.domain.auth.AuthState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for phone OTP login flow.
 *
 * One StateFlow<UiState> per screen; events as functions;
 * no logic in composables (AGENTS.md §ARCHITECTURE).
 *
 * Security: phone numbers and OTPs are never logged.
 */
@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepo: AuthRepository,
) : ViewModel() {

    /** Auth state observed by splash routing. */
    val authState: StateFlow<AuthState> = authRepo.authState
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), AuthState.Loading)

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            authRepo.restoreSession()
        }
    }

    fun onPhoneChanged(phone: String) {
        _uiState.value = _uiState.value.copy(phone = phone, error = null)
    }

    fun onOtpChanged(otp: String) {
        _uiState.value = _uiState.value.copy(otp = otp, error = null)
    }

    fun sendOtp() {
        val phone = _uiState.value.phone.trim()
        if (phone.length < 10) {
            _uiState.value = _uiState.value.copy(error = "Enter a valid 10-digit phone number")
            return
        }

        val formattedPhone = if (phone.startsWith("+")) phone else "+91$phone"

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            authRepo.sendOtp(formattedPhone)
                .onSuccess {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        otpSent = true,
                        formattedPhone = formattedPhone,
                        resendTimerSeconds = 30,
                    )
                    startResendTimer()
                }
                .onFailure { e ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = "Failed to send OTP. Please try again.",
                    )
                }
        }
    }

    fun verifyOtp() {
        val otp = _uiState.value.otp.trim()
        val phone = _uiState.value.formattedPhone

        if (otp.length != 6) {
            _uiState.value = _uiState.value.copy(error = "Enter the 6-digit code")
            return
        }

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            authRepo.verifyOtp(phone, otp)
                .onSuccess {
                    _uiState.value = _uiState.value.copy(isLoading = false)
                }
                .onFailure {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = "Invalid code. Please try again.",
                    )
                }
        }
    }

    fun resendOtp() {
        if (_uiState.value.resendTimerSeconds > 0) return
        sendOtp()
    }

    fun goBackToPhone() {
        _uiState.value = _uiState.value.copy(
            otpSent = false, otp = "", error = null, resendTimerSeconds = 0,
        )
    }

    private fun startResendTimer() {
        viewModelScope.launch {
            var seconds = 30
            while (seconds > 0) {
                _uiState.value = _uiState.value.copy(resendTimerSeconds = seconds)
                kotlinx.coroutines.delay(1000)
                seconds--
            }
            _uiState.value = _uiState.value.copy(resendTimerSeconds = 0)
        }
    }
}

/**
 * UI state for auth screens. Single source of truth (AGENTS.md §ARCHITECTURE).
 */
data class AuthUiState(
    val phone: String = "",
    val otp: String = "",
    val formattedPhone: String = "",
    val isLoading: Boolean = false,
    val otpSent: Boolean = false,
    val error: String? = null,
    val resendTimerSeconds: Int = 0,
)
