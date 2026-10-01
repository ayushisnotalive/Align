import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { lightTheme } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { logger } from '../../utils/logger';
import {
  COMMUNICATION_STYLES,
  IDEAL_DATES,
  LIFESTYLE_VIBES,
  TAG_CATEGORIES,
  MAX_ALLOWED_TAGS,
} from '../../constants/lifestyleTags';

export default function Step5Attributes() {
  const router = useRouter();
  const { session } = useAuthStore();

  // Communication, Ideal Date, Lifestyle Vibe
  const [commStyle, setCommStyle] = useState<string>('Big Texter & Fast Replies');
  const [idealDate, setIdealDate] = useState<string>('Coffee & Bookstore Stroll');
  const [lifestyleVibe, setLifestyleVibe] = useState<string>('Healthy Balance of Both');

  // Vast categorized interests (up to 12)
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Literature & Poetry',
    'Specialty Coffee & Cafes',
    'Netflix & Binge-Watching',
    'Coding & Hackathons',
  ]);

  // Lifestyle habits
  const [smoking, setSmoking] = useState<string>('Never');
  const [drinking, setDrinking] = useState<string>('Socially');
  const [workout, setWorkout] = useState<string>('Active');

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [saving, setSaving] = useState(false);

  const toggleTag = (label: string) => {
    if (selectedTags.includes(label)) {
      setSelectedTags(selectedTags.filter((t) => t !== label));
    } else {
      if (selectedTags.length >= MAX_ALLOWED_TAGS) {
        Alert.alert(
          'Maximum Reached',
          `You can select up to ${MAX_ALLOWED_TAGS} passions and interests.`
        );
        return;
      }
      setSelectedTags([...selectedTags, label]);
    }
  };

  const handleFinish = async () => {
    if (!session?.user?.id) return;
    setSaving(true);

    try {
      // 1. Update profiles completion
      const { error: pError } = await supabase
        .from('profiles')
        .update({
          profile_complete: true,
          onboarding_step: 5,
        })
        .eq('id', session.user.id);

      if (pError) {
        logger.warn('Step5Attributes', 'Profile complete update error:', pError.message);
      }

      // 2. Insert/update rich profile_details
      await supabase.from('profile_details').upsert(
        {
          user_id: session.user.id,
          communication_style: commStyle,
          ideal_date: idealDate,
          lifestyle_vibe: lifestyleVibe,
          interests: selectedTags,
          smoking_habits: smoking,
          drinking_frequency: drinking,
          workout_habits: workout,
        },
        { onConflict: 'user_id' }
      );

      // 3. Complete onboarding and route to discover
      router.replace('/(tabs)/discover' as any);
    } catch (err: any) {
      logger.warn('Step5Attributes', 'Failed to save step 5:', err?.message || err);
      router.replace('/(tabs)/discover' as any);
    } finally {
      setSaving(false);
    }
  };

  const currentCategory = TAG_CATEGORIES[activeCategoryIndex];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your Campus Vibe</Text>
      <Text style={styles.subtitle}>
        Express who you are. Choose your date style, communication preference, and select up to {MAX_ALLOWED_TAGS} passions.
      </Text>

      {/* Ideal First Date */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionEmoji}>✨</Text>
          <Text style={styles.sectionTitle}>Your Ideal First Date</Text>
        </View>
        <Text style={styles.sectionHint}>What kind of date sounds most fun to you?</Text>
        <View style={styles.chipsWrap}>
          {IDEAL_DATES.map((item) => {
            const active = idealDate === item.label;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.choiceChip, active && styles.choiceChipActive]}
                onPress={() => setIdealDate(item.label)}
              >
                <Text style={styles.chipEmoji}>{item.emoji}</Text>
                <Text style={[styles.choiceChipText, active && styles.choiceChipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Communication Style */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionEmoji}>💬</Text>
          <Text style={styles.sectionTitle}>Communication Style</Text>
        </View>
        <Text style={styles.sectionHint}>Are you a texter, caller, or in-person talker?</Text>
        <View style={styles.chipsWrap}>
          {COMMUNICATION_STYLES.map((item) => {
            const active = commStyle === item.label;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.choiceChip, active && styles.choiceChipActive]}
                onPress={() => setCommStyle(item.label)}
              >
                <Text style={styles.chipEmoji}>{item.emoji}</Text>
                <Text style={[styles.choiceChipText, active && styles.choiceChipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Going Out vs Staying In */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionEmoji}>🛋️</Text>
          <Text style={styles.sectionTitle}>Going Out or Staying In?</Text>
        </View>
        <Text style={styles.sectionHint}>How do you recharge your social battery on weekends?</Text>
        <View style={styles.chipsWrap}>
          {LIFESTYLE_VIBES.map((item) => {
            const active = lifestyleVibe === item.label;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.choiceChip, active && styles.choiceChipActive]}
                onPress={() => setLifestyleVibe(item.label)}
              >
                <Text style={styles.chipEmoji}>{item.emoji}</Text>
                <Text style={[styles.choiceChipText, active && styles.choiceChipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Vast Tinder-style Passions & Interests (Up to 12) */}
      <View style={styles.sectionCard}>
        <View style={styles.passionsHeader}>
          <View>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionEmoji}>🔥</Text>
              <Text style={styles.sectionTitle}>Passions & Interests</Text>
            </View>
            <Text style={styles.sectionHint}>Select up to {MAX_ALLOWED_TAGS} things you love</Text>
          </View>
          <View style={[
            styles.counterBadge,
            selectedTags.length === MAX_ALLOWED_TAGS && styles.counterBadgeFull
          ]}>
            <Text style={styles.counterText}>
              {selectedTags.length} / {MAX_ALLOWED_TAGS}
            </Text>
          </View>
        </View>

        {/* Category switcher tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabs}
        >
          {TAG_CATEGORIES.map((cat, idx) => {
            const active = activeCategoryIndex === idx;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catTab, active && styles.catTabActive]}
                onPress={() => setActiveCategoryIndex(idx)}
              >
                <Text style={[styles.catTabText, active && styles.catTabTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Tags in current category */}
        <View style={styles.tagsGrid}>
          {currentCategory.tags.map((tag) => {
            const active = selectedTags.includes(tag.label);
            return (
              <TouchableOpacity
                key={tag.id}
                style={[styles.passionChip, active && styles.passionChipActive]}
                onPress={() => toggleTag(tag.label)}
              >
                <Text style={styles.tagEmoji}>{tag.emoji}</Text>
                <Text style={[styles.passionChipText, active && styles.passionChipTextActive]}>
                  {tag.label}
                </Text>
                {active && (
                  <Ionicons name="checkmark-circle" size={16} color="#fff" style={{ marginLeft: 4 }} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Habits overview */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionEmoji}>⚡</Text>
          <Text style={styles.sectionTitle}>Daily Habits</Text>
        </View>

        <Text style={styles.habitLabel}>Workout & Fitness</Text>
        <View style={styles.chipsWrap}>
          {['Never', 'Sometimes', 'Active', 'Daily'].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.smallChip, workout === opt && styles.smallChipActive]}
              onPress={() => setWorkout(opt)}
            >
              <Text style={[styles.smallChipText, workout === opt && styles.smallChipTextActive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.habitLabel, { marginTop: 14 }]}>Drinking</Text>
        <View style={styles.chipsWrap}>
          {['Never', 'Socially', 'Regularly'].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.smallChip, drinking === opt && styles.smallChipActive]}
              onPress={() => setDrinking(opt)}
            >
              <Text style={[styles.smallChipText, drinking === opt && styles.smallChipTextActive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.habitLabel, { marginTop: 14 }]}>Smoking</Text>
        <View style={styles.chipsWrap}>
          {['Never', 'Socially', 'Regularly'].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.smallChip, smoking === opt && styles.smallChipActive]}
              onPress={() => setSmoking(opt)}
            >
              <Text style={[styles.smallChipText, smoking === opt && styles.smallChipTextActive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Submit Button */}
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
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '900', color: lightTheme.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24, lineHeight: 20 },
  sectionCard: {
    backgroundColor: '#f9faff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e8edf8',
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  sectionEmoji: { fontSize: 18 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: lightTheme.text },
  sectionHint: { fontSize: 12, color: '#777', marginBottom: 12 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choiceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e5f2',
    gap: 6,
  },
  choiceChipActive: {
    backgroundColor: lightTheme.primary,
    borderColor: lightTheme.primary,
  },
  chipEmoji: { fontSize: 14 },
  choiceChipText: { fontSize: 13, fontWeight: '600', color: lightTheme.text },
  choiceChipTextActive: { color: '#fff', fontWeight: '700' },
  passionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  counterBadge: {
    backgroundColor: '#e8ecf8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterBadgeFull: {
    backgroundColor: '#ff4b4b',
  },
  counterText: { fontSize: 12, fontWeight: '800', color: lightTheme.primary },
  categoryTabs: { gap: 8, paddingVertical: 8, marginBottom: 8 },
  catTab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e5f2',
  },
  catTabActive: {
    backgroundColor: '#eef2ff',
    borderColor: lightTheme.primary,
  },
  catTabText: { fontSize: 12, fontWeight: '600', color: '#666' },
  catTabTextActive: { color: lightTheme.primary, fontWeight: '700' },
  tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  passionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e0e5f2',
    gap: 6,
  },
  passionChipActive: {
    backgroundColor: lightTheme.primary,
    borderColor: lightTheme.primary,
  },
  tagEmoji: { fontSize: 14 },
  passionChipText: { fontSize: 13, fontWeight: '500', color: lightTheme.text },
  passionChipTextActive: { color: '#fff', fontWeight: '700' },
  habitLabel: { fontSize: 13, fontWeight: '700', color: '#555', marginBottom: 8 },
  smallChip: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e0e5f2',
  },
  smallChipActive: { backgroundColor: lightTheme.primary, borderColor: lightTheme.primary },
  smallChipText: { fontSize: 12, fontWeight: '600', color: lightTheme.text },
  smallChipTextActive: { color: '#fff', fontWeight: '700' },
  button: {
    backgroundColor: lightTheme.primary,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});
