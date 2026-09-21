package com.align.app.ui.profile

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileEditScreen(
    onNavigateToGallery: () -> Unit,
    onNavigateToCollegePicker: () -> Unit,
    onNavigateToAttributes: () -> Unit,
    onNavigateToHometown: () -> Unit,
    onNavigateToPlaces: () -> Unit,
    onNavigateToSettings: () -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Edit Profile") }
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            item {
                SectionHeader("Media")
                ProfileListItem(
                    title = "Photos & Videos",
                    subtitle = "Manage your profile gallery",
                    onClick = onNavigateToGallery
                )
                Divider()
            }
            
            item {
                SectionHeader("Verification")
                ProfileListItem(
                    title = "College Verification",
                    subtitle = "Add your student ID to verify",
                    onClick = onNavigateToCollegePicker
                )
                Divider()
            }
            
            item {
                SectionHeader("About Me")
                ProfileListItem(
                    title = "Basic Attributes",
                    subtitle = "Height, Exercise, Drinking, etc.",
                    onClick = onNavigateToAttributes
                )
                Divider()
                ProfileListItem(
                    title = "Hometown",
                    subtitle = "Where you grew up",
                    onClick = onNavigateToHometown
                )
                Divider()
                ProfileListItem(
                    title = "Places I've Lived",
                    subtitle = "Cities you've called home",
                    onClick = onNavigateToPlaces
                )
                Divider()
            }
            
            item {
                SectionHeader("Preferences")
                ProfileListItem(
                    title = "Discovery Settings",
                    subtitle = "Adjust your feed and matching criteria",
                    onClick = onNavigateToSettings
                )
                Divider()
            }
        }
    }
}

@Composable
fun SectionHeader(title: String) {
    Text(
        text = title,
        style = MaterialTheme.typography.labelLarge,
        color = MaterialTheme.colorScheme.primary,
        modifier = Modifier.padding(start = 16.dp, top = 24.dp, bottom = 8.dp)
    )
}

@Composable
fun ProfileListItem(title: String, subtitle: String, onClick: () -> Unit) {
    ListItem(
        headlineContent = { Text(title) },
        supportingContent = { Text(subtitle) },
        trailingContent = { Icon(Icons.Default.ChevronRight, contentDescription = null) },
        modifier = Modifier.clickable(onClick = onClick)
    )
}
