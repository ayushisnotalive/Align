package com.align.app.ui.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.align.app.domain.profile.LookupValue
import com.align.app.domain.profile.ProfileRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class WorkAndEducationUiState(
    val educationLevels: List<LookupValue> = emptyList(),
    val isLoading: Boolean = true,
    val isSaving: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class WorkAndEducationViewModel @Inject constructor(
    private val profileRepository: ProfileRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(WorkAndEducationUiState())
    val uiState: StateFlow<WorkAndEducationUiState> = _uiState.asStateFlow()

    init {
        loadLookupValues()
    }

    private fun loadLookupValues() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            
            val educationResult = profileRepository.getLookupValues("education")

            if (educationResult.isSuccess) {
                _uiState.update {
                    it.copy(
                        educationLevels = educationResult.getOrDefault(emptyList()),
                        isLoading = false
                    )
                }
            } else {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        error = "Failed to load options"
                    )
                }
            }
        }
    }

    fun saveWorkAndEducation(
        occupation: String,
        employer: String,
        school: String,
        educationId: Int?,
        onComplete: (Boolean) -> Unit
    ) {
        viewModelScope.launch {
            _uiState.update { it.copy(isSaving = true, error = null) }
            val result = profileRepository.updateWorkAndEducation(occupation, employer, school, educationId)
            
            if (result.isSuccess) {
                // Not updating onboarding step yet, will do it after Bio
                _uiState.update { it.copy(isSaving = false) }
                onComplete(true)
            } else {
                _uiState.update { 
                    it.copy(isSaving = false, error = result.exceptionOrNull()?.message ?: "Unknown error")
                }
                onComplete(false)
            }
        }
    }
}
