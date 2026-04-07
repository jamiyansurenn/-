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
  hos: '/images/projects/hos_tsamhag.png',
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

function normalizeStoredImageUrl(raw: string): string {
  let s = raw.trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

/**
 * Turn DB / upload API strings into a browser-usable absolute or site-relative URL.
 * Returns null only when the value should fall back to a stock placeholder.
 */
export function resolveStoredImageToUrl(normalized: string): string | null {
  if (!normalized) return null;
  /**
   * Some legacy rows contain non-URL tokens (e.g. UUIDs).
   * Treat them as invalid so UI falls back to placeholders instead of requesting `/uuid...` on Vercel.
   */
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(normalized)) {
    return null;
  }
  const apiBase = getApiBaseUrl();
  if (normalized.startsWith('/uploads/')) {
    return `${apiBase}${normalized}`;
  }
  if (normalized.startsWith('uploads/')) {
    return `${apiBase}/${normalized}`;
  }
  if (normalized.startsWith('//')) {
    return `https:${normalized}`;
  }
  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }
  if (normalized.startsWith('data:') || normalized.startsWith('blob:')) {
    return normalized;
  }
  if (normalized.startsWith('/')) {
    // Accept only clear site asset/upload paths or file-like paths.
    if (
      normalized.startsWith('/uploads/') ||
      normalized.startsWith('/images/') ||
      /\.[a-zA-Z0-9]{2,5}($|\?)/.test(normalized)
    ) {
      return normalized;
    }
    return null;
  }
  return null;
}

/** Normalize + resolve a stored image field (admin preview, validation). */
export function resolveImageFieldToUrl(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const normalized = normalizeStoredImageUrl(String(raw).trim());
  return resolveStoredImageToUrl(normalized);
}

/** Cover image: main `image` field, else first entry in `images` (array or JSON string). */
export function resolveProjectCoverImage(project: {
  image?: string | null;
  images?: unknown;
}): string | undefined {
  const main = typeof project.image === 'string' ? project.image.trim() : '';
  if (main) return main;
  const imgs = project.images;
  if (Array.isArray(imgs)) {
    const first = imgs.find((x) => typeof x === 'string' && String(x).trim());
    if (first != null) return String(first).trim();
  }
  if (typeof imgs === 'string' && imgs.trim()) {
    try {
      const arr = JSON.parse(imgs) as unknown;
      if (Array.isArray(arr)) {
        const first = arr.find((x) => typeof x === 'string' && String(x).trim());
        if (first != null) return String(first).trim();
      }
    } catch {
      /* ignore */
    }
  }
  return undefined;
}

/**
 * Get image URL with fallback to placeholder
 */
export function getImageUrl(
  imageUrl: string | { url?: string } | null | undefined,
  category: ImageCategory = 'default',
  index?: number
): string {
  const rawUrl =
    typeof imageUrl === 'string'
      ? imageUrl
      : imageUrl && typeof imageUrl === 'object' && typeof imageUrl.url === 'string'
        ? imageUrl.url
        : '';
  const resolved = resolveImageFieldToUrl(rawUrl);
  if (resolved !== null) {
    return resolved;
  }
  if (normalizeStoredImageUrl(rawUrl.trim())) {
    return getPlaceholderImage(category, index);
  }
  return getPlaceholderImage(category, index);
}
