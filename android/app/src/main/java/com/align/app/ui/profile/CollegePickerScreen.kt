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
fun CollegePickerScreen(
    onCollegeSelected: (Int) -> Unit,
    onRequestMissingCollege: () -> Unit,
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf("") }
    
    // In reality, this list comes from Supabase via ProfileRepository based on searchQuery
    val dummyColleges = listOf(
        Pair(1, "Indian Institute of Technology Bombay"),
        Pair(2, "Indian Institute of Technology Delhi"),
        Pair(3, "National Institute of Technology Trichy")
    ).filter { it.second.contains(searchQuery, ignoreCase = true) }

    Column(modifier = modifier.fillMaxSize().padding(16.dp)) {
        Text(
            text = "Select Your College",
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.onBackground
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            modifier = Modifier.fillMaxWidth(),
            placeholder = { Text("Search college name...") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
            singleLine = true,
            colors = TextFieldDefaults.outlinedTextFieldColors(
                containerColor = MaterialTheme.colorScheme.surfaceVariant,
                unfocusedBorderColor = MaterialTheme.colorScheme.surfaceVariant
            )
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        LazyColumn(modifier = Modifier.weight(1f)) {
            items(dummyColleges) { college ->
                ListItem(
                    headlineContent = { Text(college.second) },
                    modifier = Modifier.clickable { onCollegeSelected(college.first) }
                )
                Divider()
            }
            item {
                TextButton(
                    onClick = onRequestMissingCollege,
                    modifier = Modifier.fillMaxWidth().padding(vertical = 16.dp)
                ) {
                    Text("Can't find your college? Request it here.", color = MaterialTheme.colorScheme.primary)
                }
            }
        }
    }
}
