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
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.LaunchedEffect
import com.align.app.ui.splash.SplashViewModel
import com.align.app.ui.auth.LoginScreen
import com.align.app.ui.consent.ConsentScreen
import com.align.app.ui.location.LocationScreen

// ── Route constants ───────────────────────────────────────────────────────────

/**
 * All navigation route strings live here. No screen imports a raw string
 * literal — always use [Routes].
 */
object Routes {
    const val SPLASH   = "splash"
    const val LOGIN    = "login"
    const val CONSENT  = "consent"
    const val LOCATION_GATE = "location_gate"
    
    const val DISCOVER = "discover"
    const val COLLEGE  = "college"
    const val EXPLORE  = "explore"
    const val MATCHES  = "matches"
    const val CHATS    = "chats"
    const val PROFILE  = "profile"
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
 * - Profile is reachable from an avatar icon in the top bar (added per-screen
 *   in later phases). It hides the bottom bar.
 *
 * Each destination is a stub composable that will be replaced per-phase.
 * State, ViewModels, and Hilt injection are added when the real screen lands.
 *
 * Security: deep-link validation and FLAG_SECURE are applied per-destination
 * when the real screen is implemented (never globally here).
 */
@Composable
fun AppNavGraph() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    // Top-level tabs only show bottom bar
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
                                    // Pop back to start to avoid a deep back stack.
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
                
                // Show a simple loading screen for splash
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

            composable(Routes.DISCOVER) { DiscoverScreen() }
            composable(Routes.COLLEGE)  { CollegeScreen() }
            composable(Routes.EXPLORE)  { ExploreScreen() }
            composable(Routes.MATCHES)  { MatchesScreen() }
            composable(Routes.CHATS)    { ChatsScreen() }
            composable(Routes.PROFILE)  { ProfileScreen() }
        }
    }
}

// ── Stub screens — replaced one-by-one per phase ──────────────────────────────

@Composable private fun DiscoverScreen() = StubScreen("Discover")
@Composable private fun CollegeScreen()  = StubScreen("College")
@Composable private fun ExploreScreen()  = StubScreen("Explore")
@Composable private fun MatchesScreen()  = StubScreen("Matches")
@Composable private fun ChatsScreen()    = StubScreen("Chats")
@Composable private fun ProfileScreen()  = StubScreen("Profile")

@Composable
private fun StubScreen(name: String) {
    Box(
        modifier           = Modifier.fillMaxSize(),
        contentAlignment   = Alignment.Center,
    ) {
        Text(text = name)
    }
}
