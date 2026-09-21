package com.align.app.ui.discover

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.align.app.domain.discover.DiscoverySettingsUpdate

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DiscoverySettingsScreen(
    onBack: () -> Unit,
    viewModel: DiscoverySettingsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Discovery Settings") },
                navigationIcon = {
                    Button(onClick = onBack) {
                        Text("Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        if (uiState.isLoading) {
            Box(modifier = Modifier.fillMaxSize().padding(paddingValues), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else if (uiState.settings != null) {
            val settings = uiState.settings!!
            
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
                
                // Show Me (Visibility)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Show me on Align", style = MaterialTheme.typography.titleMedium)
                    Switch(
                        checked = settings.showMe,
                        onCheckedChange = { viewModel.updateSettings(DiscoverySettingsUpdate(showMe = it)) }
                    )
                }
                HorizontalDivider()
                
                // Verified Only
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Show only Verified profiles", style = MaterialTheme.typography.titleMedium)
                    Switch(
                        checked = settings.verifiedOnly,
                        onCheckedChange = { viewModel.updateSettings(DiscoverySettingsUpdate(verifiedOnly = it)) }
                    )
                }
                HorizontalDivider()

                // Radius
                Text("Maximum Distance: ${settings.radiusKm} km", style = MaterialTheme.typography.titleMedium)
                Slider(
                    value = settings.radiusKm.toFloat(),
                    onValueChange = { viewModel.updateSettings(DiscoverySettingsUpdate(radiusKm = it.toInt())) },
                    valueRange = 5f..100f,
                    steps = 19
                )
                HorizontalDivider()

                // Age Range
                Text("Age Range: ${settings.minAge} - ${settings.maxAge}", style = MaterialTheme.typography.titleMedium)
                // Note: using two sliders for simplicity. A RangeSlider would be better.
                Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Min: ${settings.minAge}", style = MaterialTheme.typography.labelMedium)
                        Slider(
                            value = settings.minAge.toFloat(),
                            onValueChange = { viewModel.updateSettings(DiscoverySettingsUpdate(minAge = it.toInt())) },
                            valueRange = 18f..100f,
                            steps = 82
                        )
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Max: ${settings.maxAge}", style = MaterialTheme.typography.labelMedium)
                        Slider(
                            value = settings.maxAge.toFloat(),
                            onValueChange = { viewModel.updateSettings(DiscoverySettingsUpdate(maxAge = it.toInt())) },
                            valueRange = 18f..100f,
                            steps = 82
                        )
                    }
                }
                HorizontalDivider()

                // College Scope default
                Text("College Tab Scope", style = MaterialTheme.typography.titleMedium)
                val scopes = listOf("my_college" to "My College", "my_city" to "My City", "my_state" to "My State")
                Column {
                    scopes.forEach { (value, label) ->
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
                            RadioButton(
                                selected = settings.collegeScope == value,
                                onClick = { viewModel.updateSettings(DiscoverySettingsUpdate(collegeScope = value)) }
                            )
                            Text(label)
                        }
                    }
                }
            }
        }
    }
}
