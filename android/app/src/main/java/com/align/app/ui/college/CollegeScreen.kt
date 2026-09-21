package com.align.app.ui.college

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.align.app.ui.components.SwipeCardStack
import com.align.app.ui.components.SwipeDirection
import com.align.app.ui.discover.DiscoverViewModel
import com.align.app.ui.discover.ProfileCard

@Composable
fun CollegeScreen(
    onNavigateToVerify: () -> Unit,
    viewModel: DiscoverViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    // Scopes: my_college, my_city, my_state
    var selectedScope by remember { mutableStateOf("my_college") }

    LaunchedEffect(selectedScope) {
        viewModel.loadFeed(mode = "college", scope = selectedScope)
    }

    Scaffold { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(MaterialTheme.colorScheme.background)
        ) {
            // Scope Switcher
            if (!uiState.unverifiedCollege) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(8.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    FilterChip(
                        selected = selectedScope == "my_college",
                        onClick = { selectedScope = "my_college" },
                        label = { Text("My College") }
                    )
                    FilterChip(
                        selected = selectedScope == "my_city",
                        onClick = { selectedScope = "my_city" },
                        label = { Text("My City") }
                    )
                    FilterChip(
                        selected = selectedScope == "my_state",
                        onClick = { selectedScope = "my_state" },
                        label = { Text("My State") }
                    )
                }
            }

            Box(
                modifier = Modifier.fillMaxSize().weight(1f),
                contentAlignment = Alignment.Center
            ) {
                when {
                    uiState.unverifiedCollege -> {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier.padding(32.dp)
                        ) {
                            Text(
                                "Verify your college to join",
                                style = MaterialTheme.typography.headlineSmall
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            Text(
                                "Connect with students from your college and city. We require ID verification to keep the community safe.",
                                style = MaterialTheme.typography.bodyMedium,
                                textAlign = androidx.compose.ui.text.style.TextAlign.Center
                            )
                            Spacer(modifier = Modifier.height(24.dp))
                            Button(onClick = onNavigateToVerify) {
                                Text("Verify Now")
                            }
                        }
                    }
                    uiState.isLoading && uiState.profiles.isEmpty() -> {
                        CircularProgressIndicator()
                    }
                    uiState.error != null -> {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("Error: ${uiState.error}", color = MaterialTheme.colorScheme.error)
                            Spacer(modifier = Modifier.height(16.dp))
                            Button(onClick = { viewModel.loadFeed(mode = "college", scope = selectedScope) }) {
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
                                Text("No students found nearby.", style = MaterialTheme.typography.bodyLarge)
                            }
                        ) { profile ->
                            ProfileCard(profile)
                        }
                    }
                }
            }
        }
    }
}
