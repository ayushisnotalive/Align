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
fun BasicInfoScreen(
    onComplete: () -> Unit,
    viewModel: BasicInfoViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    var firstName by remember { mutableStateOf("") }
    var lastName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var dob by remember { mutableStateOf("") }
    var selectedGender by remember { mutableStateOf<LookupValue?>(null) }
    var selectedPronoun by remember { mutableStateOf<LookupValue?>(null) }
    var selectedOrientation by remember { mutableStateOf<LookupValue?>(null) }
    
    var genderExpanded by remember { mutableStateOf(false) }
    var pronounExpanded by remember { mutableStateOf(false) }
    var orientationExpanded by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Basic Info") }
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
                    value = firstName,
                    onValueChange = { firstName = it },
                    label = { Text("First Name") },
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = lastName,
                    onValueChange = { lastName = it },
                    label = { Text("Last Name") },
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email") },
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = dob,
                    onValueChange = { dob = it },
                    label = { Text("Date of Birth (YYYY-MM-DD)") },
                    modifier = Modifier.fillMaxWidth()
                )

                ExposedDropdownMenuBox(
                    expanded = genderExpanded,
                    onExpandedChange = { genderExpanded = !genderExpanded }
                ) {
                    OutlinedTextField(
                        value = selectedGender?.label ?: "",
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Gender") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = genderExpanded) },
                        modifier = Modifier.menuAnchor().fillMaxWidth()
                    )
                    ExposedDropdownMenu(
                        expanded = genderExpanded,
                        onDismissRequest = { genderExpanded = false }
                    ) {
                        uiState.genders.forEach { option ->
                            DropdownMenuItem(
                                text = { Text(option.label) },
                                onClick = {
                                    selectedGender = option
                                    genderExpanded = false
                                }
                            )
                        }
                    }
                }

                ExposedDropdownMenuBox(
                    expanded = pronounExpanded,
                    onExpandedChange = { pronounExpanded = !pronounExpanded }
                ) {
                    OutlinedTextField(
                        value = selectedPronoun?.label ?: "",
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Pronouns (Optional)") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = pronounExpanded) },
                        modifier = Modifier.menuAnchor().fillMaxWidth()
                    )
                    ExposedDropdownMenu(
                        expanded = pronounExpanded,
                        onDismissRequest = { pronounExpanded = false }
                    ) {
                        uiState.pronouns.forEach { option ->
                            DropdownMenuItem(
                                text = { Text(option.label) },
                                onClick = {
                                    selectedPronoun = option
                                    pronounExpanded = false
                                }
                            )
                        }
                    }
                }

                ExposedDropdownMenuBox(
                    expanded = orientationExpanded,
                    onExpandedChange = { orientationExpanded = !orientationExpanded }
                ) {
                    OutlinedTextField(
                        value = selectedOrientation?.label ?: "",
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Sexual Orientation") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = orientationExpanded) },
                        modifier = Modifier.menuAnchor().fillMaxWidth()
                    )
                    ExposedDropdownMenu(
                        expanded = orientationExpanded,
                        onDismissRequest = { orientationExpanded = false }
                    ) {
                        uiState.orientations.forEach { option ->
                            DropdownMenuItem(
                                text = { Text(option.label) },
                                onClick = {
                                    selectedOrientation = option
                                    orientationExpanded = false
                                }
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.weight(1f))
                
                val isValid = firstName.isNotBlank() && lastName.isNotBlank() && email.isNotBlank() && dob.isNotBlank() && selectedGender != null && selectedOrientation != null
                
                Button(
                    onClick = {
                        viewModel.saveBasicInfo(
                            firstName = firstName,
                            lastName = lastName,
                            email = email,
                            dob = dob,
                            genderId = selectedGender!!.id,
                            pronounId = selectedPronoun?.id,
                            orientationId = selectedOrientation!!.id
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
