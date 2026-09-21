package com.align.app.ui.discover

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.align.app.domain.discover.FeedProfile
import com.align.app.ui.components.SwipeCardStack
import com.align.app.ui.components.SwipeDirection

@Composable
fun DiscoverScreen(
    viewModel: DiscoverViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        // Initial load
        if (uiState.profiles.isEmpty() && !uiState.isLoading && uiState.error == null) {
            viewModel.loadFeed(mode = "discover")
        }
    }

    Scaffold { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(MaterialTheme.colorScheme.background),
            contentAlignment = Alignment.Center
        ) {
            when {
                uiState.isLoading && uiState.profiles.isEmpty() -> {
                    CircularProgressIndicator()
                }
                uiState.error != null -> {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Error: ${uiState.error}", color = MaterialTheme.colorScheme.error)
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(onClick = { viewModel.loadFeed(mode = "discover") }) {
                            Text("Retry")
                        }
                    }
                }
                else -> {
                    SwipeCardStack(
                        items = uiState.profiles,
                        onSwipe = { profile, direction ->
                            val isLike = direction == SwipeDirection.Right || direction == SwipeDirection.Up
                            viewModel.swipe(profile, isLike)
                        },
                        onEmptyStack = {
                            Text("No more profiles to show right now.", style = MaterialTheme.typography.bodyLarge)
                        }
                    ) { profile ->
                        ProfileCard(profile)
                    }
                }
            }
        }
    }
}

@Composable
fun ProfileCard(profile: FeedProfile) {
    Card(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            // Main photo
            val firstPhotoUrl = profile.photos.firstOrNull()?.url // S3 URL fetching logic handled via Coil interceptor ideally
            if (firstPhotoUrl != null) {
                AsyncImage(
                    model = firstPhotoUrl,
                    contentDescription = "Profile photo",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            } else {
                Box(modifier = Modifier.fillMaxSize().background(Color.LightGray))
            }

            // Info overlay
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.BottomStart)
                    .background(Color.Black.copy(alpha = 0.5f))
                    .padding(16.dp)
            ) {
                Column {
                    Row(verticalAlignment = Alignment.Bottom) {
                        Text(
                            text = "${profile.firstName}, ${profile.age}",
                            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
                            color = Color.White
                        )
                        if (profile.isBlueTick) {
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("✓", color = MaterialTheme.colorScheme.primary)
                        }
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    if (!profile.occupation.isNullOrBlank()) {
                        Text(text = profile.occupation, color = Color.White, style = MaterialTheme.typography.bodyMedium)
                    }
                    if (profile.distanceKm >= 0) {
                        Text(text = "${profile.distanceKm} km away", color = Color.White.copy(alpha = 0.8f), style = MaterialTheme.typography.bodySmall)
                    }
                    
                    if (profile.college != null) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Box(modifier = Modifier.clip(RoundedCornerShape(4.dp)).background(MaterialTheme.colorScheme.primaryContainer).padding(horizontal = 8.dp, vertical = 4.dp)) {
                            Text("🎓 ${profile.college.collegeName}", color = MaterialTheme.colorScheme.onPrimaryContainer, style = MaterialTheme.typography.labelMedium)
                        }
                    }
                }
            }
        }
    }
}
