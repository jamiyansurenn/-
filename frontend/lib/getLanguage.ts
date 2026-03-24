import { cookies } from 'next/headers';
import { Language, getTranslation } from './i18n';

export async function getLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const lang = cookieStore.get('language')?.value;
  const allowed: Language[] = ['mn', 'en', 'zh', 'ru', 'ja', 'ko'];
  if (lang && allowed.includes(lang as Language)) {
    return lang as Language;
  }
  return 'mn';
}

export async function getTranslations() {
  const lang = await getLanguage();
  return getTranslation(lang);
}
