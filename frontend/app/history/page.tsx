import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Logo from '@/components/Logo';
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

        <section style={{ padding: '4rem 0', background: 'var(--off-white)' }}>
          <div className="container">
            <div className="history-alt">
              <div className="history-alt-logoWrap">
                <Logo width={82} height={82} className="history-alt-logo" />
              </div>
              <div className="history-alt-line" />
              {(t.pages.history.timeline || []).map((item: any, index: number) => {
                const isLeft = index % 2 === 0;
                const prevYear = index > 0 ? t.pages.history.timeline[index - 1]?.year : null;
                const showYear = item.year && item.year !== prevYear;
                return (
                  <AnimateOnScroll key={index} delay={index * 90}>
                    <div className={`history-alt-row ${isLeft ? 'left' : 'right'}`}>
                      <div className="history-alt-side">
                        {isLeft ? (
                          <article className="history-alt-card">
                            <h3 className="history-alt-title">{item.title}</h3>
                            <p className="history-alt-text">{item.description}</p>
                          </article>
                        ) : null}
                      </div>

                      <div className="history-alt-center">
                        <span className="history-alt-dot" aria-hidden />
                        {showYear ? <span className="history-alt-year">{item.year}</span> : null}
                      </div>

                      <div className="history-alt-side">
                        {!isLeft ? (
                          <article className="history-alt-card">
                            <h3 className="history-alt-title">{item.title}</h3>
                            <p className="history-alt-text">{item.description}</p>
                          </article>
                        ) : null}
                      </div>
                    </div>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {companyInfo.data?.history && (
          <section style={{ padding: '4rem 0' }}>
            <div className="container">
              <AnimateOnScroll>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                  <h2 className="section-title">{t.pages.history.companyHistoryTitle}</h2>
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
