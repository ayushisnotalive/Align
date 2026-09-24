import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { supabase } from '../lib/supabase';
import { lightTheme } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

export default function LocationGateScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGrantLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Required',
          'Align needs your location to show people around you. Please enable it in your settings.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      // Update location in DB
      const { error } = await supabase.rpc('set_location', {
        p_lat: location.coords.latitude,
        p_lng: location.coords.longitude,
        p_perm_state: 'granted'
      });

      if (error) {
        console.error('Failed to save location', error);
      }

      // Save consent locally
      await SecureStore.setItemAsync('location_granted', 'true');

      // Check profile completeness for routing
      const { data: profile } = await supabase
        .from('profiles')
        .select('profile_complete')
        .eq('id', session.user.id)
        .single();

      if (profile?.profile_complete) {
        router.replace('/(tabs)/discover' as any);
      } else {
        router.replace('/(onboarding)/step1-profile' as any);
      }

    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong fetching your location.');
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
        You need to enable location to use Align. We only use this to show people near you and will never share your exact location.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleGrantLocation}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Allow Location</Text>
        )}
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
    backgroundColor: '#f5eef1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: lightTheme.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  button: {
    backgroundColor: lightTheme.primary,
    padding: 18,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: lightTheme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
