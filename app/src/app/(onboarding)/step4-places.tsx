import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { lightTheme } from '../../theme/colors';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { logger } from '../../utils/logger';

const RELATIONSHIP_GOALS = [
  { label: 'Long-term dating ❤️', code: 'long_term' },
  { label: 'Casual & fun ✨', code: 'casual' },
  { label: 'Study buddy 📚', code: 'study_buddy' },
  { label: 'Campus friends 🎉', code: 'friends' },
];

const GENDER_PREFERENCES = [
  { label: 'Women', code: 'women' },
  { label: 'Men', code: 'men' },
  { label: 'Everyone', code: 'everyone' },
];

export default function Step4Places() {
  const router = useRouter();
  const { session } = useAuthStore();
  const [hometown, setHometown] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('long_term');
  const [interestedIn, setInterestedIn] = useState('everyone');
  const [saving, setSaving] = useState(false);

  const handleNext = async () => {
    if (!session?.user?.id) return;
    setSaving(true);

    try {
      // 1. Update profile_details with hometown
      await supabase.from('profile_details').upsert({
        user_id: session.user.id,
        home_city: hometown.trim() || 'Campus',
      }, { onConflict: 'user_id' });

      // 2. Update discovery_settings with preferences
      await supabase.from('discovery_settings').upsert({
        user_id: session.user.id,
        relationship_goals: [selectedGoal],
        target_gender_preference: [interestedIn],
      }, { onConflict: 'user_id' });

      // 3. Update onboarding step
      await supabase.from('profiles').update({ onboarding_step: 4 }).eq('id', session.user.id);

      router.push('/(onboarding)/step5-attributes' as any);
    } catch (err: any) {
      logger.warn('Step4Places', 'Error saving preferences:', err?.message || err);
      router.push('/(onboarding)/step5-attributes' as any);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Where & What</Text>
      <Text style={styles.subtitle}>
        Help Align match you with students looking for the same campus connection.
      </Text>

      {/* Hometown */}
      <View style={styles.section}>
        <Text style={styles.label}>Your Hometown / Home City</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Mumbai, Delhi, Bengaluru"
          placeholderTextColor="#888"
          value={hometown}
          onChangeText={setHometown}
        />
      </View>

      {/* Relationship Goals */}
      <View style={styles.section}>
        <Text style={styles.label}>What are you hoping to find?</Text>
        <View style={styles.grid}>
          {RELATIONSHIP_GOALS.map((goal) => {
            const active = selectedGoal === goal.code;
            return (
              <TouchableOpacity
                key={goal.code}
                style={[styles.goalCard, active && styles.goalCardActive]}
                onPress={() => setSelectedGoal(goal.code)}
              >
                <Text style={[styles.goalText, active && styles.goalTextActive]}>{goal.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Interested in */}
      <View style={styles.section}>
        <Text style={styles.label}>Interested in seeing</Text>
        <View style={styles.chipsRow}>
          {GENDER_PREFERENCES.map((pref) => {
            const active = interestedIn === pref.code;
            return (
              <TouchableOpacity
                key={pref.code}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setInterestedIn(pref.code)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{pref.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, saving && styles.buttonDisabled]} 
        onPress={handleNext}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue to Interests</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '900', color: lightTheme.text, marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 28, lineHeight: 22 },
  section: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '700', color: lightTheme.text, marginBottom: 10 },
  input: {
    backgroundColor: '#f8f9fc',
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    color: lightTheme.text,
    borderWidth: 1,
    borderColor: '#e8ecf4',
  },
  grid: { gap: 10 },
  goalCard: {
    backgroundColor: '#f8f9fc',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e8ecf4',
  },
  goalCardActive: {
    backgroundColor: '#f0f3ff',
    borderColor: lightTheme.primary,
  },
  goalText: { fontSize: 15, fontWeight: '600', color: lightTheme.text },
  goalTextActive: { color: lightTheme.primary, fontWeight: '700' },
  chipsRow: { flexDirection: 'row', gap: 10 },
  chip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#f0f2f8',
    alignItems: 'center',
  },
  chipActive: { backgroundColor: lightTheme.primary },
  chipText: { fontSize: 14, fontWeight: '600', color: lightTheme.text },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  button: {
    backgroundColor: lightTheme.primary,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});
