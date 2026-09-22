package com.align.app.ui.profile

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.align.app.domain.profile.LookupValue

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WorkAndEducationScreen(
    onComplete: () -> Unit,
    viewModel: WorkAndEducationViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    var occupation by remember { mutableStateOf("") }
    var employer by remember { mutableStateOf("") }
    var school by remember { mutableStateOf("") }
    var selectedEducation by remember { mutableStateOf<LookupValue?>(null) }
    
    var educationExpanded by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Work & Education") }
            )
        }
    ) { paddingValues ->
        if (uiState.isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else {
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

                OutlinedTextField(
                    value = occupation,
                    onValueChange = { occupation = it },
                    label = { Text("Occupation (Optional)") },
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = employer,
                    onValueChange = { employer = it },
                    label = { Text("Employer (Optional)") },
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = school,
                    onValueChange = { school = it },
                    label = { Text("School (Type N/A if none)") },
                    modifier = Modifier.fillMaxWidth()
                )

                ExposedDropdownMenuBox(
                    expanded = educationExpanded,
                    onExpandedChange = { educationExpanded = !educationExpanded }
                ) {
                    OutlinedTextField(
                        value = selectedEducation?.label ?: "",
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Education Level (Optional)") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = educationExpanded) },
                        modifier = Modifier.menuAnchor().fillMaxWidth()
                    )
                    ExposedDropdownMenu(
                        expanded = educationExpanded,
                        onDismissRequest = { educationExpanded = false }
                    ) {
                        uiState.educationLevels.forEach { option ->
                            DropdownMenuItem(
                                text = { Text(option.label) },
                                onClick = {
                                    selectedEducation = option
                                    educationExpanded = false
                                }
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.weight(1f))
                
                val isValid = school.isNotBlank() || school.equals("N/A", ignoreCase = true)
                
                Button(
                    onClick = {
                        viewModel.saveWorkAndEducation(
                            occupation = occupation,
                            employer = employer,
                            school = school,
                            educationId = selectedEducation?.id
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
}
