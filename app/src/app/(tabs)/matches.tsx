import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';
import { Typography } from '../../components/ui/Typography';
import { PressableScale } from '../../components/ui/PressableScale';
import { FlashList } from '@shopify/flash-list';

const MOCK_NEW_MATCHES = [
  { id: '1', name: 'Aarav', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800' },
  { id: '2', name: 'Riya', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800' },
  { id: '3', name: 'Karan', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800' },
  { id: '4', name: 'Priya', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800' },
];

const MOCK_CONVERSATIONS = [
  { id: '10', name: 'Priya', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800', lastMessage: 'Hey, are you going to the fest tomorrow?', time: '2m' },
  { id: '11', name: 'Rohan', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', lastMessage: 'Haha that is hilarious 😂', time: '1h' },
  { id: '12', name: 'Neha', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800', lastMessage: 'See you at 5!', time: 'Yesterday' },
  { id: '13', name: 'Kabir', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800', lastMessage: 'What\'s up?', time: 'Tuesday' },
];

export default function Matches() {
  const router = useRouter();

  const handleOpenChat = (matchId: string, name: string) => {
    router.push({
      pathname: '/chat/[id]' as any,
      params: { id: matchId, name },
    });
  };

  const renderHeader = () => (
    <View style={styles.listHeader}>
      {/* Message Requests Banner */}
      <PressableScale 
        style={styles.requestsBanner} 
        onPress={() => router.push('/requests' as any)}
      >
        <View style={styles.requestsLeft}>
          <View style={styles.requestsIcon}>
            <Ionicons name="mail-unread" size={20} color={lightTheme.primary} />
          </View>
          <Typography variant="h4">Message Requests</Typography>
        </View>
        <View style={styles.requestsRight}>
          <View style={styles.badge}><Typography variant="caption" color="#fff">3</Typography></View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>
      </PressableScale>

      {/* New Matches Queue */}
      <Typography variant="h3" style={styles.sectionTitle}>New Matches</Typography>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.matchesQueue}
      >
        {MOCK_NEW_MATCHES.map(match => (
          <PressableScale 
            key={match.id} 
            style={styles.matchItem} 
            onPress={() => handleOpenChat(match.id, match.name)}
          >
            <View style={styles.matchImageContainer}>
              <Image source={{ uri: match.image }} style={styles.matchImage} />
              <View style={styles.matchDot} />
            </View>
            <Typography variant="bodySmall" weight="600">{match.name}</Typography>
          </PressableScale>
        ))}
      </ScrollView>

      <Typography variant="h3" style={styles.sectionTitle}>Messages</Typography>
    </View>
  );

  const renderItem = useCallback(({ item }: { item: typeof MOCK_CONVERSATIONS[0] }) => (
    <PressableScale 
      style={styles.chatRow} 
      onPress={() => handleOpenChat(item.id, item.name)}
      scaleTo={0.98}
    >
      <Image source={{ uri: item.image }} style={styles.chatImage} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Typography variant="h4">{item.name}</Typography>
          <Typography variant="bodySmall">{item.time}</Typography>
        </View>
        <Typography variant="body" color={lightTheme.textSecondary} numberOfLines={1}>
          {item.lastMessage}
        </Typography>
      </View>
    </PressableScale>
  ), []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h1">Messages</Typography>
      </View>

      <View style={styles.listContainer}>
        <FlashList
          data={MOCK_CONVERSATIONS}
          renderItem={renderItem}
          // @ts-ignore
          estimatedItemSize={88}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
    backgroundColor: lightTheme.background,
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    paddingBottom: 16,
  },
  requestsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: lightTheme.surface,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 20,
    marginBottom: 32,
    ...lightTheme.shadows.sm,
  },
  requestsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requestsIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: lightTheme.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: lightTheme.danger,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    marginLeft: 24,
    marginBottom: 16,
  },
  matchesQueue: {
    paddingHorizontal: 24,
    gap: 20,
    marginBottom: 32,
  },
  matchItem: {
    alignItems: 'center',
    width: 80,
  },
  matchImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  matchImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: lightTheme.primary,
  },
  matchDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: lightTheme.success,
    borderWidth: 3,
    borderColor: lightTheme.background,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
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
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.border,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
});
