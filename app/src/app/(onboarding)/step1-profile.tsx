import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { lightTheme } from '../../theme/colors';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import AvatarPickerModal from '../../components/AvatarPickerModal';
import { PRESET_AVATARS, DEFAULT_AVATAR } from '../../constants/avatars';
import { logger } from '../../utils/logger';

const GENDER_OPTIONS = [
  { label: 'Man', code: 'man', id: 1 },
  { label: 'Woman', code: 'woman', id: 2 },
  { label: 'Non-binary', code: 'nonbinary', id: 3 },
  { label: 'Other', code: 'other', id: 4 },
];

const PRONOUN_OPTIONS = ['he/him', 'she/her', 'they/them', 'ask me'];

export default function Step1Profile() {
  const router = useRouter();
  const { session } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('20');
  const [selectedGender, setSelectedGender] = useState('Woman');
  const [genderId, setGenderId] = useState(2);
  const [pronoun, setPronoun] = useState('she/her');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [hasSelectedCustomAvatar, setHasSelectedCustomAvatar] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleNext = async () => {
    if (!firstName.trim()) {
      Alert.alert('Required', 'Please enter your first name.');
      return;
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 99) {
      Alert.alert('Invalid Age', 'You must be at least 18 years old to join Align.');
      return;
    }

    if (!session?.user?.id) {
      Alert.alert('Session Error', 'Please log in again.');
      router.replace('/(auth)/login');
      return;
    }

    setSaving(true);
    try {
      const birthYear = new Date().getFullYear() - parsedAge;
      const computedDob = `${birthYear}-01-01`;

      // Update profiles
      const { error: pErr } = await supabase.from('profiles').update({
        first_name: firstName.trim(),
        bio: bio.trim(),
        onboarding_step: 1,
        gender_id: genderId,
        pronoun_id: 1,
        orientation_id: 1,
      }).eq('id', session.user.id);

      if (pErr) throw pErr;

      // Update private data
      await supabase.from('profile_private').update({
        last_name: lastName.trim() || null,
        dob: computedDob,
        email: session.user.email
      }).eq('user_id', session.user.id);

      // Upsert profile_details - only save avatar_url if user explicitly picked one
      await supabase.from('profile_details').upsert({
        user_id: session.user.id,
        legal_first_name: firstName.trim(),
        display_nickname: firstName.trim(),
        age: parsedAge,
        gender_identity: selectedGender,
        pronouns: pronoun,
        bio: bio.trim(),
        avatar_url: hasSelectedCustomAvatar ? avatarUrl : null,
      }, { onConflict: 'user_id' });

      router.push('/(onboarding)/step2-photos' as any);
    } catch (err: any) {
      logger.warn('Step1Profile', 'Failed to save profile info:', err?.message || err);
      Alert.alert('Save Error', err?.message || 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Welcome to Align</Text>
      <Text style={styles.subtitle}>Let’s start with your basics. How should campus know you?</Text>

      {/* Avatar Icon Picker */}
      <View style={styles.avatarSection}>
        <TouchableOpacity 
          style={styles.avatarWrapper} 
          onPress={() => setAvatarModalOpen(true)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: avatarUrl || DEFAULT_AVATAR }} style={styles.avatarPreview} />
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAvatarModalOpen(true)} style={styles.changeIconBtn}>
          <Text style={styles.changeIconText}>Choose Profile Icon</Text>
        </TouchableOpacity>
      </View>

      {/* Name row */}
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Maya"
            placeholderTextColor="#888"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Sharma"
            placeholderTextColor="#888"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
      </View>

      {/* Age */}
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Your Age *</Text>
        <TextInput
          style={styles.input}
          placeholder="20"
          placeholderTextColor="#888"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          maxLength={2}
        />
      </View>

      {/* Gender chips */}
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Gender Identity *</Text>
        <View style={styles.chipsRow}>
          {GENDER_OPTIONS.map((g) => {
            const active = selectedGender === g.label;
            return (
              <TouchableOpacity
                key={g.code}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => {
                  setSelectedGender(g.label);
                  setGenderId(g.id);
                }}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{g.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Pronouns */}
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Pronouns</Text>
        <View style={styles.chipsRow}>
          {PRONOUN_OPTIONS.map((p) => {
            const active = pronoun === p;
            return (
              <TouchableOpacity
                key={p}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setPronoun(p)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{p}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Bio */}
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Bio / About You</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Studying CS, lover of iced matchas, looking for someone to study or explore with ✨"
          placeholderTextColor="#888"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          maxLength={300}
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, saving && styles.buttonDisabled]} 
        onPress={handleNext}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue to Photos</Text>
        )}
      </TouchableOpacity>

      <AvatarPickerModal
        visible={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        onSelect={(url) => {
          setAvatarUrl(url);
          setHasSelectedCustomAvatar(true);
        }}
        currentAvatarUrl={avatarUrl || undefined}
      />
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarPreview: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f0f0f0',
    borderWidth: 3,
    borderColor: lightTheme.primary,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: lightTheme.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  changeIconBtn: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  changeIconText: {
    color: lightTheme.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  fieldWrap: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: lightTheme.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fc',
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    color: lightTheme.text,
    borderWidth: 1,
    borderColor: '#e8ecf4',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f2f8',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: lightTheme.primary,
    borderColor: lightTheme.primary,
  },
  chipText: {
    color: lightTheme.text,
    fontWeight: '600',
    fontSize: 14,
  },
  chipTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: lightTheme.primary,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 12,
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
