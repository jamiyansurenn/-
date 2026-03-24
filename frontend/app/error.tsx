'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();
  useEffect(() => {
    // Log error to console for debugging
    console.error('Application error:', error);
  }, [error]);

  return (
    <>
      <Header />
      <main>
        <section style={{ padding: '4rem 0', textAlign: 'center' }}>
          <div className="container">
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>{t.common.error}</h1>
            <h2 style={{ marginBottom: '1rem' }}>{(t.pages as any)?.error?.title || 'Уучлаарай, алдаа гарлаа'}</h2>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
              {(t.pages as any)?.error?.description || 'Хуудас ачаалахад алдаа гарлаа. Дахин оролдоно уу.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={reset} className="btn">
                {(t.pages as any)?.error?.retry || 'Дахин оролдох'}
              </button>
              <Link href="/" className="btn btn-secondary">
                {t.pages.notFound.home}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
