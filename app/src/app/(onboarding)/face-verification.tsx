import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';

export default function FaceVerification() {
  const router = useRouter();
  const [hasConsented, setHasConsented] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const handleVerify = () => {
    setIsVerifying(true);
    // In reality, this would open expo-camera, take a selfie, and hit our Edge Function.
    setTimeout(() => {
      setIsVerifying(false);
      Alert.alert('Success', 'Your face has been verified! You now have a Blue Tick.', [
        { text: 'Awesome', onPress: () => router.back() }
      ]);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={28} color={lightTheme.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="scan" size={64} color="#1DA1F2" />
        </View>
        <Text style={styles.title}>Get the Blue Tick</Text>
        
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Ionicons name="shield-checkmark" size={24} color={lightTheme.primary} />
            <View style={styles.bulletTextContainer}>
              <Text style={styles.bulletTitle}>Prove you're real</Text>
              <Text style={styles.bulletText}>We'll use a quick selfie to compare against your profile photos.</Text>
            </View>
          </View>
          <View style={styles.bulletItem}>
            <Ionicons name="trash-bin" size={24} color={lightTheme.primary} />
            <View style={styles.bulletTextContainer}>
              <Text style={styles.bulletTitle}>Privacy First</Text>
              <Text style={styles.bulletText}>Your biometric data is never shown on your profile and is permanently deleted within 24 hours.</Text>
            </View>
          </View>
          <View style={styles.bulletItem}>
            <Ionicons name="checkmark-done-circle" size={24} color="#1DA1F2" />
            <View style={styles.bulletTextContainer}>
              <Text style={styles.bulletTitle}>Stand out</Text>
              <Text style={styles.bulletText}>Get a blue tick next to your name to show others you're a verified human.</Text>
            </View>
          </View>
        </View>

        {!hasConsented ? (
          <View style={styles.consentBox}>
            <Text style={styles.consentText}>
              By proceeding, you consent to the collection and temporary processing of your facial biometric data for verification purposes.
            </Text>
            <TouchableOpacity style={styles.agreeBtn} onPress={() => setHasConsented(true)}>
              <Text style={styles.agreeBtnText}>I Agree</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.verifyBtn, isVerifying && { opacity: 0.7 }]} 
            onPress={handleVerify}
            disabled={isVerifying}
          >
            <Text style={styles.verifyBtnText}>{isVerifying ? 'Verifying...' : 'Take a Selfie'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: lightTheme.background },
  header: { paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16 },
  backBtn: { padding: 4, alignSelf: 'flex-start' },
  content: { paddingHorizontal: 24, flex: 1 },
  iconContainer: { alignItems: 'center', marginVertical: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: lightTheme.text, textAlign: 'center', marginBottom: 32 },
  bulletList: { gap: 24, marginBottom: 48 },
  bulletItem: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  bulletTextContainer: { flex: 1 },
  bulletTitle: { fontSize: 18, fontWeight: 'bold', color: lightTheme.text, marginBottom: 4 },
  bulletText: { fontSize: 14, color: '#666', lineHeight: 20 },
  consentBox: { backgroundColor: '#f0f0f0', padding: 20, borderRadius: 16, gap: 16 },
  consentText: { fontSize: 14, color: '#444', textAlign: 'center', lineHeight: 20 },
  agreeBtn: { backgroundColor: lightTheme.primary, paddingVertical: 14, borderRadius: 24, alignItems: 'center' },
  agreeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  verifyBtn: { backgroundColor: '#1DA1F2', paddingVertical: 16, borderRadius: 24, alignItems: 'center', marginTop: 'auto', marginBottom: 40 },
  verifyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});
