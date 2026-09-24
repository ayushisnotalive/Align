import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';
import { supabase } from '../../lib/supabase';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CollegeFeed() {
  const [scope, setScope] = useState<'college' | 'city' | 'state'>('college');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchCollegeFeed();
  }, [scope]);

  const fetchCollegeFeed = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase.rpc('get_feed', {
        p_mode: 'college',
        p_scope: scope === 'college' ? 'my_college' : (scope === 'city' ? 'my_city' : 'my_state'),
        p_cursor: null,
        p_limit: 20
      });

      if (error) {
        if (error.message.includes('verified college')) {
          setErrorMsg('You must verify your college ID to access the College Network.');
        } else {
          setErrorMsg(error.message);
        }
      } else {
        setProfiles(data || []);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (profile: any) => {
    if (profile.photos && profile.photos.length > 0) {
      return `https://align-media.s3.amazonaws.com/${profile.photos[0].s3_key}`;
    }
    return 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800';
  };

  if (errorMsg) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <Ionicons name="lock-closed" size={64} color={lightTheme.primary} style={{ marginBottom: 16 }} />
        <Text style={styles.errorText}>{errorMsg}</Text>
        {errorMsg.includes('verify') && (
          <TouchableOpacity style={styles.verifyBtn}>
            <Text style={styles.verifyBtnText}>Verify Now</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>College Network</Text>
        <Ionicons name="shield-checkmark" size={24} color={lightTheme.primary} />
      </View>
      
      <View style={styles.scopeToggle}>
        <TouchableOpacity 
          style={[styles.scopeBtn, scope === 'college' && styles.scopeBtnActive]}
          onPress={() => setScope('college')}
        >
          <Text style={[styles.scopeText, scope === 'college' && styles.scopeTextActive]}>My College</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.scopeBtn, scope === 'city' && styles.scopeBtnActive]}
          onPress={() => setScope('city')}
        >
          <Text style={[styles.scopeText, scope === 'city' && styles.scopeTextActive]}>My City</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.scopeBtn, scope === 'state' && styles.scopeBtnActive]}
          onPress={() => setScope('state')}
        >
          <Text style={[styles.scopeText, scope === 'state' && styles.scopeTextActive]}>My State</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.feed} contentContainerStyle={styles.feedContent}>
        {loading ? (
          <ActivityIndicator size="large" color={lightTheme.primary} style={{ marginTop: 40 }} />
        ) : profiles.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>No profiles found in this scope.</Text>
        ) : (
          profiles.map(profile => (
            <View key={profile.id} style={styles.card}>
              <Image source={{ uri: getImageUrl(profile) }} style={styles.cardImage} />
              <View style={styles.cardInfo}>
                <View style={styles.cardHeader}>
                  <Text style={styles.name}>{profile.first_name}, {profile.age}</Text>
                  {profile.is_blue_tick && (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color={lightTheme.primary} />
                    </View>
                  )}
                </View>
                <Text style={styles.college}><Ionicons name="school" size={14} /> {profile.college?.college_name || 'No College'}</Text>
                <Text style={styles.degree}>{profile.college?.course || ''} • {profile.college?.study_year || ''}</Text>
                
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="close" size={24} color="#ff4b4b" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, styles.likeBtn]}>
                    <Ionicons name="heart" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: lightTheme.text,
  },
  scopeToggle: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: lightTheme.card,
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: lightTheme.border,
  },
  scopeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 16,
  },
  scopeBtnActive: {
    backgroundColor: lightTheme.primary,
  },
  scopeText: {
    color: '#888',
    fontWeight: '600',
  },
  scopeTextActive: {
    color: '#fff',
  },
  feed: {
    flex: 1,
  },
  feedContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: lightTheme.border,
  },
  cardImage: {
    width: '100%',
    height: SCREEN_WIDTH - 48,
  },
  cardInfo: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: lightTheme.text,
  },
  verifiedBadge: {
    marginLeft: 8,
  },
  college: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  degree: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeBtn: {
    backgroundColor: lightTheme.primary,
  },
  errorText: {
    fontSize: 18,
    color: lightTheme.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
  },
  verifyBtn: {
    backgroundColor: lightTheme.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  verifyBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
