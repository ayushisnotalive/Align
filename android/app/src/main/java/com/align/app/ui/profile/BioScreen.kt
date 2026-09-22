package com.align.app.ui.profile

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BioScreen(
    onComplete: () -> Unit,
    viewModel: BioViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    var bio by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("About Me") }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            if (uiState.error != null) {
                Text(uiState.error!!, color = MaterialTheme.colorScheme.error)
            }

            Text("Write a short bio about yourself. This will be shown on your profile.")

            OutlinedTextField(
                value = bio,
                onValueChange = { 
                    if (it.length <= 500) {
                        bio = it 
                    }
                },
                label = { Text("Bio") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(150.dp),
                maxLines = 5,
                supportingText = { Text("${bio.length} / 500") }
            )

            Spacer(modifier = Modifier.weight(1f))
            
            val isValid = bio.isNotBlank()
            
            Button(
                onClick = {
                    viewModel.saveBio(
                        bio = bio
                    ) { success ->
                        if (success) {
                            onComplete()
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                enabled = isValid && !uiState.isSaving
            ) {
                if (uiState.isSaving) {
                    CircularProgressIndicator(modifier = Modifier.size(24.dp))
                } else {
                    Text("Continue")
                }
            }
        }
    }
}
