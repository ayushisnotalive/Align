import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../theme/colors';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    age: number;
    college: string;
    bio: string;
    images: string[];
    ideal_date?: string;
    communication_style?: string;
    lifestyle_vibe?: string;
    interests?: string[];
  } | null;
}

export default function ProfileModal({ visible, onClose, user }: ProfileModalProps) {
  if (!user) return null;

  const handleOptions = () => {
    Alert.alert(
      `Options for ${user.name}`,
      'What would you like to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Report', style: 'destructive', onPress: () => Alert.alert('Reported', 'User has been reported to admins.') },
        { text: 'Block', style: 'destructive', onPress: () => {
          Alert.alert('Blocked', 'User has been blocked.');
          onClose();
        }},
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="chevron-down" size={28} color={lightTheme.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOptions} style={styles.optionsBtn}>
            <Ionicons name="ellipsis-vertical" size={24} color={lightTheme.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.scroll}>
          <Image source={{ uri: (user.images && user.images[0]) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500' }} style={styles.coverImage} />
          <View style={styles.content}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{user.name}, {user.age}</Text>
              <Ionicons name="checkmark-circle" size={24} color={lightTheme.primary} />
            </View>
            <Text style={styles.college}><Ionicons name="school" size={16} /> {user.college}</Text>
            
            {user.bio ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About Me</Text>
                <Text style={styles.bio}>{user.bio}</Text>
              </View>
            ) : null}

            {/* Lifestyle & Dating Style */}
            {(!!user.ideal_date || !!user.communication_style || !!user.lifestyle_vibe) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Lifestyle & Connection</Text>
                <View style={styles.lifestyleGrid}>
                  {user.ideal_date ? (
                    <View style={styles.badgeItem}>
                      <Ionicons name="wine-outline" size={16} color={lightTheme.primary} />
                      <View style={{ marginLeft: 8, flex: 1 }}>
                        <Text style={styles.badgeLabel}>Ideal Date</Text>
                        <Text style={styles.badgeValue}>{user.ideal_date}</Text>
                      </View>
                    </View>
                  ) : null}
                  {user.communication_style ? (
                    <View style={styles.badgeItem}>
                      <Ionicons name="chatbubbles-outline" size={16} color={lightTheme.primary} />
                      <View style={{ marginLeft: 8, flex: 1 }}>
                        <Text style={styles.badgeLabel}>Communication</Text>
                        <Text style={styles.badgeValue}>{user.communication_style}</Text>
                      </View>
                    </View>
                  ) : null}
                  {user.lifestyle_vibe ? (
                    <View style={styles.badgeItem}>
                      <Ionicons name="sparkles-outline" size={16} color={lightTheme.primary} />
                      <View style={{ marginLeft: 8, flex: 1 }}>
                        <Text style={styles.badgeLabel}>Weekend Vibe</Text>
                        <Text style={styles.badgeValue}>{user.lifestyle_vibe}</Text>
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            )}

            {/* Passions */}
            {Array.isArray(user.interests) && user.interests.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Passions ({user.interests.length}/12)</Text>
                <View style={styles.tagWrap}>
                  {user.interests.map((tag, idx) => (
                    <View key={idx} style={styles.tagBadge}>
                      <Text style={styles.tagBadgeText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            <TouchableOpacity style={styles.blockBtn} onPress={handleOptions}>
              <Text style={styles.blockBtnText}>Block / Report {user.name}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  closeBtn: {
    padding: 4,
  },
  optionsBtn: {
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  coverImage: {
    width: '100%',
    height: 400,
  },
  content: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: lightTheme.text,
  },
  college: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: lightTheme.text,
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  blockBtn: {
    marginTop: 32,
    alignItems: 'center',
    paddingVertical: 16,
  },
  blockBtnText: {
    color: '#ff4b4b',
    fontWeight: 'bold',
    fontSize: 16,
  },
  lifestyleGrid: {
    gap: 10,
    marginTop: 4,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  badgeLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  badgeValue: {
    fontSize: 13,
    color: lightTheme.text,
    fontWeight: '700',
    marginTop: 1,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  tagBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
  },
  tagBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: lightTheme.primary,
  },
});
