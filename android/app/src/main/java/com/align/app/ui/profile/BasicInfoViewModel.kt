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

data class BasicInfoUiState(
    val isLoading: Boolean = true,
    val isSaving: Boolean = false,
    val error: String? = null,
    val genders: List<LookupValue> = emptyList(),
    val pronouns: List<LookupValue> = emptyList(),
    val orientations: List<LookupValue> = emptyList()
)

@HiltViewModel
class BasicInfoViewModel @Inject constructor(
    private val profileRepository: ProfileRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(BasicInfoUiState())
    val uiState: StateFlow<BasicInfoUiState> = _uiState.asStateFlow()

    init {
        loadOptions()
    }

    private fun loadOptions() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            
            val genderResult = profileRepository.getLookupValues("gender")
            val pronounResult = profileRepository.getLookupValues("pronoun")
            val orientationResult = profileRepository.getLookupValues("orientation")
            
            if (genderResult.isSuccess && pronounResult.isSuccess && orientationResult.isSuccess) {
                _uiState.update { 
                    it.copy(
                        isLoading = false,
                        genders = genderResult.getOrDefault(emptyList()),
                        pronouns = pronounResult.getOrDefault(emptyList()),
                        orientations = orientationResult.getOrDefault(emptyList())
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

    fun saveBasicInfo(
        firstName: String,
        lastName: String,
        email: String,
        dob: String,
        genderId: Int,
        pronounId: Int?,
        orientationId: Int,
        onComplete: (Boolean) -> Unit
    ) {
        viewModelScope.launch {
            _uiState.update { it.copy(isSaving = true, error = null) }
            val result = profileRepository.updateBasicInfo(firstName, lastName, email, dob, genderId, pronounId, orientationId)
            
            if (result.isSuccess) {
                val stepResult = profileRepository.updateOnboardingStep(1)
                _uiState.update { it.copy(isSaving = false) }
                onComplete(stepResult.isSuccess)
            } else {
                _uiState.update { it.copy(isSaving = false, error = result.exceptionOrNull()?.message ?: "Failed to save") }
                onComplete(false)
            }
        }
    }
}
