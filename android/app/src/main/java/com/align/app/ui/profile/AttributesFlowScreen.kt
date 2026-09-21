package com.align.app.ui.profile

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AttributesFlowScreen(
    onAttributesSelected: (Map<String, String>) -> Unit,
    modifier: Modifier = Modifier
) {
    // Simplified attributes selection flow
    var selectedHeight by remember { mutableStateOf("175 cm") }
    var selectedExercise by remember { mutableStateOf("Active") }
    
    val heights = listOf("160 cm", "170 cm", "175 cm", "180 cm", "190 cm")
    val exercises = listOf("Active", "Sometimes", "Never")

    Column(modifier = modifier.fillMaxSize().padding(16.dp)) {
        Text(
            text = "Your Basics",
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.onBackground
        )
        Text(
            text = "Tell us a bit about yourself.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        
        Spacer(modifier = Modifier.height(32.dp))
        
        Text("Height", style = MaterialTheme.typography.titleMedium)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
            heights.forEach { height ->
                FilterChip(
                    selected = selectedHeight == height,
                    onClick = { selectedHeight = height },
                    label = { Text(height) }
                )
            }
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        Text("Exercise", style = MaterialTheme.typography.titleMedium)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
            exercises.forEach { exercise ->
                FilterChip(
                    selected = selectedExercise == exercise,
                    onClick = { selectedExercise = exercise },
                    label = { Text(exercise) }
                )
            }
        }
        
        Spacer(modifier = Modifier.weight(1f))
        
        Button(
            onClick = {
                onAttributesSelected(
                    mapOf(
                        "height" to selectedHeight,
                        "exercise" to selectedExercise
                    )
                )
            },
            modifier = Modifier.fillMaxWidth().height(50.dp)
        ) {
            Text("Save & Continue")
        }
    }
}
