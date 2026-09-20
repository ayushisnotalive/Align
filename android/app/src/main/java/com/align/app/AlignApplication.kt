package com.align.app

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

/**
 * Application entry point.
 *
 * @HiltAndroidApp triggers Hilt's code generation and attaches the
 * application-level DI component. No business logic lives here; all
 * initialisation goes through Hilt modules in the :di package.
 *
 * Security: android:allowBackup="false" in the manifest prevents Auto-Backup
 * from capturing the encrypted session token stored in EncryptedSharedPreferences
 * (added in Phase 2). dataExtractionRules will be added in task 25 for Android 12+
 * fine-grained control.
 */
@HiltAndroidApp
class AlignApplication : Application()
