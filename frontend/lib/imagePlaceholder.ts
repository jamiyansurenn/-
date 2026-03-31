import {
  ABOUT_COLLAGE_IMAGE_CHAINS,
  STOCK_ABOUT_COLLAGE,
  STOCK_PLACEHOLDERS,
  type StockCategory,
} from './stockConstructionImages';
import { getApiBaseUrl } from './apiBase';

export { ABOUT_COLLAGE_IMAGE_CHAINS };

/** Local assets when you add files under public/ */
const local = {
  hos: '/images/projects/hos_tsamhag.jpeg',
  b7: '/images/projects/b7.png',
};

function withLocalTail<T extends string>(urls: readonly T[]): T[] {
  return [...urls, local.hos, local.b7] as T[];
}

const placeholderImages: Record<StockCategory, string[]> = {
  building: withLocalTail(STOCK_PLACEHOLDERS.building),
  construction: withLocalTail(STOCK_PLACEHOLDERS.construction),
  team: [...STOCK_PLACEHOLDERS.team],
  service: withLocalTail(STOCK_PLACEHOLDERS.service),
  news: withLocalTail(STOCK_PLACEHOLDERS.news),
  default: withLocalTail(STOCK_PLACEHOLDERS.default),
};

/** Home about — 2 барилгын сэдэвт зураг */
export const homeAboutCollageImages: readonly [string, string] = [
  STOCK_ABOUT_COLLAGE[0],
  STOCK_ABOUT_COLLAGE[1],
];

export type ImageCategory = 'building' | 'construction' | 'team' | 'service' | 'news' | 'default';

export function getPlaceholderImage(category: ImageCategory = 'default', index?: number): string {
  const images = placeholderImages[category] || placeholderImages.default;

  if (index !== undefined) {
    return images[index % images.length];
  }

  return images[Math.floor(Math.random() * images.length)];
}

/**
 * Get image URL with fallback to placeholder
 */
export function getImageUrl(
  imageUrl: string | { url?: string } | null | undefined,
  category: ImageCategory = 'default',
  index?: number
): string {
  const apiBase = getApiBaseUrl();
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
    return getPlaceholderImage(category, index);
  }

  return getPlaceholderImage(category, index);
}
