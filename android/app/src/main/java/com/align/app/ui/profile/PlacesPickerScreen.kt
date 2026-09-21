package com.align.app.ui.profile

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlacesPickerScreen(
    title: String,
    onPlaceSelected: (Int) -> Unit,
    modifier: Modifier = Modifier,
    onSkip: (() -> Unit)? = null
) {
    var searchQuery by remember { mutableStateOf("") }
    
    // In reality, fetched from Google Places API or Supabase Cities table
    val dummyPlaces = listOf(
        Pair(1, "Mumbai, India"),
        Pair(2, "Delhi, India"),
        Pair(3, "Bangalore, India"),
        Pair(4, "San Francisco, CA")
    ).filter { it.second.contains(searchQuery, ignoreCase = true) }

    Column(modifier = modifier.fillMaxSize().padding(16.dp)) {
        Text(
            text = title,
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.onBackground
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            modifier = Modifier.fillMaxWidth(),
            placeholder = { Text("Search city...") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
            singleLine = true,
            colors = TextFieldDefaults.colors(
                focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                unfocusedIndicatorColor = MaterialTheme.colorScheme.surfaceVariant
            )
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        LazyColumn(modifier = Modifier.weight(1f)) {
            items(dummyPlaces) { place ->
                ListItem(
                    headlineContent = { Text(place.second) },
                    modifier = Modifier.clickable { onPlaceSelected(place.first) }
                )
                Divider()
            }
        }
        
        if (onSkip != null) {
            Button(
                onClick = onSkip,
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.surfaceVariant, contentColor = MaterialTheme.colorScheme.onSurface),
                modifier = Modifier.fillMaxWidth().padding(top = 16.dp)
            ) {
                Text("Skip for now")
            }
        }
    }
}
