import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { lightTheme } from '../../theme/colors';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { logger } from '../../utils/logger';
import { DEFAULT_AVATAR } from '../../constants/avatars';
import { getPhotoUrl } from '../../utils/media';

export default function Step2Photos() {
  const router = useRouter();
  const { session } = useAuthStore();
  const [photos, setPhotos] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_AVATAR);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (session?.user?.id) {
        const { data } = await supabase
          .from('profile_details')
          .select('avatar_url')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (data?.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
      }
    })();
  }, [session?.user?.id]);

  const pickImage = async () => {
    if (photos.length >= 6) {
      Alert.alert('Limit Reached', 'You can upload up to 6 photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const [selectedIconIndex, setSelectedIconIndex] = useState<number>(0);

  const swapPhotos = (indexA: number, indexB: number) => {
    if (indexA < 0 || indexB < 0 || indexA >= photos.length || indexB >= photos.length) return;
    const newPhotos = [...photos];
    const temp = newPhotos[indexA];
    newPhotos[indexA] = newPhotos[indexB];
    newPhotos[indexB] = temp;
    setPhotos(newPhotos);
    if (selectedIconIndex === indexA) setSelectedIconIndex(indexB);
    else if (selectedIconIndex === indexB) setSelectedIconIndex(indexA);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    if (selectedIconIndex === index) setSelectedIconIndex(0);
    else if (selectedIconIndex > index) setSelectedIconIndex(selectedIconIndex - 1);
  };

  const handleNext = async () => {
    if (!session) return;
    setLoading(true);

    try {
      let chosenAvatarUrl = '';

      // Clean existing photos for user before re-inserting during onboarding to prevent unique index conflicts
      await supabase.from('photos').delete().eq('user_id', session.user.id);

      // For each photo, upload to Supabase storage and save to DB
      for (let i = 0; i < photos.length; i++) {
        const uri = photos[i];
        const fileName = `${session.user.id}/${Date.now()}_step2_${i}.jpg`;
        let finalKey = `photos/${fileName}`;

        try {
          const res = await fetch(uri);
          const blob = await res.blob();

          const { error: uploadErr } = await supabase.storage
            .from('photos')
            .upload(fileName, blob, { contentType: 'image/jpeg', upsert: true });

          if (uploadErr) {
            logger.warn('Step2Photos', 'Storage upload error:', uploadErr.message);
          }

          const { data: urlData } = supabase.storage.from('photos').getPublicUrl(fileName);
          if (urlData?.publicUrl) {
            finalKey = urlData.publicUrl;
          }
        } catch (e) {
          logger.warn('Step2Photos', 'Storage upload caught:', e);
        }

        if (i === selectedIconIndex || (!chosenAvatarUrl && i === 0)) {
          chosenAvatarUrl = getPhotoUrl(finalKey, 0);
        }

        // Insert into media
        const { data: mediaData, error: mediaErr } = await supabase.from('media').insert({
          owner_id: session.user.id,
          kind: 'profile_photo',
          bucket: 'photos',
          s3_key: finalKey,
          mime_type: 'image/jpeg',
          size_bytes: 20480,
          moderation_status: 'ok'
        }).select().single();

        if (mediaErr) {
          logger.warn('Step2Photos', 'Media insert error:', mediaErr.message);
          continue;
        }

        // Insert into photos
        await supabase.from('photos').insert({
          user_id: session.user.id,
          media_id: mediaData.id,
          position: i + 1
        });
      }

      // If user uploaded photos, set their chosen photo (default first photo) as profile icon
      if (chosenAvatarUrl) {
        await supabase.from('profile_details').upsert({
          user_id: session.user.id,
          avatar_url: chosenAvatarUrl
        }, { onConflict: 'user_id' });
      }

      // Update onboarding step
      await supabase.from('profiles').update({ onboarding_step: 2 }).eq('id', session.user.id);

      router.push('/(onboarding)/step3-college' as any);
    } catch (err: any) {
      logger.warn('Step2Photos', 'Failed to upload photos:', err?.message || err);
      // Don't block the user, allow proceeding with chosen avatar
      router.push('/(onboarding)/step3-college' as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your Photos</Text>
      <Text style={styles.subtitle}>
        The 1st photo is your primary card. Tap any photo to set it as your profile icon.
      </Text>

      {/* Grid of photos */}
      <View style={styles.photoGrid}>
        {/* Slot 0: If no photos uploaded yet, show active avatar with option to replace */}
        {photos.length === 0 && (
          <View style={styles.photoBoxPrimary}>
            <Image source={{ uri: avatarUrl }} style={styles.photoImage} />
            <View style={styles.avatarLabel}>
              <Text style={styles.avatarLabelText}>Active Profile Icon</Text>
            </View>
          </View>
        )}

        {photos.map((uri, index) => {
          const isPrimary = index === 0;
          const isSelectedIcon = selectedIconIndex === index;

          return (
            <View key={index} style={[styles.photoBox, isPrimary && styles.photoBoxActivePrimary]}>
              <Image source={{ uri }} style={styles.photoImage} />
              
              <TouchableOpacity style={styles.deleteBtn} onPress={() => removePhoto(index)}>
                <Ionicons name="close-circle" size={24} color="#ff4b4b" />
              </TouchableOpacity>

              {/* Primary Photo Badge */}
              {isPrimary && (
                <View style={styles.coverBadge}>
                  <Text style={styles.coverBadgeText}>PRIMARY</Text>
                </View>
              )}

              {/* Profile Icon Badge / Selector */}
              <TouchableOpacity
                style={[styles.iconSelectBadge, isSelectedIcon && styles.iconSelectBadgeActive]}
                onPress={() => setSelectedIconIndex(index)}
              >
                <Ionicons name={isSelectedIcon ? 'checkmark-circle' : 'person-circle-outline'} size={12} color="#fff" />
                <Text style={styles.iconSelectText}>{isSelectedIcon ? 'ICON' : 'USE ICON'}</Text>
              </TouchableOpacity>

              {/* Reorder Buttons */}
              <View style={styles.reorderStrip}>
                {index > 0 && (
                  <TouchableOpacity
                    style={styles.reorderBtnSmall}
                    onPress={() => swapPhotos(index, index - 1)}
                  >
                    <Ionicons name="chevron-back" size={14} color="#fff" />
                  </TouchableOpacity>
                )}
                {index < photos.length - 1 && (
                  <TouchableOpacity
                    style={styles.reorderBtnSmall}
                    onPress={() => swapPhotos(index, index + 1)}
                  >
                    <Ionicons name="chevron-forward" size={14} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        {photos.length < 6 && (
          <TouchableOpacity style={styles.addPhotoBox} onPress={pickImage}>
            <Ionicons name="add" size={36} color={lightTheme.primary} />
            <Text style={styles.addPhotoText}>Add Photo</Text>
            <Text style={{ fontSize: 11, color: '#94A3B8' }}>Slot #{photos.length + 1}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Swap 1st and 2nd Photo Button */}
      {photos.length >= 2 && (
        <TouchableOpacity
          style={styles.quickSwapBar}
          onPress={() => swapPhotos(0, 1)}
        >
          <Ionicons name="swap-horizontal" size={18} color={lightTheme.primary} />
          <Text style={styles.quickSwapBarText}>Swap 1st and 2nd Photo</Text>
        </TouchableOpacity>
      )}

      <View style={styles.tipBox}>
        <Ionicons name="bulb-outline" size={20} color={lightTheme.primary} />
        <Text style={styles.tipText}>
          By default, your 1st photo is your primary card & profile icon. You can change this anytime!
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleNext}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {photos.length > 0 ? `Continue with ${photos.length} Photo${photos.length > 1 ? 's' : ''}` : 'Continue with Avatar'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: lightTheme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  photoBox: {
    width: '30%',
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f5f5f5',
  },
  photoBoxPrimary: {
    width: '30%',
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: lightTheme.primary,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  deleteBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  coverBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  coverBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  avatarLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: lightTheme.primary,
    paddingVertical: 3,
    alignItems: 'center',
  },
  avatarLabelText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  addPhotoBox: {
    width: '30%',
    aspectRatio: 3 / 4,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e8ecf4',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafbff',
  },
  addPhotoText: {
    color: lightTheme.primary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f8ff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 12,
  },
  tipText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
    lineHeight: 18,
  },
  button: {
    backgroundColor: lightTheme.primary,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  photoBoxActivePrimary: {
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  iconSelectBadge: {
    position: 'absolute',
    bottom: 22,
    left: 4,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingVertical: 2,
    borderRadius: 6,
  },
  iconSelectBadgeActive: {
    backgroundColor: lightTheme.primary,
  },
  iconSelectText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
  reorderStrip: {
    position: 'absolute',
    bottom: 2,
    left: 4,
    right: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  reorderBtnSmall: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  quickSwapBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EEF2FF',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginBottom: 16,
  },
  quickSwapBarText: {
    fontSize: 13,
    fontWeight: '700',
    color: lightTheme.primary,
  },
});
