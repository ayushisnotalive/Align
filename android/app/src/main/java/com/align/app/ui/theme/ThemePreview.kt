package com.align.app.ui.theme

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

// ─────────────────────────────────────────────────────────────────────────────
// Theme preview — verifies that the 60-30-10 colour contract is satisfied in
// both light and dark modes. Not shipped in production; debug-only.
//
// Run in Android Studio: open this file and click the split/preview button.
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun ThemePreviewContent() {
    Surface(
        color = MaterialTheme.colorScheme.background,
        modifier = Modifier.padding(16.dp),
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {

            Text(
                text = "Align · Theme Preview",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onBackground,
            )

            Spacer(Modifier.height(4.dp))

            // 60% — background swatch
            SwatchRow(label = "60% Background") {
                Box(
                    Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(MaterialTheme.colorScheme.background),
                )
            }

            // 30% — surface swatch
            SwatchRow(label = "30% Surface") {
                Box(
                    Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(MaterialTheme.colorScheme.surface),
                )
            }

            // 10% — accent swatch + CTA button demo
            SwatchRow(label = "10% Accent") {
                Row(
                    Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Box(
                        Modifier
                            .size(48.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(MaterialTheme.colorScheme.primary),
                    )
                    Button(onClick = {}) { Text("Like ♥") }
                }
            }
        }
    }
}

@Composable
private fun SwatchRow(label: String, content: @Composable () -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onBackground,
        )
        content()
    }
}

// ─── Previews ─────────────────────────────────────────────────────────────────

@Preview(name = "Light theme", showBackground = true, backgroundColor = 0xFFFFF8F5)
@Composable
private fun ThemePreviewLight() {
    AlignTheme(darkTheme = false) { ThemePreviewContent() }
}

@Preview(name = "Dark theme", showBackground = true, backgroundColor = 0xFF14111A)
@Composable
private fun ThemePreviewDark() {
    AlignTheme(darkTheme = true) { ThemePreviewContent() }
}
