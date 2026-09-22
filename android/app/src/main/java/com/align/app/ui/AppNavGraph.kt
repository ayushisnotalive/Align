package com.align.app.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Chat
import androidx.compose.material.icons.filled.Explore
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.CircularProgressIndicator
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
import com.align.app.ui.profile.BasicInfoScreen
import com.align.app.ui.profile.BioScreen
import com.align.app.ui.profile.CollegePickerScreen
import com.align.app.ui.profile.CollegeVerificationScreen
import com.align.app.ui.profile.PhotoGalleryScreen
import com.align.app.ui.profile.PlacesPickerScreen
import com.align.app.ui.profile.ProfileEditScreen
import com.align.app.ui.profile.ProfileViewModel
import com.align.app.ui.profile.WorkAndEducationScreen

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
    
    const val DISCOVERY_SETTINGS = "discovery_settings"

    const val ONBOARDING_BASIC_INFO = "onboarding/basic_info"
    const val ONBOARDING_WORK_EDU   = "onboarding/work_edu"
    const val ONBOARDING_BIO        = "onboarding/bio"
    const val ONBOARDING_PHOTOS     = "onboarding/photos"
    const val ONBOARDING_COLLEGE    = "onboarding/college"
    const val ONBOARDING_HOMETOWN   = "onboarding/hometown"
    const val ONBOARDING_PLACES     = "onboarding/places"
    const val ONBOARDING_ATTRIBUTES = "onboarding/attributes"

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
                    // Start onboarding from step 0 (we rely on SPLASH to route correctly later, 
                    // but on first signup we go to basic info)
                    navController.navigate(Routes.ONBOARDING_BASIC_INFO) {
                        popUpTo(Routes.LOCATION_GATE) { inclusive = true }
                    }
                })
            }

            // Onboarding Sequence
            composable(Routes.ONBOARDING_BASIC_INFO) {
                BasicInfoScreen(
                    onComplete = {
                        navController.navigate(Routes.ONBOARDING_WORK_EDU) {
                            popUpTo(Routes.ONBOARDING_BASIC_INFO) { inclusive = true }
                        }
                    }
                )
            }
            
            composable(Routes.ONBOARDING_WORK_EDU) {
                WorkAndEducationScreen(
                    onComplete = {
                        navController.navigate(Routes.ONBOARDING_BIO) {
                            popUpTo(Routes.ONBOARDING_WORK_EDU) { inclusive = true }
                        }
                    }
                )
            }
            
            composable(Routes.ONBOARDING_BIO) {
                BioScreen(
                    onComplete = {
                        navController.navigate(Routes.ONBOARDING_PHOTOS) {
                            popUpTo(Routes.ONBOARDING_BIO) { inclusive = true }
                        }
                    }
                )
            }
            
            composable(Routes.ONBOARDING_PHOTOS) {
                PhotoGalleryScreen(
                    onComplete = {
                        navController.navigate(Routes.ONBOARDING_COLLEGE) {
                            popUpTo(Routes.ONBOARDING_PHOTOS) { inclusive = true }
                        }
                    }
                )
            }
            
            composable(Routes.ONBOARDING_COLLEGE) {
                val viewModel: ProfileViewModel = hiltViewModel()
                CollegePickerScreen(
                    onCollegeSelected = { collegeId ->
                        // During onboarding, we'll verify later, just go to Hometown
                        // Ideally we'd show the verification screen here, but let's go to verify
                        navController.navigate("onboarding/college_verification/$collegeId/Selected College")
                    },
                    onRequestMissingCollege = { },
                    onSkip = {
                        viewModel.updateOnboardingStep(3) {
                            navController.navigate(Routes.ONBOARDING_HOMETOWN) {
                                popUpTo(Routes.ONBOARDING_COLLEGE) { inclusive = true }
                            }
                        }
                    }
                )
            }
            
            composable(
                route = "onboarding/college_verification/{collegeId}/{collegeName}",
                arguments = listOf(
                    navArgument("collegeId")   { type = NavType.IntType },
                    navArgument("collegeName") { type = NavType.StringType },
                )
            ) { backStackEntry ->
                val viewModel: ProfileViewModel = hiltViewModel()
                val collegeId = backStackEntry.arguments?.getInt("collegeId") ?: 0
                val collegeName = backStackEntry.arguments?.getString("collegeName") ?: ""
                CollegeVerificationScreen(
                    collegeId = collegeId,
                    collegeName = collegeName,
                    onVerificationSubmitted = {
                        viewModel.updateOnboardingStep(3) {
                            navController.navigate(Routes.ONBOARDING_HOMETOWN) {
                                popUpTo(Routes.ONBOARDING_COLLEGE) { inclusive = true }
                            }
                        }
                    },
                    onBack = { navController.popBackStack() },
                )
            }
            
            composable(Routes.ONBOARDING_HOMETOWN) {
                val viewModel: ProfileViewModel = hiltViewModel()
                PlacesPickerScreen(
                    title = "Hometown",
                    onPlaceSelected = { _ ->
                        viewModel.updateOnboardingStep(4) {
                            navController.navigate(Routes.ONBOARDING_PLACES) {
                                popUpTo(Routes.ONBOARDING_HOMETOWN) { inclusive = true }
                            }
                        }
                    },
                    onSkip = {
                        viewModel.updateOnboardingStep(4) {
                            navController.navigate(Routes.ONBOARDING_PLACES) {
                                popUpTo(Routes.ONBOARDING_HOMETOWN) { inclusive = true }
                            }
                        }
                    }
                )
            }
            
            composable(Routes.ONBOARDING_PLACES) {
                val viewModel: ProfileViewModel = hiltViewModel()
                PlacesPickerScreen(
                    title = "Places I've Lived",
                    onPlaceSelected = { _ ->
                        viewModel.updateOnboardingStep(5) {
                            navController.navigate(Routes.ONBOARDING_ATTRIBUTES) {
                                popUpTo(Routes.ONBOARDING_PLACES) { inclusive = true }
                            }
                        }
                    },
                    onSkip = {
                        viewModel.updateOnboardingStep(5) {
                            navController.navigate(Routes.ONBOARDING_ATTRIBUTES) {
                                popUpTo(Routes.ONBOARDING_PLACES) { inclusive = true }
                            }
                        }
                    }
                )
            }
            
            composable(Routes.ONBOARDING_ATTRIBUTES) {
                val viewModel: ProfileViewModel = hiltViewModel()
                AttributesFlowScreen(
                    onAttributesSelected = { _ ->
                        viewModel.updateOnboardingStep(6) {
                            navController.navigate(Routes.DISCOVER) {
                                popUpTo(Routes.ONBOARDING_ATTRIBUTES) { inclusive = true }
                            }
                        }
                    }
                )
            }

            // ── Main tabs ────────────────────────────────────────────────────────

            composable(Routes.DISCOVER) { 
                OnboardingGate(
                    onIncompleteProfile = {
                        navController.navigate(Routes.PROFILE_EDIT) {
                            launchSingleTop = true
                        }
                    }
                ) {
                    com.align.app.ui.discover.DiscoverScreen() 
                }
            }
            composable(Routes.COLLEGE)  { 
                com.align.app.ui.college.CollegeScreen(
                    onNavigateToVerify = { navController.navigate(Routes.COLLEGE_PICKER) }
                ) 
            }
            composable(Routes.EXPLORE)  { ExploreScreen() }
            composable(Routes.MATCHES)  { MatchesScreen() }
            composable(Routes.CHATS)    { ChatsScreen() }

            composable(Routes.DISCOVERY_SETTINGS) {
                com.align.app.ui.discover.DiscoverySettingsScreen(
                    onBack = { navController.popBackStack() }
                )
            }

            // ── Profile hub ────────────────────────────────────────────────

            // PROFILE = top-level entry from avatar icon → goes to edit hub
            composable(Routes.PROFILE) {
                ProfileEditScreen(
                    onNavigateToGallery         = { navController.navigate(Routes.PHOTO_GALLERY) },
                    onNavigateToCollegePicker   = { navController.navigate(Routes.COLLEGE_PICKER) },
                    onNavigateToAttributes      = { navController.navigate(Routes.ATTRIBUTES_FLOW) },
                    onNavigateToHometown        = { navController.navigate(Routes.HOMETOWN_PICKER) },
                    onNavigateToPlaces          = { navController.navigate(Routes.PLACES_PICKER) },
                    onNavigateToSettings        = { navController.navigate(Routes.DISCOVERY_SETTINGS) },
                )
            }

            composable(Routes.PROFILE_EDIT) {
                ProfileEditScreen(
                    onNavigateToGallery         = { navController.navigate(Routes.PHOTO_GALLERY) },
                    onNavigateToCollegePicker   = { navController.navigate(Routes.COLLEGE_PICKER) },
                    onNavigateToAttributes      = { navController.navigate(Routes.ATTRIBUTES_FLOW) },
                    onNavigateToHometown        = { navController.navigate(Routes.HOMETOWN_PICKER) },
                    onNavigateToPlaces          = { navController.navigate(Routes.PLACES_PICKER) },
                    onNavigateToSettings        = { navController.navigate(Routes.DISCOVERY_SETTINGS) },
                )
            }

            // Photo gallery
            composable(Routes.PHOTO_GALLERY) {
                PhotoGalleryScreen()
            }

            // College picker → on selection navigate to verification
            composable(Routes.COLLEGE_PICKER) {
                CollegePickerScreen(
                    onCollegeSelected = { collegeId ->
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
                val collegeId = backStackEntry.arguments?.getInt("collegeId") ?: 0
                val collegeName = backStackEntry.arguments?.getString("collegeName") ?: ""
                CollegeVerificationScreen(
                    collegeId = collegeId,
                    collegeName = collegeName,
                    onVerificationSubmitted = {
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

@Composable
fun OnboardingGate(
    viewModel: ProfileViewModel = hiltViewModel(),
    onIncompleteProfile: () -> Unit,
    content: @Composable () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(uiState.isLoading, uiState.profile, uiState.photos) {
        if (!uiState.isLoading) {
            val isProfileComplete = uiState.profile?.isComplete == true
            val hasEnoughPhotos = uiState.photos.size >= 3

            if (!isProfileComplete || !hasEnoughPhotos) {
                onIncompleteProfile()
            }
        }
    }

    if (uiState.isLoading) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
    } else {
        val isProfileComplete = uiState.profile?.isComplete == true
        val hasEnoughPhotos = uiState.photos.size >= 3
        if (isProfileComplete && hasEnoughPhotos) {
            content()
        }
    }
}
