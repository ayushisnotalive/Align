import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, ActivityIndicator, Dimensions } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';
import { useLiveFeed, LiveUser } from '../../hooks/use-live-feed';
import { supabase } from '../../lib/supabase';

// Goal options mapping display labels to backend codes
const GOAL_OPTIONS = [
  { label: 'Grabbing coffee', code: 'coffee' },
  { label: 'Studying', code: 'studying' },
  { label: 'At the gym', code: 'gym' },
  { label: 'Looking for lunch', code: 'lunch' },
  { label: 'Chilling', code: 'chilling' },
];

const GOAL_CODE_TO_LABEL: Record<string, string> = GOAL_OPTIONS.reduce((acc, opt) => {
  acc[opt.code] = opt.label;
  return acc;
}, {} as Record<string, string>);

export default function Explore() {
  const {
    feed,
    isLive,
    liveCountdown,
    fetchFeed,
    goLive,
    stopLive,
  } = useLiveFeed();

  const mapRef = useRef<MapView>(null);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [isLiveModalVisible, setLiveModalVisible] = useState(false);
  const [selectedGoalCode, setSelectedGoalCode] = useState<string | null>(null);
  const [isGoingLive, setIsGoingLive] = useState(false);
  const [selectedUser, setSelectedUser] = useState<LiveUser | null>(null);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [ghostMode, setGhostMode] = useState(false);

  // Fetch initial ghost mode status
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('discovery_settings')
          .select('ghost_mode')
          .eq('user_id', user.id)
          .single();
        if (data) setGhostMode(data.ghost_mode);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Location permission is needed to show the map.');
        // Default to Delhi if denied
        setInitialRegion({
          latitude: 28.6139,
          longitude: 77.2090,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      // Fetch feed for current location initially
      fetchFeed(location.coords.latitude, location.coords.longitude, 25);
    })();
  }, [fetchFeed]);

  const handleRegionChangeComplete = (region: Region) => {
    // Fetch nearby users when map is moved
    fetchFeed(region.latitude, region.longitude, 50);
  };

  const handleGoLive = async () => {
    if (!selectedGoalCode) return;
    setIsGoingLive(true);
    const result = await goLive(selectedGoalCode, []);
    setIsGoingLive(false);

    if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      setLiveModalVisible(false);
      setSelectedGoalCode(null);
    }
  };

  const handleStopLive = () => {
    Alert.alert(
      'Stop Live Session',
      'Are you sure you want to stop your live session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Stop', style: 'destructive', onPress: () => stopLive() },
      ]
    );
  };

  const handleSendWave = async () => {
    if (!selectedUser) return;
    setSendingRequest(true);
    try {
      const { error } = await supabase.rpc('send_message_request', {
        p_target_id: selectedUser.user_id,
        p_body: `Hey! I saw you are ${GOAL_CODE_TO_LABEL[selectedUser.goal_code] || selectedUser.goal_code} nearby.`
      });
      if (error) throw error;
      Alert.alert('Sent!', `You waved at ${selectedUser.name}.`);
      setSelectedUser(null);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setSendingRequest(false);
    }
  };

  const handleToggleGhostMode = async () => {
    const newGhostMode = !ghostMode;
    setGhostMode(newGhostMode);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('discovery_settings')
        .update({ ghost_mode: newGhostMode })
        .eq('user_id', user.id);
        
      if (error) {
        Alert.alert('Error', 'Failed to update Ghost Mode');
        setGhostMode(!newGhostMode); // Revert
      } else {
        Alert.alert('Ghost Mode', newGhostMode ? 'You are now hidden from the map.' : 'You are now visible on the map.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {initialRegion ? (
        <MapView 
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          onRegionChangeComplete={handleRegionChangeComplete}
          showsUserLocation
          showsMyLocationButton
          userInterfaceStyle="dark"
        >
          {feed.map(user => (
            user.lat && user.lng ? (
              <Marker
                key={user.user_id}
                coordinate={{ latitude: user.lat, longitude: user.lng }}
                onPress={() => setSelectedUser(user)}
              >
                <View style={styles.markerContainer}>
                  <View style={styles.markerAvatar}>
                    <Ionicons name="person" size={20} color="#fff" />
                  </View>
                </View>
              </Marker>
            ) : null
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={lightTheme.primary} />
          <Text style={styles.loadingText}>Locating you...</Text>
        </View>
      )}

      {/* Header Overlays */}
      <View style={styles.headerOverlay}>
        <Text style={styles.headerTitle}>Explore</Text>
        <TouchableOpacity style={[styles.ghostModeToggle, ghostMode && styles.ghostModeActive]} onPress={handleToggleGhostMode}>
          <Ionicons name={ghostMode ? "eye-off" : "eye"} size={20} color={ghostMode ? "#fff" : lightTheme.primary} />
        </TouchableOpacity>
      </View>

      {/* Floating Action Button for Going Live */}
      <View style={styles.fabContainer}>
        {isLive ? (
          <View style={styles.liveActiveContainer}>
            <View style={styles.liveActiveBadge}>
              <Ionicons name="radio-button-on" size={12} color={lightTheme.success} />
              <Text style={styles.liveActiveText}>Live: {liveCountdown}</Text>
            </View>
            <TouchableOpacity style={styles.stopLiveFab} onPress={handleStopLive}>
              <Ionicons name="stop" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.goLiveFab} onPress={() => setLiveModalVisible(true)}>
            <Ionicons name="radio-outline" size={24} color="#fff" />
            <Text style={styles.goLiveFabText}>Go Live</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Mini Profile Bottom Sheet */}
      <Modal visible={!!selectedUser} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalDismissArea} onPress={() => setSelectedUser(null)} />
          <View style={styles.profileSheetContent}>
            <View style={styles.profileSheetHeader}>
              <View style={styles.profileSheetAvatar}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>
              <View style={styles.profileSheetInfo}>
                <Text style={styles.profileSheetName}>{selectedUser?.name}</Text>
                <Text style={styles.profileSheetGoal}>
                  {selectedUser ? (GOAL_CODE_TO_LABEL[selectedUser.goal_code] || selectedUser.goal_code) : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedUser(null)}>
                <Ionicons name="close-circle" size={28} color="#ccc" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.waveBtn} 
              onPress={handleSendWave}
              disabled={sendingRequest}
            >
              {sendingRequest ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.waveBtnText}>Wave 👋</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Go Live Modal */}
      <Modal visible={isLiveModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>What are you doing?</Text>
              <TouchableOpacity onPress={() => setLiveModalVisible(false)}>
                <Ionicons name="close" size={24} color={lightTheme.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.goalsContainer}>
              {GOAL_OPTIONS.map((goal) => (
                <TouchableOpacity 
                  key={goal.code} 
                  style={[styles.goalChip, selectedGoalCode === goal.code && styles.goalChipActive]}
                  onPress={() => setSelectedGoalCode(goal.code)}
                >
                  <Text style={[
                    styles.goalChipText, 
                    selectedGoalCode === goal.code && styles.goalChipTextActive
                  ]}>
                    {goal.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.startLiveBtn, (!selectedGoalCode || isGoingLive) && { opacity: 0.5 }]} 
              disabled={!selectedGoalCode || isGoingLive}
              onPress={handleGoLive}
            >
              {isGoingLive ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.startLiveBtnText}>Broadcast for 2 Hours</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: lightTheme.background },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: lightTheme.textSecondary, fontWeight: '600' },
  headerOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#333' },
  ghostModeToggle: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  ghostModeActive: {
    backgroundColor: '#333',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    zIndex: 10,
  },
  goLiveFab: {
    backgroundColor: lightTheme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: lightTheme.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    gap: 8,
  },
  goLiveFabText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  liveActiveContainer: { alignItems: 'center', gap: 12 },
  liveActiveBadge: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    gap: 6,
  },
  liveActiveText: { color: lightTheme.text, fontWeight: '700', fontSize: 14 },
  stopLiveFab: {
    backgroundColor: lightTheme.danger,
    padding: 16,
    borderRadius: 30,
    shadowColor: lightTheme.danger,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  markerContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,107,107,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: lightTheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalDismissArea: { flex: 1 },
  profileSheetContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  profileSheetHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  profileSheetAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileSheetInfo: { flex: 1 },
  profileSheetName: { fontSize: 22, fontWeight: 'bold', color: lightTheme.text, marginBottom: 4 },
  profileSheetGoal: { fontSize: 16, color: lightTheme.textSecondary },
  waveBtn: {
    backgroundColor: lightTheme.primary,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  waveBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    marginBottom: 'auto',
    marginTop: 'auto',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: lightTheme.text },
  goalsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  goalChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  goalChipActive: { backgroundColor: lightTheme.primary, borderColor: lightTheme.primary },
  goalChipText: { color: '#666', fontWeight: '600' },
  goalChipTextActive: { color: '#fff' },
  startLiveBtn: {
    backgroundColor: lightTheme.primary,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  startLiveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
