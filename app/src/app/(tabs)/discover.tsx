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
import { getImageUrl, getPhotoUrl } from '../../utils/media';
import { logger } from '../../utils/logger';
import ProfileModal from '../../components/ProfileModal';
import PremiumModal from '../../components/PremiumModal';
import { PremiumTier } from '../../types/premium';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD_X = SCREEN_WIDTH * 0.3;
const SWIPE_THRESHOLD_Y = SCREEN_HEIGHT * 0.2;

export default function Discover() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [photoIndexMap, setPhotoIndexMap] = useState<{ [id: string]: number }>({});
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumInitialTier, setPremiumInitialTier] = useState<PremiumTier>('plus');

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
      const feedData = data || [];

      // Smart Photos: Always show random photos by default across candidate cards
      const initialMap: { [id: string]: number } = {};
      feedData.forEach((p: any) => {
        const count = Array.isArray(p.photos) ? p.photos.length : 0;
        initialMap[p.id] = count > 1 ? Math.floor(Math.random() * count) : 0;
      });
      setPhotoIndexMap(initialMap);
      setProfiles(feedData);
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

  const handleNextPhoto = (profileId: string, maxPhotos: number) => {
    if (maxPhotos <= 1) return;
    setPhotoIndexMap((prev) => ({
      ...prev,
      [profileId]: ((prev[profileId] ?? 0) + 1) % maxPhotos,
    }));
  };

  const handlePrevPhoto = (profileId: string, maxPhotos: number) => {
    if (maxPhotos <= 1) return;
    setPhotoIndexMap((prev) => ({
      ...prev,
      [profileId]: (prev[profileId] ?? 0) <= 0 ? maxPhotos - 1 : (prev[profileId] ?? 0) - 1,
    }));
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

        // Look up photo that was active on the card when swiped
        const activeIdx = photoIndexMap[swipedProfile.id] ?? 0;
        const activePhoto = Array.isArray(swipedProfile.photos) && swipedProfile.photos[activeIdx];
        const activePhotoId = activePhoto?.photo_id || null;

        const { data: isMutual, error } = await supabase.rpc('swipe', {
          p_target_id: swipedProfile.id,
          p_direction: pDirection,
          p_source: 'discover',
          p_photo_id: activePhotoId
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

  const handleRewind = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const { data, error } = await supabase.rpc('rewind_last_swipe');
      if (error) {
        if (error.message?.includes('subscription required') || error.message?.includes('Align Plus')) {
          Alert.alert(
            '⚡ Rewind is an Align Plus Feature',
            'Accidentally swiped left? Get Align Plus, Gold, or Diamond to rewind your last swipe anytime!',
            [
              { text: 'Not now', style: 'cancel' },
              {
                text: 'View Plans',
                onPress: () => {
                  setPremiumInitialTier('plus');
                  setShowPremiumModal(true);
                },
              },
            ]
          );
        } else {
          Alert.alert('Cannot Rewind', error.message || 'No swipe available to rewind.');
        }
        return;
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Swiped Rewound! ⏪', 'Your last swipe has been undone.');
      await fetchFeed();
    } catch (err: any) {
      Alert.alert('Rewind Error', err?.message || 'Failed to rewind swipe');
    }
  };

  const handleBoost = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    try {
      const { data, error } = await supabase.rpc('boost_user_profile');
      if (error) {
        if (error.message?.includes('subscription required') || error.message?.includes('Align Plus')) {
          Alert.alert(
            '⚡ 10x Profile Views with Boost',
            'Get 1 Free Campus Boost every week with Align Plus, Gold, or Diamond to jump to the front of every card deck for 30 minutes!',
            [
              { text: 'Later', style: 'cancel' },
              {
                text: 'Unlock Boost',
                onPress: () => {
                  setPremiumInitialTier('plus');
                  setShowPremiumModal(true);
                },
              },
            ]
          );
        } else {
          Alert.alert('Boost Notice', error.message || 'Could not activate boost.');
        }
        return;
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('🚀 Campus Boost Active!', 'Your profile is now pinned to the top of all decks across campus for the next 30 minutes!');
    } catch (err: any) {
      Alert.alert('Boost Error', err?.message || 'Failed to boost profile');
    }
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

      const photosList = Array.isArray(profile.photos) && profile.photos.length > 0 ? profile.photos : [];
      const currentPhotoIdx = photoIndexMap[profile.id] ?? 0;
      const currentPhotoObj = photosList[currentPhotoIdx];
      const displayImageUrl = currentPhotoObj?.s3_key ? getPhotoUrl(currentPhotoObj.s3_key) : getImageUrl(profile);

      const allImageUrls = photosList.length > 0
        ? photosList.map((ph: any) => getPhotoUrl(ph.s3_key))
        : [getImageUrl(profile)];

      const renderCardContent = (p: any) => (
        <View style={{ flex: 1, width: '100%', height: '100%' }}>
          <Image source={{ uri: displayImageUrl }} style={styles.image} />

          {/* Photo Indicator Bars */}
          {photosList.length > 1 && (
            <View style={styles.photoIndicatorsRow}>
              {photosList.map((_: any, pIdx: number) => (
                <View
                  key={pIdx}
                  style={[
                    styles.indicatorBar,
                    pIdx === currentPhotoIdx && styles.indicatorBarActive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Touch zones to tap left / right for photos */}
          {photosList.length > 1 && (
            <View style={styles.photoTouchZones}>
              <TouchableOpacity
                style={styles.touchZoneLeft}
                onPress={() => handlePrevPhoto(p.id, photosList.length)}
                activeOpacity={1}
              />
              <TouchableOpacity
                style={styles.touchZoneRight}
                onPress={() => handleNextPhoto(p.id, photosList.length)}
                activeOpacity={1}
              />
            </View>
          )}

          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.88)']} style={styles.gradient}>
            <View style={styles.cardInfo}>
              <View style={styles.nameRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, flexWrap: 'wrap', gap: 6 }}>
                  <Text style={styles.name}>{p.first_name || 'Student'}, {p.age || 21}</Text>
                  {p.is_blue_tick && (
                    <Ionicons name="checkmark-circle" size={24} color="#1DA1F2" />
                  )}
                  {p.subscription_tier === 'diamond' && (
                    <View style={styles.diamondBadge}>
                      <Text style={styles.diamondBadgeText}>💎 VIP</Text>
                    </View>
                  )}
                  {p.subscription_tier === 'gold' && (
                    <View style={styles.goldBadge}>
                      <Text style={styles.goldBadgeText}>👑 Gold</Text>
                    </View>
                  )}
                  {p.is_boosted && (
                    <View style={styles.boostBadge}>
                      <Text style={styles.boostBadgeText}>⚡ Boosted</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity 
                  onPress={() => setSelectedProfile({
                    id: p.id,
                    name: p.first_name || 'Student',
                    age: p.age || 21,
                    college: p.college?.college_name || p.school || 'Campus Student',
                    bio: p.bio || '',
                    images: allImageUrls,
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
        </View>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <PressableScale
              style={styles.upgradeHeaderBtn}
              onPress={() => {
                setPremiumInitialTier('gold');
                setShowPremiumModal(true);
              }}
            >
              <Ionicons name="sparkles" size={16} color="#D4AF37" />
              <Text style={styles.upgradeHeaderBtnText}>UPGRADE</Text>
            </PressableScale>
            <PressableScale style={styles.filterBtn} onPress={() => router.push('/discovery-settings' as any)}>
              <Ionicons name="options" size={24} color={lightTheme.primary} />
            </PressableScale>
          </View>
        </View>
        
        <View style={styles.cardContainer}>
          {renderCards()}
        </View>
        
        <View style={styles.actions}>
          <PressableScale style={[styles.actionButton, styles.shadowBtn, { width: 50, height: 50 }]} onPress={handleRewind}>
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
          <PressableScale style={[styles.actionButton, styles.shadowBtn, { width: 50, height: 50 }]} onPress={handleBoost}>
            <Ionicons name="flash" size={24} color="#9b59b6" />
          </PressableScale>
        </View>

        {/* Profile Full View Modal */}
        <ProfileModal
          visible={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
          user={selectedProfile}
        />

        {/* 3-Tier Premium Modal */}
        <PremiumModal
          visible={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          initialTier={premiumInitialTier}
          onUpgradeSuccess={() => fetchFeed()}
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
  photoIndicatorsRow: {
    position: 'absolute',
    top: 12,
    left: 14,
    right: 14,
    flexDirection: 'row',
    gap: 6,
    zIndex: 10,
  },
  indicatorBar: {
    flex: 1,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  indicatorBarActive: {
    backgroundColor: '#fff',
  },
  photoTouchZones: {
    position: 'absolute',
    top: 25,
    bottom: '40%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 5,
  },
  touchZoneLeft: {
    flex: 1,
  },
  touchZoneRight: {
    flex: 1,
  },
  upgradeHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
  },
  upgradeHeaderBtnText: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  diamondBadge: {
    backgroundColor: 'rgba(0, 242, 254, 0.25)',
    borderColor: '#00F2FE',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  diamondBadgeText: {
    color: '#E0FFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  goldBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    borderColor: '#FFD700',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  goldBadgeText: {
    color: '#FFEAA7',
    fontSize: 11,
    fontWeight: '800',
  },
  boostBadge: {
    backgroundColor: 'rgba(155, 89, 182, 0.35)',
    borderColor: '#9B59B6',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  boostBadgeText: {
    color: '#E8DAEF',
    fontSize: 11,
    fontWeight: '800',
  },
});
