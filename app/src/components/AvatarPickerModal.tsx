import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../theme/colors';
import { PRESET_AVATARS, AvatarOption } from '../constants/avatars';

interface AvatarPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentAvatarUrl?: string | null;
  onPickCustom?: () => void;
}

export default function AvatarPickerModal({
  visible,
  onClose,
  onSelect,
  currentAvatarUrl,
  onPickCustom,
}: AvatarPickerModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Choose Profile Icon</Text>
              <Text style={styles.subtitle}>Select a personality avatar or pick from gallery</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={lightTheme.text} />
            </TouchableOpacity>
          </View>

          {onPickCustom && (
            <TouchableOpacity style={styles.customBtn} onPress={onPickCustom}>
              <View style={styles.customIconWrap}>
                <Ionicons name="camera-outline" size={22} color="#fff" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.customBtnTitle}>Upload from Gallery</Text>
                <Text style={styles.customBtnSub}>Use your own custom picture</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>
          )}

          <Text style={styles.sectionTitle}>Preset Avatars</Text>

          <FlatList
            data={PRESET_AVATARS}
            numColumns={3}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isSelected = currentAvatarUrl === item.url;
              return (
                <TouchableOpacity
                  style={[styles.avatarCard, isSelected && styles.avatarCardSelected]}
                  onPress={() => {
                    onSelect(item.url);
                    onClose();
                  }}
                >
                  <Image source={{ uri: item.url }} style={styles.avatarImg} />
                  <Text style={styles.avatarName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: lightTheme.text,
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  customBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8ecff',
    marginBottom: 16,
  },
  customIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: lightTheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customBtnTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: lightTheme.text,
  },
  customBtnSub: {
    fontSize: 12,
    color: '#888',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 16,
    gap: 12,
  },
  avatarCard: {
    flex: 1 / 3,
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    margin: 4,
    backgroundColor: '#fafafa',
  },
  avatarCardSelected: {
    borderColor: lightTheme.primary,
    backgroundColor: '#f0f3ff',
  },
  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
  },
  avatarName: {
    fontSize: 12,
    fontWeight: '600',
    color: lightTheme.text,
    marginTop: 6,
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: lightTheme.primary,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
