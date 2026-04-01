/**
 * Сайтын өөрийн төсөл / визуализацийн зургууд (/public/images/site, projects).
 */

const site = (file: string) => `/images/site/${file}` as const;

/** Нүүр, төслүүд, плейсхолдеруудын суурь 8 зураг */
export const STOCK_SITE_IMAGES = [
  site('01-twin-towers.png'),
  site('02-b7-playground.png'),
  site('03-dual-towers-sky.png'),
  site('04-orange-modern.png'),
  site('05-city-aerial.png'),
  site('06-b7-aerial.png'),
  site('07-complex-masterplan.png'),
  site('08-b7-amgalan.png'),
] as const;

/** Hero: олон слайд — ээлжээр эдгээр зураг */
export const STOCK_HERO_BACKGROUNDS: readonly string[] = [...STOCK_SITE_IMAGES];

/** Нүүр — «Үндсэн зарчмууд» 4 карт */
export const STOCK_PILLAR_IMAGES = [
  STOCK_SITE_IMAGES[0],
  STOCK_SITE_IMAGES[1],
  STOCK_SITE_IMAGES[4],
  STOCK_SITE_IMAGES[5],
] as const;

/**
 * Нүүр About коллаж — onError дээр ээлжлэн солих гинжин хэлхээ.
 */
export const ABOUT_COLLAGE_IMAGE_CHAINS: readonly [readonly string[], readonly string[]] = [
  [
    STOCK_SITE_IMAGES[0],
    STOCK_SITE_IMAGES[1],
    STOCK_SITE_IMAGES[2],
    STOCK_SITE_IMAGES[3],
    STOCK_SITE_IMAGES[4],
  ],
  [
    STOCK_SITE_IMAGES[1],
    STOCK_SITE_IMAGES[0],
    STOCK_SITE_IMAGES[2],
    STOCK_SITE_IMAGES[5],
    STOCK_SITE_IMAGES[6],
  ],
] as const;

export const STOCK_ABOUT_COLLAGE = [
  ABOUT_COLLAGE_IMAGE_CHAINS[0][0],
  ABOUT_COLLAGE_IMAGE_CHAINS[1][0],
] as const;

const B = [
  STOCK_SITE_IMAGES[0],
  STOCK_SITE_IMAGES[1],
  STOCK_SITE_IMAGES[2],
  STOCK_SITE_IMAGES[3],
  STOCK_SITE_IMAGES[4],
  STOCK_SITE_IMAGES[5],
  STOCK_SITE_IMAGES[6],
  STOCK_SITE_IMAGES[7],
];

const C = [
  STOCK_SITE_IMAGES[2],
  STOCK_SITE_IMAGES[3],
  STOCK_SITE_IMAGES[0],
  STOCK_SITE_IMAGES[4],
  STOCK_SITE_IMAGES[6],
  STOCK_SITE_IMAGES[7],
  STOCK_SITE_IMAGES[1],
  STOCK_SITE_IMAGES[5],
];

/** Хүний нөөцийн плейсхолдер — зөвхөн энд сток (зураг өгөгдөөгүй). */
const TEAM = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80',
];

const SVC = [
  STOCK_SITE_IMAGES[4],
  STOCK_SITE_IMAGES[3],
  STOCK_SITE_IMAGES[1],
  STOCK_SITE_IMAGES[0],
  STOCK_SITE_IMAGES[5],
  STOCK_SITE_IMAGES[7],
  STOCK_SITE_IMAGES[2],
  STOCK_SITE_IMAGES[6],
];

const NEWS = [
  STOCK_SITE_IMAGES[5],
  STOCK_SITE_IMAGES[4],
  STOCK_SITE_IMAGES[0],
  STOCK_SITE_IMAGES[3],
  STOCK_SITE_IMAGES[2],
  STOCK_SITE_IMAGES[6],
  STOCK_SITE_IMAGES[1],
  STOCK_SITE_IMAGES[7],
];

/** getImageUrl placeholder-ууд — ангилал тус бүр 8 зураг */
export const STOCK_PLACEHOLDERS = {
  building: B,
  construction: C,
  team: TEAM,
  service: SVC,
  news: NEWS,
  default: [...B],
} as const;

export type StockCategory = keyof typeof STOCK_PLACEHOLDERS;

export function stockImage(category: StockCategory, index: number): string {
  const list = STOCK_PLACEHOLDERS[category] || STOCK_PLACEHOLDERS.default;
  return list[index % list.length];
}
