import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GiftedChat, IMessage, Bubble, InputToolbar, Composer, Send, BubbleProps } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { Typography } from '../../components/ui/Typography';
import { PressableScale } from '../../components/ui/PressableScale';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import * as ImagePicker from 'expo-image-picker';
import { logger } from '../../utils/logger';

export default function ChatScreen() {
  const router = useRouter();
  const { id: matchId, name, otherUserId: paramOtherUserId } = useLocalSearchParams<{ id: string; name: string; otherUserId?: string }>();
  const [otherUserId, setOtherUserId] = useState<string | undefined>(paramOtherUserId);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { session } = useAuthStore();
  
  // Resolve otherUserId if not passed in params
  useEffect(() => {
    if (!otherUserId && matchId && session?.user?.id) {
      supabase
        .from('matches')
        .select('user_a, user_b')
        .eq('id', matchId)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            const partnerId = data.user_a === session.user.id ? data.user_b : data.user_a;
            setOtherUserId(partnerId);
          }
        });
    }
  }, [matchId, session?.user?.id, otherUserId]);
  
  // Reanimated 3 animated keyboard
  const keyboard = useAnimatedKeyboard();
  
  const animatedPaddingStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: Math.max(0, keyboard.height.value - 30),
    };
  });

  useEffect(() => {
    if (!matchId) return;

    fetchMessages();

    // Subscribe to new messages for this match
    const messagesChannel = supabase
      .channel(`chat_${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMessage = payload.new;
          if (newMessage.sender_id !== session?.user.id) {
            const giftedMsg: IMessage = {
              _id: newMessage.id,
              text: newMessage.body,
              createdAt: new Date(newMessage.created_at),
              image: newMessage.type === 'image' ? newMessage.media_url : undefined,
              user: {
                _id: newMessage.sender_id,
                name: name as string,
              },
              // @ts-ignore
              reaction: newMessage.reaction,
            };
            setMessages((prev) => GiftedChat.append(prev, [giftedMsg]));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const updatedMessage = payload.new;
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === updatedMessage.id
                ? { ...msg, reaction: updatedMessage.reaction }
                : msg
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [matchId]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.warn('Chat', 'Error fetching messages:', error.message);
    } else if (data) {
      const formattedMessages: IMessage[] = data.map(m => ({
        _id: m.id,
        text: m.body,
        createdAt: new Date(m.created_at),
        image: m.type === 'image' ? m.media_url : undefined,
        user: {
          _id: m.sender_id,
          name: m.sender_id === session?.user.id ? 'Me' : (name as string),
        },
        // @ts-ignore
        reaction: m.reaction,
      }));
      setMessages(formattedMessages);
    }
  };

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    const msg = newMessages[0];
    if (!msg || !session?.user.id) return;

    // Optimistically update UI
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));

    // Send to Supabase
    const { error } = await supabase
      .from('messages')
      .insert({
        match_id: matchId,
        sender_id: session.user.id,
        body: msg.text || '',
        type: msg.image ? 'image' : 'text',
        media_url: msg.image || null,
      });

    if (error) {
      logger.warn('Chat', 'Error sending message:', error.message);
      Alert.alert('Error', 'Failed to send message.');
    }
  }, [matchId, session?.user.id]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      try {
        const res = await fetch(uri);
        const blob = await res.blob();
        
        const { data, error: fnError } = await supabase.functions.invoke('presigned-upload', {
          body: { kind: 'chat_image', contentType: blob.type || 'image/jpeg', size: blob.size }
        });

        if (fnError || !data?.url) {
          Alert.alert('Upload failed', 'Could not get upload URL');
          return;
        }

        const uploadRes = await fetch(data.url, {
          method: 'PUT',
          headers: { 'Content-Type': blob.type || 'image/jpeg' },
          body: blob,
        });

        if (!uploadRes.ok) {
          Alert.alert('Upload failed', 'Failed to upload image');
          return;
        }

        const publicUrl = `https://align-media.s3.amazonaws.com/${data.key}`;
        
        const newMsg: IMessage = {
          _id: Math.random().toString(),
          text: '',
          image: publicUrl,
          createdAt: new Date(),
          user: { _id: session?.user?.id || '', name: 'Me' }
        };
        onSend([newMsg]);
      } catch (err: any) {
        logger.warn('Chat', 'Failed to share media:', err?.message || err);
        Alert.alert('Error', 'Failed to share media.');
      }
    }
  };

  const onLongPress = (context: any, message: any) => {
    Alert.alert('React', 'Choose a reaction', [
      { text: 'Cancel', style: 'cancel' },
      { text: '❤️ Heart', onPress: async () => {
        await supabase.from('messages').update({ reaction: '❤️' }).eq('id', message._id);
      }},
      { text: '😂 Laugh', onPress: async () => {
        await supabase.from('messages').update({ reaction: '😂' }).eq('id', message._id);
      }}
    ]);
  };

  const renderBubble = (props: BubbleProps<IMessage>) => {
    // @ts-ignore
    const reaction = props.currentMessage?.reaction;
    return (
      <View style={{ marginBottom: reaction ? 16 : 0 }}>
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: lightTheme.primary,
              borderBottomRightRadius: 4,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
              padding: 4,
              ...lightTheme.shadows.sm,
            },
            left: {
              backgroundColor: lightTheme.surface,
              borderWidth: 1,
              borderColor: lightTheme.border,
              borderBottomLeftRadius: 4,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              borderBottomRightRadius: 20,
              padding: 4,
              ...lightTheme.shadows.sm,
            }
          }}
          textStyle={{
            left: {
              color: lightTheme.text,
              fontWeight: '500',
            },
            right: {
              fontWeight: '500',
            }
          }}
        />
        {reaction && (
          <View style={[
            styles.reactionContainer,
            props.position === 'left' ? { left: 40 } : { right: 40 }
          ]}>
            <Text style={{ fontSize: 14 }}>{reaction}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderInputToolbar = (props: any) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, backgroundColor: lightTheme.surface, borderTopWidth: 1, borderColor: lightTheme.border }}>
      <PressableScale onPress={pickImage} style={{ padding: 8 }}>
        <Ionicons name="image" size={28} color={lightTheme.primary} />
      </PressableScale>
      <InputToolbar 
        {...props} 
        containerStyle={[styles.inputToolbar, { flex: 1, borderTopWidth: 0 }]}
        primaryStyle={{ alignItems: 'center' }}
      />
    </View>
  );

  const renderComposer = (props: any) => (
    <Composer
      {...props}
      textInputStyle={styles.composerInput}
      placeholderTextColor={lightTheme.textSecondary}
    />
  );

  const renderSend = (props: any) => (
    <Send {...props} containerStyle={styles.sendContainer}>
      <View style={styles.sendButton}>
        <Ionicons name="send" size={18} color="#fff" />
      </View>
    </Send>
  );

  const handleOptions = () => {
    Alert.alert(
      `Options for ${name}`,
      'What would you like to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Report', style: 'destructive', onPress: async () => {
          if (!session?.user?.id || !otherUserId) {
            Alert.alert('Notice', 'Unable to report at this time.');
            return;
          }
          await supabase.from('reports').insert({ reporter_id: session.user.id, target_id: otherUserId, reason: 'Inappropriate behavior' });
          Alert.alert('Reported', 'User has been reported. Our team will review this shortly.');
        }},
        { text: 'Block', style: 'destructive', onPress: async () => {
          if (!session?.user?.id || !otherUserId) {
            Alert.alert('Notice', 'Unable to block at this time.');
            return;
          }
          await supabase.from('blocks').insert({ blocker_id: session.user.id, blocked_id: otherUserId });
          Alert.alert('Blocked', 'You have blocked this user.');
          router.back();
        }},
        { text: 'Unmatch', style: 'destructive', onPress: async () => {
          if (!session?.user?.id) return;
          await supabase.from('matches').update({ status: 'unmatched', unmatched_by: session.user.id }).eq('id', matchId);
          Alert.alert('Unmatched', 'You have unmatched this user.');
          router.back();
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <PressableScale style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={lightTheme.primary} />
        </PressableScale>
        <Typography variant="h4">{name}</Typography>
        <PressableScale style={styles.optionsButton} onPress={handleOptions}>
          <Ionicons name="ellipsis-horizontal" size={24} color={lightTheme.primary} />
        </PressableScale>
      </View>
      
      <Animated.View style={[styles.chatContainer, animatedPaddingStyle]}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{ _id: session?.user?.id || '' }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
          // @ts-ignore
          onLongPress={onLongPress}
          // @ts-ignore
          bottomOffset={0} 
          minInputToolbarHeight={70}
        />
      </Animated.View>
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
    backgroundColor: lightTheme.surface,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.border,
    ...lightTheme.shadows.sm,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: lightTheme.primaryLight,
    borderRadius: 12,
  },
  optionsButton: {
    padding: 8,
    backgroundColor: lightTheme.primaryLight,
    borderRadius: 12,
  },
  chatContainer: {
    flex: 1,
  },
  inputToolbar: {
    backgroundColor: lightTheme.surface,
    borderTopWidth: 1,
    borderTopColor: lightTheme.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  composerInput: {
    backgroundColor: lightTheme.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    marginRight: 12,
    fontSize: 16,
    color: lightTheme.text,
    borderWidth: 1,
    borderColor: lightTheme.border,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: lightTheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...lightTheme.shadows.sm,
  },
  reactionContainer: {
    position: 'absolute',
    bottom: -12,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#eee',
    ...lightTheme.shadows.sm,
  }
});
