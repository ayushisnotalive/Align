import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';

const MOCK_NEW_MATCHES = [
  { id: '1', name: 'Aarav', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800' },
  { id: '2', name: 'Riya', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800' },
  { id: '3', name: 'Karan', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800' },
];

const MOCK_CONVERSATIONS = [
  { id: '10', name: 'Priya', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800', lastMessage: 'Hey, are you going to the fest tomorrow?', time: '2m' },
  { id: '11', name: 'Rohan', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', lastMessage: 'Haha that is hilarious 😂', time: '1h' },
];

export default function Matches() {
  const router = useRouter();

  const handleOpenChat = (matchId: string, name: string) => {
    router.push({
      pathname: '/chat/[id]' as any,
      params: { id: matchId, name },
    });
  };

  const handleOpenRequests = () => {
    router.push('/requests' as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <ScrollView style={styles.scroll}>
        {/* Message Requests Banner (Conditional) */}
        <TouchableOpacity style={styles.requestsBanner} onPress={handleOpenRequests}>
          <View style={styles.requestsLeft}>
            <View style={styles.requestsIcon}>
              <Ionicons name="mail-unread" size={20} color="#fff" />
            </View>
            <Text style={styles.requestsText}>Message Requests</Text>
          </View>
          <View style={styles.requestsRight}>
            <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </View>
        </TouchableOpacity>

        {/* New Matches Queue */}
        <Text style={styles.sectionTitle}>New Matches</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.matchesQueue}>
          {MOCK_NEW_MATCHES.map(match => (
            <TouchableOpacity key={match.id} style={styles.matchItem} onPress={() => handleOpenChat(match.id, match.name)}>
              <Image source={{ uri: match.image }} style={styles.matchImage} />
              <Text style={styles.matchName}>{match.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Conversations List */}
        <Text style={styles.sectionTitle}>Messages</Text>
        <View style={styles.conversationsList}>
          {MOCK_CONVERSATIONS.map(chat => (
            <TouchableOpacity key={chat.id} style={styles.chatRow} onPress={() => handleOpenChat(chat.id, chat.name)}>
              <Image source={{ uri: chat.image }} style={styles.chatImage} />
              <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>{chat.name}</Text>
                  <Text style={styles.chatTime}>{chat.time}</Text>
                </View>
                <Text style={styles.chatPreview} numberOfLines={1}>{chat.lastMessage}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: lightTheme.text,
  },
  scroll: {
    flex: 1,
  },
  requestsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: lightTheme.border,
  },
  requestsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requestsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: lightTheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: lightTheme.text,
  },
  requestsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#ff4b4b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: lightTheme.text,
    marginLeft: 24,
    marginBottom: 16,
  },
  matchesQueue: {
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  matchItem: {
    alignItems: 'center',
    width: 72,
  },
  matchImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: lightTheme.primary,
  },
  matchName: {
    fontSize: 14,
    fontWeight: '600',
    color: lightTheme.text,
  },
  conversationsList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  chatImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  chatContent: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.border,
    paddingBottom: 24,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: lightTheme.text,
  },
  chatTime: {
    fontSize: 14,
    color: '#888',
  },
  chatPreview: {
    fontSize: 16,
    color: '#666',
  },
});
