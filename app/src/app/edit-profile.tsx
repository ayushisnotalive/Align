import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { lightTheme } from '../theme/colors';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';

// Data Options
const OPTIONS = {
  biological_sex: ['Male', 'Female', 'Intersex'],
  gender_identity: ['Cisgender', 'Transgender', 'Non-binary', 'Genderqueer', 'Custom'],
  sexual_orientation: ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Asexual', 'Queer', 'Other'],
  pronouns: ['he/him', 'she/her', 'they/them', 'custom'],
  body_type: ['Athletic', 'Average', 'Curvy', 'A few extra pounds', 'Slim'],
  educational_attainment: ['High school', 'In college', 'Undergraduate degree', 'Postgraduate/Master\'s', 'Doctorate'],
  drinking_frequency: ['Never', 'Socially', 'Regularly'],
  smoking_habits: ['Never', 'Socially', 'Regularly'],
  weed_consumption: ['Never', 'Socially', 'Regularly'],
  workout_habits: ['Never', 'Sometimes', 'Active', 'Daily'],
  dietary_lifestyle: ['Omnivore', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Pescatarian'],
  zodiac_sign: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
};

export default function EditProfile() {
  const router = useRouter();
  const { session } = useAuthStore();
  
  // Basic
  const [firstName, setFirstName] = useState('');
  const [bio, setBio] = useState('');
  
  // Details
  const [details, setDetails] = useState<any>({});

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<{key: string, label: string, options: string[]}|null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;
    try {
      const [profileRes, detailsRes] = await Promise.all([
        supabase.from('profiles').select('first_name, bio').eq('id', session.user.id).single(),
        supabase.from('profile_details').select('*').eq('user_id', session.user.id).maybeSingle()
      ]);
      if (profileRes.data) {
        setFirstName(profileRes.data.first_name || '');
        setBio(profileRes.data.bio || '');
      }
      if (detailsRes.data) {
        setDetails(detailsRes.data);
      } else {
        // Create initial details row if it doesn't exist
        await supabase.from('profile_details').insert({ user_id: session.user.id });
      }
    } catch (error) {
      console.error('Error fetching profile', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    if (session) {
      const { error: profileError } = await supabase.from('profiles').update({ first_name: firstName, bio: bio }).eq('id', session.user.id);
      if (profileError) {
        Alert.alert('Error', `Failed to update profile: ${profileError.message}`);
        setLoading(false);
        return;
      }
      
      const payload = { ...details };
      delete payload.id;
      delete payload.user_id;
      delete payload.created_at;
      delete payload.updated_at;

      const { error } = await supabase.from('profile_details').update(payload).eq('user_id', session.user.id);
      if (error) {
        Alert.alert('Error', `Failed to update profile details: ${error.message}`);
      } else {
        router.back();
      }
    }
    setLoading(false);
  };

  const updateDetail = (key: string, value: any) => {
    setDetails((prev: any) => ({ ...prev, [key]: value }));
  };

  const openSelect = (key: string, label: string, options: string[]) => {
    setCurrentField({ key, label, options });
    setModalVisible(true);
  };

  const renderInput = (label: string, key: string, isNumeric = false) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={`Enter ${label}`}
        placeholderTextColor="#888"
        value={details[key]?.toString() || ''}
        keyboardType={isNumeric ? 'numeric' : 'default'}
        onChangeText={(text) => updateDetail(key, isNumeric ? parseInt(text) || null : text)}
      />
    </View>
  );

  const renderSelect = (label: string, key: string, options: string[]) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.selectBtn} onPress={() => openSelect(key, label, options)}>
        <Text style={[styles.selectText, !details[key] && { color: '#888' }]}>
          {details[key] || `Select ${label}`}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#888" />
      </TouchableOpacity>
    </View>
  );

  if (fetching) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={lightTheme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={lightTheme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color={lightTheme.primary} /> : <Text style={styles.saveBtn}>Save</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionHeader}>Basics & Bio</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
          />
        </View>

        {renderInput('Display Nickname', 'display_nickname')}
        {renderInput('Age', 'age', true)}
        {renderInput('Height (cm)', 'height_cm', true)}

        <Text style={styles.sectionHeader}>Identity</Text>
        {renderSelect('Biological Sex', 'biological_sex', OPTIONS.biological_sex)}
        {renderSelect('Gender Identity', 'gender_identity', OPTIONS.gender_identity)}
        {renderSelect('Sexual Orientation', 'sexual_orientation', OPTIONS.sexual_orientation)}
        {renderSelect('Pronouns', 'pronouns', OPTIONS.pronouns)}
        {renderSelect('Body Type', 'body_type', OPTIONS.body_type)}

        <Text style={styles.sectionHeader}>Location & Work</Text>
        {renderInput('Home City', 'home_city')}
        {renderInput('Neighborhood', 'neighborhood')}
        {renderInput('Work Location', 'work_location')}
        {renderSelect('Education', 'educational_attainment', OPTIONS.educational_attainment)}
        {renderInput('University/College', 'university_college')}
        {renderInput('Graduation Year', 'graduation_year', true)}
        {renderInput('Occupation', 'current_occupation')}
        {renderInput('Employer', 'employer_company')}
        {renderInput('Industry', 'industry')}

        <Text style={styles.sectionHeader}>Lifestyle & Habits</Text>
        {renderSelect('Drinking', 'drinking_frequency', OPTIONS.drinking_frequency)}
        {renderSelect('Smoking', 'smoking_habits', OPTIONS.smoking_habits)}
        {renderSelect('Weed', 'weed_consumption', OPTIONS.weed_consumption)}
        {renderSelect('Workout Habits', 'workout_habits', OPTIONS.workout_habits)}
        {renderSelect('Dietary Lifestyle', 'dietary_lifestyle', OPTIONS.dietary_lifestyle)}

        <Text style={styles.sectionHeader}>Personality</Text>
        {renderSelect('Zodiac Sign', 'zodiac_sign', OPTIONS.zodiac_sign)}
        {renderInput('MBTI Personality', 'mbti_personality')}
        {renderInput('Love Language', 'love_language')}

        <Text style={styles.sectionHeader}>Integrations</Text>
        {renderInput('Spotify Anthem ID', 'spotify_anthem_id')}
        {renderInput('Instagram Username', 'instagram_username')}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Select Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{currentField?.label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={lightTheme.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={currentField?.options || []}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => {
                    if (currentField) updateDetail(currentField.key, item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, details[currentField?.key || ''] === item && styles.optionSelected]}>{item}</Text>
                  {details[currentField?.key || ''] === item && <Ionicons name="checkmark" size={20} color={lightTheme.primary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: lightTheme.text },
  saveBtn: { fontSize: 16, fontWeight: 'bold', color: lightTheme.primary, padding: 8 },
  content: { padding: 20 },
  sectionHeader: {
    fontSize: 22, fontWeight: '800', color: lightTheme.text,
    marginTop: 24, marginBottom: 16,
  },
  fieldContainer: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, marginLeft: 4 },
  input: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, fontSize: 16, color: lightTheme.text,
    borderWidth: 1, borderColor: '#eee',
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  selectBtn: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#eee',
  },
  selectText: { fontSize: 16, color: lightTheme.text },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: lightTheme.text },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  optionText: { fontSize: 16, color: lightTheme.text },
  optionSelected: { color: lightTheme.primary, fontWeight: 'bold' },
});
