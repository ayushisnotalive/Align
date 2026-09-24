import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { lightTheme } from '../../theme/colors';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    if (!otp) return;
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email: email as string,
      token: otp,
      type: 'email',
    });

    setLoading(false);

    if (error) {
      Alert.alert('Verification Failed', error.message);
    } else {
      router.replace('/');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="mail-open-outline" size={40} color={lightTheme.primary} />
        </View>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>We've sent a 6-digit code to</Text>
        <Text style={styles.emailText}>{email}</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="000000"
          placeholderTextColor="#ccc"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          selectionColor={lightTheme.primary}
        />

        <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading || otp.length < 6}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify & Login</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Wrong email? Go back</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: lightTheme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: lightTheme.primary,
    marginTop: 4,
  },
  form: {
    gap: 24,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 20,
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 12,
    color: lightTheme.text,
    borderWidth: 1,
    borderColor: '#eee',
  },
  button: {
    backgroundColor: lightTheme.primary,
    padding: 18,
    borderRadius: 16,
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
  },
  backButton: {
    marginTop: 32,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  }
});
