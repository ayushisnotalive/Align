package com.align.app.ui.theme

import androidx.compose.ui.graphics.Color

// ─────────────────────────────────────────────────────────────────────────────
// 60-30-10 design token definitions (prd.md §9 + AGENTS.md §DESIGN SYSTEM).
//
// ALL raw color values live ONLY in this file.
// Screens and composables NEVER reference Color(...) or raw hex directly.
// Use MaterialTheme.colorScheme tokens, which are mapped from these values
// in Theme.kt.
//
// This file will be expanded in the dedicated theme task (Phase 0 · task 27)
// with additional semantic tokens (error, outline, etc.).
// ─────────────────────────────────────────────────────────────────────────────

// 60% — dominant background
internal val Background_Light  = Color(0xFFFFF8F5)
internal val Background_Dark   = Color(0xFF14111A)

// 30% — cards, bars, chips, inputs, bottom navigation surface
internal val Surface_Light     = Color(0xFFF3E4E8)
internal val Surface_Dark      = Color(0xFF221C2E)

// 10% — accent: primary CTA, like, live dot, selected tab, blue-tick ring.
// NEVER use for more than ~10% of a screen.
internal val Accent_Light      = Color(0xFFFF4D6D)
internal val Accent_Dark       = Color(0xFFFF6B85)

// Text
internal val OnBackground_Light = Color(0xFF1E1A24)
internal val OnBackground_Dark  = Color(0xFFF5EFF7)
