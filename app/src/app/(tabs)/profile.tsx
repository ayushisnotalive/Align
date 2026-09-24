import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Profile() {
  const router = useRouter();
  const { session } = useAuthStore();
  const [distance, setDistance] = useState(50);
  const [showMe, setShowMe] = useState(true);

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: handleLogout },
    ]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  const confirmDeleteAccount = () => {
    Alert.alert('Delete Account', 'This will initiate a 14-day deletion grace period. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: handleDeleteAccount },
    ]);
  };

  const handleDeleteAccount = async () => {
    const { error } = await supabase.rpc('request_deletion');
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Account Deletion Requested', 'Your account has been paused and will be deleted in 14 days.');
      await supabase.auth.signOut();
      router.replace('/(auth)/login');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <LinearGradient
        colors={[lightTheme.primary, '#4E31E8']}
        style={styles.profileCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={40} color={lightTheme.primary} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>User • 21</Text>
          <Text style={styles.email}>{session?.user?.email}</Text>
          <TouchableOpacity 
            style={styles.editBtn}
            onPress={() => router.push('/edit-profile' as any)}
          >
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Discovery Settings</Text>
        <View style={styles.cardGroup}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Show me on Align</Text>
            <Switch value={showMe} onValueChange={setShowMe} trackColor={{ true: lightTheme.primary, false: '#e0e0e0' }} />
          </View>
          <View style={styles.separator} />
          
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Maximum Distance</Text>
              <Text style={styles.settingSubtext}>{distance}km</Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity onPress={() => setDistance(Math.max(5, distance - 5))}>
                <Ionicons name="remove-circle" size={32} color={lightTheme.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setDistance(Math.min(100, distance + 5))}>
                <Ionicons name="add-circle" size={32} color={lightTheme.primary} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.separator} />
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Looking for</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.settingValue}>Women </Text>
              <Ionicons name="chevron-forward" size={16} color="#888" />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verification & Safety</Text>
        <View style={styles.cardGroup}>
          <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/(onboarding)/face-verification' as any)}>
            <View style={styles.iconLabel}>
              <Ionicons name="checkmark-done-circle" size={24} color="#1DA1F2" />
              <Text style={[styles.settingLabel, { color: '#1DA1F2', fontWeight: '700', marginLeft: 12 }]}>Get Verified (Blue Tick)</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          <View style={styles.separator} />

          <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/admin' as any)}>
            <View style={styles.iconLabel}>
              <Ionicons name="shield-checkmark" size={24} color={lightTheme.primary} />
              <Text style={[styles.settingLabel, { color: lightTheme.primary, fontWeight: '700', marginLeft: 12 }]}>Admin Panel</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.cardGroup}>
          <TouchableOpacity style={styles.settingRow} onPress={confirmLogout}>
            <Text style={[styles.settingLabel, { color: '#ff4b4b', fontWeight: '600' }]}>Logout</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.settingRow} onPress={confirmDeleteAccount}>
            <Text style={[styles.settingLabel, { color: '#ff4b4b', fontWeight: '600' }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: lightTheme.text,
    letterSpacing: -0.5,
  },
  profileCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: lightTheme.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  editBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editBtnText: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 14,
  },
  section: {
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 12,
    marginBottom: 12,
  },
  cardGroup: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 20,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: lightTheme.text,
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingSubtext: {
    fontSize: 14,
    color: lightTheme.primary,
    fontWeight: '700',
    marginTop: 4,
  },
  settingValue: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  stepper: {
    flexDirection: 'row',
    gap: 16,
  },
});
