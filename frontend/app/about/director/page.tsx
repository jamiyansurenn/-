import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { getTranslations } from '@/lib/getLanguage';

export default async function DirectorPage() {
  const t = await getTranslations();

  return (
    <>
      <Header />
      <main>
        <section style={{ padding: '4rem 0', paddingTop: '2rem' }}>
          <div className="container">
            <AnimateOnScroll>
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                  <h2 style={{ marginBottom: '2rem', color: 'var(--primary-orange)' }}>
                    {t.pages.director.greeting}
                  </h2>
                </div>
                <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-gray)' }}>
                  <p style={{ marginBottom: '1.5rem' }}>
                    {t.pages.director.paragraph1}
                  </p>
                  <p style={{ marginBottom: '1.5rem' }}>
                    {t.pages.director.paragraph2}
                  </p>
                  <p style={{ marginBottom: '1.5rem' }}>
                    {t.pages.director.paragraph3}
                  </p>
                  <p style={{ marginBottom: '1.5rem' }}>
                    {t.pages.director.paragraph4}
                  </p>
                  <p style={{ marginTop: '2rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                    {t.pages.director.closing}
                  </p>
                  <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                    {t.pages.director.signature}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
