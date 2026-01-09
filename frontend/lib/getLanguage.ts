import { cookies } from 'next/headers';
import { Language, getTranslation } from './i18n';

export async function getLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const lang = cookieStore.get('language')?.value;
  if (lang === 'mn' || lang === 'en' || lang === 'zh') {
    return lang;
  }
  return 'mn';
}

export async function getTranslations() {
  const lang = await getLanguage();
  return getTranslation(lang);
}
