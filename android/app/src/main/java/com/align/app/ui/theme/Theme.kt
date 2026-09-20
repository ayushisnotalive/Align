package com.align.app.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic color is intentionally DISABLED so our 60-30-10 palette is always
// enforced. The accent (#FF4D6D / #FF6B85) must never be diluted by Material
// You's wallpaper extraction.
//
// Full semantic token mapping (error, outline, secondary, tertiary, etc.) will
// be completed in the dedicated theme task (Phase 0 · task 27). Only the tokens
// needed for the skeleton are wired here to keep this commit small.
// ─────────────────────────────────────────────────────────────────────────────

private val LightColorScheme = lightColorScheme(
    primary          = Accent_Light,
    onPrimary        = Background_Light,
    background       = Background_Light,
    onBackground     = OnBackground_Light,
    surface          = Surface_Light,
    onSurface        = OnBackground_Light,
    surfaceVariant   = Surface_Light,
    onSurfaceVariant = OnBackground_Light,
)

private val DarkColorScheme = darkColorScheme(
    primary          = Accent_Dark,
    onPrimary        = Background_Dark,
    background       = Background_Dark,
    onBackground     = OnBackground_Dark,
    surface          = Surface_Dark,
    onSurface        = OnBackground_Dark,
    surfaceVariant   = Surface_Dark,
    onSurfaceVariant = OnBackground_Dark,
)

/**
 * Root Compose theme for the Align app.
 *
 * Applies the 60-30-10 color scheme and sets the status bar appearance to
 * match. All screens must be wrapped in this theme (done once in [MainActivity]).
 *
 * @param darkTheme Follow system setting by default; override for previews.
 */
@Composable
fun AlignTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            // Transparent status bar — set the background colour instead.
            window.statusBarColor = colorScheme.background.toArgb()
            WindowCompat
                .getInsetsController(window, view)
                .isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography  = AlignTypography,
        content     = content,
    )
}
