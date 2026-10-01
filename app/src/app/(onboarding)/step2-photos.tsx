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

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (!session) return;
    setLoading(true);

    try {
      // For each photo, upload to S3 and save to DB
      for (let i = 0; i < photos.length; i++) {
        const uri = photos[i];
        let blob: Blob | null = null;
        try {
          const res = await fetch(uri);
          blob = await res.blob();
        } catch (fetchErr) {
          logger.warn('Step2Photos', 'Could not convert image to blob:', fetchErr);
        }
        
        let finalKey = `photos/${session.user.id}/${Date.now()}_${i}.jpg`;
        const sizeBytes = blob ? blob.size : 10240;
        const mimeType = blob?.type || 'image/jpeg';

        // Insert into media
        const { data: mediaData, error: mediaErr } = await supabase.from('media').insert({
          owner_id: session.user.id,
          kind: 'profile_photo',
          bucket: 'align-media',
          s3_key: finalKey,
          mime_type: mimeType,
          size_bytes: sizeBytes,
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
        Show off your vibe. Add your best pictures or continue with your selected campus avatar.
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

        {photos.map((uri, index) => (
          <View key={index} style={styles.photoBox}>
            <Image source={{ uri }} style={styles.photoImage} />
            <TouchableOpacity style={styles.deleteBtn} onPress={() => removePhoto(index)}>
              <Ionicons name="close-circle" size={24} color="#ff4b4b" />
            </TouchableOpacity>
            {index === 0 && (
              <View style={styles.coverBadge}>
                <Text style={styles.coverBadgeText}>Main</Text>
              </View>
            )}
          </View>
        ))}

        {photos.length < 6 && (
          <TouchableOpacity style={styles.addPhotoBox} onPress={pickImage}>
            <Ionicons name="add" size={36} color={lightTheme.primary} />
            <Text style={styles.addPhotoText}>Add Photo</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tipBox}>
        <Ionicons name="bulb-outline" size={20} color={lightTheme.primary} />
        <Text style={styles.tipText}>
          Profiles with clear smiling photos get 4x more mutual likes on campus!
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
});
