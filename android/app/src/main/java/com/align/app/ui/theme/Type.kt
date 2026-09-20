package com.align.app.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// ─────────────────────────────────────────────────────────────────────────────
// Typography placeholder — uses the system default font family.
// The dedicated theme task (Phase 0 · task 27) will replace FontFamily.Default
// with a Google Font (e.g. Inter or Outfit) and fill in the full type scale.
// ─────────────────────────────────────────────────────────────────────────────

internal val AlignTypography = Typography(
    bodyLarge = TextStyle(
        fontFamily    = FontFamily.Default,
        fontWeight    = FontWeight.Normal,
        fontSize      = 16.sp,
        lineHeight    = 24.sp,
        letterSpacing = 0.5.sp,
    ),
)
