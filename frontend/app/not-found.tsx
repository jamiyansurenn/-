import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="not-found-main">
        <section className="not-found-section">
          <div className="container">
            <div className="not-found-card">
              <p className="not-found-code">404</p>
              <h1 className="not-found-title">Хуудас олдсонгүй</h1>
              <p className="not-found-text">
                Таны хайж буй хуудас устсан эсвэл шилжсэн байж магадгүй. Нүүр хуудас эсвэл холбоо барих хуудас руу шилжинэ үү.
              </p>
              <div className="not-found-actions">
                <Link href="/" className="btn">
                  Нүүр хуудас
                </Link>
                <Link href="/contact" className="btn btn-secondary">
                  Холбоо барих
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
