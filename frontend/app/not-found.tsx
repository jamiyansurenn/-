import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <section style={{ padding: '4rem 0', textAlign: 'center' }}>
          <div className="container">
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
            <h2 style={{ marginBottom: '1rem' }}>Хуудас олдсонгүй</h2>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
              Таны хайж буй хуудас олдсонгүй байна.
            </p>
            <Link href="/" className="btn">
              Нүүр хуудас руу буцах
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
