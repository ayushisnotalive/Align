package com.align.app.ui.profile

import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.align.app.domain.media.MediaItem
import com.align.app.domain.media.MediaRepository
import com.align.app.domain.profile.College
import com.align.app.domain.profile.Profile
import com.align.app.domain.profile.ProfileRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ProfileUiState(
    val isLoading: Boolean = true,
    val isUploading: Boolean = false,
    val profile: Profile? = null,
    val photos: List<MediaItem> = emptyList(),
    val colleges: List<College> = emptyList(),
    val error: String? = null
)

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val profileRepository: ProfileRepository,
    private val mediaRepository: MediaRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ProfileUiState())
    val uiState: StateFlow<ProfileUiState> = _uiState.asStateFlow()

    init {
        loadProfileData()
    }

    private fun loadProfileData() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            
            val profileResult = profileRepository.getProfile()
            val photosResult = mediaRepository.getProfilePhotos()
            
            if (profileResult.isSuccess && photosResult.isSuccess) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        profile = profileResult.getOrNull(),
                        photos = photosResult.getOrDefault(emptyList())
                    )
                }
            } else {
                _uiState.update { 
                    it.copy(
                        isLoading = false, 
                        error = profileResult.exceptionOrNull()?.message ?: photosResult.exceptionOrNull()?.message ?: "Failed to load profile"
                    ) 
                }
            }
        }
    }

    fun searchColleges(query: String) {
        viewModelScope.launch {
            val result = profileRepository.searchColleges(query)
            if (result.isSuccess) {
                _uiState.update { it.copy(colleges = result.getOrDefault(emptyList())) }
            }
        }
    }

    fun uploadPhoto(uri: Uri, kind: String = "profile_photo", onComplete: ((String?) -> Unit)? = null) {
        viewModelScope.launch {
            _uiState.update { it.copy(isUploading = true, error = null) }
            
            // Optimistic update: show the local image immediately using the content:// URI
            val optimisticId = "local_${System.currentTimeMillis()}"
            val currentPhotos = _uiState.value.photos
            val optimisticPhoto = com.align.app.domain.media.MediaItem(
                id = optimisticId,
                s3Key = "",
                url = uri.toString(),
                position = currentPhotos.size + 1
            )
            _uiState.update { it.copy(photos = it.photos + optimisticPhoto) }
            
            val result = mediaRepository.uploadImage(uri, kind)
            _uiState.update { it.copy(isUploading = false) }
            
            if (result.isSuccess) {
                // Reload photos from server to get the real data
                val photosResult = mediaRepository.getProfilePhotos()
                if (photosResult.isSuccess) {
                    _uiState.update { it.copy(photos = photosResult.getOrDefault(emptyList())) }
                }
                onComplete?.invoke(result.getOrNull())
            } else {
                // Remove optimistic entry on failure
                _uiState.update { 
                    it.copy(
                        photos = it.photos.filter { p -> p.id != optimisticId },
                        error = result.exceptionOrNull()?.message ?: "Failed to upload photo"
                    )
                }
                onComplete?.invoke(null)
            }
        }
    }
    
    fun deletePhoto(mediaId: String) {
        viewModelScope.launch {
            mediaRepository.deletePhoto(mediaId)
            // Reload photos
            val photosResult = mediaRepository.getProfilePhotos()
            if (photosResult.isSuccess) {
                _uiState.update { it.copy(photos = photosResult.getOrDefault(emptyList())) }
            }
        }
    }
    
    fun submitCollegeVerification(collegeId: Int, mediaId: String, onComplete: (Boolean) -> Unit) {
        viewModelScope.launch {
            _uiState.update { it.copy(isUploading = true) }
            val result = profileRepository.submitCollegeVerification(collegeId, mediaId)
            _uiState.update { it.copy(isUploading = false) }
            onComplete(result.isSuccess)
        }
    }
    
    fun clearError() {
        _uiState.update { it.copy(error = null) }
    }
    
    fun updateOnboardingStep(step: Int, onComplete: () -> Unit) {
        viewModelScope.launch {
            val result = profileRepository.updateOnboardingStep(step)
            if (result.isSuccess) {
                onComplete()
            } else {
                _uiState.update { it.copy(error = "Failed to update progress") }
            }
        }
    }
}
