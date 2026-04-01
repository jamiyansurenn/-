import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Logo from '@/components/Logo';
import { getCompanyInfo } from '@/lib/api';
import { getImageUrl } from '@/lib/imagePlaceholder';
import { getTranslations } from '@/lib/getLanguage';
import PageHero from '@/components/corporate/PageHero';
import SectionBlock from '@/components/corporate/SectionBlock';
import { getCmsPage } from '@/lib/page-cms';

export default async function HistoryPage() {
  const companyInfo = await getCompanyInfo().catch(() => ({ data: null }));
  const t = await getTranslations();
  const cmsPage = await getCmsPage('history');

  return (
    <>
      <Header />
      <main>
        <PageHero
          title={cmsPage?.title || t.pages.history.title}
          subtitle={(cmsPage?.seoDescription as string) || t.pages.history.subtitle}
          backgroundImage={getImageUrl(undefined, 'building', 2)}
        />

        <SectionBlock muted>
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
        </SectionBlock>

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
