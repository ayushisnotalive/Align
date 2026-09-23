import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { lightTheme } from '../../theme/colors';

export default function Step4Places() {
  const router = useRouter();
  const [hometown, setHometown] = useState('');
  const [place1, setPlace1] = useState('');

  const handleNext = () => {
    // In a real app we'd search cities and insert into profiles.hometown_city_id and public.user_places
    router.push('/(onboarding)/step5-attributes' as any);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Where are you from?</Text>
      
      <Text style={styles.label}>Hometown</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Mumbai, Maharashtra"
        placeholderTextColor="#888"
        value={hometown}
        onChangeText={setHometown}
      />

      <Text style={styles.label}>Add a place you frequent (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Pune, Maharashtra"
        placeholderTextColor="#888"
        value={place1}
        onChangeText={setPlace1}
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
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: lightTheme.text,
    marginBottom: 8,
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
