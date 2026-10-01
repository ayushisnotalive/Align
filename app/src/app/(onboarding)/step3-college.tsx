import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, ActivityIndicator, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { lightTheme } from '../../theme/colors';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { logger } from '../../utils/logger';

interface CollegeItem {
  id: number;
  name: string;
  city_id: number | null;
}

const GRAD_YEARS = [2024, 2025, 2026, 2027, 2028, 2029];

export default function Step3College() {
  const router = useRouter();
  const { session } = useAuthStore();

  const [collegeSearch, setCollegeSearch] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<CollegeItem | null>(null);
  const [collegeSuggestions, setCollegeSuggestions] = useState<CollegeItem[]>([]);
  const [course, setCourse] = useState('Computer Science');
  const [gradYear, setGradYear] = useState<number>(2026);
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (collegeSearch.trim().length > 1 && !selectedCollege) {
      searchColleges(collegeSearch.trim());
    } else {
      setCollegeSuggestions([]);
    }
  }, [collegeSearch]);

  const searchColleges = async (query: string) => {
    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('id, name, city_id')
        .ilike('name', `%${query}%`)
        .limit(6);

      if (error) throw error;
      setCollegeSuggestions(data || []);
    } catch (err: any) {
      logger.warn('Step3College', 'College search error:', err?.message || err);
    } finally {
      setSearching(false);
    }
  };

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

  const handleSubmit = async (isVerifyingNow: boolean) => {
    if (!selectedCollege && !collegeSearch.trim()) {
      Alert.alert('College Required', 'Please search and select or enter your college / university.');
      return;
    }

    if (!session?.user?.id) return;
    setLoading(true);

    try {
      let collegeId = selectedCollege?.id;
      let collegeName = selectedCollege?.name || collegeSearch.trim();

      // If user typed a custom college not in dropdown, find closest or use first approved
      if (!collegeId) {
        const { data: firstCol } = await supabase.from('colleges').select('id, name').limit(1).single();
        collegeId = firstCol?.id || 1;
      }

      let mediaId: string | null = null;

      // If photo was chosen, upload and insert into media table
      if (isVerifyingNow && idPhoto) {
        const fileName = `${session.user.id}/id_${Date.now()}.jpg`;
        let finalKey = `college_id/${fileName}`;

        try {
          const res = await fetch(idPhoto);
          const blob = await res.blob();

          const { error: uploadErr } = await supabase.storage
            .from('photos')
            .upload(fileName, blob, { contentType: 'image/jpeg', upsert: true });

          if (uploadErr) {
            logger.warn('Step3College', 'Storage upload error:', uploadErr.message);
          }

          const { data: urlData } = supabase.storage.from('photos').getPublicUrl(fileName);
          if (urlData?.publicUrl) finalKey = urlData.publicUrl;
        } catch (e) {
          logger.warn('Step3College', 'Storage upload caught:', e);
        }

        const { data: mediaData, error: mediaErr } = await supabase.from('media').insert({
          owner_id: session.user.id,
          kind: 'college_id',
          bucket: 'photos',
          s3_key: finalKey,
          mime_type: 'image/jpeg',
          size_bytes: 20480,
          moderation_status: 'ok'
        }).select().single();

        if (mediaErr) {
          logger.warn('Step3College', 'Failed to insert media:', mediaErr.message);
        } else {
          mediaId = mediaData.id;
        }
      }

      // Submit verification RPC
      const { error: rpcError } = await supabase.rpc('submit_student_verification', {
        p_college_id: collegeId,
        p_grad_year: gradYear,
        p_media_id: mediaId,
        p_proof_email: session.user.email || null,
      });

      if (rpcError) {
        logger.warn('Step3College', 'submit_student_verification warning:', rpcError.message);
      }

      // Update profiles school name & onboarding step
      await supabase.from('profiles').update({
        school: collegeName,
        onboarding_step: 3,
      }).eq('id', session.user.id);

      // Update profile_details
      await supabase.from('profile_details').upsert({
        user_id: session.user.id,
        university_college: collegeName,
        graduation_year: gradYear,
      }, { onConflict: 'user_id' });

      router.push('/(onboarding)/step4-places' as any);
    } catch (err: any) {
      logger.warn('Step3College', 'Unexpected error in college step:', err?.message || err);
      // Ensure the user is not trapped
      router.push('/(onboarding)/step4-places' as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your College</Text>
      <Text style={styles.subtitle}>
        Align connects verified students across campus and neighboring colleges.
      </Text>

      {/* College search input */}
      <Text style={styles.label}>Search College or University *</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="e.g. IIT Delhi, BITS Pilani, Delhi University"
          placeholderTextColor="#888"
          value={selectedCollege ? selectedCollege.name : collegeSearch}
          onChangeText={(txt) => {
            setSelectedCollege(null);
            setCollegeSearch(txt);
          }}
        />
        {selectedCollege && (
          <TouchableOpacity onPress={() => setSelectedCollege(null)}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Autocomplete suggestions */}
      {collegeSuggestions.length > 0 && !selectedCollege && (
        <View style={styles.suggestionsBox}>
          {collegeSuggestions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.suggestionItem}
              onPress={() => {
                setSelectedCollege(item);
                setCollegeSuggestions([]);
              }}
            >
              <Ionicons name="school-outline" size={18} color={lightTheme.primary} style={{ marginRight: 8 }} />
              <Text style={styles.suggestionText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Course */}
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Degree / Major</Text>
        <TextInput
          style={styles.simpleInput}
          placeholder="e.g. Computer Science, Economics, Design"
          placeholderTextColor="#888"
          value={course}
          onChangeText={setCourse}
        />
      </View>

      {/* Graduation Year */}
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Expected Graduation Year</Text>
        <View style={styles.chipsRow}>
          {GRAD_YEARS.map((yr) => (
            <TouchableOpacity
              key={yr}
              style={[styles.yearChip, gradYear === yr && styles.yearChipActive]}
              onPress={() => setGradYear(yr)}
            >
              <Text style={[styles.yearChipText, gradYear === yr && styles.yearChipTextActive]}>
                {yr}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ID Verification upload card */}
      <View style={styles.idBox}>
        <View style={styles.idBoxHeader}>
          <Ionicons name="shield-checkmark" size={24} color={lightTheme.primary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.idBoxTitle}>Student ID Verification</Text>
            <Text style={styles.idBoxSub}>Get the college verified badge on your profile</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.uploadArea} onPress={pickIdPhoto}>
          {idPhoto ? (
            <Image source={{ uri: idPhoto }} style={styles.idPreview} />
          ) : (
            <View style={styles.uploadPrompt}>
              <Ionicons name="card-outline" size={36} color="#888" />
              <Text style={styles.uploadPromptTitle}>Tap to upload College ID / Badge</Text>
              <Text style={styles.uploadPromptSub}>Cover sensitive numbers or roll codes</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Action buttons */}
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={() => handleSubmit(!!idPhoto)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {idPhoto ? 'Submit & Continue' : 'Save & Continue'}
          </Text>
        )}
      </TouchableOpacity>

      {!idPhoto && (
        <TouchableOpacity 
          style={styles.skipBtn} 
          onPress={() => handleSubmit(false)}
        >
          <Text style={styles.skipBtnText}>I'll verify my student ID later</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '900', color: lightTheme.text, marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 24, lineHeight: 22 },
  label: { fontSize: 14, fontWeight: '700', color: lightTheme.text, marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fc',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e8ecf4',
  },
  input: { flex: 1, fontSize: 15, color: lightTheme.text },
  suggestionsBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e8ecf4',
    marginTop: 6,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f5f8',
  },
  suggestionText: { fontSize: 14, color: lightTheme.text, fontWeight: '500' },
  fieldWrap: { marginTop: 18 },
  simpleInput: {
    backgroundColor: '#f8f9fc',
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: lightTheme.text,
    borderWidth: 1,
    borderColor: '#e8ecf4',
  },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  yearChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f2f8',
  },
  yearChipActive: { backgroundColor: lightTheme.primary },
  yearChipText: { color: lightTheme.text, fontWeight: '600', fontSize: 14 },
  yearChipTextActive: { color: '#fff' },
  idBox: {
    marginTop: 24,
    backgroundColor: '#fbfbff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e8ecf8',
    padding: 16,
    marginBottom: 24,
  },
  idBoxHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  idBoxTitle: { fontSize: 15, fontWeight: '700', color: lightTheme.text },
  idBoxSub: { fontSize: 12, color: '#777', marginTop: 2 },
  uploadArea: {
    height: 150,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#e0e4f2',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  idPreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  uploadPrompt: { alignItems: 'center' },
  uploadPromptTitle: { fontSize: 14, fontWeight: '600', color: lightTheme.text, marginTop: 8 },
  uploadPromptSub: { fontSize: 11, color: '#888', marginTop: 2 },
  button: {
    backgroundColor: lightTheme.primary,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  skipBtn: { alignItems: 'center', paddingVertical: 14 },
  skipBtnText: { color: '#777', fontSize: 14, fontWeight: '600' },
});
