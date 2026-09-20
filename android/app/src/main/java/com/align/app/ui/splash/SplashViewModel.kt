package com.align.app.ui.splash

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.align.app.domain.auth.AuthRepository
import com.align.app.domain.auth.AuthState
import com.align.app.domain.consent.ConsentRepository
import com.align.app.domain.location.LocationRepository
import com.align.app.ui.Routes
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SplashViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val consentRepository: ConsentRepository,
    private val locationRepository: LocationRepository
) : ViewModel() {

    private val _startDestination = MutableStateFlow<String?>(null)
    val startDestination: StateFlow<String?> = _startDestination.asStateFlow()

    init {
        determineStartDestination()
    }

    private fun determineStartDestination() {
        viewModelScope.launch {
            // 1. Check Auth state
            val authState = authRepository.authState.first()
            if (authState !is AuthState.Authenticated) {
                _startDestination.value = Routes.LOGIN
                return@launch
            }

            // 2. Check Consents
            val hasConsented = consentRepository.hasAcceptedAllConsents()
            if (!hasConsented) {
                _startDestination.value = Routes.CONSENT
                return@launch
            }

            // 3. Check Location Permission
            val hasLocation = locationRepository.hasLocationPermission.first()
            if (!hasLocation) {
                _startDestination.value = Routes.LOCATION_GATE
                return@launch
            }

            // 4. (Later in Phase 3) Check Onboarding status
            // For now, go straight to home/Discover
            _startDestination.value = Routes.DISCOVER
        }
    }
}
