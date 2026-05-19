import { getPublicPageBySlug } from './api';

export type CmsPageSection = { id: string } & Record<string, unknown>;

export type CmsPageRecord = {
  id?: string;
  slug?: string;
  title?: string | null;
  status?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  sections?: CmsPageSection[];
};

/** Pass `lang` from `getLanguage()` so `en` sections can replace `mn` per order on public pages. */
export async function getCmsPage(slug: string, lang?: string): Promise<CmsPageRecord | null> {
  const res = await getPublicPageBySlug(slug, lang);
  const data = res?.data;
  if (!data || typeof data !== 'object') return null;
  return data as CmsPageRecord;
}

export function getSectionContent(section: any): any {
  if (!section?.contentJson) return {};
  try {
    return JSON.parse(section.contentJson);
  } catch {
    return {};
  }
}
