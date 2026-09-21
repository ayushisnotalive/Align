package com.align.app.ui.discover

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.align.app.domain.discover.DiscoverRepository
import com.align.app.domain.discover.FeedProfile
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class DiscoverUiState(
    val isLoading: Boolean = true,
    val isCollegeMode: Boolean = false,
    val profiles: List<FeedProfile> = emptyList(),
    val error: String? = null,
    val hasMore: Boolean = true,
    val unverifiedCollege: Boolean = false // Set if server rejects college mode due to no verified college
)

@HiltViewModel
class DiscoverViewModel @Inject constructor(
    private val discoverRepository: DiscoverRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(DiscoverUiState())
    val uiState: StateFlow<DiscoverUiState> = _uiState.asStateFlow()

    private var cursor: String? = null
    private var isFetching = false

    fun loadFeed(mode: String = "discover", scope: String? = null) {
        if (isFetching) return
        viewModelScope.launch {
            isFetching = true
            _uiState.update { it.copy(isLoading = true, error = null, isCollegeMode = mode == "college", unverifiedCollege = false) }
            
            val result = discoverRepository.getFeed(mode = mode, scope = scope, limit = 20)
            
            isFetching = false
            if (result.isSuccess) {
                val feed = result.getOrDefault(emptyList())
                cursor = feed.lastOrNull()?.id
                _uiState.update { 
                    it.copy(
                        isLoading = false,
                        profiles = feed,
                        hasMore = feed.size == 20
                    ) 
                }
            } else {
                val errorMsg = result.exceptionOrNull()?.message ?: "Failed to load feed"
                val unverified = errorMsg.contains("you must have a verified college")
                _uiState.update { 
                    it.copy(
                        isLoading = false,
                        error = if (unverified) null else errorMsg,
                        unverifiedCollege = unverified
                    )
                }
            }
        }
    }

    fun loadMore(mode: String = "discover", scope: String? = null) {
        if (isFetching || !_uiState.value.hasMore || cursor == null) return
        
        viewModelScope.launch {
            isFetching = true
            val result = discoverRepository.getFeed(mode = mode, scope = scope, cursor = cursor, limit = 20)
            isFetching = false
            
            if (result.isSuccess) {
                val newFeed = result.getOrDefault(emptyList())
                if (newFeed.isNotEmpty()) {
                    cursor = newFeed.last().id
                    _uiState.update { 
                        it.copy(
                            profiles = it.profiles + newFeed,
                            hasMore = newFeed.size == 20
                        )
                    }
                } else {
                    _uiState.update { it.copy(hasMore = false) }
                }
            }
        }
    }

    fun swipe(profile: FeedProfile, isLike: Boolean) {
        // Optimistically remove from state
        _uiState.update { state ->
            state.copy(profiles = state.profiles.filter { it.id != profile.id })
        }
        
        viewModelScope.launch {
            // Send to backend
            discoverRepository.swipe(profile.id, isLike)
            
            // If running low on profiles, load more
            if (_uiState.value.profiles.size < 5 && _uiState.value.hasMore) {
                val mode = if (_uiState.value.isCollegeMode) "college" else "discover"
                loadMore(mode)
            }
        }
    }
}
