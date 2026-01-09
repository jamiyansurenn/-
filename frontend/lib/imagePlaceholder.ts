// Random placeholder images for different categories
const placeholderImages = {
  building: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&h=600&fit=crop',
  ],
  construction: [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
  ],
  team: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  ],
  service: [
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop',
  ],
  news: [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
  ],
  default: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
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
  imageUrl: string | null | undefined,
  category: ImageCategory = 'default',
  index?: number
): string {
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl;
  }
  return getPlaceholderImage(category, index);
}
