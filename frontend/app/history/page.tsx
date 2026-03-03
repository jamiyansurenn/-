import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { getCompanyInfo } from '@/lib/api';
import { getImageUrl } from '@/lib/imagePlaceholder';
import { getTranslations } from '@/lib/getLanguage';

export default async function HistoryPage() {
  const companyInfo = await getCompanyInfo().catch(() => ({ data: null }));
  const t = await getTranslations();

  return (
    <>
      <Header />
      <main>
        <section className="hero" style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `url(${getImageUrl(undefined, 'building', 2)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }}></div>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <AnimateOnScroll>
              <h1>{t.pages.history.title}</h1>
              <p>{t.pages.history.subtitle}</p>
            </AnimateOnScroll>
          </div>
        </section>

        <section style={{ padding: '4rem 0', background: '#fafafa' }}>
          <div className="container">
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              {(t.pages.history.timeline || []).map((item: any, index: number) => (
                <AnimateOnScroll key={index} delay={index * 100}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '2rem',
                      marginBottom: '3rem',
                      padding: '2rem',
                      background: '#fff',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                    className="timeline-item card"
                  >
                    <div
                      style={{
                        minWidth: '120px',
                        textAlign: 'center',
                        padding: '1rem',
                        background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--dark-orange) 100%)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                      }}
                    >
                      {item.year}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>{item.title}</h2>
                      <p style={{ lineHeight: '1.8', color: 'var(--text-gray)' }}>{item.description}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {companyInfo.data?.history && (
          <section style={{ padding: '4rem 0' }}>
            <div className="container">
              <AnimateOnScroll>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                  <h2 className="section-title">Бидний түүх</h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                    {companyInfo.data.history}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
