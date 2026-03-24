import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTranslations } from '@/lib/getLanguage';

export default async function NotFound() {
  const t = await getTranslations();
  const nf = t.pages.notFound;

  return (
    <>
      <Header />
      <main className="not-found-main">
        <section className="not-found-section">
          <div className="container">
            <div className="not-found-card">
              <p className="not-found-code">404</p>
              <h1 className="not-found-title">{nf.title}</h1>
              <p className="not-found-text">{nf.description}</p>
              <div className="not-found-actions">
                <Link href="/" className="btn">
                  {nf.home}
                </Link>
                <Link href="/contact" className="btn btn-secondary">
                  {nf.contact}
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
