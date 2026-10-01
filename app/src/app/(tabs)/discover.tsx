import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';
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
import { useRouter } from 'expo-router';
import { getImageUrl } from '../../utils/media';
import { logger } from '../../utils/logger';
import ProfileModal from '../../components/ProfileModal';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD_X = SCREEN_WIDTH * 0.3;
const SWIPE_THRESHOLD_Y = SCREEN_HEIGHT * 0.2;

export default function Discover() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isSwiping = useSharedValue(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const { data, error } = await supabase.rpc('get_feed', {
        p_mode: 'discover',
        p_scope: null,
        p_cursor: null,
        p_limit: 20
      });

      if (error) throw error;
      setProfiles(data || []);
      setCurrentIndex(0);
    } catch (err: any) {
      if (err.message === 'location required' || err.message?.includes('location')) {
        Alert.alert(
          'Location Required',
          'Please turn on your location to discover people near you.',
          [{ text: 'Enable Location', onPress: () => router.replace('/location-gate' as any) }]
        );
      } else {
        logger.warn('Discover', 'Error loading feed:', err?.message || err);
        Alert.alert('Error loading feed', err?.message || 'Unknown error');
      }
    }
  };

  const onSwipeComplete = async (direction: 'left' | 'right' | 'up') => {
    const swipedProfile = profiles[currentIndex];
    setCurrentIndex((prev) => prev + 1);
    translateX.value = 0;
    translateY.value = 0;

    if (swipedProfile) {
      try {
        const isLike = direction === 'right' || direction === 'up';
        const pDirection = direction === 'up' ? 'super' : (direction === 'right' ? 'like' : 'pass');
        const { data: isMutual, error } = await supabase.rpc('swipe', {
          p_target_id: swipedProfile.id,
          p_direction: pDirection,
          p_source: 'discover'
        });

        if (error) logger.warn('Discover', 'Swipe RPC warning:', error.message);
        
        if (isMutual) {
          Alert.alert("It's a Match!", `You and ${swipedProfile.first_name} liked each other!`);
        }
      } catch (err: any) {
        logger.warn('Discover', 'Unexpected swipe error:', err?.message || err);
      }
    }
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
    if (currentIndex >= profiles.length) {
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

    return profiles.map((profile, i) => {
      if (i < currentIndex) return null;

      const renderCardContent = (p: any) => (
        <>
          <Image source={{ uri: getImageUrl(p) }} style={styles.image} />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.88)']} style={styles.gradient}>
            <View style={styles.cardInfo}>
              <View style={styles.nameRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Text style={styles.name}>{p.first_name || 'Student'}, {p.age || 21}</Text>
                  {p.is_blue_tick && (
                    <Ionicons name="checkmark-circle" size={24} color="#1DA1F2" style={{ marginLeft: 6 }} />
                  )}
                </View>
                <TouchableOpacity 
                  onPress={() => setSelectedProfile({
                    id: p.id,
                    name: p.first_name || 'Student',
                    age: p.age || 21,
                    college: p.college?.college_name || p.school || 'Campus Student',
                    bio: p.bio || '',
                    images: [getImageUrl(p)],
                    ideal_date: p.ideal_date,
                    communication_style: p.communication_style,
                    lifestyle_vibe: p.lifestyle_vibe,
                    interests: p.interests,
                  })}
                  style={styles.infoBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="information-circle-outline" size={28} color="#fff" />
                </TouchableOpacity>
              </View>

              <Text style={styles.college}>
                <Ionicons name="school" size={16} color="#ccc" /> {p.college?.college_name || p.school || 'Campus Student'}
              </Text>

              {/* Badges for ideal date & passions */}
              {(p.ideal_date || (Array.isArray(p.interests) && p.interests.length > 0)) && (
                <View style={styles.cardBadgesRow}>
                  {p.ideal_date ? (
                    <View style={styles.cardBadge}>
                      <Text style={styles.cardBadgeText}>🍷 {p.ideal_date}</Text>
                    </View>
                  ) : null}
                  {Array.isArray(p.interests) && p.interests.slice(0, 2).map((item: string, idx: number) => (
                    <View key={idx} style={[styles.cardBadge, styles.cardPassionBadge]}>
                      <Text style={styles.cardBadgeText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}

              {p.bio ? <Text style={styles.bio} numberOfLines={2}>{p.bio}</Text> : null}
            </View>
          </LinearGradient>
        </>
      );

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
              <Animated.View style={[styles.stamp, styles.superStamp, animatedLaterStyle]}>
                <Text style={styles.stampTextSuper}>SUPER</Text>
              </Animated.View>

              {renderCardContent(profile)}
            </Animated.View>
          </GestureDetector>
        );
      }

      const scale = 1 - 0.05 * (i - currentIndex);
      const topOffset = 15 * (i - currentIndex);

      return (
        <Animated.View key={profile.id} style={[styles.cardStyle, { top: topOffset, transform: [{ scale }] }]}>
          {renderCardContent(profile)}
        </Animated.View>
      );
    }).reverse();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="h1">Discover</Typography>
          <PressableScale style={styles.filterBtn} onPress={() => router.push('/discovery-settings' as any)}>
            <Ionicons name="options" size={24} color={lightTheme.primary} />
          </PressableScale>
        </View>
        
        <View style={styles.cardContainer}>
          {renderCards()}
        </View>
        
        <View style={styles.actions}>
          <PressableScale style={[styles.actionButton, styles.shadowBtn, { width: 50, height: 50 }]} onPress={() => Alert.alert('Premium feature', 'Rewind is a premium feature.')}>
            <Ionicons name="return-up-back" size={24} color="#f5b041" />
          </PressableScale>
          <PressableScale style={[styles.actionButton, styles.shadowBtn]} onPress={() => forceSwipe('left')}>
            <Ionicons name="close" size={36} color={lightTheme.danger} />
          </PressableScale>
          <PressableScale style={[styles.actionButton, styles.superLikeButton, styles.shadowBtn]} onPress={() => forceSwipe('up')}>
            <Ionicons name="star" size={32} color="#fff" />
          </PressableScale>
          <PressableScale style={[styles.actionButton, styles.likeButton, styles.shadowBtn]} onPress={() => forceSwipe('right')}>
            <Ionicons name="heart" size={36} color="#fff" />
          </PressableScale>
          <PressableScale style={[styles.actionButton, styles.shadowBtn, { width: 50, height: 50 }]} onPress={() => Alert.alert('Premium feature', 'Boost is a premium feature.')}>
            <Ionicons name="flash" size={24} color="#9b59b6" />
          </PressableScale>
        </View>

        {/* Profile Full View Modal */}
        <ProfileModal
          visible={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
          user={selectedProfile}
        />
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
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  name: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  infoBtn: {
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  college: { color: '#E0E0E0', fontSize: 16, fontWeight: '600' },
  cardBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 4,
  },
  cardBadge: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardPassionBadge: {
    backgroundColor: 'rgba(78,49,232,0.7)',
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cardBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  bio: { color: '#fff', fontSize: 14, lineHeight: 20, opacity: 0.9, marginTop: 2 },
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
  superLikeButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#3498db' },
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
  superStamp: { bottom: 120, top: 'auto', alignSelf: 'center', borderColor: '#3498db' },
  stampTextLike: { color: lightTheme.success, fontSize: 34, fontWeight: '900', letterSpacing: 2 },
  stampTextNope: { color: lightTheme.danger, fontSize: 34, fontWeight: '900', letterSpacing: 2 },
  stampTextSuper: { color: '#3498db', fontSize: 32, fontWeight: '900', letterSpacing: 2 },
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
