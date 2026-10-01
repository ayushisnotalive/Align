import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { supabase } from '../lib/supabase';
import { lightTheme } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { logger } from '../utils/logger';

export default function LocationGateScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const proceedWithCoords = async (latitude: number, longitude: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      return;
    }

    // Update location in DB
    const { error } = await supabase.rpc('set_location', {
      p_lat: latitude,
      p_lng: longitude,
      p_perm_state: 'granted'
    });

    if (error) {
      logger.warn('LocationGate', 'Failed to save location:', error.message);
    }

    // Save consent locally
    await SecureStore.setItemAsync('location_granted', 'true');

    // Check profile completeness for routing
    const { data: profile } = await supabase
      .from('profiles')
      .select('profile_complete')
      .eq('id', session.user.id)
      .maybeSingle();

    if (profile?.profile_complete) {
      router.replace('/(tabs)/discover' as any);
    } else {
      router.replace('/(onboarding)/step1-profile' as any);
    }
  };

  const handleGrantLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Could not get GPS permission. You can continue using standard campus location (Delhi) for testing.',
          [
            { text: 'Use Campus Location', onPress: () => proceedWithCoords(28.6139, 77.2090) },
            { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) }
          ]
        );
        return;
      }

      let lat = 28.6139;
      let lng = 77.2090;
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        lat = location.coords.latitude;
        lng = location.coords.longitude;
      } catch (e) {
        logger.warn('LocationGate', 'Could not get fine coords, using campus center');
      }

      await proceedWithCoords(lat, lng);
    } catch (err: any) {
      logger.warn('LocationGate', 'Location permission/retrieval error:', err?.message || err);
      // Fallback
      await proceedWithCoords(28.6139, 77.2090);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="location" size={64} color={lightTheme.primary} />
      </View>
      <Text style={styles.title}>Enable Location</Text>
      <Text style={styles.subtitle}>
        Align matches you with students and peers around your campus. Your exact coordinates are never shared with other users.
      </Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleGrantLocation}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Allow Location</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.fallbackBtn}
        onPress={() => proceedWithCoords(28.6139, 77.2090)}
        disabled={loading}
      >
        <Text style={styles.fallbackBtnText}>Use Default Campus Location (Delhi)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: lightTheme.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: lightTheme.primary,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
    shadowColor: lightTheme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  fallbackBtn: {
    marginTop: 18,
    paddingVertical: 12,
    alignItems: 'center',
  },
  fallbackBtnText: {
    color: lightTheme.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
