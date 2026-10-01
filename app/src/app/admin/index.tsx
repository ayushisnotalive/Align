import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, RefreshControl, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme/colors';
import { supabase } from '../../lib/supabase';
import { logger } from '../../utils/logger';

interface PendingVerification {
  verification_id: string;
  user_id: string;
  first_name: string;
  college_name: string;
  city_name: string;
  proof_email: string | null;
  media_id: string | null;
  s3_key: string | null;
  submitted_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<'reports' | 'verifications'>('verifications');
  const [verifications, setVerifications] = useState<PendingVerification[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedVerId, setSelectedVerId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('ID card not clear or invalid');

  const checkAdminAndFetch = useCallback(async () => {
    try {
      const { data: isAdmin, error: adminErr } = await supabase.rpc('check_is_admin');
      if (adminErr || !isAdmin) {
        Alert.alert('Access Denied', 'You do not have administrative privileges to view this area.', [
          { text: 'Go Back', onPress: () => router.replace('/(tabs)/profile' as any) }
        ]);
        return;
      }

      await Promise.all([fetchVerifications(), fetchReports()]);
    } catch (err: any) {
      logger.warn('Admin', 'Admin access check error:', err?.message || err);
      Alert.alert('Error', 'Unable to verify admin credentials.');
      router.replace('/(tabs)/profile' as any);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    checkAdminAndFetch();
  }, [checkAdminAndFetch]);

  const fetchVerifications = async () => {
    try {
      const { data, error } = await supabase.rpc('admin_pending_college_verifications', { p_limit: 50 });
      if (error) throw error;
      setVerifications(data || []);
    } catch (err: any) {
      logger.warn('Admin', 'Failed to fetch verifications:', err?.message || err);
    }
  };

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*, target:profiles!target_id(id, first_name), reporter:profiles!reporter_id(id, first_name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setReports(data);
    } catch (err: any) {
      logger.warn('Admin', 'Failed to fetch reports:', err?.message || err);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    checkAdminAndFetch();
  };

  const handleApproveCollege = async (verId: string, userName: string) => {
    try {
      const { error } = await supabase.rpc('admin_review_college_verification', {
        p_verification_id: verId,
        p_approve: true,
      });

      if (error) throw error;
      Alert.alert('Approved! ✓', `College verification for ${userName} has been approved.`);
      setVerifications(prev => prev.filter(v => v.verification_id !== verId));
    } catch (err: any) {
      logger.warn('Admin', 'Approve error:', err?.message || err);
      Alert.alert('Error', err.message || 'Failed to approve verification');
    }
  };

  const promptRejectCollege = (verId: string) => {
    setSelectedVerId(verId);
    setRejectReason('Student ID document is blurry or unreadable');
    setRejectModalVisible(true);
  };

  const submitRejectCollege = async () => {
    if (!selectedVerId) return;
    try {
      const { error } = await supabase.rpc('admin_review_college_verification', {
        p_verification_id: selectedVerId,
        p_approve: false,
        p_reason: rejectReason || 'Document could not be verified'
      });

      if (error) throw error;
      Alert.alert('Rejected', 'Verification has been rejected with feedback.');
      setVerifications(prev => prev.filter(v => v.verification_id !== selectedVerId));
      setRejectModalVisible(false);
      setSelectedVerId(null);
    } catch (err: any) {
      logger.warn('Admin', 'Reject error:', err?.message || err);
      Alert.alert('Error', err.message || 'Failed to reject verification');
    }
  };

  const handleBan = async (targetId: string, targetName: string) => {
    Alert.alert('Ban User', `Are you sure you want to ban ${targetName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Ban', 
        style: 'destructive', 
        onPress: async () => {
          await supabase.from('profiles').update({ status: 'banned' }).eq('id', targetId);
          Alert.alert('User Banned', 'User has been banned.');
          fetchReports();
        }
      }
    ]);
  };

  const handleDismissReport = async (reportId: string) => {
    await supabase.from('reports').delete().eq('id', reportId);
    fetchReports();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={lightTheme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.replace('/(tabs)/profile' as any)} 
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={28} color={lightTheme.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Management</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={22} color={lightTheme.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, tab === 'verifications' && styles.tabBtnActive]}
          onPress={() => setTab('verifications')}
        >
          <Text style={[styles.tabText, tab === 'verifications' && styles.tabTextActive]}>
            Verifications ({verifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, tab === 'reports' && styles.tabBtnActive]}
          onPress={() => setTab('reports')}
        >
          <Text style={[styles.tabText, tab === 'reports' && styles.tabTextActive]}>
            Reports ({reports.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {tab === 'verifications' ? (
          <View style={styles.listContainer}>
            {verifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-done-circle-outline" size={64} color="#888" />
                <Text style={styles.emptyTitle}>Queue Clean!</Text>
                <Text style={styles.emptySub}>No student verification requests pending review.</Text>
              </View>
            ) : (
              verifications.map(ver => {
                const imageUrl = ver.s3_key 
                  ? `https://align-media.s3.amazonaws.com/${ver.s3_key}`
                  : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800';

                return (
                  <View key={ver.verification_id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.cardTitle}>{ver.first_name || 'Student'}</Text>
                        <Text style={styles.cardSub}>{ver.college_name} • {ver.city_name}</Text>
                      </View>
                      <View style={styles.pendingBadge}>
                        <Text style={styles.pendingBadgeText}>Pending</Text>
                      </View>
                    </View>

                    {ver.proof_email && (
                      <Text style={styles.emailClaim}>Claimed Email: {ver.proof_email}</Text>
                    )}

                    <Image source={{ uri: imageUrl }} style={styles.idImage} />

                    <View style={styles.actions}>
                      <TouchableOpacity 
                        style={styles.actionBtnReject} 
                        onPress={() => promptRejectCollege(ver.verification_id)}
                      >
                        <Ionicons name="close" size={18} color="#ff4b4b" />
                        <Text style={styles.actionBtnTextReject}>Reject</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionBtnAccept} 
                        onPress={() => handleApproveCollege(ver.verification_id, ver.first_name || 'Student')}
                      >
                        <Ionicons name="checkmark" size={18} color="#2ecc71" />
                        <Text style={styles.actionBtnTextAccept}>Approve</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        ) : (
          <View style={styles.listContainer}>
            {reports.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="shield-checkmark-outline" size={64} color="#888" />
                <Text style={styles.emptyTitle}>No Open Reports</Text>
                <Text style={styles.emptySub}>The community is safe and quiet.</Text>
              </View>
            ) : (
              reports.map(report => (
                <View key={report.id} style={styles.card}>
                  <Text style={styles.cardTitle}>Reported: {report.target?.first_name || 'Unknown'}</Text>
                  <Text style={styles.cardSub}>By: {report.reporter?.first_name || 'Anonymous'}</Text>
                  <Text style={styles.reason}>"{report.reason}"</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionBtnReject} onPress={() => handleDismissReport(report.id)}>
                      <Text style={styles.actionBtnTextReject}>Dismiss</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionBtnAccept, { backgroundColor: '#ffe5e5' }]} 
                      onPress={() => handleBan(report.target_id, report.target?.first_name || 'User')}
                    >
                      <Text style={[styles.actionBtnTextAccept, { color: '#ff4b4b' }]}>Ban User</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Reject Reason Modal */}
      <Modal visible={rejectModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Reason for Rejection</Text>
            <Text style={styles.modalSub}>Explain why this student verification could not be approved.</Text>
            
            <TextInput
              style={styles.modalInput}
              value={rejectReason}
              onChangeText={setRejectReason}
              placeholder="e.g. ID card expired or name doesn't match"
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelBtn} 
                onPress={() => setRejectModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalConfirmBtn} 
                onPress={submitRejectCollege}
              >
                <Text style={styles.modalConfirmText}>Confirm Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: lightTheme.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingTop: 60, 
    paddingBottom: 16, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: lightTheme.border 
  },
  backBtn: { padding: 6 },
  refreshBtn: { padding: 6 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: lightTheme.text },
  tabsContainer: { 
    flexDirection: 'row', 
    margin: 16, 
    backgroundColor: '#eee', 
    borderRadius: 20, 
    padding: 4 
  },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 16 },
  tabBtnActive: { backgroundColor: lightTheme.primary },
  tabText: { color: '#666', fontWeight: 'bold', fontSize: 13 },
  tabTextActive: { color: '#fff' },
  scroll: { flex: 1 },
  listContainer: { paddingHorizontal: 16, gap: 16 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: lightTheme.text, marginTop: 12 },
  emptySub: { fontSize: 14, color: '#888', marginTop: 4, textAlign: 'center' },
  card: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: lightTheme.border, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 2 
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: lightTheme.text },
  cardSub: { fontSize: 13, color: '#666', marginTop: 2 },
  pendingBadge: { backgroundColor: '#fff8e6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#ffe5a0' },
  pendingBadgeText: { fontSize: 11, fontWeight: 'bold', color: '#b78103' },
  emailClaim: { fontSize: 13, color: lightTheme.primary, fontWeight: '600', marginBottom: 10 },
  reason: { fontSize: 14, fontStyle: 'italic', color: lightTheme.text, backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 16 },
  idImage: { width: '100%', height: 220, borderRadius: 12, marginBottom: 16, resizeMode: 'cover', backgroundColor: '#eee' },
  actions: { flexDirection: 'row', gap: 12 },
  actionBtnReject: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 4, paddingVertical: 12, borderRadius: 12, backgroundColor: '#ffe5e5', alignItems: 'center' },
  actionBtnTextReject: { color: '#ff4b4b', fontWeight: 'bold' },
  actionBtnAccept: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 4, paddingVertical: 12, borderRadius: 12, backgroundColor: '#e5ffe5', alignItems: 'center' },
  actionBtnTextAccept: { color: '#2ecc71', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: lightTheme.text },
  modalSub: { fontSize: 13, color: '#666', marginTop: 4, marginBottom: 16 },
  modalInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, minHeight: 80, textAlignVertical: 'top', fontSize: 15, marginBottom: 20 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  modalCancelBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  modalCancelText: { color: '#666', fontWeight: '600' },
  modalConfirmBtn: { backgroundColor: '#ff4b4b', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  modalConfirmText: { color: '#fff', fontWeight: 'bold' },
});
