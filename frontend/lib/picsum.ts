/** Stable Lorem Picsum URLs (reliable hotlink; swap for /public assets in production). */
export function picsum(seed: string, w = 800, h = 520) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}
