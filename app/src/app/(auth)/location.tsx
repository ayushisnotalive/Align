import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { lightTheme } from '../../theme/colors';

export default function LocationScreen() {
  const router = useRouter();

  const handleAllowLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need location permission to show people near you.'
      );
      return;
    }

    // Usually we would redirect to home or onboarding here
    // For now, let's just go back to root which handles routing or a placeholder home
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location is Required</Text>
      <Text style={styles.subtitle}>
        Align relies on your location to connect you with verified college students nearby.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleAllowLocation}>
        <Text style={styles.buttonText}>Allow Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: lightTheme.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: lightTheme.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
