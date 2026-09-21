package com.align.app.ui.discover

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.align.app.domain.discover.DiscoverRepository
import com.align.app.domain.discover.DiscoverySettings
import com.align.app.domain.discover.DiscoverySettingsUpdate
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class DiscoverySettingsUiState(
    val isLoading: Boolean = true,
    val isSaving: Boolean = false,
    val settings: DiscoverySettings? = null,
    val error: String? = null
)

@HiltViewModel
class DiscoverySettingsViewModel @Inject constructor(
    private val discoverRepository: DiscoverRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(DiscoverySettingsUiState())
    val uiState: StateFlow<DiscoverySettingsUiState> = _uiState.asStateFlow()

    init {
        loadSettings()
    }

    private fun loadSettings() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            val result = discoverRepository.getDiscoverySettings()
            if (result.isSuccess) {
                _uiState.update { it.copy(isLoading = false, settings = result.getOrNull()) }
            } else {
                _uiState.update { it.copy(isLoading = false, error = result.exceptionOrNull()?.message ?: "Failed to load settings") }
            }
        }
    }

    fun updateSettings(update: DiscoverySettingsUpdate) {
        viewModelScope.launch {
            _uiState.update { it.copy(isSaving = true, error = null) }
            
            // Optimistically update UI state
            val current = _uiState.value.settings
            if (current != null) {
                _uiState.update { state -> 
                    state.copy(settings = current.copy(
                        mode = update.mode ?: current.mode,
                        radiusKm = update.radiusKm ?: current.radiusKm,
                        minAge = update.minAge ?: current.minAge,
                        maxAge = update.maxAge ?: current.maxAge,
                        showGenders = update.showGenders ?: current.showGenders,
                        verifiedOnly = update.verifiedOnly ?: current.verifiedOnly,
                        collegeScope = update.collegeScope ?: current.collegeScope,
                        showMe = update.showMe ?: current.showMe
                    )) 
                }
            }
            
            val result = discoverRepository.updateDiscoverySettings(update)
            _uiState.update { it.copy(isSaving = false) }
            
            if (result.isFailure) {
                // Revert or show error
                _uiState.update { it.copy(error = result.exceptionOrNull()?.message ?: "Failed to save settings") }
                loadSettings() // Reload from server to ensure sync
            }
        }
    }
}
