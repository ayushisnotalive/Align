import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { PremiumPlan, PremiumTier, UserSubscription } from '../types/premium';
import { logger } from '../utils/logger';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  defaultTier?: PremiumTier;
  initialTier?: PremiumTier;
  onSubscriptionUpdated?: (sub: UserSubscription) => void;
  onUpgradeSuccess?: () => void;
}

const { width } = Dimensions.get('window');

const TIER_CONFIG: Record<
  PremiumTier,
  {
    name: string;
    badge: string;
    icon: keyof typeof Ionicons.glyphMap;
    colors: [string, string];
    accent: string;
    monthlyPrice: number;
    quarterlyPrice: number;
    tagline: string;
  }
> = {
  plus: {
    name: 'Align Plus',
    badge: 'PLUS',
    icon: 'flash',
    colors: ['#4E31E8', '#6366F1'],
    accent: '#4E31E8',
    monthlyPrice: 199,
    quarterlyPrice: 499,
    tagline: 'Spark your campus connection with unlimited power',
  },
  gold: {
    name: 'Align Gold',
    badge: 'GOLD 👑',
    icon: 'trophy',
    colors: ['#F59E0B', '#D97706'],
    accent: '#F59E0B',
    monthlyPrice: 399,
    quarterlyPrice: 899,
    tagline: 'See who likes you & maximize matches with Smart Photo AI',
  },
  diamond: {
    name: 'Align Diamond',
    badge: 'DIAMOND 💎',
    icon: 'diamond',
    colors: ['#06B6D4', '#8B5CF6'],
    accent: '#06B6D4',
    monthlyPrice: 699,
    quarterlyPrice: 1599,
    tagline: 'The pinnacle of VIP college dating, radar & AI wingman',
  },
};

export default function PremiumModal({
  visible,
  onClose,
  defaultTier,
  initialTier = 'gold',
  onSubscriptionUpdated,
  onUpgradeSuccess,
}: PremiumModalProps) {
  const effectiveTier = defaultTier || initialTier || 'gold';
  const [selectedTier, setSelectedTier] = useState<PremiumTier>(effectiveTier);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('monthly');
  const [plans, setPlans] = useState<PremiumPlan[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (visible) {
      if (defaultTier || initialTier) setSelectedTier(defaultTier || initialTier);
      loadPlansAndSubscription();
    }
  }, [visible, defaultTier, initialTier]);

  const loadPlansAndSubscription = async () => {
    try {
      setLoading(true);
      const [plansRes, subRes] = await Promise.all([
        supabase.rpc('get_available_plans'),
        supabase.rpc('get_user_subscription'),
      ]);

      if (plansRes.data) {
        setPlans(plansRes.data);
      }
      if (subRes.data) {
        setSubscription(subRes.data);
        if (subRes.data.tier && !defaultTier) {
          setSelectedTier(subRes.data.tier as PremiumTier);
        }
      }
    } catch (err: any) {
      logger.warn('PremiumModal', 'Failed to load plans:', err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setProcessing(true);
      const days = billingCycle === 'quarterly' ? 90 : 30;

      const { data, error } = await supabase.rpc('activate_subscription', {
        p_plan_id: selectedTier,
        p_duration_days: days,
      });

      if (error) throw error;

      if (data) {
        setSubscription(data);
        if (onSubscriptionUpdated) onSubscriptionUpdated(data);
        if (onUpgradeSuccess) onUpgradeSuccess();
      }

      Alert.alert(
        '🎉 Welcome to ' + TIER_CONFIG[selectedTier].name + '!',
        `Your ${billingCycle === 'quarterly' ? '3-month' : 'monthly'} subscription is now active! All ${selectedTier.toUpperCase()} features have been unlocked.`,
        [{ text: 'Awesome!', onPress: onClose }]
      );
    } catch (err: any) {
      Alert.alert('Subscription Failed', err?.message || 'Could not activate subscription.');
    } finally {
      setProcessing(false);
    }
  };

  const currentConfig = TIER_CONFIG[selectedTier];
  const activePlan = plans.find((p) => p.id === selectedTier);
  const isCurrentPlanActive = subscription?.has_subscription && subscription.tier === selectedTier;

  // Features list for selected tier
  const featuresList = activePlan?.features?.feature_list || [
    'Unlimited Daily Swipes & Likes',
    'Rewind Last Swiped Profiles',
    'Campus Passport: Match in any city',
    'Incognito Mode & Ad-free experience',
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="sparkles" size={18} color="#F59E0B" />
              <Text style={styles.headerTitle}>Align Memberships</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* 3 Tier Segment Selector */}
            <View style={styles.tierSelector}>
              {(['plus', 'gold', 'diamond'] as PremiumTier[]).map((tier) => {
                const config = TIER_CONFIG[tier];
                const isSelected = selectedTier === tier;
                const isUserCurrent = subscription?.has_subscription && subscription.tier === tier;

                return (
                  <TouchableOpacity
                    key={tier}
                    style={[
                      styles.tierTab,
                      isSelected && {
                        backgroundColor: config.accent,
                        borderColor: config.accent,
                        shadowColor: config.accent,
                        shadowOpacity: 0.35,
                        shadowRadius: 8,
                      },
                    ]}
                    onPress={() => setSelectedTier(tier)}
                  >
                    <Ionicons
                      name={config.icon}
                      size={16}
                      color={isSelected ? '#fff' : '#666'}
                    />
                    <Text
                      style={[
                        styles.tierTabText,
                        isSelected && { color: '#fff', fontWeight: '800' },
                      ]}
                    >
                      {tier.toUpperCase()}
                    </Text>
                    {isUserCurrent && (
                      <View style={styles.activeDot}>
                        <Text style={styles.activeDotText}>ACTIVE</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Hero Gradient Card */}
            <LinearGradient
              colors={currentConfig.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroTopRow}>
                <View style={styles.heroBadge}>
                  <Ionicons name={currentConfig.icon} size={14} color="#fff" />
                  <Text style={styles.heroBadgeText}>{currentConfig.badge}</Text>
                </View>
                {isCurrentPlanActive && (
                  <View style={styles.currentPlanPill}>
                    <Text style={styles.currentPlanPillText}>CURRENT PLAN</Text>
                  </View>
                )}
              </View>

              <Text style={styles.heroTitle}>{currentConfig.name}</Text>
              <Text style={styles.heroTagline}>{currentConfig.tagline}</Text>

              {/* Price display */}
              <View style={styles.priceRow}>
                <Text style={styles.currencySymbol}>₹</Text>
                <Text style={styles.priceAmount}>
                  {billingCycle === 'quarterly'
                    ? currentConfig.quarterlyPrice
                    : currentConfig.monthlyPrice}
                </Text>
                <Text style={styles.pricePeriod}>
                  {billingCycle === 'quarterly' ? ' / 3 months' : ' / month'}
                </Text>
              </View>
            </LinearGradient>

            {/* Billing Cycle Toggle */}
            <View style={styles.billingToggleWrap}>
              <TouchableOpacity
                style={[
                  styles.billingOption,
                  billingCycle === 'monthly' && styles.billingOptionSelected,
                ]}
                onPress={() => setBillingCycle('monthly')}
              >
                <Text
                  style={[
                    styles.billingOptionText,
                    billingCycle === 'monthly' && styles.billingOptionTextSelected,
                  ]}
                >
                  Monthly
                </Text>
                <Text style={styles.billingSubPrice}>₹{currentConfig.monthlyPrice}/mo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.billingOption,
                  billingCycle === 'quarterly' && styles.billingOptionSelected,
                ]}
                onPress={() => setBillingCycle('quarterly')}
              >
                <View style={styles.saveBadge}>
                  <Text style={styles.saveBadgeText}>SAVE 30%</Text>
                </View>
                <Text
                  style={[
                    styles.billingOptionText,
                    billingCycle === 'quarterly' && styles.billingOptionTextSelected,
                  ]}
                >
                  3 Months
                </Text>
                <Text style={styles.billingSubPrice}>
                  ₹{Math.round(currentConfig.quarterlyPrice / 3)}/mo
                </Text>
              </TouchableOpacity>
            </View>

            {/* Key Perks Showcase */}
            <Text style={styles.featuresHeading}>Included in {currentConfig.name}:</Text>
            <View style={styles.featuresList}>
              {featuresList.map((feat, index) => (
                <View key={index} style={styles.featureItem}>
                  <View
                    style={[
                      styles.checkCircle,
                      { backgroundColor: currentConfig.accent + '20' },
                    ]}
                  >
                    <Ionicons name="checkmark" size={14} color={currentConfig.accent} />
                  </View>
                  <Text style={styles.featureText}>{feat}</Text>
                </View>
              ))}
            </View>

            {/* Tier-Specific Highlight Badges */}
            {selectedTier === 'plus' && (
              <View style={[styles.highlightBox, { borderColor: '#4E31E830' }]}>
                <Ionicons name="infinite" size={24} color="#4E31E8" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.highlightTitle}>No More Like Limits</Text>
                  <Text style={styles.highlightSub}>
                    Browse college students with unlimited daily swipes and rewind your mistakes anytime.
                  </Text>
                </View>
              </View>
            )}

            {selectedTier === 'gold' && (
              <View style={[styles.highlightBox, { borderColor: '#F59E0B40' }]}>
                <Ionicons name="eye" size={24} color="#F59E0B" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.highlightTitle}>Instant Secret Admirers</Text>
                  <Text style={styles.highlightSub}>
                    Unlock the grid of everyone who already liked you. Match with zero waiting!
                  </Text>
                </View>
              </View>
            )}

            {selectedTier === 'diamond' && (
              <View style={[styles.highlightBox, { borderColor: '#06B6D440' }]}>
                <Ionicons name="sparkles" size={24} color="#06B6D4" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.highlightTitle}>VIP Priority & AI Wingman</Text>
                  <Text style={styles.highlightSub}>
                    Your card stays pinned at the top. Get live campus crush radar alerts and AI icebreakers.
                  </Text>
                </View>
              </View>
            )}

            {/* Action Button */}
            <TouchableOpacity
              style={[
                styles.subscribeBtn,
                { backgroundColor: currentConfig.accent },
                isCurrentPlanActive && styles.subscribeBtnDisabled,
              ]}
              onPress={handleSubscribe}
              disabled={processing || isCurrentPlanActive}
            >
              {processing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : isCurrentPlanActive ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                  <Text style={styles.subscribeBtnText}>Current Active Plan</Text>
                </View>
              ) : (
                <Text style={styles.subscribeBtnText}>
                  {subscription?.has_subscription
                    ? `Switch to ${currentConfig.name}`
                    : `Upgrade to ${currentConfig.name}`}
                </Text>
              )}
            </TouchableOpacity>

            <Text style={styles.disclaimerText}>
              Cancel anytime in settings. Recurring billing, terms & conditions apply for Align campus network.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  tierSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  tierTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 4,
  },
  tierTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  activeDot: {
    backgroundColor: '#10B981',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 2,
  },
  activeDotText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
  },
  heroCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  heroBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  currentPlanPill: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  currentPlanPillText: {
    color: '#111',
    fontSize: 10,
    fontWeight: '900',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  heroTagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.88)',
    marginTop: 4,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 14,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  priceAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  pricePeriod: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    marginLeft: 4,
  },
  billingToggleWrap: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  billingOption: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    position: 'relative',
  },
  billingOptionSelected: {
    borderColor: '#111',
    backgroundColor: '#FAFAFA',
  },
  billingOptionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  billingOptionTextSelected: {
    color: '#111',
  },
  billingSubPrice: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  saveBadge: {
    position: 'absolute',
    top: -9,
    right: 10,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  saveBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },
  featuresHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111',
    marginBottom: 12,
  },
  featuresList: {
    gap: 10,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  featureText: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
    lineHeight: 19,
  },
  highlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  highlightSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 16,
  },
  subscribeBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  subscribeBtnDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  subscribeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 15,
  },
});
