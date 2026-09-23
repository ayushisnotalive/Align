import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';

const MOCK_LIVE_FEED = [
  { id: '1', name: 'Kabir', goal: 'Grabbing coffee', expires_in: '1h 20m' },
  { id: '2', name: 'Ayesha', goal: 'Studying', expires_in: '45m' },
  { id: '3', name: 'Rahul', goal: 'At the gym', expires_in: '15m' },
];

export default function Explore() {
  const [isLiveModalVisible, setLiveModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  const handleGoLive = () => {
    // In a real app, call supabase.rpc('go_live', { p_goal_code: selectedGoal })
    setIsLive(true);
    setLiveModalVisible(false);
  };

  const handleStopLive = () => {
    // Call supabase.rpc('stop_live')
    setIsLive(false);
  };

  const handleActionOptions = (userName: string, userId: string) => {
    Alert.alert(
      `Options for ${userName}`,
      'What would you like to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Report', style: 'destructive', onPress: () => Alert.alert('Reported', 'User has been reported to admins.') },
        { text: 'Block', style: 'destructive', onPress: () => Alert.alert('Blocked', 'User has been blocked.') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <TouchableOpacity style={styles.hometownFilter}>
          <Ionicons name="location" size={16} color={lightTheme.primary} />
          <Text style={styles.hometownText}>Delhi</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={64} color="#ccc" />
        <Text style={styles.mapText}>Map integration goes here.</Text>
      </View>

      <View style={styles.liveSection}>
        <View style={styles.liveHeader}>
          <Text style={styles.sectionTitle}>Live Now</Text>
          {isLive ? (
            <TouchableOpacity style={styles.stopLiveBtn} onPress={handleStopLive}>
              <Text style={styles.stopLiveText}>Stop Live</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.goLiveBtn} onPress={() => setLiveModalVisible(true)}>
              <Text style={styles.goLiveText}>Go Live</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {isLive && (
          <View style={styles.myLiveBanner}>
            <Text style={styles.myLiveText}>You are currently live: "{selectedGoal}"</Text>
            <Text style={styles.myLiveTime}>Expires in 1h 59m</Text>
          </View>
        )}

        <ScrollView style={styles.feed} contentContainerStyle={{ paddingBottom: 24 }}>
          {MOCK_LIVE_FEED.map(live => (
            <View key={live.id} style={styles.liveCard}>
              <View style={styles.liveAvatar}>
                <Ionicons name="person" size={24} color="#fff" />
              </View>
              <View style={styles.liveInfo}>
                <Text style={styles.liveName}>{live.name}</Text>
                <Text style={styles.liveGoal}>{live.goal}</Text>
              </View>
              <TouchableOpacity style={styles.liveTime} onPress={() => handleActionOptions(live.name, live.id)}>
                <Ionicons name="ellipsis-horizontal" size={20} color="#888" />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <Ionicons name="time-outline" size={14} color="#888" />
                  <Text style={styles.liveTimeText}>{live.expires_in}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Go Live Modal */}
      <Modal visible={isLiveModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>What are you doing?</Text>
              <TouchableOpacity onPress={() => setLiveModalVisible(false)}>
                <Ionicons name="close" size={24} color={lightTheme.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.goalsContainer}>
              {['Grabbing coffee', 'Studying', 'At the gym', 'Looking for lunch', 'Chilling'].map(goal => (
                <TouchableOpacity 
                  key={goal} 
                  style={[styles.goalChip, selectedGoal === goal && styles.goalChipActive]}
                  onPress={() => setSelectedGoal(goal)}
                >
                  <Text style={[styles.goalChipText, selectedGoal === goal && styles.goalChipTextActive]}>{goal}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.startLiveBtn, !selectedGoal && { opacity: 0.5 }]} 
              disabled={!selectedGoal}
              onPress={handleGoLive}
            >
              <Text style={styles.startLiveBtnText}>Broadcast for 2 Hours</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: lightTheme.text,
  },
  hometownFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: lightTheme.border,
    gap: 4,
  },
  hometownText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: lightTheme.primary,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 24,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: lightTheme.border,
  },
  mapText: {
    marginTop: 8,
    color: '#888',
    fontWeight: '600',
  },
  liveSection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  liveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: lightTheme.text,
  },
  goLiveBtn: {
    backgroundColor: lightTheme.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  goLiveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stopLiveBtn: {
    backgroundColor: '#ff4b4b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  stopLiveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  myLiveBanner: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: lightTheme.primary,
    borderLeftWidth: 4,
  },
  myLiveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: lightTheme.text,
    marginBottom: 4,
  },
  myLiveTime: {
    fontSize: 14,
    color: lightTheme.primary,
  },
  feed: {
    flex: 1,
  },
  liveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: lightTheme.border,
  },
  liveAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  liveInfo: {
    flex: 1,
  },
  liveName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: lightTheme.text,
    marginBottom: 2,
  },
  liveGoal: {
    fontSize: 14,
    color: '#666',
  },
  liveTime: {
    alignItems: 'flex-end',
    gap: 4,
  },
  liveTimeText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 48,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: lightTheme.text,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  goalChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  goalChipActive: {
    backgroundColor: lightTheme.primary,
    borderColor: lightTheme.primary,
  },
  goalChipText: {
    color: '#666',
    fontWeight: '600',
  },
  goalChipTextActive: {
    color: '#fff',
  },
  startLiveBtn: {
    backgroundColor: lightTheme.primary,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  startLiveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
