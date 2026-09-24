import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { lightTheme } from '../../theme/colors';

import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';

export default function Step5Attributes() {
  const router = useRouter();
  const { session } = useAuthStore();

  const handleFinish = async () => {
    if (session) {
      await supabase.from('profiles').update({
        profile_complete: true,
        onboarding_step: 5
      }).eq('id', session.user.id);
    }
    router.replace('/(tabs)/discover' as any);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>More about you</Text>
      <Text style={styles.subtitle}>
        Adding optional details helps you find better matches. You can always skip or hide these later.
      </Text>
      
      {/* Placeholder for attribute questions */}
      <View style={styles.questionCard}>
        <Text style={styles.questionTitle}>Do you smoke?</Text>
        <View style={styles.optionsRow}>
          {['No', 'Sometimes', 'Yes'].map(opt => (
            <TouchableOpacity key={opt} style={styles.optionChip}>
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionTitle}>Do you drink?</Text>
        <View style={styles.optionsRow}>
          {['No', 'Socially', 'Yes'].map(opt => (
            <TouchableOpacity key={opt} style={styles.optionChip}>
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleFinish}>
        <Text style={styles.buttonText}>Finish Profile</Text>
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
    marginBottom: 32,
    lineHeight: 22,
  },
  questionCard: {
    backgroundColor: lightTheme.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: lightTheme.border,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: lightTheme.text,
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    backgroundColor: lightTheme.background,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: lightTheme.primary,
  },
  optionText: {
    color: lightTheme.text,
    fontWeight: '500',
  },
  button: {
    backgroundColor: lightTheme.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
