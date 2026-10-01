import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { lightTheme } from '../theme/colors';
import { supabase } from '../lib/supabase';
import { getPhotoUrl } from '../utils/media';
import { logger } from '../utils/logger';

interface PhotoItem {
  photo_id: string;
  media_id: string;
  s3_key: string;
  position: number;
  likes_count: number;
  impressions_count: number;
  like_percentage: number;
  is_best_performing: boolean;
}

interface PhotoManagerModalProps {
  visible: boolean;
  onClose: () => void;
  onProfileIconChanged?: (url: string) => void;
}

export default function PhotoManagerModal({
  visible,
  onClose,
  onProfileIconChanged,
}: PhotoManagerModalProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_user_photo_insights');
      if (error) throw error;

      if (data) {
        setIsPro(data.is_pro ?? false);
        setTotalLikes(data.total_likes ?? 0);
        setPhotos(data.photos || []);
      }
    } catch (err: any) {
      logger.warn('PhotoManager', 'Failed to fetch photo insights:', err?.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      fetchInsights();
    }
  }, [visible, fetchInsights]);

  // Set a photo as Primary (#1)
  const handleSetPrimary = async (photoId: string) => {
    try {
      setActionLoadingId(photoId);
      const { error } = await supabase.rpc('set_primary_photo', { p_photo_id: photoId });
      if (error) throw error;
      await fetchInsights();
      Alert.alert('Primary Photo Updated', 'This photo is now your main primary image shown first to others!');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not set primary photo');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Swap two adjacent photos (e.g. 1st and 2nd)
  const handleSwapPositions = async (indexA: number, indexB: number) => {
    if (indexA < 0 || indexB < 0 || indexA >= photos.length || indexB >= photos.length) return;

    try {
      const newPhotos = [...photos];
      const temp = newPhotos[indexA];
      newPhotos[indexA] = newPhotos[indexB];
      newPhotos[indexB] = temp;

      const photoIds = newPhotos.map((p) => p.photo_id);
      setActionLoadingId(photos[indexA].photo_id);

      const { error } = await supabase.rpc('reorder_user_photos', { p_photo_ids: photoIds });
      if (error) throw error;

      await fetchInsights();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not reorder photos');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Set photo as Profile Icon (avatar_url)
  const handleSetAsProfileIcon = async (s3Key: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      const photoUrl = getPhotoUrl(s3Key);
      const { error } = await supabase
        .from('profile_details')
        .upsert({ user_id: session.user.id, avatar_url: photoUrl }, { onConflict: 'user_id' });

      if (error) throw error;
      if (onProfileIconChanged) onProfileIconChanged(photoUrl);

      Alert.alert('Icon Updated', 'This photo is now set as your profile avatar icon!');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not update profile icon');
    }
  };

  // Upload a new photo to next slot
  const handleUploadPhoto = async () => {
    if (photos.length >= 6) {
      Alert.alert('Limit Reached', 'You can upload up to 6 profile photos.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.85,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      setUploading(true);
      const localUri = result.assets[0].uri;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      let blob: Blob | null = null;
      try {
        const res = await fetch(localUri);
        blob = await res.blob();
      } catch (e) {
        // fallback
      }

      const nextPosition = photos.length + 1;
      const s3Key = `photos/${session.user.id}/${Date.now()}_slot${nextPosition}.jpg`;
      const sizeBytes = blob ? blob.size : 20480;
      const mimeType = blob?.type || 'image/jpeg';

      const { data: mediaData, error: mediaErr } = await supabase
        .from('media')
        .insert({
          owner_id: session.user.id,
          kind: 'profile_photo',
          bucket: 'align-media',
          s3_key: s3Key,
          mime_type: mimeType,
          size_bytes: sizeBytes,
          moderation_status: 'ok',
        })
        .select()
        .single();

      if (mediaErr) throw mediaErr;

      const { error: photoErr } = await supabase.from('photos').insert({
        user_id: session.user.id,
        media_id: mediaData.id,
        position: nextPosition,
      });

      if (photoErr) throw photoErr;

      // If it's their very first photo, also make it default profile icon
      if (nextPosition === 1) {
        const photoUrl = getPhotoUrl(s3Key);
        await supabase
          .from('profile_details')
          .upsert({ user_id: session.user.id, avatar_url: photoUrl }, { onConflict: 'user_id' });
        if (onProfileIconChanged) onProfileIconChanged(photoUrl);
      }

      await fetchInsights();
      Alert.alert('Photo Added', `Photo added to slot ${nextPosition}!`);
    } catch (err: any) {
      Alert.alert('Upload Failed', err?.message || 'Could not upload photo');
    } finally {
      setUploading(false);
    }
  };

  // Delete a photo
  const handleDeletePhoto = (photoId: string, position: number) => {
    Alert.alert('Delete Photo', 'Are you sure you want to remove this photo from your profile?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setActionLoadingId(photoId);
            const { error } = await supabase.from('photos').delete().eq('id', photoId);
            if (error) throw error;

            // Reorder remaining
            const remaining = photos.filter((p) => p.photo_id !== photoId);
            if (remaining.length > 0) {
              await supabase.rpc('reorder_user_photos', {
                p_photo_ids: remaining.map((p) => p.photo_id),
              });
            }

            await fetchInsights();
          } catch (err: any) {
            Alert.alert('Error', err?.message || 'Could not delete photo');
          } finally {
            setActionLoadingId(null);
          }
        },
      },
    ]);
  };

  const bestPhoto = photos.find((p) => p.is_best_performing);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Manage Photos & Insights</Text>
              <Text style={styles.subtitle}>Drag order, pick profile icon & track photo likes</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={lightTheme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
            {/* Pro Status / Insights Banner */}
            <View style={[styles.proBanner, isPro ? styles.proBannerActive : styles.proBannerTrial]}>
              <View style={styles.proBannerIconWrap}>
                <Ionicons name={isPro ? 'sparkles' : 'lock-closed'} size={20} color="#fff" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.proBannerTitle}>{isPro ? 'ALIGN PRO: PHOTO ANALYTICS' : 'ALIGN PRO INSIGHTS'}</Text>
                  <View style={styles.proTag}>
                    <Text style={styles.proTagText}>{isPro ? 'ACTIVE' : 'PREVIEW'}</Text>
                  </View>
                </View>
                <Text style={styles.proBannerSub}>
                  {isPro
                    ? `Tracking engagement across all ${photos.length} photos. Total likes: ${totalLikes}`
                    : 'See which photo gets you the most likes & matches so you can make it primary!'}
                </Text>
              </View>
            </View>

            {/* Most Liked Photo Call to Action */}
            {bestPhoto && bestPhoto.position !== 1 && (
              <View style={styles.smartPhotoAlert}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Ionicons name="trophy" size={24} color="#F59E0B" />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.smartPhotoTitle}>Smart Photo Recommendation</Text>
                    <Text style={styles.smartPhotoSub}>
                      Photo #{bestPhoto.position} is winning with {bestPhoto.likes_count} likes ({bestPhoto.like_percentage}% of your matches)!
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.smartPhotoBtn}
                  onPress={() => handleSetPrimary(bestPhoto.photo_id)}
                >
                  <Text style={styles.smartPhotoBtnText}>Make Primary</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Photos Grid with Reordering & Analytics */}
            <View style={styles.gridHeader}>
              <Text style={styles.sectionTitle}>Profile Photos ({photos.length}/6)</Text>
              <Text style={styles.dragHelpText}>1st photo is your primary card</Text>
            </View>

            {loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color={lightTheme.primary} />
                <Text style={styles.loadingText}>Loading photo performance...</Text>
              </View>
            ) : (
              <View style={styles.photoGrid}>
                {photos.map((photo, index) => {
                  const isPrimary = photo.position === 1;
                  const isBusy = actionLoadingId === photo.photo_id;

                  return (
                    <View key={photo.photo_id} style={[styles.photoCard, isPrimary && styles.photoCardPrimary]}>
                      <Image source={{ uri: getPhotoUrl(photo.s3_key) }} style={styles.photoImg} />

                      {/* Primary / Slot Badge */}
                      <View style={[styles.badgePosition, isPrimary && styles.badgePrimary]}>
                        <Ionicons name={isPrimary ? 'star' : 'image'} size={12} color="#fff" />
                        <Text style={styles.badgePositionText}>{isPrimary ? 'PRIMARY' : `#${photo.position}`}</Text>
                      </View>

                      {/* Best Performing Badge */}
                      {photo.is_best_performing && (
                        <View style={styles.badgeBest}>
                          <Ionicons name="trophy" size={11} color="#fff" />
                          <Text style={styles.badgeBestText}>TOP LIKED</Text>
                        </View>
                      )}

                      {/* Insights Overlay */}
                      <View style={styles.photoStatsBar}>
                        <View style={styles.statChip}>
                          <Ionicons name="heart" size={11} color="#EF4444" />
                          <Text style={styles.statChipText}>{photo.likes_count} likes</Text>
                        </View>
                        {photo.like_percentage > 0 && (
                          <View style={[styles.statChip, { backgroundColor: 'rgba(78,49,232,0.85)' }]}>
                            <Text style={styles.statChipText}>{photo.like_percentage}%</Text>
                          </View>
                        )}
                      </View>

                      {/* Reorder and Action Buttons */}
                      <View style={styles.actionOverlay}>
                        {isBusy ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <>
                            {/* Reorder Controls */}
                            <View style={styles.reorderRow}>
                              {index > 0 && (
                                <TouchableOpacity
                                  style={styles.reorderBtn}
                                  onPress={() => handleSwapPositions(index, index - 1)}
                                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                >
                                  <Ionicons name="chevron-back" size={14} color="#fff" />
                                </TouchableOpacity>
                              )}
                              {index < photos.length - 1 && (
                                <TouchableOpacity
                                  style={styles.reorderBtn}
                                  onPress={() => handleSwapPositions(index, index + 1)}
                                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                >
                                  <Ionicons name="chevron-forward" size={14} color="#fff" />
                                </TouchableOpacity>
                              )}
                            </View>

                            {/* Set as Primary & Set as Icon */}
                            <View style={styles.controlRow}>
                              {!isPrimary && (
                                <TouchableOpacity
                                  style={styles.pillActionBtn}
                                  onPress={() => handleSetPrimary(photo.photo_id)}
                                >
                                  <Text style={styles.pillActionText}>Make Primary</Text>
                                </TouchableOpacity>
                              )}
                              <TouchableOpacity
                                style={[styles.pillActionBtn, { backgroundColor: 'rgba(255,255,255,0.25)' }]}
                                onPress={() => handleSetAsProfileIcon(photo.s3_key)}
                              >
                                <Ionicons name="person-circle-outline" size={12} color="#fff" />
                                <Text style={styles.pillActionText}>Set Icon</Text>
                              </TouchableOpacity>
                            </View>
                          </>
                        )}
                      </View>

                      {/* Delete button */}
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDeletePhoto(photo.photo_id, photo.position)}
                      >
                        <Ionicons name="trash-outline" size={14} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  );
                })}

                {/* Add Photo Slot if less than 6 */}
                {photos.length < 6 && (
                  <TouchableOpacity
                    style={styles.addSlotCard}
                    onPress={handleUploadPhoto}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <ActivityIndicator size="small" color={lightTheme.primary} />
                    ) : (
                      <>
                        <View style={styles.addSlotIcon}>
                          <Ionicons name="add" size={28} color={lightTheme.primary} />
                        </View>
                        <Text style={styles.addSlotText}>Add Photo</Text>
                        <Text style={styles.addSlotSub}>Slot #{photos.length + 1}</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Quick Swap 1st and 2nd button for convenience */}
            {photos.length >= 2 && (
              <TouchableOpacity
                style={styles.quickSwapBtn}
                onPress={() => handleSwapPositions(0, 1)}
              >
                <Ionicons name="swap-horizontal" size={18} color={lightTheme.primary} />
                <Text style={styles.quickSwapText}>Swap 1st and 2nd Photo</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: lightTheme.text,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  proBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 14,
  },
  proBannerActive: {
    backgroundColor: '#1E1B4B',
  },
  proBannerTrial: {
    backgroundColor: '#312E81',
  },
  proBannerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  proBannerTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
  proTag: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    marginLeft: 8,
  },
  proTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
  },
  proBannerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    lineHeight: 16,
  },
  smartPhotoAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 16,
  },
  smartPhotoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  smartPhotoSub: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 2,
  },
  smartPhotoBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 8,
  },
  smartPhotoBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dragHelpText: {
    fontSize: 12,
    color: lightTheme.primary,
    fontWeight: '600',
  },
  loadingBox: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  photoCard: {
    width: '47.5%',
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  photoCardPrimary: {
    borderColor: '#F59E0B',
    borderWidth: 2.5,
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  badgePosition: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgePrimary: {
    backgroundColor: '#F59E0B',
  },
  badgePositionText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  badgeBest: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeBestText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
  photoStatsBar: {
    position: 'absolute',
    bottom: 50,
    left: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statChipText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  actionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 6,
    gap: 4,
  },
  reorderRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 2,
  },
  reorderBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 4,
  },
  pillActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: lightTheme.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pillActionText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  deleteBtn: {
    position: 'absolute',
    top: 36,
    right: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSlotCard: {
    width: '47.5%',
    height: 220,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  addSlotIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(78,49,232,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSlotText: {
    fontSize: 14,
    fontWeight: '700',
    color: lightTheme.primary,
  },
  addSlotSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  quickSwapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EEF2FF',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginTop: 8,
  },
  quickSwapText: {
    fontSize: 14,
    fontWeight: '700',
    color: lightTheme.primary,
  },
});
