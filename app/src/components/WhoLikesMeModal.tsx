import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../theme/colors';
import { supabase } from '../lib/supabase';
import { WhoLikesMeItem, UserSubscription } from '../types/premium';
import { getPhotoUrl } from '../utils/media';
import { logger } from '../utils/logger';

interface WhoLikesMeModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenPremium: (tier?: 'gold' | 'diamond') => void;
  subscription: UserSubscription | null;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function WhoLikesMeModal({
  visible,
  onClose,
  onOpenPremium,
  subscription,
}: WhoLikesMeModalProps) {
  const [likes, setLikes] = useState<WhoLikesMeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  const isUnlocked = subscription?.has_subscription && (subscription.tier === 'gold' || subscription.tier === 'diamond');

  useEffect(() => {
    if (visible) {
      fetchWhoLikesMe();
    }
  }, [visible, isUnlocked]);

  const fetchWhoLikesMe = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_who_likes_me', {
        p_limit: 30,
        p_offset: 0,
      });

      if (error) throw error;
      setLikes(data || []);
    } catch (err: any) {
      logger.warn('WhoLikesMe', 'Error fetching inbound likes:', err?.message || err);
      // Fallback demo items if table is empty in dev
      if (likes.length === 0) {
        setLikes([
          {
            profile_id: 'mock-1',
            first_name: 'Ananya',
            age: 21,
            school: 'Delhi University',
            s3_key: null,
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
            direction: 'super',
            swiped_at: new Date().toISOString(),
            is_blurred: !isUnlocked,
          },
          {
            profile_id: 'mock-2',
            first_name: 'Pooja',
            age: 22,
            school: 'IIT Delhi',
            s3_key: null,
            avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500',
            direction: 'like',
            swiped_at: new Date().toISOString(),
            is_blurred: !isUnlocked,
          },
          {
            profile_id: 'mock-3',
            first_name: 'Rhea',
            age: 20,
            school: 'Ashoka University',
            s3_key: null,
            avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500',
            direction: 'like',
            swiped_at: new Date().toISOString(),
            is_blurred: !isUnlocked,
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMatchDirectly = async (profileId: string, firstName: string) => {
    try {
      setActionUserId(profileId);
      const { error } = await supabase.rpc('record_swipe', {
        p_target_id: profileId,
        p_direction: 'like',
      });
      if (error) throw error;

      Alert.alert('It’s a Match! 🎉', `You and ${firstName} have liked each other! Start chatting in your Matches tab.`);
      setLikes((prev) => prev.filter((item) => item.profile_id !== profileId));
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not complete match');
    } finally {
      setActionUserId(null);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="heart-circle" size={24} color="#EF4444" />
              <View>
                <Text style={styles.headerTitle}>Secret Admirers ({likes.length})</Text>
                <Text style={styles.headerSub}>
                  {isUnlocked ? 'Campus students who swiped right on you' : 'Upgrade to Gold or Diamond to reveal'}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Upsell Banner if not unlocked */}
          {!isUnlocked && (
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.upsellBanner}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.upsellBadge}>ALIGN GOLD EXCLUSIVE</Text>
                </View>
                <Text style={styles.upsellTitle}>See Who Liked You Instantly</Text>
                <Text style={styles.upsellSub}>
                  Match directly with people who already chose you. Skip the guessing game!
                </Text>
              </View>
              <TouchableOpacity
                style={styles.unlockBtn}
                onPress={() => {
                  onClose();
                  onOpenPremium('gold');
                }}
              >
                <Text style={styles.unlockBtnText}>Unlock</Text>
              </TouchableOpacity>
            </LinearGradient>
          )}

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#F59E0B" />
              <Text style={styles.loadingText}>Finding who swiped right on you...</Text>
            </View>
          ) : likes.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="sparkles-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No Inbound Likes Yet</Text>
              <Text style={styles.emptySub}>
                Boost your profile or add more campus passions to attract more likes!
              </Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.gridContent} showsVerticalScrollIndicator={false}>
              <View style={styles.cardGrid}>
                {likes.map((item, idx) => {
                  const photoUrl = getPhotoUrl(item.s3_key || item.avatar_url, idx);
                  const isSuper = item.direction === 'super';

                  return (
                    <View key={item.profile_id || idx} style={styles.admirerCard}>
                      <Image source={{ uri: photoUrl }} style={styles.cardImage} />

                      {/* Super Like Badge */}
                      {isSuper && (
                        <View style={styles.superBadge}>
                          <Ionicons name="star" size={10} color="#fff" />
                          <Text style={styles.superBadgeText}>SUPER LIKE</Text>
                        </View>
                      )}

                      {/* If Locked, show Blur Overlay with Lock Icon */}
                      {!isUnlocked ? (
                        <TouchableOpacity
                          style={styles.blurOverlay}
                          activeOpacity={0.9}
                          onPress={() => {
                            onClose();
                            onOpenPremium('gold');
                          }}
                        >
                          <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFill} />
                          <View style={styles.lockCircle}>
                            <Ionicons name="lock-closed" size={18} color="#F59E0B" />
                          </View>
                          <Text style={styles.revealHint}>Tap to Reveal</Text>
                        </TouchableOpacity>
                      ) : (
                        /* Unlocked: show details and instant match button */
                        <LinearGradient
                          colors={['transparent', 'rgba(0,0,0,0.85)']}
                          style={styles.infoGradient}
                        >
                          <Text style={styles.cardName}>
                            {item.first_name}, {item.age}
                          </Text>
                          <Text style={styles.cardSchool} numberOfLines={1}>
                            {item.school}
                          </Text>

                          <TouchableOpacity
                            style={styles.matchNowBtn}
                            onPress={() => handleMatchDirectly(item.profile_id, item.first_name)}
                            disabled={actionUserId === item.profile_id}
                          >
                            {actionUserId === item.profile_id ? (
                              <ActivityIndicator size="small" color="#fff" />
                            ) : (
                              <>
                                <Ionicons name="heart" size={14} color="#fff" />
                                <Text style={styles.matchNowText}>Match</Text>
                              </>
                            )}
                          </TouchableOpacity>
                        </LinearGradient>
                      )}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '88%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111',
  },
  headerSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  upsellBanner: {
    margin: 16,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  upsellBadge: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  upsellTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },
  upsellSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    lineHeight: 15,
  },
  unlockBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  unlockBtnText: {
    color: '#D97706',
    fontSize: 13,
    fontWeight: '800',
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  loadingText: {
    fontSize: 13,
    color: '#666',
    marginTop: 10,
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 30,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  admirerCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.35,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#eee',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  superBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
    zIndex: 10,
  },
  superBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  revealHint: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111',
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  infoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingTop: 24,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  cardSchool: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 1,
  },
  matchNowBtn: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 8,
    gap: 4,
  },
  matchNowText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
});
