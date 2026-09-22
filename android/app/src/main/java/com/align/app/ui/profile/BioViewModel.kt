package com.align.app.ui.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.align.app.domain.profile.ProfileRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class BioUiState(
    val isSaving: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class BioViewModel @Inject constructor(
    private val profileRepository: ProfileRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(BioUiState())
    val uiState: StateFlow<BioUiState> = _uiState.asStateFlow()

    fun saveBio(
        bio: String,
        onComplete: (Boolean) -> Unit
    ) {
        viewModelScope.launch {
            _uiState.update { it.copy(isSaving = true, error = null) }
            val result = profileRepository.updateBio(bio)
            
            if (result.isSuccess) {
                // Bio is the last step before photos in this flow, update onboarding step to 2
                val stepResult = profileRepository.updateOnboardingStep(2)
                _uiState.update { it.copy(isSaving = false) }
                onComplete(stepResult.isSuccess)
            } else {
                _uiState.update { 
                    it.copy(isSaving = false, error = result.exceptionOrNull()?.message ?: "Unknown error")
                }
                onComplete(false)
            }
        }
    }
}
