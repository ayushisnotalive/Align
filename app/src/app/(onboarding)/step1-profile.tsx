import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { lightTheme } from '../../theme/colors';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';

export default function Step1Profile() {
  const router = useRouter();
  const { session } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');

  // We will need proper pickers for these IDs, but for simplicity in this scaffold, we'll hardcode or use basic inputs.
  // In a real app we'd fetch public.lookup_values where list_key='gender', etc.

  const handleNext = async () => {
    if (!firstName || !lastName || !bio) {
      Alert.alert('Missing Fields', 'Please fill out all required fields to proceed.');
      return;
    }

    // Save to profile
    // Note: To truly complete the profile, all required fields must be set (gender_id, pronoun_id, etc).
    // For now we just save what we have and proceed to the next step.
    if (session) {
      await supabase.from('profiles').update({
        first_name: firstName,
        bio: bio,
        onboarding_step: 1
      }).eq('id', session.user.id);

      await supabase.from('profile_private').update({
        last_name: lastName
      }).eq('user_id', session.user.id);
    }

    router.push('/(onboarding)/step2-photos' as any);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Basic Info</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#888"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#888"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Bio"
        placeholderTextColor="#888"
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
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
    marginBottom: 24,
  },
  input: {
    backgroundColor: lightTheme.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: lightTheme.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: lightTheme.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
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
