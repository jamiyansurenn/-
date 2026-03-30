import { picsum } from './picsum';

/** Local assets when you add files under public/ */
const local = {
  hos: '/images/projects/hos_tsamhag.jpeg',
  b7: '/images/projects/b7.png',
};

/* Picsum seeds = stable URLs; append local paths as fallbacks for custom art. */
const placeholderImages = {
  building: [
    picsum('dtg-bld-0', 1200, 760),
    picsum('dtg-bld-1', 1200, 760),
    picsum('dtg-bld-2', 1200, 760),
    local.hos,
  ],
  construction: [
    picsum('dtg-con-0', 1200, 760),
    picsum('dtg-con-1', 1200, 760),
    picsum('dtg-con-2', 1200, 760),
    local.b7,
  ],
  team: [picsum('dtg-team-0', 640, 640), picsum('dtg-team-1', 640, 640), picsum('dtg-team-2', 640, 640), picsum('dtg-team-3', 640, 640)],
  service: [picsum('dtg-svc-0', 1000, 650), picsum('dtg-svc-1', 1000, 650), picsum('dtg-svc-2', 1000, 650), picsum('dtg-svc-3', 1000, 650)],
  news: [picsum('dtg-news-0', 900, 560), picsum('dtg-news-1', 900, 560), picsum('dtg-news-2', 900, 560), picsum('dtg-news-3', 900, 560)],
  default: [picsum('dtg-def-0', 1000, 650), picsum('dtg-def-1', 1000, 650), picsum('dtg-def-2', 1000, 650), picsum('dtg-def-3', 1000, 650)],
};

/**
 * Home about collage: two equal thumbnails.
 * Picsum seeds avoid broken Unsplash loads in some networks; images are stable per seed.
 */
export const homeAboutCollageImages: readonly [string, string] = [picsum('dtg-about-a', 640, 640), picsum('dtg-about-b', 640, 640)];

export type ImageCategory = 'building' | 'construction' | 'team' | 'service' | 'news' | 'default';

/**
 * Get a random placeholder image URL for a given category
 * @param category - The category of image needed
 * @param index - Optional index to get a specific image (for consistency)
 * @returns A placeholder image URL
 */
export function getPlaceholderImage(
  category: ImageCategory = 'default',
  index?: number
): string {
  const images = placeholderImages[category] || placeholderImages.default;
  
  if (index !== undefined) {
    return images[index % images.length];
  }
  
  // Return random image
  return images[Math.floor(Math.random() * images.length)];
}

/**
 * Get image URL with fallback to placeholder
 * @param imageUrl - The actual image URL (can be null/undefined)
 * @param category - Category for placeholder if imageUrl is missing
 * @param index - Optional index for consistent placeholder selection
 * @returns Image URL or placeholder URL
 */
export function getImageUrl(
  imageUrl: string | { url?: string } | null | undefined,
  category: ImageCategory = 'default',
  index?: number
): string {
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');
  const rawUrl =
    typeof imageUrl === 'string'
      ? imageUrl
      : imageUrl && typeof imageUrl === 'object' && typeof imageUrl.url === 'string'
        ? imageUrl.url
        : '';
  const normalized = rawUrl.trim();

  if (normalized) {
    if (normalized.startsWith('/uploads/')) {
      return `${apiBase}${normalized}`;
    }
    if (normalized.startsWith('/')) {
      return normalized;
    }
    if (
      normalized.startsWith('http://') ||
      normalized.startsWith('https://') ||
      normalized.startsWith('data:') ||
      normalized.startsWith('blob:')
    ) {
      return normalized;
    }
    // Invalid/non-web path (e.g. C:\fakepath\...), use safe placeholder.
    return getPlaceholderImage(category, index);
  }

  return getPlaceholderImage(category, index);
}
