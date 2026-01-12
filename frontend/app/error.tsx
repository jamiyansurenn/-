'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>Алдаа гарлаа</h1>
            <h2 style={{ marginBottom: '1rem' }}>Уучлаарай, алдаа гарлаа</h2>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
              Хуудас ачаалахад алдаа гарлаа. Дахин оролдоно уу.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={reset} className="btn">
                Дахин оролдох
              </button>
              <Link href="/" className="btn btn-secondary">
                Нүүр хуудас руу буцах
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
