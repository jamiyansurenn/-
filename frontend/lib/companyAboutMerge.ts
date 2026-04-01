/**
 * company-info/public хариу дээр хуучин seed/dashboard-ын товч placeholder үлдсэн бол
 * ярианы хэл (i18n home.about)-аас баялаг текст сонгоно.
 */

function norm(s: string): string {
  return s.trim().replace(/\u2026/g, '...').replace(/\s+/g, ' ');
}

/** Dashboard / хуучин seed-ээс үлдсэн товч мөрүүд */
const PLACEHOLDER_EXACT = new Set(
  [
    'манай зорилго...',
    'манай зорилго..',
    'манай зорилго.',
    'манай зорилго',
    'манай үнэт зүйлс...',
    'манай үнэт зүйлс..',
    'манай үнэт зүйлс.',
    'манай үнэт зүйлс',
    'манай алсын хараа...',
    'манай алсын хараа',
    'бидний тухай мэдээлэл...',
    'бидний тухай мэдээлэл',
  ].map((s) => s.toLowerCase())
);

export function isPlaceholderCompanyText(value: string): boolean {
  const t = norm(value);
  if (!t) return true;
  if (PLACEHOLDER_EXACT.has(t.toLowerCase())) return true;
  if (t.length <= 36 && (t.endsWith('...') || t.endsWith('…'))) {
    const lower = t.toLowerCase();
    if (/^манай\s+/.test(lower) || /^бидний\s+тухай\s+/.test(lower)) return true;
  }
  return false;
}

function pickField(apiValue: unknown, i18nFallback: string | undefined): string | undefined {
  const fb = i18nFallback?.trim();
  if (apiValue == null) return fb;
  if (typeof apiValue !== 'string') return fb;
  const s = apiValue.trim();
  if (!s) return fb;
  if (isPlaceholderCompanyText(s)) return fb;
  return s;
}

type HomeAbout = {
  aboutUs?: string;
  vision?: string;
  mission?: string;
  values?: string;
};

export function mergeCompanyAboutBlocks(
  raw: Record<string, unknown> | null | undefined,
  ha: HomeAbout
): {
  aboutUs?: string;
  vision?: string;
  mission?: string;
  values?: string;
  history?: string;
} {
  const r = raw ?? {};
  const historyRaw = r.history;
  let history: string | undefined;
  if (typeof historyRaw === 'string' && historyRaw.trim()) {
    const h = historyRaw.trim();
    history = isPlaceholderCompanyText(h) ? undefined : h;
  }

  return {
    aboutUs: pickField(r.aboutUs, ha.aboutUs),
    vision: pickField(r.vision, ha.vision),
    mission: pickField(r.mission, ha.mission),
    values: pickField(r.values, ha.values),
    history,
  };
}
