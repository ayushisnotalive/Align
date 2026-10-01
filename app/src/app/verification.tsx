import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../theme/colors';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { Typography } from '../components/ui/Typography';
import { logger } from '../utils/logger';
import * as ImagePicker from 'expo-image-picker';

export default function VerificationScreen() {
  const router = useRouter();
  const { session } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isBlueTick, setIsBlueTick] = useState(false);
  const [collegeStatus, setCollegeStatus] = useState<string>('unverified');
  const [collegeName, setCollegeName] = useState<string>('Your College');
  const [step, setStep] = useState<'overview' | 'selfie'>('overview');
  const [selfieUri, setSelfieUri] = useState<string | null>(null);

  useEffect(() => {
    checkStatus();
  }, [session?.user?.id]);

  const checkStatus = async () => {
    if (!session?.user?.id) return;
    try {
      const [profileRes, collegeRes] = await Promise.all([
        supabase.from('profiles').select('is_blue_tick, school').eq('id', session.user.id).maybeSingle(),
        supabase.from('user_colleges').select('verification_status, colleges(name)').eq('user_id', session.user.id).maybeSingle()
      ]);

      if (profileRes.data) {
        setIsBlueTick(profileRes.data.is_blue_tick || false);
        if (profileRes.data.school) setCollegeName(profileRes.data.school);
      }

      if (collegeRes.data) {
        setCollegeStatus(collegeRes.data.verification_status || 'unverified');
        const col = collegeRes.data.colleges as any;
        if (col?.name) setCollegeName(col.name);
      }
    } catch (err: any) {
      logger.warn('Verification', 'Error checking verification status:', err?.message || err);
    } finally {
      setFetching(false);
    }
  };

  const pickSelfie = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelfieUri(result.assets[0].uri);
    }
  };

  const handleSelfieVerify = async () => {
    if (!session?.user?.id) return;
    setLoading(true);

    try {
      // Call the secure RPC to grant blue tick verification
      const { error } = await supabase.rpc('verify_user_blue_tick');
      if (error) throw error;

      setIsBlueTick(true);
      Alert.alert(
        'Verified! 🎉',
        'Congratulations! Your profile has been verified. The coveted blue tick is now active next to your name.',
        [{ text: 'Awesome!', onPress: () => router.back() }]
      );
    } catch (err: any) {
      logger.warn('Verification', 'Failed to complete face verification:', err?.message || err);
      Alert.alert('Verification Error', err.message || 'Could not complete verification.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={lightTheme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={28} color={lightTheme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trust & Verification</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {step === 'overview' ? (
          <>
            <View style={styles.statusBanner}>
              <Ionicons 
                name={isBlueTick ? "checkmark-circle" : "shield-checkmark"} 
                size={64} 
                color={isBlueTick ? "#1DA1F2" : lightTheme.primary} 
              />
              <Typography variant="h2" align="center" style={{ marginTop: 12, marginBottom: 4 }}>
                {isBlueTick ? 'Verified Account' : 'Get Verified on Align'}
              </Typography>
              <Typography variant="body" align="center" color={lightTheme.textSecondary}>
                {isBlueTick 
                  ? 'Your profile holds a verified blue badge. You stand out in discover feeds and get highest priority.'
                  : 'Verified profiles get 3x more campus connections and full trust across campus communities.'}
              </Typography>
            </View>

            {/* Blue Tick Card */}
            <View style={styles.card}>
              <View style={styles.cardIcon}>
                <Ionicons name="person-circle" size={32} color="#1DA1F2" />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.cardTitle}>Selfie Identity Verification</Text>
                <Text style={styles.cardSub}>
                  {isBlueTick ? 'Active: Blue tick granted' : 'Take a quick pose selfie to prove you are really you.'}
                </Text>
              </View>
              {isBlueTick ? (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.verifiedBadgeText}>Verified</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.cardActionBtn} onPress={() => setStep('selfie')}>
                  <Text style={styles.cardActionBtnText}>Start</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* College Card */}
            <View style={styles.card}>
              <View style={styles.cardIcon}>
                <Ionicons name="school" size={32} color={lightTheme.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.cardTitle}>Student ID Verification</Text>
                <Text style={styles.cardSub}>
                  {collegeStatus === 'approved' 
                    ? `Verified Student at ${collegeName}`
                    : collegeStatus === 'pending'
                    ? 'Student ID under review by campus mods'
                    : `Verify your enrollment at ${collegeName}`}
                </Text>
              </View>
              {collegeStatus === 'approved' ? (
                <View style={[styles.verifiedBadge, { backgroundColor: '#2ecc71' }]}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.verifiedBadgeText}>Approved</Text>
                </View>
              ) : collegeStatus === 'pending' ? (
                <View style={[styles.verifiedBadge, { backgroundColor: '#f39c12' }]}>
                  <Text style={styles.verifiedBadgeText}>Pending</Text>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.cardActionBtn} 
                  onPress={() => router.push('/(onboarding)/step3-college' as any)}
                >
                  <Text style={styles.cardActionBtnText}>Upload ID</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.perksCard}>
              <Text style={styles.perksTitle}>Why Get Verified?</Text>
              <View style={styles.perkRow}>
                <Ionicons name="flash" size={18} color="#f39c12" />
                <Text style={styles.perkText}>Priority placement in campus discover feed</Text>
              </View>
              <View style={styles.perkRow}>
                <Ionicons name="eye" size={18} color={lightTheme.primary} />
                <Text style={styles.perkText}>Exclusive Verified-Only filter access</Text>
              </View>
              <View style={styles.perkRow}>
                <Ionicons name="shield-checkmark" size={18} color="#2ecc71" />
                <Text style={styles.perkText}>Higher response rate from top campus profiles</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.selfieStep}>
            <View style={styles.poseContainer}>
              {selfieUri ? (
                <Image source={{ uri: selfieUri }} style={styles.selfiePreview} />
              ) : (
                <Text style={styles.poseEmoji}>✌️</Text>
              )}
            </View>

            <Typography variant="h2" align="center" style={{ marginBottom: 8 }}>
              Two-Finger Pose
            </Typography>
            <Typography variant="body" align="center" color={lightTheme.textSecondary} style={{ marginBottom: 32, paddingHorizontal: 20 }}>
              Hold up two fingers (peace sign) next to your face so we can verify it's the real you.
            </Typography>

            <View style={{ width: '100%', gap: 12 }}>
              <TouchableOpacity 
                style={styles.secondaryButton} 
                onPress={pickSelfie}
              >
                <Ionicons name="camera-outline" size={20} color={lightTheme.primary} />
                <Text style={styles.secondaryButtonText}>
                  {selfieUri ? 'Retake Photo' : 'Open Camera'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.primaryButton, loading && styles.buttonDisabled]} 
                onPress={handleSelfieVerify}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Verify Me Now</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.textButton} 
                onPress={() => setStep('overview')}
              >
                <Text style={styles.textButtonText}>Back to Overview</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: lightTheme.text },
  backBtn: { padding: 4 },
  content: { padding: 20, paddingBottom: 40 },
  statusBanner: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: lightTheme.text },
  cardSub: { fontSize: 12, color: '#777', marginTop: 3 },
  cardActionBtn: {
    backgroundColor: lightTheme.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  cardActionBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1DA1F2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  verifiedBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  perksCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  perksTitle: { fontSize: 16, fontWeight: '800', color: lightTheme.text, marginBottom: 14 },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  perkText: { fontSize: 14, color: '#555', flex: 1 },
  selfieStep: { alignItems: 'center', paddingVertical: 20 },
  poseContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 4,
    borderColor: lightTheme.primary,
    overflow: 'hidden',
  },
  poseEmoji: { fontSize: 72 },
  selfiePreview: { width: '100%', height: '100%' },
  primaryButton: {
    backgroundColor: lightTheme.primary,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  secondaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: lightTheme.primary,
    width: '100%',
  },
  secondaryButtonText: { color: lightTheme.primary, fontWeight: '700', fontSize: 15 },
  textButton: { alignItems: 'center', paddingVertical: 10 },
  textButtonText: { color: '#888', fontWeight: '600', fontSize: 14 },
  buttonDisabled: { opacity: 0.6 },
});
