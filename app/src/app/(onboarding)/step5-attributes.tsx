import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { lightTheme } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';
import { logger } from '../../utils/logger';

const POPULAR_INTERESTS = [
  'Coding', 'Music', 'Gym & Fitness', 'Gaming', 'Coffee', 'Photography',
  'Anime', 'Startups', 'Travel', 'Design', 'Reading', 'Cinema', 'Foodie', 'Fashion'
];

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export default function Step5Attributes() {
  const router = useRouter();
  const { session } = useAuthStore();

  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Coding', 'Music', 'Coffee']);
  const [zodiac, setZodiac] = useState<string>('Leo');
  const [smoking, setSmoking] = useState<string>('Never');
  const [drinking, setDrinking] = useState<string>('Socially');
  const [workout, setWorkout] = useState<string>('Active');
  const [saving, setSaving] = useState(false);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length >= 6) {
        Alert.alert('Limit Reached', 'You can pick up to 6 interests.');
        return;
      }
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleFinish = async () => {
    if (!session?.user?.id) return;
    setSaving(true);
    
    try {
      // 1. Update profiles completion
      const { error: pError } = await supabase.from('profiles').update({
        profile_complete: true,
        onboarding_step: 5
      }).eq('id', session.user.id);

      if (pError) {
        logger.warn('Step5Attributes', 'Profile complete update error:', pError.message);
      }

      // 2. Insert/update profile_details
      await supabase.from('profile_details').upsert({
        user_id: session.user.id,
        smoking_habits: smoking,
        drinking_frequency: drinking,
        workout_habits: workout,
        zodiac_sign: zodiac,
        interests: selectedInterests,
      }, { onConflict: 'user_id' });

      // 3. Complete onboarding and route to discover
      router.replace('/(tabs)/discover' as any);
    } catch (err: any) {
      logger.warn('Step5Attributes', 'Failed to save step 5:', err?.message || err);
      router.replace('/(tabs)/discover' as any);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Interests & Vibe</Text>
      <Text style={styles.subtitle}>
        Select your interests and lifestyle to help our matching engine connect you with campus kindred spirits.
      </Text>
      
      {/* Interests */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Your Interests (Pick up to 6)</Text>
        <View style={styles.chipsRow}>
          {POPULAR_INTERESTS.map((item) => {
            const active = selectedInterests.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => toggleInterest(item)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Zodiac */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Zodiac Sign</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {ZODIAC_SIGNS.map((sign) => {
            const active = zodiac === sign;
            return (
              <TouchableOpacity
                key={sign}
                style={[styles.zodiacChip, active && styles.chipActive]}
                onPress={() => setZodiac(sign)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{sign}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Lifestyle questions */}
      <View style={styles.questionCard}>
        <Text style={styles.questionTitle}>Workout & Fitness</Text>
        <View style={styles.optionsRow}>
          {['Never', 'Sometimes', 'Active', 'Daily'].map(opt => (
            <TouchableOpacity key={opt} style={[styles.optionChip, workout === opt && styles.optionChipActive]} onPress={() => setWorkout(opt)}>
              <Text style={[styles.optionText, workout === opt && styles.optionTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionTitle}>Drinking</Text>
        <View style={styles.optionsRow}>
          {['Never', 'Socially', 'Regularly'].map(opt => (
            <TouchableOpacity key={opt} style={[styles.optionChip, drinking === opt && styles.optionChipActive]} onPress={() => setDrinking(opt)}>
              <Text style={[styles.optionText, drinking === opt && styles.optionTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionTitle}>Smoking</Text>
        <View style={styles.optionsRow}>
          {['Never', 'Socially', 'Regularly'].map(opt => (
            <TouchableOpacity key={opt} style={[styles.optionChip, smoking === opt && styles.optionChipActive]} onPress={() => setSmoking(opt)}>
              <Text style={[styles.optionText, smoking === opt && styles.optionTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, saving && styles.buttonDisabled]} 
        onPress={handleFinish} 
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Finish & Discover Campus ✨</Text>
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
    marginBottom: 28,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: lightTheme.text,
    marginBottom: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#f0f2f8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: lightTheme.primary,
  },
  chipText: {
    color: lightTheme.text,
    fontWeight: '600',
    fontSize: 14,
  },
  chipTextActive: {
    color: '#fff',
  },
  zodiacChip: {
    backgroundColor: '#f0f2f8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  questionCard: {
    backgroundColor: '#f8f9fc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8ecf4',
  },
  questionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: lightTheme.text,
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e4f0',
  },
  optionChipActive: {
    backgroundColor: lightTheme.primary,
    borderColor: lightTheme.primary,
  },
  optionText: {
    color: lightTheme.text,
    fontWeight: '500',
    fontSize: 13,
  },
  optionTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: lightTheme.primary,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20,
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
