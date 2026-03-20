import * as fs from 'fs';
import * as path from 'path';

const STORE_FILENAME = 'hero-settings.json';

function getStorePath(): string {
  // Use project root uploads folder so it works in both dev/prod.
  return path.resolve(process.cwd(), 'uploads', STORE_FILENAME);
}

export type HeroSlide = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type HeroSettingsResponse = {
  backgrounds: string[];
  slides: HeroSlide[];
};

export function readHeroSettings(): HeroSettingsResponse | null {
  const storePath = getStorePath();
  try {
    if (!fs.existsSync(storePath)) return null;
    const raw = fs.readFileSync(storePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.backgrounds) || !Array.isArray(parsed.slides)) return null;
    return {
      backgrounds: parsed.backgrounds,
      slides: parsed.slides,
    };
  } catch {
    return null;
  }
}

export function writeHeroSettings(data: HeroSettingsResponse) {
  const storePath = getStorePath();
  const dir = path.dirname(storePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(
    storePath,
    JSON.stringify(
      {
        backgrounds: data.backgrounds,
        slides: data.slides,
        updatedAt: new Date().toISOString(),
      },
      null,
      2
    ),
    'utf8'
  );
}

