import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';
import { Typography } from '../../components/ui/Typography';
import { PressableScale } from '../../components/ui/PressableScale';
import { FlashList } from '@shopify/flash-list';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import * as SecureStore from 'expo-secure-store';

type Match = {
  match_id: string;
  other_user_id: string;
  first_name: string;
  s3_key: string | null;
  last_message: string | null;
  last_message_time: string | null;
  is_new: boolean;
};

export default function Matches() {
  const router = useRouter();
  const { session } = useAuthStore();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();

    const matchesChannel = supabase
      .channel('matches_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches' },
        (payload) => {
          fetchMatches();
        }
      )
      .subscribe();

    const messagesChannel = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          fetchMatches();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(matchesChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, []);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase.rpc('get_matches');
      if (error) throw error;
      setMatches(data || []);
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = (matchId: string, name: string) => {
    router.push({
      pathname: '/chat/[id]' as any,
      params: { id: matchId, name },
    });
  };

  const getImageUrl = (s3Key: string | null) => {
    if (s3Key) {
      return `https://align-media.s3.amazonaws.com/${s3Key}`;
    }
    return 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800'; // Default placeholder
  };

  const newMatches = matches.filter(m => m.is_new);
  const activeConversations = matches.filter(m => !m.is_new);

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 86400000) { // less than 24 hours
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
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
          <View style={styles.badge}><Typography variant="caption" color="#fff">0</Typography></View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>
      </PressableScale>

      {/* New Matches Queue */}
      <Typography variant="h3" style={styles.sectionTitle}>New Matches</Typography>
      {newMatches.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.matchesQueue}
        >
          {newMatches.map(match => (
            <PressableScale 
              key={match.match_id} 
              style={styles.matchItem} 
              onPress={() => handleOpenChat(match.match_id, match.first_name)}
            >
              <View style={styles.matchImageContainer}>
                <Image source={{ uri: getImageUrl(match.s3_key) }} style={styles.matchImage} />
                <View style={styles.matchDot} />
              </View>
              <Typography variant="bodySmall" weight="600">{match.first_name}</Typography>
            </PressableScale>
          ))}
        </ScrollView>
      ) : (
        <View style={{ marginLeft: 24, marginBottom: 32 }}>
          <Typography variant="body" color={lightTheme.textSecondary}>
            Keep swiping to get new matches!
          </Typography>
        </View>
      )}

      <Typography variant="h3" style={styles.sectionTitle}>Messages</Typography>
    </View>
  );

  const renderItem = useCallback(({ item }: { item: Match }) => (
    <PressableScale 
      style={styles.chatRow} 
      onPress={() => handleOpenChat(item.match_id, item.first_name)}
      scaleTo={0.98}
    >
      <Image source={{ uri: getImageUrl(item.s3_key) }} style={styles.chatImage} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Typography variant="h4">{item.first_name}</Typography>
          <Typography variant="bodySmall">{formatTime(item.last_message_time)}</Typography>
        </View>
        <Typography variant="body" color={lightTheme.textSecondary} numberOfLines={1}>
          {item.last_message}
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
        {!loading && matches.length === 0 ? (
           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Typography variant="h3" color={lightTheme.textSecondary}>No matches yet</Typography>
           </View>
        ) : (
          <FlashList
            data={activeConversations}
            renderItem={renderItem}
            estimatedItemSize={88}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        )}
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
