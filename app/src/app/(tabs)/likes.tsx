import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { lightTheme } from '../../theme/colors';
import { Typography } from '../../components/ui/Typography';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMN_WIDTH = (SCREEN_WIDTH - 48) / 2;

export default function LikesScreen() {
  const { session } = useAuthStore();
  const [likes, setLikes] = useState<any[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Check premium status
      const { data: creditData } = await supabase
        .from('user_credits')
        .select('is_premium')
        .eq('user_id', session?.user.id)
        .single();
      
      setIsPremium(creditData?.is_premium || false);

      // 2. Fetch inbound likes
      const { data, error } = await supabase.rpc('get_who_likes_me');
      if (error) throw error;
      setLikes(data || []);
    } catch (err) {
      console.error('Error fetching likes:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (profile: any) => {
    if (profile.photos && profile.photos.length > 0) {
      return `https://align-media.s3.amazonaws.com/${profile.photos[0].s3_key}`;
    }
    return 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400';
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.cardContainer}>
        <Image source={{ uri: getImageUrl(item) }} style={styles.cardImage} />
        {!isPremium && (
          <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark">
            <View style={styles.blurOverlay}>
              <Ionicons name="lock-closed" size={32} color="#fff" />
            </View>
          </BlurView>
        )}
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
          <Text style={styles.nameText}>{isPremium ? item.first_name : 'Someone'}</Text>
          <Text style={styles.ageText}>{isPremium ? item.age : 'Likes you'}</Text>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2">Who Likes You</Typography>
        <Typography variant="body" color={lightTheme.textSecondary}>
          {likes.length} people have already liked you.
        </Typography>
      </View>

      {!isPremium && (
        <View style={styles.paywallBanner}>
          <Ionicons name="star" size={24} color="#f1c40f" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.paywallTitle}>See who likes you</Text>
            <Text style={styles.paywallDesc}>Upgrade to Premium to reveal your admirers and match instantly.</Text>
          </View>
          <TouchableOpacity style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>Upgrade</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={likes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="heart-dislike-outline" size={64} color={lightTheme.border} />
            <Typography variant="h4" style={{ marginTop: 16 }}>No likes yet</Typography>
            <Typography variant="body" color={lightTheme.textSecondary} align="center">
              Keep swiping and optimizing your profile to get more likes!
            </Typography>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: lightTheme.background },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16 },
  listContent: { paddingHorizontal: 16, paddingBottom: 40 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 16 },
  cardContainer: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH * 1.4,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: lightTheme.surface,
    ...lightTheme.shadows.sm,
  },
  cardImage: { width: '100%', height: '100%' },
  blurOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  gradient: {
    position: 'absolute',
    bottom: 0, width: '100%', height: '40%',
    justifyContent: 'flex-end', padding: 12
  },
  nameText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  ageText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 40 },
  paywallBanner: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 16, padding: 16,
    backgroundColor: '#fff9e6', borderRadius: 16,
    borderWidth: 1, borderColor: '#ffeaa7'
  },
  paywallTitle: { fontSize: 16, fontWeight: '700', color: '#d35400' },
  paywallDesc: { fontSize: 12, color: '#e67e22', marginTop: 4 },
  upgradeBtn: {
    backgroundColor: '#f39c12', paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeBtnText: { color: '#fff', fontWeight: 'bold' }
});
