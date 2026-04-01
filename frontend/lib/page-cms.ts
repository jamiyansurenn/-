import { getPublicPageBySlug } from './api';

export async function getCmsPage(slug: string, lang?: string) {
  const res = await getPublicPageBySlug(slug, lang);
  return res?.data || null;
}

export function getSectionContent(section: any): any {
  if (!section?.contentJson) return {};
  try {
    return JSON.parse(section.contentJson);
  } catch {
    return {};
  }
}
