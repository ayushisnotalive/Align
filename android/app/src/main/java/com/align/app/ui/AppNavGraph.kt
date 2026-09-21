package com.align.app.ui

import android.net.Uri
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Chat
import androidx.compose.material.icons.filled.Explore
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.LaunchedEffect
import com.align.app.ui.splash.SplashViewModel
import com.align.app.ui.auth.LoginScreen
import com.align.app.ui.consent.ConsentScreen
import com.align.app.ui.location.LocationScreen
import com.align.app.ui.profile.AttributesFlowScreen
import com.align.app.ui.profile.CollegePickerScreen
import com.align.app.ui.profile.CollegeVerificationScreen
import com.align.app.ui.profile.PhotoGalleryScreen
import com.align.app.ui.profile.PlacesPickerScreen
import com.align.app.ui.profile.ProfileEditScreen

// ── Route constants ───────────────────────────────────────────────────────────

/**
 * All navigation route strings live here. No screen imports a raw string
 * literal — always use [Routes].
 */
object Routes {
    const val SPLASH        = "splash"
    const val LOGIN         = "login"
    const val CONSENT       = "consent"
    const val LOCATION_GATE = "location_gate"

    const val DISCOVER = "discover"
    const val COLLEGE  = "college"
    const val EXPLORE  = "explore"
    const val MATCHES  = "matches"
    const val CHATS    = "chats"

    // Profile hub + sub-routes (Phase 3)
    const val PROFILE             = "profile"
    const val PROFILE_EDIT        = "profile/edit"
    const val PHOTO_GALLERY       = "profile/photos"
    const val COLLEGE_PICKER      = "profile/college_picker"
    const val COLLEGE_VERIFICATION = "profile/college_verification/{collegeId}/{collegeName}"
    const val ATTRIBUTES_FLOW     = "profile/attributes"
    const val PLACES_PICKER       = "profile/places"
    const val HOMETOWN_PICKER     = "profile/hometown"
}

// ── Tab descriptors ───────────────────────────────────────────────────────────

private data class TopLevelRoute(
    val label: String,
    val route: String,
    val icon: @Composable () -> Unit,
)

/** The five bottom-tab destinations (prd.md §6). */
private val topLevelRoutes = listOf(
    TopLevelRoute("Discover", Routes.DISCOVER) {
        Icon(Icons.Filled.Search,   contentDescription = "Discover")
    },
    TopLevelRoute("College",  Routes.COLLEGE) {
        Icon(Icons.Filled.School,   contentDescription = "College")
    },
    TopLevelRoute("Explore",  Routes.EXPLORE) {
        Icon(Icons.Filled.Explore,  contentDescription = "Explore")
    },
    TopLevelRoute("Matches",  Routes.MATCHES) {
        Icon(Icons.Filled.Favorite, contentDescription = "Matches")
    },
    TopLevelRoute("Chats",    Routes.CHATS) {
        Icon(Icons.Filled.Chat,     contentDescription = "Chats")
    },
)

// ── Root navigation graph ─────────────────────────────────────────────────────

/**
 * Root [NavHost] for the entire app.
 *
 * Structure (prd.md §6):
 * - Five bottom-tab destinations: Discover, College, Explore, Matches, Chats.
 * - Profile is reachable from an avatar icon in the top bar (per-screen in
 *   later phases). Profile sub-screens hide the bottom bar.
 *
 * Phase 3 profile sub-graph:
 *   profile/edit → profile/photos
 *                → profile/college_picker → profile/college_verification/{id}/{name}
 *                → profile/attributes
 *                → profile/places
 *                → profile/hometown
 *
 * Security: deep-link validation and FLAG_SECURE are applied per-destination
 * when the real screen is implemented (never globally here).
 */
@Composable
fun AppNavGraph() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    // Bottom bar only visible on top-level tabs
    val showBottomBar = currentDestination?.route in listOf(
        Routes.DISCOVER, Routes.COLLEGE, Routes.EXPLORE, Routes.MATCHES, Routes.CHATS
    )

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                NavigationBar {
                    topLevelRoutes.forEach { tab ->
                        NavigationBarItem(
                            selected = currentDestination
                                ?.hierarchy
                                ?.any { it.route == tab.route } == true,
                            onClick = {
                                navController.navigate(tab.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState    = true
                                }
                            },
                            icon  = tab.icon,
                            label = { Text(tab.label) },
                        )
                    }
                }
            }
        },
    ) { innerPadding ->
        NavHost(
            navController    = navController,
            startDestination = Routes.SPLASH,
            modifier         = Modifier.padding(innerPadding),
        ) {
            // ── Auth / onboarding flow ──────────────────────────────────────

            composable(Routes.SPLASH) {
                val splashViewModel = hiltViewModel<SplashViewModel>()
                val startDestination by splashViewModel.startDestination.collectAsState()

                LaunchedEffect(startDestination) {
                    startDestination?.let { dest ->
                        navController.navigate(dest) {
                            popUpTo(Routes.SPLASH) { inclusive = true }
                        }
                    }
                }

                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Align", style = androidx.compose.material3.MaterialTheme.typography.headlineLarge)
                }
            }

            composable(Routes.LOGIN) {
                LoginScreen(onLoginSuccess = {
                    navController.navigate(Routes.CONSENT) {
                        popUpTo(Routes.LOGIN) { inclusive = true }
                    }
                })
            }

            composable(Routes.CONSENT) {
                ConsentScreen(onAllConsented = {
                    navController.navigate(Routes.LOCATION_GATE) {
                        popUpTo(Routes.CONSENT) { inclusive = true }
                    }
                })
            }

            composable(Routes.LOCATION_GATE) {
                LocationScreen(onPermissionGranted = {
                    navController.navigate(Routes.DISCOVER) {
                        popUpTo(Routes.LOCATION_GATE) { inclusive = true }
                    }
                })
            }

            // ── Main tabs (stubs, replaced in Phase 4+) ────────────────────

            composable(Routes.DISCOVER) { DiscoverScreen() }
            composable(Routes.COLLEGE)  { CollegeScreen() }
            composable(Routes.EXPLORE)  { ExploreScreen() }
            composable(Routes.MATCHES)  { MatchesScreen() }
            composable(Routes.CHATS)    { ChatsScreen() }

            // ── Profile hub ────────────────────────────────────────────────

            // PROFILE = top-level entry from avatar icon → goes to edit hub
            composable(Routes.PROFILE) {
                ProfileEditScreen(
                    onNavigateToGallery         = { navController.navigate(Routes.PHOTO_GALLERY) },
                    onNavigateToCollegePicker   = { navController.navigate(Routes.COLLEGE_PICKER) },
                    onNavigateToAttributes      = { navController.navigate(Routes.ATTRIBUTES_FLOW) },
                    onNavigateToHometown        = { navController.navigate(Routes.HOMETOWN_PICKER) },
                    onNavigateToPlaces          = { navController.navigate(Routes.PLACES_PICKER) },
                )
            }

            composable(Routes.PROFILE_EDIT) {
                ProfileEditScreen(
                    onNavigateToGallery         = { navController.navigate(Routes.PHOTO_GALLERY) },
                    onNavigateToCollegePicker   = { navController.navigate(Routes.COLLEGE_PICKER) },
                    onNavigateToAttributes      = { navController.navigate(Routes.ATTRIBUTES_FLOW) },
                    onNavigateToHometown        = { navController.navigate(Routes.HOMETOWN_PICKER) },
                    onNavigateToPlaces          = { navController.navigate(Routes.PLACES_PICKER) },
                )
            }

            // Photo gallery
            composable(Routes.PHOTO_GALLERY) {
                val photos = remember { mutableStateListOf<Uri>() }
                PhotoGalleryScreen(
                    photos          = photos,
                    onPhotosSelected = { uris -> photos.addAll(uris) },
                    onPhotoDeleted  = { uri -> photos.remove(uri) },
                )
            }

            // College picker → on selection navigate to verification
            composable(Routes.COLLEGE_PICKER) {
                CollegePickerScreen(
                    onCollegeSelected = { collegeId ->
                        // The dummy list used "IIT Bombay" for id=1, etc. Pass name via route arg.
                        navController.navigate("profile/college_verification/$collegeId/Selected College")
                    },
                    onRequestMissingCollege = {
                        // TODO (Phase 3 onboarding): open a request-missing-college bottom sheet
                    }
                )
            }

            // College verification — receives collegeId and collegeName as path args
            composable(
                route = Routes.COLLEGE_VERIFICATION,
                arguments = listOf(
                    navArgument("collegeId")   { type = NavType.IntType },
                    navArgument("collegeName") { type = NavType.StringType },
                )
            ) { backStackEntry ->
                val collegeName = backStackEntry.arguments?.getString("collegeName") ?: ""
                CollegeVerificationScreen(
                    collegeName           = collegeName,
                    onSubmitVerification  = { _ ->
                        // After submission navigate back to the profile edit hub
                        navController.popBackStack(Routes.PROFILE_EDIT, inclusive = false)
                    },
                    onBack = { navController.popBackStack() },
                )
            }

            // Attributes flow
            composable(Routes.ATTRIBUTES_FLOW) {
                AttributesFlowScreen(
                    onAttributesSelected = { _ ->
                        navController.popBackStack()
                    }
                )
            }

            // Places picker (lived-in cities)
            composable(Routes.PLACES_PICKER) {
                PlacesPickerScreen(
                    title           = "Places I've Lived",
                    onPlaceSelected = { _ ->
                        navController.popBackStack()
                    }
                )
            }

            // Hometown picker (reuses PlacesPickerScreen with different title)
            composable(Routes.HOMETOWN_PICKER) {
                PlacesPickerScreen(
                    title           = "Hometown",
                    onPlaceSelected = { _ ->
                        navController.popBackStack()
                    }
                )
            }
        }
    }
}

// ── Stub screens — replaced one-by-one per phase ──────────────────────────────

@Composable private fun DiscoverScreen() = StubScreen("Discover")
@Composable private fun CollegeScreen()  = StubScreen("College")
@Composable private fun ExploreScreen()  = StubScreen("Explore")
@Composable private fun MatchesScreen()  = StubScreen("Matches")
@Composable private fun ChatsScreen()    = StubScreen("Chats")

@Composable
private fun StubScreen(name: String) {
    Box(
        modifier           = Modifier.fillMaxSize(),
        contentAlignment   = Alignment.Center,
    ) {
        Text(text = name)
    }
}
