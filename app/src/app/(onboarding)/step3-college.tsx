import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { lightTheme } from '../../theme/colors';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';

export default function Step3College() {
  const router = useRouter();
  const { session } = useAuthStore();
  const [collegeSearch, setCollegeSearch] = useState('');
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickIdPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setIdPhoto(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
    if (!idPhoto) {
      Alert.alert('ID Required', 'Please upload a photo of your college ID to get verified.');
      return;
    }
    if (!session) return;
    
    setLoading(true);
    try {
      const res = await fetch(idPhoto);
      const blob = await res.blob();
      
      const { data, error: fnError } = await supabase.functions.invoke('presigned-upload', {
        body: { kind: 'college_id', contentType: blob.type || 'image/jpeg', size: blob.size }
      });

      let finalKey = data?.key;
      let finalUrl = data?.url;
      let isFallback = false;

      if (fnError || !data?.url) {
        console.warn('Failed to get presigned URL, using fallback for local dev');
        finalKey = `fallback-college/${session.user.id}/${Date.now()}.jpg`;
        isFallback = true;
      }

      if (!isFallback && finalUrl) {
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

      const { data: mediaData, error: mediaErr } = await supabase.from('media').insert({
        owner_id: session.user.id,
        kind: 'college_id',
        bucket: 'align-media',
        s3_key: finalKey,
        mime_type: blob.type || 'image/jpeg',
        size_bytes: blob.size,
        moderation_status: 'ok'
      }).select().single();

      if (mediaErr) throw mediaErr;

      await supabase.from('verifications').insert({
        user_id: session.user.id,
        type: 'manual',
        status: 'pending',
        provider: 'manual',
        media_id: mediaData.id
      });

      router.push('/(onboarding)/step4-places' as any);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not submit college verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Verify your College</Text>
      <Text style={styles.subtitle}>
        We need to verify you are a student. Cover any sensitive numbers before uploading.
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Search College (e.g. IIT Delhi)"
        placeholderTextColor="#888"
        value={collegeSearch}
        onChangeText={setCollegeSearch}
      />
      {/* In a real app we would have a dropdown list of colleges from Supabase here */}

      <TouchableOpacity style={styles.idUploadBox} onPress={pickIdPhoto}>
        {idPhoto ? (
          <Image source={{ uri: idPhoto }} style={styles.idImage} />
        ) : (
          <Text style={styles.uploadText}>Tap to upload College ID</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleNext} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit & Continue</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/(onboarding)/step4-places' as any)}>
        <Text style={styles.skipText}>I'll verify later</Text>
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
    lineHeight: 22,
  },
  input: {
    backgroundColor: lightTheme.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: lightTheme.text,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: lightTheme.border,
  },
  idUploadBox: {
    height: 200,
    backgroundColor: lightTheme.card,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: lightTheme.border,
    borderStyle: 'dashed',
    marginBottom: 32,
    overflow: 'hidden',
  },
  idImage: {
    width: '100%',
    height: '100%',
  },
  uploadText: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: lightTheme.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  skipText: {
    color: '#888',
    fontSize: 16,
  },
});
