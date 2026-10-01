import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { lightTheme } from '../theme/colors';
import { PRESET_AVATARS } from '../constants/avatars';
import { supabase } from '../lib/supabase';
import { getPhotoUrl } from '../utils/media';

interface AvatarPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentAvatarUrl?: string | null;
  onPickCustom?: () => void;
  userPhotos?: string[];
}

export default function AvatarPickerModal({
  visible,
  onClose,
  onSelect,
  currentAvatarUrl,
  onPickCustom,
  userPhotos,
}: AvatarPickerModalProps) {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(userPhotos || []);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [uploadingCustom, setUploadingCustom] = useState(false);

  useEffect(() => {
    if (userPhotos && userPhotos.length > 0) {
      setUploadedPhotos(userPhotos);
      return;
    }

    if (!visible) return;

    const fetchUserPhotos = async () => {
      try {
        setLoadingPhotos(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        const { data, error } = await supabase
          .from('photos')
          .select('id, position, media:media_id(s3_key)')
          .eq('user_id', session.user.id)
          .order('position', { ascending: true });

        if (error) {
          // If RLS or relationship, fallback to media
          const { data: mediaData } = await supabase
            .from('media')
            .select('s3_key')
            .eq('owner_id', session.user.id)
            .eq('kind', 'profile_photo')
            .is('deleted_at', null);

          if (mediaData && mediaData.length > 0) {
            setUploadedPhotos(mediaData.map((m: any) => getPhotoUrl(m.s3_key)));
          }
          return;
        }

        if (data && data.length > 0) {
          const urls = data
            .map((p: any) => {
              const key = p.media?.s3_key;
              return key ? getPhotoUrl(key) : null;
            })
            .filter(Boolean) as string[];
          setUploadedPhotos(urls);
        }
      } catch (e) {
        // non-blocking
      } finally {
        setLoadingPhotos(false);
      }
    };

    fetchUserPhotos();
  }, [visible, userPhotos]);

  const handlePickFromGallery = async () => {
    if (onPickCustom) {
      onPickCustom();
      return;
    }

    try {
      setUploadingCustom(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const localUri = result.assets[0].uri;
        onSelect(localUri);
        onClose();
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not pick photo');
    } finally {
      setUploadingCustom(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Choose Profile Icon</Text>
              <Text style={styles.subtitle}>Pick from your uploaded photos or choose an avatar</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={lightTheme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Uploaded Photos Section */}
            <View style={styles.sectionHeaderWrap}>
              <Text style={styles.sectionTitle}>My Uploaded Photos</Text>
              <Text style={styles.sectionCounter}>
                {uploadedPhotos.length} {uploadedPhotos.length === 1 ? 'photo' : 'photos'} available
              </Text>
            </View>

            {loadingPhotos ? (
              <View style={styles.photoLoading}>
                <ActivityIndicator size="small" color={lightTheme.primary} />
                <Text style={styles.photoLoadingText}>Loading your photos...</Text>
              </View>
            ) : uploadedPhotos.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
                {uploadedPhotos.map((url, idx) => {
                  const isSelected = currentAvatarUrl === url;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.userPhotoCard, isSelected && styles.userPhotoCardSelected]}
                      onPress={() => {
                        onSelect(url);
                        onClose();
                      }}
                    >
                      <Image source={{ uri: url }} style={styles.userPhotoImg} />
                      <View style={[styles.photoTag, idx === 0 && styles.primaryTag]}>
                        <Text style={styles.photoTagText}>{idx === 0 ? 'Primary' : `Photo #${idx + 1}`}</Text>
                      </View>
                      {isSelected && (
                        <View style={styles.checkBadge}>
                          <Ionicons name="checkmark" size={14} color="#fff" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : (
              <View style={styles.noPhotosBox}>
                <Ionicons name="images-outline" size={28} color="#94A3B8" />
                <Text style={styles.noPhotosText}>No profile photos uploaded yet</Text>
              </View>
            )}

            {/* Custom Gallery Picker Button */}
            <TouchableOpacity 
              style={styles.customBtn} 
              onPress={handlePickFromGallery}
              disabled={uploadingCustom}
            >
              <View style={styles.customIconWrap}>
                {uploadingCustom ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="camera-outline" size={22} color="#fff" />
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.customBtnTitle}>Upload New Icon from Gallery</Text>
                <Text style={styles.customBtnSub}>Crop and set any picture from your device</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>

            {/* Persona Preset Avatars */}
            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Or Choose an Avatar Persona</Text>
            <View style={styles.avatarGrid}>
              {PRESET_AVATARS.map((item) => {
                const isSelected = currentAvatarUrl === item.url;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.avatarCard, isSelected && styles.avatarCardSelected]}
                    onPress={() => {
                      onSelect(item.url);
                      onClose();
                    }}
                  >
                    <Image source={{ uri: item.url }} style={styles.avatarImg} />
                    <Text style={styles.avatarName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Ionicons name="checkmark" size={14} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: '88%',
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
    color: '#777',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  sectionHeaderWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCounter: {
    fontSize: 12,
    fontWeight: '600',
    color: lightTheme.primary,
  },
  photoScroll: {
    marginBottom: 16,
    paddingVertical: 4,
  },
  userPhotoCard: {
    width: 90,
    height: 120,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  userPhotoCardSelected: {
    borderColor: lightTheme.primary,
    borderWidth: 2.5,
  },
  userPhotoImg: {
    width: '100%',
    height: '100%',
  },
  photoTag: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 6,
    paddingVertical: 2,
    alignItems: 'center',
  },
  primaryTag: {
    backgroundColor: 'rgba(78,49,232,0.9)',
  },
  photoTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  photoLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  photoLoadingText: {
    fontSize: 13,
    color: '#64748B',
  },
  noPhotosBox: {
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginBottom: 14,
    gap: 4,
  },
  noPhotosText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  customBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  customIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: lightTheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customBtnTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: lightTheme.text,
  },
  customBtnSub: {
    fontSize: 12,
    color: '#64748B',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  avatarCard: {
    width: '30%',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#fafafa',
  },
  avatarCardSelected: {
    borderColor: lightTheme.primary,
    backgroundColor: '#f0f3ff',
  },
  avatarImg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eee',
  },
  avatarName: {
    fontSize: 11,
    fontWeight: '600',
    color: lightTheme.text,
    marginTop: 6,
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: lightTheme.primary,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
