import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GiftedChat, IMessage, Bubble, InputToolbar, Composer, Send } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';
import Animated, { useAnimatedKeyboard, useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { Typography } from '../../components/ui/Typography';
import { PressableScale } from '../../components/ui/PressableScale';

export default function ChatScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams();
  const [messages, setMessages] = useState<IMessage[]>([]);
  
  // Reanimated 3 animated keyboard
  const keyboard = useAnimatedKeyboard();
  
  const animatedPaddingStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: Math.max(0, keyboard.height.value - 30), // GiftedChat has some internal padding
    };
  });

  useEffect(() => {
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
  }, []);

  const renderBubble = (props: any) => {
    return (
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
    );
  };

  const renderInputToolbar = (props: any) => (
    <InputToolbar 
      {...props} 
      containerStyle={styles.inputToolbar}
      primaryStyle={{ alignItems: 'center' }}
    />
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
          user={{ _id: 1 }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
          // @ts-ignore - bottomOffset might not be typed properly in this version
          bottomOffset={0} // Handled by Reanimated
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
});
