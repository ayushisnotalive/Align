import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 120;

const MOCK_PROFILES = [
  { id: '1', name: 'Aarav', age: 21, college: 'IIT Delhi', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800' },
  { id: '2', name: 'Riya', age: 20, college: 'NIFT Delhi', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800' },
  { id: '3', name: 'Karan', age: 22, college: 'SRCC', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800' },
];

export default function Discover() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'left' | 'right') => {
    // Record swipe in DB here
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex((prev) => prev + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: false,
    }).start();
  };

  const renderCards = () => {
    if (currentIndex >= MOCK_PROFILES.length) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No more profiles nearby!</Text>
          <Text style={styles.emptySubtext}>Try expanding your search settings.</Text>
        </View>
      );
    }

    return MOCK_PROFILES.map((profile, i) => {
      if (i < currentIndex) return null;

      if (i === currentIndex) {
        const rotate = position.x.interpolate({
          inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
          outputRange: ['-10deg', '0deg', '10deg'],
          extrapolate: 'clamp',
        });
        
        const likeOpacity = position.x.interpolate({
          inputRange: [0, SCREEN_WIDTH / 4],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        });

        const nopeOpacity = position.x.interpolate({
          inputRange: [-SCREEN_WIDTH / 4, 0],
          outputRange: [1, 0],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={profile.id}
            style={[styles.cardStyle, { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] }]}
            {...panResponder.panHandlers}
          >
            <Animated.View style={[styles.stamp, styles.likeStamp, { opacity: likeOpacity }]}>
              <Text style={styles.stampTextLike}>LIKE</Text>
            </Animated.View>
            <Animated.View style={[styles.stamp, styles.nopeStamp, { opacity: nopeOpacity }]}>
              <Text style={styles.stampTextNope}>PASS</Text>
            </Animated.View>

            <Image source={{ uri: profile.image }} style={styles.image} />
            <View style={styles.cardInfo}>
              <Text style={styles.name}>{profile.name}, {profile.age}</Text>
              <Text style={styles.college}><Ionicons name="school" size={16} /> {profile.college}</Text>
            </View>
          </Animated.View>
        );
      }

      return (
        <Animated.View key={profile.id} style={[styles.cardStyle, { top: 10 * (i - currentIndex) }]}>
          <Image source={{ uri: profile.image }} style={styles.image} />
          <View style={styles.cardInfo}>
            <Text style={styles.name}>{profile.name}, {profile.age}</Text>
            <Text style={styles.college}><Ionicons name="school" size={16} /> {profile.college}</Text>
          </View>
        </Animated.View>
      );
    }).reverse();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity>
          <Ionicons name="options" size={28} color={lightTheme.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        {renderCards()}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => forceSwipe('left')}>
          <Ionicons name="close" size={32} color="#ff4b4b" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={() => forceSwipe('right')}>
          <Ionicons name="heart" size={32} color="#fff" />
        </TouchableOpacity>
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
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 16,
  },
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH - 32,
    height: SCREEN_WIDTH * 1.4,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  cardInfo: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    // Add gradient in a real app
    backgroundColor: 'rgba(0,0,0,0.6)', 
  },
  name: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  college: {
    color: '#eee',
    fontSize: 18,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    gap: 24,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  likeButton: {
    backgroundColor: lightTheme.primary,
  },
  stamp: {
    position: 'absolute',
    top: 50,
    padding: 10,
    borderWidth: 4,
    borderRadius: 10,
    zIndex: 10,
  },
  likeStamp: {
    left: 40,
    borderColor: '#4caf50',
    transform: [{ rotate: '-20deg' }],
  },
  nopeStamp: {
    right: 40,
    borderColor: '#ff4b4b',
    transform: [{ rotate: '20deg' }],
  },
  stampTextLike: {
    color: '#4caf50',
    fontSize: 32,
    fontWeight: 'bold',
  },
  stampTextNope: {
    color: '#ff4b4b',
    fontSize: 32,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: lightTheme.text,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },
});
