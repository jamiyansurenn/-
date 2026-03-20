// Random placeholder images for different categories
const placeholderImages = {
  building: [
    '/images/projects/hos_tsamhag.jpeg',
    '/images/projects/b7.png',
    '/images/projects/hos_tsamhag.jpeg',
    '/images/projects/b7.png',
  ],
  construction: [
    '/images/projects/b7.png',
    '/images/projects/hos_tsamhag.jpeg',
    '/images/projects/b7.png',
    '/images/projects/hos_tsamhag.jpeg',
  ],
  team: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  ],
  service: [
    '/images/projects/b7.png',
    '/images/projects/hos_tsamhag.jpeg',
    '/images/projects/b7.png',
  ],
  news: [
    '/images/projects/hos_tsamhag.jpeg',
    '/images/projects/b7.png',
    '/images/projects/hos_tsamhag.jpeg',
  ],
  default: [
    '/images/projects/b7.png',
    '/images/projects/hos_tsamhag.jpeg',
    '/images/projects/b7.png',
    '/images/projects/hos_tsamhag.jpeg',
  ],
};

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
    return normalized;
  }

  return getPlaceholderImage(category, index);
}
