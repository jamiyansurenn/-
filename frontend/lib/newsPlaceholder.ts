/**
 * Hide Prisma seed / demo news that reads as Lorem-style placeholder on production home.
 */
export function isSeedPlaceholderNews(item: {
  title?: string;
  excerpt?: string;
  slug?: string;
  content?: string;
}): boolean {
  const title = String(item.title ?? '').trim();
  const excerpt = String(item.excerpt ?? '').trim();
  const slug = String(item.slug ?? '').trim();
  const content = String(item.content ?? '').trim();

  if (slug === 'news-1') return true;
  if (title === 'Мэдээ 1') return true;
  if (excerpt === 'Мэдээний товч тайлбар') return true;
  if (content === 'Мэдээний бүрэн агуулга...') return true;
  if (/^Мэдээ\s*\d+$/i.test(title)) return true;
  return false;
}

export function filterProductionNews<T extends { title?: string; excerpt?: string; slug?: string; content?: string }>(
  items: T[] | null | undefined
): T[] {
  if (!Array.isArray(items) || items.length === 0) return [];
  return items.filter((item) => !isSeedPlaceholderNews(item));
}
