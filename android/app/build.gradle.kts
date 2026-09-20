import java.util.Properties

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.hilt)
    alias(libs.plugins.ksp)
}

// ── Secrets ───────────────────────────────────────────────────────────────────
// SUPABASE_URL and SUPABASE_ANON_KEY are Supabase "publishable" keys — safe to
// embed in the APK (https://supabase.com/docs/guides/api/api-keys).
// NO service-role key, AWS keys, or FCM keys may ever appear here or in
// BuildConfig. Those live server-side only (supabase secrets set / AWS SSM).
val localProps = Properties().apply {
    val f = rootProject.file("local.properties")
    if (f.exists()) load(f.inputStream())
}

android {
    namespace  = "com.align.app"
    compileSdk = 35

    // ── Product flavors ───────────────────────────────────────────────────────
    // Two environments share one codebase:
    //   dev  — Supabase align-dev project. Used in all debug builds.
    //   prod — Supabase align-prod project. Used in all release builds.
    //
    // Keys come from local.properties (gitignored). Flavors are the ONLY place
    // that reads them; defaultConfig has no SUPABASE_* fields.
    //
    // local.properties format:
    //   sdk.dir=…
    //   dev.supabaseUrl=https://…dev….supabase.co
    //   dev.supabaseKey=sb_publishable_…
    //   prod.supabaseUrl=https://…prod….supabase.co
    //   prod.supabaseKey=sb_publishable_…
    // ─────────────────────────────────────────────────────────────────────────
    flavorDimensions += "env"

    productFlavors {
        create("dev") {
            dimension        = "env"
            applicationIdSuffix = ".dev"          // install alongside prod
            versionNameSuffix   = "-dev"
            // Expose keys so the data layer can use BuildConfig.SUPABASE_URL.
            buildConfigField("String", "SUPABASE_URL",
                "\"${localProps["dev.supabaseUrl"] ?: localProps["supabaseUrl"] ?: ""}\"")
            buildConfigField("String", "SUPABASE_ANON_KEY",
                "\"${localProps["dev.supabaseKey"] ?: localProps["supabaseKey"] ?: ""}\"")
            buildConfigField("Boolean", "IS_PROD", "false")
        }
        create("prod") {
            dimension = "env"
            // prod has no suffix — applicationId stays com.align.app.
            buildConfigField("String", "SUPABASE_URL",
                "\"${localProps["prod.supabaseUrl"] ?: localProps["supabaseUrl"] ?: ""}\"")
            buildConfigField("String", "SUPABASE_ANON_KEY",
                "\"${localProps["prod.supabaseKey"] ?: localProps["supabaseKey"] ?: ""}\"")
            buildConfigField("Boolean", "IS_PROD", "true")
        }
    }

    defaultConfig {
        applicationId = "com.align.app"
        minSdk        = 26
        targetSdk     = 35
        versionCode   = 1
        versionName   = "0.1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables { useSupportLibrary = true }
        // No SUPABASE_* here — keys are flavor-specific above.
    }

    buildTypes {
        release {
            // R8 full-mode shrinking. debuggable MUST stay false in release.
            isMinifyEnabled   = true
            isShrinkResources = true
            isDebuggable      = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
        }
        debug {
            isDebuggable = true
            // applicationIdSuffix is already set per-flavor; don't add more here.
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }

    buildFeatures {
        compose     = true
        buildConfig = true  // required for SUPABASE_* and IS_PROD fields
    }

    packaging {
        resources { excludes += "/META-INF/{AL2.0,LGPL2.1}" }
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)

    // Compose BOM — pins all Compose artifact versions together.
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.ext)
    debugImplementation(libs.androidx.compose.ui.tooling)

    // Navigation
    implementation(libs.androidx.navigation.compose)

    // Hilt — DI. Using KSP (faster than kapt for new projects).
    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)
    implementation(libs.hilt.navigation.compose)
}
