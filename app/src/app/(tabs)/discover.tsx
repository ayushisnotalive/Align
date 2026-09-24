import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { PressableScale } from '../../components/ui/PressableScale';
import { Typography } from '../../components/ui/Typography';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD_X = SCREEN_WIDTH * 0.3;
const SWIPE_THRESHOLD_Y = SCREEN_HEIGHT * 0.2;

const MOCK_PROFILES = [
  { id: '1', name: 'Aarav', age: 21, college: 'IIT Delhi', bio: 'Coffee & Code. Swipe up if you want to grab matcha later!', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800' },
  { id: '2', name: 'Riya', age: 20, college: 'NIFT Delhi', bio: 'Design student. Always looking for aesthetic cafes.', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800' },
  { id: '3', name: 'Karan', age: 22, college: 'SRCC', bio: 'Finance bro by day, gamer by night. Let\'s align.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800' },
  { id: '4', name: 'Priya', age: 21, college: 'LSR', bio: 'Literature and philosophy. Catch me reading in the sun.', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800' },
];

export default function Discover() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isSwiping = useSharedValue(false);

  const onSwipeComplete = (direction: 'left' | 'right' | 'up') => {
    setCurrentIndex((prev) => prev + 1);
    translateX.value = 0;
    translateY.value = 0;
  };

  const forceSwipe = (direction: 'left' | 'right' | 'up') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    let toX = 0;
    let toY = 0;
    
    if (direction === 'right') toX = SCREEN_WIDTH * 1.5;
    else if (direction === 'left') toX = -SCREEN_WIDTH * 1.5;
    else if (direction === 'up') toY = -SCREEN_HEIGHT * 1.5;

    translateX.value = withSpring(toX, { velocity: 50 }, () => {
      runOnJS(onSwipeComplete)(direction);
    });
    translateY.value = withSpring(toY, { velocity: 50 });
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isSwiping.value = true;
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      isSwiping.value = false;
      
      const swipeRight = e.translationX > SWIPE_THRESHOLD_X || e.velocityX > 800;
      const swipeLeft = e.translationX < -SWIPE_THRESHOLD_X || e.velocityX < -800;
      const swipeUp = e.translationY < -SWIPE_THRESHOLD_Y || e.velocityY < -800;

      if (swipeRight) {
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, { velocity: e.velocityX }, () => {
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
          runOnJS(onSwipeComplete)('right');
        });
      } else if (swipeLeft) {
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, { velocity: e.velocityX }, () => {
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
          runOnJS(onSwipeComplete)('left');
        });
      } else if (swipeUp) {
        translateY.value = withSpring(-SCREEN_HEIGHT * 1.5, { velocity: e.velocityY }, () => {
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
          runOnJS(onSwipeComplete)('up');
        });
      } else {
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-10, 0, 10],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const animatedLikeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SCREEN_WIDTH / 4], [0, 1], Extrapolation.CLAMP),
  }));

  const animatedNopeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SCREEN_WIDTH / 4, 0], [1, 0], Extrapolation.CLAMP),
  }));

  const animatedLaterStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [-SCREEN_HEIGHT / 4, 0], [1, 0], Extrapolation.CLAMP),
  }));

  const renderCards = () => {
    if (currentIndex >= MOCK_PROFILES.length) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.radarRing}>
            <Ionicons name="scan-outline" size={64} color={lightTheme.primary} />
          </View>
          <Typography variant="h2" align="center" style={{ marginBottom: 8 }}>You've seen everyone!</Typography>
          <Typography variant="body" align="center" color="#888">Expand your radius to align with more people.</Typography>
        </View>
      );
    }

    return MOCK_PROFILES.map((profile, i) => {
      if (i < currentIndex) return null;

      if (i === currentIndex) {
        return (
          <GestureDetector key={profile.id} gesture={panGesture}>
            <Animated.View style={[styles.cardStyle, animatedCardStyle]}>
              <Animated.View style={[styles.stamp, styles.likeStamp, animatedLikeStyle]}>
                <Text style={styles.stampTextLike}>LIKE</Text>
              </Animated.View>
              <Animated.View style={[styles.stamp, styles.nopeStamp, animatedNopeStyle]}>
                <Text style={styles.stampTextNope}>NOPE</Text>
              </Animated.View>
              <Animated.View style={[styles.stamp, styles.laterStamp, animatedLaterStyle]}>
                <Text style={styles.stampTextLater}>LATER</Text>
              </Animated.View>

              <Image source={{ uri: profile.image }} style={styles.image} />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.gradient}>
                <View style={styles.cardInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{profile.name}, {profile.age}</Text>
                    <Ionicons name="checkmark-circle" size={24} color="#1DA1F2" />
                  </View>
                  <Text style={styles.college}><Ionicons name="school" size={16} color="#ccc" /> {profile.college}</Text>
                  {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
                </View>
              </LinearGradient>
            </Animated.View>
          </GestureDetector>
        );
      }

      const scale = 1 - 0.05 * (i - currentIndex);
      const topOffset = 15 * (i - currentIndex);

      return (
        <Animated.View key={profile.id} style={[styles.cardStyle, { top: topOffset, transform: [{ scale }] }]}>
          <Image source={{ uri: profile.image }} style={styles.image} />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.gradient}>
            <View style={styles.cardInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{profile.name}, {profile.age}</Text>
                <Ionicons name="checkmark-circle" size={24} color="#1DA1F2" />
              </View>
              <Text style={styles.college}><Ionicons name="school" size={16} color="#ccc" /> {profile.college}</Text>
              {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
            </View>
          </LinearGradient>
        </Animated.View>
      );
    }).reverse();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="h1">Discover</Typography>
          <PressableScale style={styles.filterBtn}>
            <Ionicons name="options" size={24} color={lightTheme.primary} />
          </PressableScale>
        </View>
        
        <View style={styles.cardContainer}>
          {renderCards()}
        </View>
        
        <View style={styles.actions}>
          <PressableScale style={[styles.actionButton, styles.shadowBtn]} onPress={() => forceSwipe('left')}>
            <Ionicons name="close" size={36} color={lightTheme.danger} />
          </PressableScale>
          <PressableScale style={[styles.actionButton, styles.laterButton, styles.shadowBtn]} onPress={() => forceSwipe('up')}>
            <Ionicons name="time" size={32} color={lightTheme.info} />
          </PressableScale>
          <PressableScale style={[styles.actionButton, styles.likeButton, styles.shadowBtn]} onPress={() => forceSwipe('right')}>
            <Ionicons name="heart" size={36} color="#fff" />
          </PressableScale>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: lightTheme.background,
  },
  filterBtn: {
    padding: 8,
    backgroundColor: lightTheme.surface,
    borderRadius: 12,
    ...lightTheme.shadows.sm,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 12,
    zIndex: 2,
  },
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH - 24,
    height: SCREEN_HEIGHT * 0.65,
    borderRadius: 24,
    backgroundColor: lightTheme.surface,
    ...lightTheme.shadows.lg,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '45%',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    justifyContent: 'flex-end',
    padding: 24,
  },
  cardInfo: { gap: 6 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  college: { color: '#E0E0E0', fontSize: 18, fontWeight: '500', marginBottom: 4 },
  bio: { color: '#fff', fontSize: 16, lineHeight: 22, opacity: 0.9 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 20,
    gap: 20,
    zIndex: 1,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: lightTheme.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  laterButton: { width: 56, height: 56, borderRadius: 28 },
  likeButton: { width: 72, height: 72, borderRadius: 36, backgroundColor: lightTheme.primary },
  shadowBtn: lightTheme.shadows.md,
  stamp: {
    position: 'absolute',
    top: 60,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 4,
    borderRadius: 12,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  likeStamp: { left: 40, borderColor: lightTheme.success, transform: [{ rotate: '-15deg' }] },
  nopeStamp: { right: 40, borderColor: lightTheme.danger, transform: [{ rotate: '15deg' }] },
  laterStamp: { bottom: 120, top: 'auto', alignSelf: 'center', borderColor: lightTheme.info },
  stampTextLike: { color: lightTheme.success, fontSize: 34, fontWeight: '900', letterSpacing: 2 },
  stampTextNope: { color: lightTheme.danger, fontSize: 34, fontWeight: '900', letterSpacing: 2 },
  stampTextLater: { color: lightTheme.info, fontSize: 32, fontWeight: '900', letterSpacing: 2 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  radarRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(78,49,232,0.1)', // Primary transparent
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
});
