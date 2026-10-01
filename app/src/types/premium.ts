export type PremiumTier = 'plus' | 'gold' | 'diamond';

export interface PremiumPlan {
  id: PremiumTier;
  price_inr: number;
  duration_days: number;
  is_active: boolean;
  features: {
    tier: PremiumTier;
    name: string;
    tagline: string;
    badge: string;
    color: string;
    accent_color: string;
    icon: string;
    price_monthly: number;
    price_quarterly: number;
    unlimited_likes: boolean;
    rewind: boolean;
    incognito: boolean;
    passport: boolean;
    weekly_boosts: number;
    ad_free: boolean;
    see_who_likes_you?: boolean;
    photo_analytics?: boolean;
    super_likes_per_day?: number;
    priority_messages_per_day?: number;
    read_receipts?: boolean;
    top_picks?: boolean;
    priority_likes?: boolean;
    message_before_match?: boolean;
    ai_wingman?: boolean;
    campus_crush_radar?: boolean;
    ghost_mode?: boolean;
    vip_profile_frame?: boolean;
    fest_vip_pass?: boolean;
    feature_list: string[];
  };
}

export interface UserSubscription {
  has_subscription: boolean;
  tier: PremiumTier | null;
  plan_id: string | null;
  started_at?: string;
  expires_at?: string;
  is_admin?: boolean;
  features?: Partial<PremiumPlan['features']>;
}

export interface WhoLikesMeItem {
  profile_id: string;
  first_name: string;
  age: number;
  school: string;
  s3_key: string | null;
  avatar_url: string | null;
  direction: string;
  swiped_at: string;
  is_blurred: boolean;
}
