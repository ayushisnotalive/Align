# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.kts.

# Keep Hilt-generated components
-keep class dagger.hilt.** { *; }
-keep class javax.inject.** { *; }
-keep @dagger.hilt.android.HiltAndroidApp class * { *; }

# Keep Navigation Compose serialization
-keepnames class androidx.navigation.** { *; }

# Suppress warnings for Kotlin metadata (safe to ignore)
-dontwarn kotlin.Metadata
