'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getTranslation, type Language } from '@/lib/i18n';

const ALLOWED: Language[] = ['mn', 'en', 'zh', 'ru', 'ja', 'ko'];

function readLangFromCookie(): Language {
  if (typeof document === 'undefined') return 'mn';
  const m = document.cookie.match(/(?:^|;\s*)language=([^;]+)/);
  const v = m?.[1]?.trim() as Language | undefined;
  return v && ALLOWED.includes(v) ? v : 'mn';
}

/**
 * Do not render Header/Footer here: they use `usePathname()`, which can run without a
 * valid App Router navigation context while this error boundary is rendering (SSR / turbo),
 * causing "Cannot read properties of null (reading 'useContext')".
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [lang, setLang] = useState<Language>('mn');
  useEffect(() => setLang(readLangFromCookie()), []);
  const t = useMemo(() => getTranslation(lang), [lang]);

  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  const nf = (t.pages as { notFound?: { home?: string; contact?: string } }).notFound;
  const errPage = (t.pages as { error?: { title?: string; description?: string; retry?: string } }).error;

  return (
    <div className="error-boundary-root">
      <header className="error-boundary-header">
        <div className="container">
          <Link href="/" className="error-boundary-brand">
            {t.home?.hero?.title || 'ДААЦЫН ЦАМХАГ'}
          </Link>
        </div>
      </header>
      <main className="error-boundary-main">
        <section className="error-boundary-section">
          <div className="container">
            <h1 className="error-boundary-code">{t.common.error}</h1>
            <h2 className="error-boundary-title">
              {errPage?.title || 'Уучлаарай, алдаа гарлаа'}
            </h2>
            <p className="error-boundary-text">
              {errPage?.description || 'Хуудас ачаалахад алдаа гарлаа. Дахин оролдоно уу.'}
            </p>
            <div className="error-boundary-actions">
              <button type="button" onClick={() => reset()} className="btn">
                {errPage?.retry || 'Дахин оролдох'}
              </button>
              <Link href="/" className="btn btn-secondary">
                {nf?.home || 'Нүүр'}
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                {nf?.contact || t.nav.contact}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="error-boundary-footer">
        <div className="container">
          <p className="error-boundary-footer-note">{t.footer?.copyright?.replace(/\{\{year\}\}/g, String(new Date().getFullYear()))}</p>
        </div>
      </footer>
    </div>
  );
}
