const S3_BASE_URL = 'https://align-media.s3.amazonaws.com';
const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800';

/**
 * Build the display URL for a user's primary photo.
 * Falls back to a stock image when no photos exist.
 */
export function getImageUrl(profile?: { photos?: { s3_key?: string }[]; s3_key?: string | null } | null): string {
  if (!profile) return FALLBACK_AVATAR;

  if (profile.s3_key) {
    return `${S3_BASE_URL}/${profile.s3_key}`;
  }

  if (Array.isArray(profile.photos) && profile.photos.length > 0 && profile.photos[0]?.s3_key) {
    return `${S3_BASE_URL}/${profile.photos[0].s3_key}`;
  }

  return FALLBACK_AVATAR;
}

