import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AvatarPickerModal from '../../components/AvatarPickerModal';
import { DEFAULT_AVATAR } from '../../constants/avatars';
import { logger } from '../../utils/logger';

export default function Profile() {
  const router = useRouter();
  const { session } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [details, setDetails] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [distance, setDistance] = useState(50);
  const [showMe, setShowMe] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      const [pRes, dRes, privRes, adminRes, dsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle(),
        supabase.from('profile_details').select('*').eq('user_id', session.user.id).maybeSingle(),
        supabase.from('profile_private').select('*').eq('user_id', session.user.id).maybeSingle(),
        supabase.rpc('check_is_admin'),
        supabase.from('discovery_settings').select('*').eq('user_id', session.user.id).maybeSingle()
      ]);

      if (pRes.data) setProfile(pRes.data);
      if (dRes.data) setDetails(dRes.data);
      if (adminRes.data !== undefined) setIsAdmin(!!adminRes.data);
      if (dsRes.data) {
        setShowMe(dsRes.data.show_me ?? true);
        setDistance(dsRes.data.radius_km ?? 50);
      }
    } catch (err: any) {
      logger.warn('Profile', 'Failed to fetch profile data:', err?.message || err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  const handleAvatarSelect = async (avatarUrl: string) => {
    if (!session?.user?.id) return;
    try {
      setDetails((prev: any) => ({ ...prev, avatar_url: avatarUrl }));
      const { error } = await supabase
        .from('profile_details')
        .upsert({ user_id: session.user.id, avatar_url: avatarUrl }, { onConflict: 'user_id' });

      if (error) throw error;
      Alert.alert('Avatar Updated', 'Your profile icon has been updated!');
    } catch (err: any) {
      logger.warn('Profile', 'Failed to update avatar:', err?.message || err);
      Alert.alert('Error', 'Could not update profile icon.');
    }
  };

  const calculateAge = () => {
    if (details?.age) return details.age;
    return 21;
  };

  const displayName = profile?.first_name || details?.display_nickname || 'Student';
  const displayAge = calculateAge();
  const displayAvatar = details?.avatar_url || DEFAULT_AVATAR;
  const isVerified = profile?.is_blue_tick || details?.is_verified;
  const collegeName = details?.university_college || profile?.school || 'College Student';

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

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={lightTheme.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.headerEditBtn}
          onPress={() => router.push('/edit-profile' as any)}
        >
          <Ionicons name="create-outline" size={22} color={lightTheme.primary} />
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={[lightTheme.primary, '#4E31E8']}
        style={styles.profileCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity 
          style={styles.avatarWrap} 
          onPress={() => setAvatarModalVisible(true)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: displayAvatar }} style={styles.avatarImg} />
          <View style={styles.avatarEditBadge}>
            <Ionicons name="camera" size={14} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{displayName}, {displayAge}</Text>
            {isVerified && (
              <Ionicons name="checkmark-circle" size={22} color="#1DA1F2" style={{ marginLeft: 6 }} />
            )}
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="school" size={14} color="rgba(255,255,255,0.85)" />
            <Text style={styles.collegeText} numberOfLines={1}>{collegeName}</Text>
          </View>

          <Text style={styles.emailText} numberOfLines={1}>{session?.user?.email}</Text>

          <View style={styles.btnRow}>
            <TouchableOpacity 
              style={styles.editBtn}
              onPress={() => router.push('/edit-profile' as any)}
            >
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.iconBtn}
              onPress={() => setAvatarModalVisible(true)}
            >
              <Ionicons name="happy-outline" size={18} color="#fff" />
              <Text style={styles.iconBtnText}>Change Icon</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Discovery Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Discovery Settings</Text>
        <View style={styles.cardGroup}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Show me on Align</Text>
            <Switch 
              value={showMe} 
              onValueChange={async (val) => {
                setShowMe(val);
                if (session?.user?.id) {
                  await supabase.from('discovery_settings').update({ show_me: val }).eq('user_id', session.user.id);
                }
              }} 
              trackColor={{ true: lightTheme.primary, false: '#e0e0e0' }} 
            />
          </View>
          <View style={styles.separator} />
          
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Maximum Distance</Text>
              <Text style={styles.settingSubtext}>{distance}km</Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity onPress={async () => {
                const newDist = Math.max(5, distance - 5);
                setDistance(newDist);
                if (session?.user?.id) {
                  await supabase.from('discovery_settings').update({ radius_km: newDist }).eq('user_id', session.user.id);
                }
              }}>
                <Ionicons name="remove-circle" size={32} color={lightTheme.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={async () => {
                const newDist = Math.min(100, distance + 5);
                setDistance(newDist);
                if (session?.user?.id) {
                  await supabase.from('discovery_settings').update({ radius_km: newDist }).eq('user_id', session.user.id);
                }
              }}>
                <Ionicons name="add-circle" size={32} color={lightTheme.primary} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.separator} />
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => router.push('/discovery-settings' as any)}
          >
            <Text style={styles.settingLabel}>Advanced Filters & Preferences</Text>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Verification & Safety */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verification & Safety</Text>
        <View style={styles.cardGroup}>
          <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/verification' as any)}>
            <View style={styles.iconLabel}>
              <Ionicons name="checkmark-done-circle" size={24} color="#1DA1F2" />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.settingLabel, { color: '#1DA1F2', fontWeight: '700' }]}>
                  {isVerified ? 'Verification Status (Verified ✓)' : 'Get Verified (Blue Tick)'}
                </Text>
                <Text style={styles.settingSubtext}>
                  {isVerified ? 'Your profile is fully verified' : 'Stand out with selfie & student ID check'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          {/* ADMIN PANEL: STRICT RBAC - ONLY VISIBLE TO VERIFIED ADMINS */}
          {isAdmin && (
            <>
              <View style={styles.separator} />
              <TouchableOpacity 
                style={[styles.settingRow, { backgroundColor: '#f5f0ff' }]} 
                onPress={() => router.push('/admin' as any)}
              >
                <View style={styles.iconLabel}>
                  <Ionicons name="shield-checkmark" size={24} color={lightTheme.primary} />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={[styles.settingLabel, { color: lightTheme.primary, fontWeight: '800' }]}>
                      Admin Management Portal
                    </Text>
                    <Text style={styles.settingSubtext}>Review reports, verify IDs, moderate users</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={lightTheme.primary} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Account actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.cardGroup}>
          <TouchableOpacity style={styles.settingRow} onPress={confirmLogout}>
            <Text style={[styles.settingLabel, { color: '#ff4b4b', fontWeight: '600' }]}>Logout</Text>
            <Ionicons name="log-out-outline" size={20} color="#ff4b4b" />
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.settingRow} onPress={confirmDeleteAccount}>
            <Text style={[styles.settingLabel, { color: '#ff4b4b', fontWeight: '600' }]}>Delete Account</Text>
            <Ionicons name="trash-outline" size={20} color="#ff4b4b" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        visible={avatarModalVisible}
        onClose={() => setAvatarModalVisible(false)}
        onSelect={handleAvatarSelect}
        currentAvatarUrl={details?.avatar_url}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: lightTheme.text,
  },
  headerEditBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: lightTheme.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 16,
  },
  avatarImg: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#111',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  collegeText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginLeft: 4,
    flex: 1,
  },
  emailText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  editBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  editBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  iconBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  cardGroup: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: lightTheme.text,
  },
  settingSubtext: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#f2f2f2',
    marginHorizontal: 16,
  },
});
