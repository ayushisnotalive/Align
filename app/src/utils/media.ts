export const S3_BASE_URL = 'https://align-media.s3.amazonaws.com';
export const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800';

export function getPhotoUrl(s3_key?: string | null): string {
  if (!s3_key) return FALLBACK_AVATAR;
  if (s3_key.startsWith('http')) return s3_key;
  return `${S3_BASE_URL}/${s3_key}`;
}

/**
 * Build the display URL for a user's primary photo or avatar.
 * Falls back to a stock image when no photos exist.
 */
export function getImageUrl(profile?: { 
  photos?: { s3_key?: string }[]; 
  s3_key?: string | null; 
  avatar_url?: string | null;
  image?: string | null;
  details?: { avatar_url?: string | null };
} | null): string {
  if (!profile) return FALLBACK_AVATAR;

  if (profile.avatar_url) {
    return profile.avatar_url;
  }

  if (profile.details?.avatar_url) {
    return profile.details.avatar_url;
  }

  if (profile.image) {
    return profile.image;
  }

  if (profile.s3_key) {
    if (profile.s3_key.startsWith('http')) return profile.s3_key;
    return `${S3_BASE_URL}/${profile.s3_key}`;
  }

  if (Array.isArray(profile.photos) && profile.photos.length > 0 && profile.photos[0]?.s3_key) {
    const key = profile.photos[0].s3_key;
    if (key.startsWith('http')) return key;
    return `${S3_BASE_URL}/${key}`;
  }

  return FALLBACK_AVATAR;
}
