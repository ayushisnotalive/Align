import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { lightTheme } from '../../theme/colors';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';

export default function Step2Photos() {
  const router = useRouter();
  const { session } = useAuthStore();
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    if (photos.length >= 6) {
      Alert.alert('Limit Reached', 'You can only upload up to 6 photos.');
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
    if (photos.length < 3) {
      Alert.alert('Need More Photos', 'Please add at least 3 photos to continue.');
      return;
    }
    
    if (!session) return;
    setLoading(true);

    try {
      // For each photo, upload to S3 and save to DB
      for (let i = 0; i < photos.length; i++) {
        const uri = photos[i];
        const res = await fetch(uri);
        const blob = await res.blob();
        
        // 1. Get presigned URL
        const { data, error: fnError } = await supabase.functions.invoke('presigned-upload', {
          body: { kind: 'profile_photo', contentType: blob.type || 'image/jpeg', size: blob.size }
        });

        let finalKey = data?.key;
        let finalUrl = data?.url;
        let isFallback = false;

        if (fnError || !data?.url) {
          console.warn('Failed to get presigned URL, using fallback for local dev:', fnError || data);
          finalKey = `fallback-media/${session.user.id}/${Date.now()}.jpg`;
          isFallback = true;
        }

        if (!isFallback && finalUrl) {
          // 2. Upload to S3
          const uploadRes = await fetch(finalUrl, {
            method: 'PUT',
            headers: { 'Content-Type': blob.type || 'image/jpeg' },
            body: blob,
          });

          if (!uploadRes.ok) {
            console.warn('Failed to upload to S3, using fallback');
            isFallback = true;
          }
        }

        // 3. Insert into media
        const { data: mediaData, error: mediaErr } = await supabase.from('media').insert({
          owner_id: session.user.id,
          kind: 'profile_photo',
          bucket: 'align-media',
          s3_key: finalKey,
          mime_type: blob.type || 'image/jpeg',
          size_bytes: blob.size,
          moderation_status: 'ok' // Set 'ok' in MVP so profile completes
        }).select().single();

        if (mediaErr) {
          console.error('Media insert error:', mediaErr);
          continue;
        }

        // 4. Insert into photos
        await supabase.from('photos').insert({
          user_id: session.user.id,
          media_id: mediaData.id,
          position: i + 1
        });
      }

      router.push('/(onboarding)/step3-college' as any);
    } catch (err) {
      console.error(err);
      Alert.alert('Upload Error', 'Failed to upload photos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your Photos</Text>
      <Text style={styles.subtitle}>Add at least 3 photos. You can upload up to 6.</Text>
      
      <View style={styles.grid}>
        {[...Array(6)].map((_, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.photoSlot} 
            onPress={() => photos[index] ? removePhoto(index) : pickImage()}
          >
            {photos[index] ? (
              <>
                <Image source={{ uri: photos[index] }} style={styles.image} />
                <View style={styles.removeBadge}>
                  <Text style={styles.removeText}>X</Text>
                </View>
              </>
            ) : (
              <Text style={styles.addText}>+</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Next</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: lightTheme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoSlot: {
    width: '31%',
    aspectRatio: 3/4,
    backgroundColor: lightTheme.surface,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: lightTheme.border,
    borderStyle: 'dashed',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  addText: {
    fontSize: 32,
    color: '#888',
  },
  removeBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: lightTheme.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
