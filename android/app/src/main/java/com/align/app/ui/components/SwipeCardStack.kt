package com.align.app.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.VectorConverter
import androidx.compose.animation.core.tween
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch
import kotlin.math.abs
import kotlin.math.roundToInt

enum class SwipeDirection {
    Left, Right, Up, Down
}

@Composable
fun <T> SwipeCardStack(
    items: List<T>,
    onSwipe: (T, SwipeDirection) -> Unit,
    onEmptyStack: @Composable () -> Unit,
    itemContent: @Composable (T) -> Unit
) {
    if (items.isEmpty()) {
        onEmptyStack()
        return
    }

    val screenWidth = with(LocalDensity.current) { LocalConfiguration.current.screenWidthDp.dp.toPx() }
    val scope = rememberCoroutineScope()
    
    // We only need to show the top two items to give a stacking effect.
    val visibleItems = items.take(2).reversed()

    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        visibleItems.forEachIndexed { index, item ->
            val isTopCard = item == items.first()
            
            // Animation state for the top card
            val offset = remember(item) { Animatable(Offset.Zero, Offset.VectorConverter) }
            val rotation = remember(item) { Animatable(0f) }

            Modifier.graphicsLayer {
                if (!isTopCard) {
                    scaleX = 0.95f
                    scaleY = 0.95f
                }
            }

            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .offset {
                        if (isTopCard) {
                            IntOffset(offset.value.x.roundToInt(), offset.value.y.roundToInt())
                        } else {
                            IntOffset.Zero
                        }
                    }
                    .graphicsLayer {
                        if (isTopCard) {
                            rotationZ = rotation.value
                        }
                    }
                    .pointerInput(item) {
                        if (isTopCard) {
                            detectDragGestures(
                                onDragEnd = {
                                    scope.launch {
                                        val swipeThreshold = screenWidth * 0.3f
                                        if (offset.value.x > swipeThreshold) {
                                            // Swipe Right
                                            offset.animateTo(Offset(screenWidth * 2, offset.value.y), tween(400))
                                            onSwipe(item, SwipeDirection.Right)
                                        } else if (offset.value.x < -swipeThreshold) {
                                            // Swipe Left
                                            offset.animateTo(Offset(-screenWidth * 2, offset.value.y), tween(400))
                                            onSwipe(item, SwipeDirection.Left)
                                        } else {
                                            // Snap back
                                            launch { offset.animateTo(Offset.Zero, tween(400)) }
                                            launch { rotation.animateTo(0f, tween(400)) }
                                        }
                                    }
                                }
                            ) { change, dragAmount ->
                                change.consume()
                                scope.launch {
                                    offset.snapTo(Offset(offset.value.x + dragAmount.x, offset.value.y + dragAmount.y))
                                    rotation.snapTo(offset.value.x / screenWidth * 15f) // max 15 degrees tilt
                                }
                            }
                        }
                    }
            ) {
                itemContent(item)
            }
        }
    }
}
