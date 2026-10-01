import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { UserSubscription } from '../types/premium';
import { supabase } from '../lib/supabase';

interface AiWingmanModalProps {
  visible: boolean;
  onClose: () => void;
  matchName?: string;
  onSelectPrompt?: (text: string) => void;
  onSelectOpener?: (text: string) => void;
  subscription?: UserSubscription | null;
  onOpenPremium?: (tier: 'diamond') => void;
  onUpgradeToDiamond?: () => void;
}

const CATEGORIES = [
  { id: 'witty', label: '⚡ Witty & Fun', icon: 'flash' },
  { id: 'flirty', label: '🔥 Smooth & Flirty', icon: 'flame' },
  { id: 'campus', label: '🎓 Campus Life', icon: 'school' },
  { id: 'date', label: '☕ Coffee / Date', icon: 'cafe' },
];

const SUGGESTIONS: Record<string, (name: string) => string[]> = {
  witty: (name) => [
    `Quick question ${name}, on a scale of 1 to 'pretending to take notes in an 8:30 AM lecture', how bored are you right now?`,
    `Are you a campus Wi-Fi router? Because I'm feeling an instant connection with zero downtime 😉`,
    `Hey ${name}, let's settle a campus debate: midnight canteen Maggi or late-night chai tapri?`,
    `I would tell you an engineering joke ${name}, but it's still under testing and probably has zero bugs!`,
  ],
  flirty: (name) => [
    `I saw your profile and honestly, skipping my afternoon class suddenly feels like a very reasonable life choice, ${name}.`,
    `Are you always this photogenic, or did you just curate your profile specifically to ruin my study schedule? ✨`,
    `Your smile is literally the only thing that could make a Monday morning attendance mandatory.`,
    `Hey ${name}, I usually wait 24 hours to text so I look mysterious, but honestly you're way too cute for that.`,
  ],
  campus: (name) => [
    `Hey ${name}! Are you heading to the college fest this weekend, or are you avoiding crowds like a pro?`,
    `Which campus canteen has the best cold coffee in your opinion? I'm taking recommendations!`,
    `Tell me your biggest college red flag: people who sit on the front bench, or people who leave group projects on seen? 😂`,
    `Surviving mid-terms or thriving? What's your current campus status?`,
  ],
  date: (name) => [
    `Hey ${name}, if we grabbed coffee near campus, what's your go-to order?`,
    `Ideal first date: quiet bookstore café or loud street food run with great music?`,
    `I know a killer spot near campus with the best sunsets. Think you can handle a friendly debate on music?`,
  ],
};

export default function AiWingmanModal({
  visible,
  onClose,
  matchName = 'there',
  onSelectPrompt,
  onSelectOpener,
  subscription,
  onOpenPremium,
  onUpgradeToDiamond,
}: AiWingmanModalProps) {
  const [selectedCat, setSelectedCat] = useState('witty');
  const [internalSub, setInternalSub] = useState<UserSubscription | null>(subscription || null);

  React.useEffect(() => {
    if (visible) {
      if (subscription) {
        setInternalSub(subscription);
      } else {
        supabase.rpc('get_user_subscription').then(({ data }) => {
          if (data) setInternalSub(data);
        });
      }
    }
  }, [visible, subscription]);

  const effectiveSub = subscription || internalSub;
  const isDiamond = effectiveSub?.has_subscription && effectiveSub.tier === 'diamond';
  const suggestions = SUGGESTIONS[selectedCat] ? SUGGESTIONS[selectedCat](matchName) : [];

  const handlePick = (prompt: string) => {
    if (!isDiamond) {
      Alert.alert(
        '💎 Align Diamond Exclusive',
        'AI Wingman rizz assistant is an exclusive VIP feature of Align Diamond. Upgrade now to unlock automated smart openers!',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Upgrade to Diamond',
            onPress: () => {
              onClose();
              if (onUpgradeToDiamond) onUpgradeToDiamond();
              else if (onOpenPremium) onOpenPremium('diamond');
            },
          },
        ]
      );
      return;
    }

    if (onSelectOpener) onSelectOpener(prompt);
    else if (onSelectPrompt) onSelectPrompt(prompt);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <LinearGradient
            colors={['#06B6D4', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.iconCircle}>
                  <Ionicons name="sparkles" size={18} color="#fff" />
                </View>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.headerTitle}>AI Wingman</Text>
                    <View style={styles.vipBadge}>
                      <Text style={styles.vipBadgeText}>DIAMOND VIP</Text>
                    </View>
                  </View>
                  <Text style={styles.headerSub}>Campus openers & banter coaching for {matchName}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Category pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCat === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catPill, isSelected && styles.catPillActive]}
                    onPress={() => setSelectedCat(cat.id)}
                  >
                    <Text style={[styles.catPillText, isSelected && styles.catPillTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </LinearGradient>

          {/* Prompts list */}
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Tap any opener to copy into chat:</Text>
            {suggestions.map((prompt, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.promptCard}
                onPress={() => handlePick(prompt)}
                activeOpacity={0.7}
              >
                <View style={styles.promptHeader}>
                  <View style={styles.sparkChip}>
                    <Ionicons name="bulb-outline" size={12} color="#06B6D4" />
                    <Text style={styles.sparkText}>Idea #{idx + 1}</Text>
                  </View>
                  <View style={styles.useRow}>
                    <Text style={styles.useText}>Use in Chat</Text>
                    <Ionicons name="send" size={12} color="#8B5CF6" />
                  </View>
                </View>
                <Text style={styles.promptBody}>"{prompt}"</Text>
              </TouchableOpacity>
            ))}

            {!isDiamond && (
              <View style={styles.lockedBanner}>
                <Ionicons name="lock-closed" size={20} color="#06B6D4" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.lockedTitle}>Preview Mode</Text>
                  <Text style={styles.lockedSub}>
                    Upgrade to Align Diamond to unlock unlimited AI suggestions, witty openers & real-time chat coaching.
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.upgradeBtn}
                  onPress={() => {
                    onClose();
                    if (onUpgradeToDiamond) onUpgradeToDiamond();
                    else if (onOpenPremium) onOpenPremium('diamond');
                  }}
                >
                  <Text style={styles.upgradeBtnText}>Upgrade</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
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
  sheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 20,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  vipBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  vipBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillsScroll: {
    flexDirection: 'row',
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginRight: 8,
  },
  catPillActive: {
    backgroundColor: '#fff',
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  catPillTextActive: {
    color: '#06B6D4',
  },
  content: {
    padding: 20,
    paddingBottom: 34,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 12,
  },
  promptCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sparkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFEFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sparkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#06B6D4',
  },
  useRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  useText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  promptBody: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
    fontWeight: '500',
  },
  lockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
  },
  lockedTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  lockedSub: {
    fontSize: 11,
    color: '#115E59',
    marginTop: 2,
    lineHeight: 15,
  },
  upgradeBtn: {
    backgroundColor: '#06B6D4',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    marginLeft: 8,
  },
  upgradeBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
});
