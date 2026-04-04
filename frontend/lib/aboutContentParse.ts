/** Split long about copy into digestible blocks for layout (MN / EN aware). */

export function splitIntoParagraphs(text: string | undefined): string[] {
  if (!text?.trim()) return [];
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export type WhatWeDoBlock = {
  title: string;
  detail: string;
};

const MARKERS: Record<string, string> = {
  mn: 'Бид юу хийдэг вэ?',
  en: 'What we do?',
};

/**
 * MN vision text embeds "Бид юу хийдэг вэ?" + service blocks; EN vision usually does not.
 */
export function splitVisionAndWhatWeDo(
  vision: string | undefined,
  language: string
): { visionIntro: string; whatWeDoBlocks: WhatWeDoBlock[] } {
  if (!vision?.trim()) return { visionIntro: '', whatWeDoBlocks: [] };
  const marker = MARKERS[language] || MARKERS.mn;
  const idx = vision.indexOf(marker);
  if (idx === -1) {
    return { visionIntro: vision.trim(), whatWeDoBlocks: [] };
  }
  const intro = vision.slice(0, idx).trim();
  const rest = vision.slice(idx + marker.length).trim();
  return { visionIntro: intro, whatWeDoBlocks: parseWhatWeDoBlocks(rest) };
}

function parseWhatWeDoBlocks(raw: string): WhatWeDoBlock[] {
  if (!raw) return [];
  const chunks = raw.split(/\n\n+/).map((c) => c.trim()).filter(Boolean);
  return chunks.map((chunk) => {
    const lines = chunk.split('\n');
    const title = (lines[0] || '').trim();
    const detail = lines.slice(1).join('\n').trim();
    if (detail) return { title, detail };
    return { title, detail: '' };
  });
}

/** Values: prose paragraphs vs bullet blocks (per double-newline chunk). */
export function formatValuesForDisplay(text: string | undefined): {
  paragraphs: string[];
  bullets: string[];
} {
  if (!text?.trim()) return { paragraphs: [], bullets: [] };
  const chunks = splitIntoParagraphs(text);
  const paragraphs: string[] = [];
  const bullets: string[] = [];
  for (const chunk of chunks) {
    const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean);
    const isBulletBlock = lines.every((l) => /^[•\-–]/.test(l) || l.startsWith('•'));
    if (isBulletBlock && lines.length > 0) {
      for (const l of lines) {
        bullets.push(l.replace(/^[•\-–]\s*/, '').trim());
      }
    } else if (lines.some((l) => /^[•\-–]/.test(l))) {
      for (const l of lines) {
        if (/^[•\-–]/.test(l)) bullets.push(l.replace(/^[•\-–]\s*/, '').trim());
        else if (l) paragraphs.push(l);
      }
    } else {
      paragraphs.push(chunk);
    }
  }
  return { paragraphs, bullets };
}
