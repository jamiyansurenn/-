/**
 * Barilga, kran, talbai, intrument — Unsplash (auto=format for CDN).
 * Replace with /public or CMS uploads when you have brand assets.
 */
const crop = (path: string) =>
  `https://images.unsplash.com/${path}?auto=format&fit=crop&w=2400&q=85`;

/** Hero: олон слайд тус бүрт өөр “cover” ээлжлүүлэх */
export const STOCK_HERO_BACKGROUNDS = [
  crop('photo-1486406146926-c627a92ad1ab'), // skyline
  crop('photo-1590644365607-1c5a38fc42dc'), // cranes sunset
  crop('photo-1581578731548-c64695cc6952'), // site work
  crop('photo-1541888946425-d81bb19240f5'), // building shell
  crop('photo-1590486803839-85c5f55463f9'), // tower / vertical
  crop('photo-1565008576519-996499997feb'), // modern facade
  crop('photo-1581092160562-40aa08f68802'), // industrial / safety
  crop('photo-1504307651254-35680f356afd'), // team / site
] as const;

/** Нүүр — «Үндсэн зарчмууд» 4 карт */
export const STOCK_PILLAR_IMAGES = [
  crop('photo-1541888946425-d81bb19240f5'),
  crop('photo-1454165804606-c3d57bc86b40'),
  crop('photo-1581092160562-40aa08f68802'),
  crop('photo-1473341304170-971dccb5ac1e'),
] as const;

/**
 * Нүүр About коллаж — эхний «кран» зураг зарим орчинд эвдэгддэг тул эхнээс нь илүү тогтвортой хос ашиглана.
 * onError дээр ABOUT_COLLAGE_IMAGE_CHAINS ээлжлэнэ.
 */
export const ABOUT_COLLAGE_IMAGE_CHAINS: readonly [readonly string[], readonly string[]] = [
  [
    crop('photo-1486406146926-c627a92ad1ab'),
    crop('photo-1581578731548-c64695cc6952'),
    crop('photo-1541888946425-d81bb19240f5'),
    crop('photo-1565008576519-996499997feb'),
    crop('photo-1503387762-592deb58ef4e'),
  ],
  [
    crop('photo-1581578731548-c64695cc6952'),
    crop('photo-1486406146926-c627a92ad1ab'),
    crop('photo-1541888946425-d81bb19240f5'),
    crop('photo-1590486803839-85c5f55463f9'),
    crop('photo-1590644365607-1c5a38fc42dc'),
  ],
] as const;

export const STOCK_ABOUT_COLLAGE = [
  ABOUT_COLLAGE_IMAGE_CHAINS[0][0],
  ABOUT_COLLAGE_IMAGE_CHAINS[1][0],
] as const;

const B = [
  crop('photo-1486406146926-c627a92ad1ab'),
  crop('photo-1565008576519-996499997feb'),
  crop('photo-1590486803839-85c5f55463f9'),
  crop('photo-1545324418-cc1a3fa10c00'),
  crop('photo-1512917774080-9991f1c4c750'),
  crop('photo-1497366216548-37526070297c'),
  crop('photo-1497366754035-f200968a6e72'),
  crop('photo-1487958449943-2429e8be8625'),
];

const C = [
  crop('photo-1590644365607-1c5a38fc42dc'),
  crop('photo-1581578731548-c64695cc6952'),
  crop('photo-1541888946425-d81bb19240f5'),
  crop('photo-1503387762-592deb58ef4e'),
  crop('photo-1581092160562-40aa08f68802'),
  crop('photo-1504307651254-35680f356afd'),
  crop('photo-1621905251918-48416bd8575a'),
  crop('photo-1615873968403-89e068629265'),
];

const TEAM = [
  crop('photo-1507003211169-0a1dd7228f2d'),
  crop('photo-1560250097-0b93528c311a'),
  crop('photo-1573496359142-b8d87734a5a2'),
  crop('photo-1552664730-d307ca884978'),
  crop('photo-1521737711867-e3b97375f902'),
  crop('photo-1600880292203-757bb62b4baf'),
  crop('photo-1556761175-5973dc0f32e7'),
  crop('photo-1556761175-4b46a572b786'),
];

const SVC = [
  crop('photo-1590644365607-1c5a38fc42dc'),
  crop('photo-1581578731548-c64695cc6952'),
  crop('photo-1479839672679-a46483c0e7c8'),
  crop('photo-1503387762-592deb58ef4e'),
  crop('photo-1541888946425-d81bb19240f5'),
  crop('photo-1581092160562-40aa08f68802'),
  crop('photo-1454165804606-c3d57bc86b40'),
  crop('photo-1590486803839-85c5f55463f9'),
];

const NEWS = [
  crop('photo-1504307651254-35680f356afd'),
  crop('photo-1541888946425-d81bb19240f5'),
  crop('photo-1486406146926-c627a92ad1ab'),
  crop('photo-1581578731548-c64695cc6952'),
  crop('photo-1590644365607-1c5a38fc42dc'),
  crop('photo-1565008576519-996499997feb'),
  crop('photo-1454165804606-c3d57bc86b40'),
  crop('photo-1503387762-592deb58ef4e'),
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
