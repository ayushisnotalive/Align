import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';

const MOCK_REPORTS = [
  { id: '1', targetName: 'Rohan', reporterName: 'Ayesha', reason: 'Inappropriate behavior in chat' },
];

const MOCK_VERIFICATIONS = [
  { id: '10', userName: 'Kabir', college: 'IIT Delhi', idImageUrl: 'https://images.unsplash.com/photo-1588666367352-255d6174a7eb?w=800' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<'reports' | 'verifications'>('reports');

  const handleBan = (userId: string) => {
    Alert.alert('User Banned', 'User has been banned and all active sessions will be terminated.');
  };

  const handleApproveCollege = (userId: string) => {
    Alert.alert('Approved', 'College verification approved.');
  };

  const handleRejectCollege = (userId: string) => {
    Alert.alert('Rejected', 'College verification rejected.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)/discover' as any);
            }
          }} 
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={28} color={lightTheme.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, tab === 'reports' && styles.tabBtnActive]}
          onPress={() => setTab('reports')}
        >
          <Text style={[styles.tabText, tab === 'reports' && styles.tabTextActive]}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, tab === 'verifications' && styles.tabBtnActive]}
          onPress={() => setTab('verifications')}
        >
          <Text style={[styles.tabText, tab === 'verifications' && styles.tabTextActive]}>Verifications</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        {tab === 'reports' ? (
          <View style={styles.listContainer}>
            {MOCK_REPORTS.map(report => (
              <View key={report.id} style={styles.card}>
                <Text style={styles.cardTitle}>Reported: {report.targetName}</Text>
                <Text style={styles.cardSub}>By: {report.reporterName}</Text>
                <Text style={styles.reason}>"{report.reason}"</Text>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.actionBtnReject} onPress={() => {}}>
                    <Text style={styles.actionBtnTextReject}>Dismiss</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtnAccept} onPress={() => handleBan(report.id)}>
                    <Text style={styles.actionBtnTextAccept}>Ban User</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.listContainer}>
            {MOCK_VERIFICATIONS.map(ver => (
              <View key={ver.id} style={styles.card}>
                <Text style={styles.cardTitle}>User: {ver.userName}</Text>
                <Text style={styles.cardSub}>Claims: {ver.college}</Text>
                <Image source={{ uri: ver.idImageUrl }} style={styles.idImage} />
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.actionBtnReject} onPress={() => handleRejectCollege(ver.id)}>
                    <Text style={styles.actionBtnTextReject}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtnAccept} onPress={() => handleApproveCollege(ver.id)}>
                    <Text style={styles.actionBtnTextAccept}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: lightTheme.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: lightTheme.border },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: lightTheme.text },
  tabsContainer: { flexDirection: 'row', margin: 24, backgroundColor: lightTheme.card, borderRadius: 20, padding: 4, borderWidth: 1, borderColor: lightTheme.border },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 16 },
  tabBtnActive: { backgroundColor: lightTheme.primary },
  tabText: { color: '#888', fontWeight: 'bold' },
  tabTextActive: { color: '#fff' },
  scroll: { flex: 1 },
  listContainer: { paddingHorizontal: 24, gap: 16, paddingBottom: 24 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: lightTheme.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: lightTheme.text, marginBottom: 4 },
  cardSub: { fontSize: 14, color: '#666', marginBottom: 12 },
  reason: { fontSize: 14, fontStyle: 'italic', color: lightTheme.text, backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 16 },
  idImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 16, resizeMode: 'cover' },
  actions: { flexDirection: 'row', gap: 12 },
  actionBtnReject: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#ffe5e5', alignItems: 'center' },
  actionBtnTextReject: { color: '#ff4b4b', fontWeight: 'bold' },
  actionBtnAccept: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#e5ffe5', alignItems: 'center' },
  actionBtnTextAccept: { color: '#2ecc71', fontWeight: 'bold' },
});
