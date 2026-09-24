import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { lightTheme } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

export default function ConsentsScreen() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (termsAccepted && privacyAccepted) {
      await SecureStore.setItemAsync('consents_granted', 'true');
      router.replace('/location-gate' as any);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Before we start</Text>
      <Text style={styles.subtitle}>
        Please review and accept our policies to continue using Align.
      </Text>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity 
          style={styles.checkboxRow} 
          onPress={() => setTermsAccepted(!termsAccepted)}
        >
          <View style={[styles.checkbox, termsAccepted && styles.checkboxSelected]}>
            {termsAccepted && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
          <Text style={styles.checkboxText}>
            I agree to the <Text style={styles.link}>Terms of Service</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.checkboxRow} 
          onPress={() => setPrivacyAccepted(!privacyAccepted)}
        >
          <View style={[styles.checkbox, privacyAccepted && styles.checkboxSelected]}>
            {privacyAccepted && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
          <Text style={styles.checkboxText}>
            I agree to the <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.button, (!termsAccepted || !privacyAccepted) && styles.buttonDisabled]} 
        onPress={handleContinue}
        disabled={!termsAccepted || !privacyAccepted}
      >
        <Text style={styles.buttonText}>Continue</Text>
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
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: lightTheme.text,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 48,
    lineHeight: 24,
  },
  checkboxContainer: {
    gap: 24,
    marginBottom: 48,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: lightTheme.primary,
    borderColor: lightTheme.primary,
  },
  checkboxText: {
    fontSize: 16,
    color: lightTheme.text,
  },
  link: {
    color: lightTheme.primary,
    fontWeight: '600',
  },
  button: {
    backgroundColor: lightTheme.primary,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ffb3c1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
