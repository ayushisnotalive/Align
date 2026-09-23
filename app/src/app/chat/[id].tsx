import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GiftedChat, IMessage, Bubble } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';

export default function ChatScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams();
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    // In a real app, we would fetch historical messages from public.messages where match_id = id
    // and subscribe to realtime inserts on public.messages for this match
    
    setMessages([
      {
        _id: 1,
        text: 'Hey! Are you going to the fest tomorrow?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: name as string || 'Match',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages),
    );
    // TODO: Insert into public.messages table via Supabase client
  }, []);

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: lightTheme.primary,
          },
          left: {
            backgroundColor: lightTheme.card,
            borderWidth: 1,
            borderColor: lightTheme.border,
          }
        }}
        textStyle={{
          left: {
            color: lightTheme.text,
          }
        }}
      />
    );
  };

  const handleOptions = () => {
    Alert.alert(
      `Options for ${name}`,
      'What would you like to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Unmatch', style: 'destructive', onPress: () => {
          Alert.alert('Unmatched', 'You have unmatched this user.');
          router.back();
        }},
        { text: 'Report', style: 'destructive', onPress: () => Alert.alert('Reported', 'User has been reported to admins.') },
        { text: 'Block', style: 'destructive', onPress: () => {
          Alert.alert('Blocked', 'User has been blocked.');
          router.back();
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={lightTheme.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <TouchableOpacity style={styles.optionsButton} onPress={handleOptions}>
          <Ionicons name="ellipsis-vertical" size={24} color={lightTheme.text} />
        </TouchableOpacity>
      </View>
      
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1, // Logged in user ID
        }}
        renderBubble={renderBubble}
      />
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
  optionsButton: {
    padding: 4,
  },
});
