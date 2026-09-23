import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();
  const { session } = useAuthStore();
  const [distance, setDistance] = useState(50);
  const [showMe, setShowMe] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>User • 21</Text>
          <Text style={styles.email}>{session?.user?.email}</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Discovery Settings</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Show me on Align</Text>
          <Switch value={showMe} onValueChange={setShowMe} trackColor={{ true: lightTheme.primary }} />
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Maximum Distance</Text>
            <Text style={styles.settingSubtext}>{distance}km</Text>
          </View>
          {/* A slider would go here, using buttons for mockup */}
          <View style={styles.stepper}>
            <TouchableOpacity onPress={() => setDistance(Math.max(5, distance - 5))}><Ionicons name="remove-circle" size={28} color={lightTheme.primary}/></TouchableOpacity>
            <TouchableOpacity onPress={() => setDistance(Math.min(100, distance + 5))}><Ionicons name="add-circle" size={28} color={lightTheme.primary}/></TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Looking for</Text>
          <Text style={styles.settingValue}>Women <Ionicons name="chevron-forward" /></Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verification & Safety</Text>

        <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/(onboarding)/face-verification' as any)}>
          <Text style={[styles.settingLabel, { color: '#1DA1F2', fontWeight: 'bold' }]}>Get Verified (Blue Tick)</Text>
          <Ionicons name="checkmark-done-circle" size={24} color="#1DA1F2" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/admin' as any)}>
          <Text style={[styles.settingLabel, { color: lightTheme.primary, fontWeight: 'bold' }]}>Admin Panel</Text>
          <Ionicons name="shield-checkmark" size={24} color={lightTheme.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
          <Text style={[styles.settingLabel, { color: '#ff4b4b' }]}>Logout</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: '#ff4b4b' }]}>Delete Account</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: lightTheme.text,
  },
  profileCard: {
    flexDirection: 'row',
    marginHorizontal: 24,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: lightTheme.border,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: lightTheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: lightTheme.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  editBtn: {
    backgroundColor: lightTheme.card,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: lightTheme.border,
  },
  editBtnText: {
    fontWeight: '600',
    color: lightTheme.text,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
    textTransform: 'uppercase',
    marginLeft: 24,
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.border,
  },
  settingLabel: {
    fontSize: 16,
    color: lightTheme.text,
  },
  settingSubtext: {
    fontSize: 14,
    color: lightTheme.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  settingValue: {
    fontSize: 16,
    color: '#888',
  },
  stepper: {
    flexDirection: 'row',
    gap: 12,
  },
});
