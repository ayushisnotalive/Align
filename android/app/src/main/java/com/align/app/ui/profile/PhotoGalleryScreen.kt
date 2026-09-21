package com.align.app.ui.profile

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage

@Composable
fun PhotoGalleryScreen(
    modifier: Modifier = Modifier,
    onComplete: (() -> Unit)? = null,
    viewModel: ProfileViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val photos = uiState.photos
    val maxPhotos = 6
    
    // Use PickMultipleVisualMedia with a safe max — always allow picking at least 1
    // The maxItems is set at contract creation time; we cap at maxPhotos and handle
    // overflow in the callback.
    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickMultipleVisualMedia(maxPhotos)
    ) { uris: List<Uri> ->
        if (uris.isNotEmpty()) {
            // Only upload up to the remaining slots
            val slotsAvailable = maxPhotos - photos.size
            uris.take(slotsAvailable.coerceAtLeast(0)).forEach { uri ->
                viewModel.uploadPhoto(uri, kind = "profile_photo")
            }
        }
    }

    Column(modifier = modifier.fillMaxSize().padding(16.dp)) {
        Text(
            text = "Your Photos",
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.onBackground
        )
        Text(
            text = "Add at least 3 photos to continue.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        
        Spacer(modifier = Modifier.height(24.dp))
        
        if (uiState.isUploading) {
            LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
            Spacer(modifier = Modifier.height(16.dp))
        }

        uiState.error?.let {
            Text(text = it, color = MaterialTheme.colorScheme.error)
            Spacer(modifier = Modifier.height(16.dp))
        }

        LazyVerticalGrid(
            columns = GridCells.Fixed(3),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.weight(1f)
        ) {
            items(photos, key = { it.id }) { photo ->
                val isOptimistic = photo.id.startsWith("local_")
                Box(
                    modifier = Modifier
                        .aspectRatio(3f / 4f)
                        .clip(MaterialTheme.shapes.medium)
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                ) {
                    // Coil's AsyncImage handles both content:// URIs (local) and
                    // https:// URLs (remote). For local optimistic entries, parse
                    // the stored URI string back to a Uri object for Coil.
                    val imageModel: Any = if (photo.url.startsWith("content://")) {
                        Uri.parse(photo.url)
                    } else {
                        photo.url
                    }
                    
                    AsyncImage(
                        model = imageModel,
                        contentDescription = "Profile Photo",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                    
                    // Show a loading overlay for optimistic (uploading) entries
                    if (isOptimistic) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(MaterialTheme.colorScheme.surface.copy(alpha = 0.4f)),
                            contentAlignment = Alignment.Center
                        ) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(24.dp),
                                strokeWidth = 2.dp
                            )
                        }
                    }
                    
                    // Only show delete button for fully uploaded photos
                    if (!isOptimistic) {
                        IconButton(
                            onClick = { viewModel.deletePhoto(photo.id) },
                            modifier = Modifier
                                .align(Alignment.TopEnd)
                                .size(32.dp)
                                .background(
                                    MaterialTheme.colorScheme.surface.copy(alpha = 0.7f),
                                    CircleShape
                                )
                        ) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Delete Photo",
                                tint = MaterialTheme.colorScheme.error,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                }
            }
            
            if (photos.size < maxPhotos) {
                item {
                    Button(
                        onClick = {
                            launcher.launch(
                                androidx.activity.result.PickVisualMediaRequest(
                                    ActivityResultContracts.PickVisualMedia.ImageOnly
                                )
                            )
                        },
                        shape = MaterialTheme.shapes.medium,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.surfaceVariant,
                            contentColor = MaterialTheme.colorScheme.primary
                        ),
                        modifier = Modifier.aspectRatio(3f / 4f)
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(imageVector = Icons.Default.Add, contentDescription = "Add Photo")
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("Add", style = MaterialTheme.typography.labelSmall)
                        }
                    }
                }
            }
        }

        if (onComplete != null) {
            Spacer(modifier = Modifier.height(16.dp))
            Button(
                onClick = { 
                    viewModel.updateOnboardingStep(2, onComplete)
                },
                modifier = Modifier.fillMaxWidth(),
                // Disable while uploading or if fewer than 3 photos
                enabled = photos.size >= 3 && !uiState.isUploading
            ) {
                Text("Continue")
            }
        }
    }
}

