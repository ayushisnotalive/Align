import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../theme/colors';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

export default function DiscoverySettings() {
  const router = useRouter();
  const { session } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [radius, setRadius] = useState(50);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(30);
  const [isPremium, setIsPremium] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<any>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    if (!session?.user?.id) return;
    try {
      const [settingsRes, creditsRes] = await Promise.all([
        supabase.from('discovery_settings').select('*').eq('user_id', session.user.id).single(),
        supabase.from('user_credits').select('is_premium').eq('user_id', session.user.id).single()
      ]);
        
      if (settingsRes.data) {
        setRadius(settingsRes.data.radius_km);
        setMinAge(settingsRes.data.min_age);
        setMaxAge(settingsRes.data.max_age);
        setAdvancedFilters(settingsRes.data.advanced_filters || {});
      }
      if (creditsRes.data) {
        setIsPremium(creditsRes.data.is_premium);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('discovery_settings')
        .update({
          radius_km: radius,
          min_age: minAge,
          max_age: maxAge,
          advanced_filters: advancedFilters,
        })
        .eq('user_id', session.user.id);
        
      if (error) throw error;
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not save settings.');
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
          <Ionicons name="chevron-back" size={28} color={lightTheme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discovery Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.settingCard}>
          <Text style={styles.label}>Max Distance: {radius} km</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.adjBtn} onPress={() => setRadius(Math.max(5, radius - 5))}>
              <Text style={styles.adjBtnText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adjBtn} onPress={() => setRadius(Math.min(160, radius + 5))}>
              <Text style={styles.adjBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingCard}>
          <Text style={styles.label}>Age Range: {minAge} - {maxAge}</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.adjBtn} onPress={() => setMinAge(Math.max(18, minAge - 1))}>
              <Text style={styles.adjBtnText}>Min -</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adjBtn} onPress={() => setMinAge(Math.min(maxAge, minAge + 1))}>
              <Text style={styles.adjBtnText}>Min +</Text>
            </TouchableOpacity>
            <View style={{ width: 16 }} />
            <TouchableOpacity style={styles.adjBtn} onPress={() => setMaxAge(Math.max(minAge, maxAge - 1))}>
              <Text style={styles.adjBtnText}>Max -</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adjBtn} onPress={() => setMaxAge(Math.min(100, maxAge + 1))}>
              <Text style={styles.adjBtnText}>Max +</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={[styles.label, { marginBottom: 0 }]}>Advanced Filters</Text>
            {!isPremium && <Ionicons name="lock-closed" size={20} color="#f1c40f" />}
          </View>
          
          <TouchableOpacity 
            style={styles.advancedToggle} 
            onPress={() => {
              if (!isPremium) {
                Alert.alert('Premium Feature', 'Upgrade to Align Premium to filter by height, education, and lifestyle.');
                return;
              }
              setAdvancedFilters((prev: any) => ({ ...prev, strictHeight: !prev?.strictHeight }));
            }}
          >
            <Text style={styles.advancedToggleText}>Strict Height Filtering (6'+)</Text>
            <View style={[styles.toggleBox, advancedFilters?.strictHeight && styles.toggleBoxActive]}>
              {advancedFilters?.strictHeight && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Changes</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: lightTheme.text },
  content: { padding: 24 },
  settingCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  btnRow: { flexDirection: 'row', alignItems: 'center' },
  adjBtn: {
    backgroundColor: lightTheme.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: lightTheme.border,
  },
  adjBtnText: { fontSize: 16, fontWeight: 'bold', color: lightTheme.text },
  button: {
    backgroundColor: lightTheme.primary,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  advancedToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  advancedToggleText: { fontSize: 16, color: lightTheme.textSecondary },
  toggleBox: {
    width: 24, height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: lightTheme.border,
    justifyContent: 'center', alignItems: 'center'
  },
  toggleBoxActive: {
    backgroundColor: lightTheme.primary,
    borderColor: lightTheme.primary,
  }
});
