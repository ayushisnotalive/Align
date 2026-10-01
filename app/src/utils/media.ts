import { PRESET_AVATARS, DEFAULT_AVATAR } from '../constants/avatars';

export const S3_BASE_URL = 'https://align-media.s3.amazonaws.com';
export const SUPABASE_STORAGE_URL = (process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hjlnomqovcvbvmnckjdo.supabase.co') + '/storage/v1/object/public/photos';
export const FALLBACK_AVATAR = DEFAULT_AVATAR || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800';

/**
 * Returns a high-res, reliable image URL for any photo key.
 * Handles:
 * 1. Full HTTP/HTTPS URLs (Supabase storage, Unsplash, external CDNs)
 * 2. Local file URIs (during initial preview)
 * 3. Supabase storage bucket relative paths (photos/...)
 * 4. Legacy/seeded S3 keys (media/..., fallback-media/...) mapped deterministically to preset portraits
 */
export function getPhotoUrl(s3_key?: string | null, fallbackIndex?: number): string {
  if (!s3_key) {
    if (typeof fallbackIndex === 'number' && fallbackIndex >= 0) {
      return PRESET_AVATARS[fallbackIndex % PRESET_AVATARS.length].url;
    }
    return FALLBACK_AVATAR;
  }

  // Already a full remote URL
  if (s3_key.startsWith('http://') || s3_key.startsWith('https://')) {
    return s3_key;
  }

  // Local phone file URI
  if (s3_key.startsWith('file://') || s3_key.startsWith('data:') || s3_key.startsWith('content://')) {
    return s3_key;
  }

  // Supabase storage bucket key
  if (s3_key.startsWith('photos/')) {
    const subPath = s3_key.substring(7);
    return `${SUPABASE_STORAGE_URL}/${subPath}`;
  }

  // Legacy/seeded keys that are not on S3 - map deterministically to curated portrait photos
  if (s3_key.startsWith('media/') || s3_key.startsWith('fallback-media/') || s3_key.startsWith('college-id/')) {
    let hash = 0;
    for (let i = 0; i < s3_key.length; i++) {
      hash = (hash << 5) - hash + s3_key.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % PRESET_AVATARS.length;
    return PRESET_AVATARS[idx].url;
  }

  return `${S3_BASE_URL}/${s3_key}`;
}

/**
 * Build the display URL for a user's primary photo or avatar.
 * Prioritizes user's uploaded real photos over default/generated stock avatars.
 */
export function getImageUrl(profile?: { 
  photos?: { s3_key?: string }[]; 
  s3_key?: string | null; 
  avatar_url?: string | null;
  image?: string | null;
  details?: { avatar_url?: string | null };
} | null): string {
  if (!profile) return FALLBACK_AVATAR;

  // 1. User's uploaded photos take highest priority!
  if (Array.isArray(profile.photos) && profile.photos.length > 0 && profile.photos[0]?.s3_key) {
    return getPhotoUrl(profile.photos[0].s3_key);
  }

  // 2. Direct photo s3_key
  if (profile.s3_key) {
    return getPhotoUrl(profile.s3_key);
  }

  // 3. User chosen avatar (if not default unsplash model)
  if (profile.avatar_url && !profile.avatar_url.includes('images.unsplash.com')) {
    return getPhotoUrl(profile.avatar_url);
  }

  if (profile.details?.avatar_url && !profile.details.avatar_url.includes('images.unsplash.com')) {
    return getPhotoUrl(profile.details.avatar_url);
  }

  // 4. Any avatar url
  if (profile.avatar_url) {
    return getPhotoUrl(profile.avatar_url);
  }

  if (profile.details?.avatar_url) {
    return getPhotoUrl(profile.details.avatar_url);
  }

  if (profile.image) {
    return getPhotoUrl(profile.image);
  }

  return FALLBACK_AVATAR;
}
