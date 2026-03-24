'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getTranslation } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: ReturnType<typeof getTranslation>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const ALLOWED: Language[] = ['mn', 'en', 'zh', 'ru', 'ja', 'ko'];

function readLanguageFromBrowser(): Language | null {
  if (typeof window === 'undefined') return null;
  const cookieMatch = document.cookie.match(/(?:^|;\s*)language=([^;]+)/);
  const fromCookie = cookieMatch?.[1]?.trim();
  if (fromCookie && ALLOWED.includes(fromCookie as Language)) {
    return fromCookie as Language;
  }
  const saved = localStorage.getItem('language') as Language | null;
  if (saved && ALLOWED.includes(saved as Language)) {
    return saved;
  }
  return null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('mn');

  useEffect(() => {
    const next = readLanguageFromBrowser();
    if (next) {
      setLanguageState(next);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Set cookie for server components
    document.cookie = `language=${lang}; path=/; max-age=31536000`;
    // Trigger re-render
    window.dispatchEvent(new Event('languagechange'));
  };

  const t = getTranslation(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
