import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../theme/colors';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { Typography } from '../components/ui/Typography';

export default function VerificationScreen() {
  const router = useRouter();
  const { session } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    
    // Simulate AI verification delay
    setTimeout(async () => {
      try {
        // Grant the blue tick
        await supabase
          .from('profile_details')
          .update({ is_verified: true })
          .eq('user_id', session.user.id);
          
        await supabase
          .from('profiles')
          .update({ is_blue_tick: true })
          .eq('id', session.user.id);

        Alert.alert(
          'Verification Successful! 🎉',
          'You are now a verified user. The coveted blue tick will appear next to your name!',
          [{ text: 'Awesome', onPress: () => router.back() }]
        );
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to update verification status.');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={28} color={lightTheme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {step === 1 ? (
          <>
            <View style={styles.iconContainer}>
              <Ionicons name="checkmark-circle" size={80} color={lightTheme.primary} />
            </View>
            <Typography variant="h2" align="center" style={{ marginBottom: 16 }}>
              Get Verified
            </Typography>
            <Typography variant="body" align="center" color={lightTheme.textSecondary} style={{ marginBottom: 40 }}>
              Prove you're the real deal. Verified profiles get 3x more matches and stand out in the feed.
            </Typography>

            <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
              <Text style={styles.buttonText}>Start Verification</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.poseContainer}>
              <Text style={styles.poseEmoji}>✌️</Text>
            </View>
            <Typography variant="h3" align="center" style={{ marginBottom: 16 }}>
              Copy this pose!
            </Typography>
            <Typography variant="body" align="center" color={lightTheme.textSecondary} style={{ marginBottom: 40 }}>
              Take a selfie holding up two fingers (peace sign) so our AI can verify it's really you.
            </Typography>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Submit Selfie (Mock)</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backBtn: { padding: 8 },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120, height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  poseContainer: {
    width: 160, height: 160,
    borderRadius: 80,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
    borderWidth: 4,
    borderColor: lightTheme.primary,
  },
  poseEmoji: { fontSize: 80 },
  button: {
    backgroundColor: lightTheme.primary,
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
