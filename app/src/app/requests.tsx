import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../theme/colors';

const MOCK_REQUESTS = [
  { id: '101', name: 'Kabir', age: 22, college: 'IIT Delhi', message: 'Hey, saw you at the fest! Wanna grab coffee?', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800' },
  { id: '102', name: 'Ananya', age: 20, college: 'NIFT Delhi', message: 'I love your style, where did you get that jacket?', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800' },
];

export default function MessageRequests() {
  const router = useRouter();

  const handleAction = (id: string, action: 'accept' | 'reject') => {
    // In a real app, call RPC to accept/reject request which creates a match and deletes the request
    // or just deletes the request.
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={lightTheme.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Message Requests</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.scroll}>
        <Text style={styles.subtitle}>
          People you haven't matched with can send you one short message request.
        </Text>
        
        {MOCK_REQUESTS.map(req => (
          <View key={req.id} style={styles.requestCard}>
            <Image source={{ uri: req.image }} style={styles.requestImage} />
            <View style={styles.requestInfo}>
              <View style={styles.infoHeader}>
                <Text style={styles.name}>{req.name}, {req.age}</Text>
                <Text style={styles.college}><Ionicons name="school" size={12}/> {req.college}</Text>
              </View>
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>"{req.message}"</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtnReject} onPress={() => handleAction(req.id, 'reject')}>
                  <Ionicons name="close" size={24} color="#ff4b4b" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtnAccept} onPress={() => handleAction(req.id, 'accept')}>
                  <Ionicons name="checkmark" size={24} color="#fff" />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: lightTheme.text,
  },
  scroll: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 32,
    lineHeight: 20,
  },
  requestCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 24,
    marginBottom: 24,
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
  requestImage: {
    width: 100,
    height: '100%',
  },
  requestInfo: {
    flex: 1,
    padding: 16,
  },
  infoHeader: {
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: lightTheme.text,
  },
  college: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  messageBubble: {
    backgroundColor: lightTheme.background,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  messageText: {
    fontSize: 14,
    color: lightTheme.text,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionBtnReject: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnAccept: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: lightTheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
