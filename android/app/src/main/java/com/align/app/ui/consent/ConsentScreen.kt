package com.align.app.ui.consent

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Checkbox
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

/**
 * Consent screen collecting required consents (terms, privacy, location).
 *
 * Consent rows are written to the `consents` table via the Supabase
 * client in the data layer. Each consent type + version is recorded.
 */
@Composable
fun ConsentScreen(
    onAllConsented: () -> Unit,
) {
    var termsAccepted by rememberSaveable { mutableStateOf(false) }
    var privacyAccepted by rememberSaveable { mutableStateOf(false) }
    var locationAccepted by rememberSaveable { mutableStateOf(false) }

    val allAccepted = termsAccepted && privacyAccepted && locationAccepted

    Scaffold { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 24.dp)
                .verticalScroll(rememberScrollState()),
        ) {
            Spacer(Modifier.height(48.dp))

            Text(
                text = "Before we start",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
            )
            Spacer(Modifier.height(8.dp))
            Text(
                text = "Please review and accept the following to continue",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )

            Spacer(Modifier.height(32.dp))

            ConsentItem(
                title = "Terms of Service",
                description = "I agree to the Terms of Service governing use of the Align app.",
                checked = termsAccepted,
                onCheckedChange = { termsAccepted = it },
            )

            Spacer(Modifier.height(16.dp))

            ConsentItem(
                title = "Privacy Policy",
                description = "I have read and accept the Privacy Policy. I understand how my data is collected, used, and protected.",
                checked = privacyAccepted,
                onCheckedChange = { privacyAccepted = it },
            )

            Spacer(Modifier.height(16.dp))

            ConsentItem(
                title = "Location Access",
                description = "I understand that Align requires my location to show me nearby people. My location is stored approximately (~1 km precision) and I can control it in settings.",
                checked = locationAccepted,
                onCheckedChange = { locationAccepted = it },
            )

            Spacer(Modifier.weight(1f))

            Button(
                onClick = onAllConsented,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                enabled = allAccepted,
            ) {
                Text("Continue")
            }

            Spacer(Modifier.height(24.dp))
        }
    }
}

@Composable
private fun ConsentItem(
    title: String,
    description: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.Top,
        horizontalArrangement = Arrangement.Start,
    ) {
        Checkbox(
            checked = checked,
            onCheckedChange = onCheckedChange,
        )
        Column(modifier = Modifier.padding(start = 8.dp, top = 12.dp)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.SemiBold,
            )
            Spacer(Modifier.height(4.dp))
            Text(
                text = description,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}
