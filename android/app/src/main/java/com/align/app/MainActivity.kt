package com.align.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.align.app.ui.AppNavGraph
import com.align.app.ui.theme.AlignTheme
import dagger.hilt.android.AndroidEntryPoint

/**
 * Single-activity host for the entire app.
 *
 * All screens are Compose destinations inside [AppNavGraph]. No Fragment
 * transactions or view inflation happen here.
 *
 * Security notes (AGENTS.md §3):
 * · FLAG_SECURE must be applied per-screen on verification/selfie destinations
 *   (Phase 7). It is NOT set here globally because it would prevent legitimate
 *   screenshots on normal screens.
 * · Tokens, OTPs, and PII are never passed via Intent extras or logged.
 * · Deep links and intent extras are validated in each destination composable.
 */
@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            AlignTheme {
                AppNavGraph()
            }
        }
    }
}
