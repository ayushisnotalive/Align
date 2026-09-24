import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Typography } from './ui/Typography';
import { PressableScale } from './ui/PressableScale';
import { lightTheme } from '../theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface MatchModalProps {
  visible: boolean;
  onClose: () => void;
  onMessage: () => void;
  myImage: string;
  theirImage: string;
  theirName: string;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  visible,
  onClose,
  onMessage,
  myImage,
  theirImage,
  theirName,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const myAvatarX = useSharedValue(-SCREEN_WIDTH);
  const theirAvatarX = useSharedValue(SCREEN_WIDTH);

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      opacity.value = withTiming(1, { duration: 400 });
      scale.value = withSpring(1, { damping: 12 });
      
      myAvatarX.value = withDelay(
        200,
        withSpring(-40, { damping: 14, stiffness: 100 })
      );
      theirAvatarX.value = withDelay(
        200,
        withSpring(40, { damping: 14, stiffness: 100 }, () => {
          // Impact when avatars collide
          // runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Heavy);
        })
      );
    } else {
      opacity.value = 0;
      scale.value = 0;
      myAvatarX.value = -SCREEN_WIDTH;
      theirAvatarX.value = SCREEN_WIDTH;
    }
  }, [visible]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const myAvatarStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: myAvatarX.value },
      { rotate: `${interpolate(myAvatarX.value, [-SCREEN_WIDTH, -40], [-45, -10])}deg` }
    ],
  }));

  const theirAvatarStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: theirAvatarX.value },
      { rotate: `${interpolate(theirAvatarX.value, [SCREEN_WIDTH, 40], [45, 10])}deg` }
    ],
  }));

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
        
        <Animated.View style={animatedContentStyle}>
          <Typography variant="h1" color="#fff" style={styles.title}>It's a Match!</Typography>
          <Typography variant="body" color="rgba(255,255,255,0.8)" style={styles.subtitle}>
            You and {theirName} aligned with each other.
          </Typography>

          <View style={styles.avatarsContainer}>
            <Animated.Image 
              source={{ uri: myImage }} 
              style={[styles.avatar, myAvatarStyle, { zIndex: 1 }]} 
            />
            <Animated.Image 
              source={{ uri: theirImage }} 
              style={[styles.avatar, theirAvatarStyle, { zIndex: 2 }]} 
            />
          </View>

          <View style={styles.actions}>
            <PressableScale style={styles.messageBtn} onPress={onMessage}>
              <Typography variant="h4" color="#fff">Send a Message</Typography>
            </PressableScale>
            
            <PressableScale style={styles.keepSwipingBtn} onPress={onClose}>
              <Typography variant="h4" color="#fff">Keep Swiping</Typography>
            </PressableScale>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 48,
  },
  avatarsContainer: {
    flexDirection: 'row',
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 64,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    position: 'absolute',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  actions: {
    gap: 16,
    width: SCREEN_WIDTH * 0.8,
  },
  messageBtn: {
    backgroundColor: lightTheme.primary,
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: 'center',
    ...lightTheme.shadows.lg,
  },
  keepSwipingBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: 'center',
  },
});
