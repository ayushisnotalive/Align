package com.align.app.ui.consent

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.align.app.domain.consent.ConsentRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ConsentViewModel @Inject constructor(
    private val consentRepository: ConsentRepository
) : ViewModel() {

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    fun submitConsents(
        termsAccepted: Boolean,
        privacyAccepted: Boolean,
        locationAccepted: Boolean,
        onSuccess: () -> Unit
    ) {
        if (!termsAccepted || !privacyAccepted || !locationAccepted) {
            _error.value = "All consents are required."
            return
        }

        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            
            consentRepository.saveConsents(termsAccepted, privacyAccepted, locationAccepted)
                .onSuccess {
                    _isLoading.value = false
                    onSuccess()
                }
                .onFailure {
                    _isLoading.value = false
                    _error.value = it.localizedMessage ?: "Failed to save consents."
                }
        }
    }
}
