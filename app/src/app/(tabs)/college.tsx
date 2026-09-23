import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

const MOCK_COLLEGE_FEED = [
  { id: '10', name: 'Priya', age: 21, college: 'IIT Delhi', degree: 'B.Tech CS', year: '3rd Year', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800' },
  { id: '11', name: 'Rohan', age: 22, college: 'IIT Delhi', degree: 'M.Tech', year: '1st Year', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800' },
];

export default function CollegeFeed() {
  const [scope, setScope] = useState<'college' | 'city' | 'state'>('college');

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
        {MOCK_COLLEGE_FEED.map(profile => (
          <View key={profile.id} style={styles.card}>
            <Image source={{ uri: profile.image }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{profile.name}, {profile.age}</Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={lightTheme.primary} />
                </View>
              </View>
              <Text style={styles.college}><Ionicons name="school" size={14} /> {profile.college}</Text>
              <Text style={styles.degree}>{profile.degree} • {profile.year}</Text>
              
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
        ))}
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
});
