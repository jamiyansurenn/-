import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { getNews } from '@/lib/api';
import Link from 'next/link';
import { getImageUrl } from '@/lib/imagePlaceholder';
import { getTranslations } from '@/lib/getLanguage';
import PageHero from '@/components/corporate/PageHero';
import SectionBlock from '@/components/corporate/SectionBlock';
import ContentCard from '@/components/corporate/ContentCard';
import styles from '@/components/corporate/corporate.module.css';
import { getCmsPage } from '@/lib/page-cms';
import CmsSectionRenderer from '@/components/corporate/CmsSectionRenderer';

// Force dynamic rendering to prevent build-time static generation errors
export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const t = await getTranslations();
  const cmsPage = await getCmsPage('news');
  let news = { data: [] };

  try {
    news = await getNews().catch(() => ({ data: [] }));
  } catch (error) {
    // Handle errors gracefully - page will render with empty data
    news = { data: [] };
  }

  return (
    <>
      <Header />
      <main>
        <PageHero title={cmsPage?.title || t.nav.news} backgroundImage={getImageUrl(undefined, 'news', 2)} />

        <SectionBlock>
          <div className="container">
            {cmsPage?.sections?.length ? (
              <div style={{ marginBottom: '1.5rem' }}>
                {cmsPage.sections.map((section: any) => (
                  <CmsSectionRenderer key={section.id} section={section} />
                ))}
              </div>
            ) : null}
            {news.data && news.data.length > 0 ? (
              <div className={styles.cardGrid}>
                {news.data.map((item: any, index: number) => {
                  const imageUrl = getImageUrl(item.image, 'news', index);
                  return (
                  <AnimateOnScroll key={item.id} delay={index * 100}>
                    <ContentCard
                      title={item.title}
                      description={`${item.excerpt || ''}${item.publishedAt ? ` (${new Date(item.publishedAt).toLocaleDateString('mn-MN')})` : ''}`}
                      image={imageUrl}
                      action={<Link href={`/news/${item.slug}`} className="btn">{t.common.readMore}</Link>}
                    />
                  </AnimateOnScroll>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>{t.pages.construction.noNews}</p>
              </div>
            )}
          </div>
        </SectionBlock>
      </main>
      <Footer />
    </>
  );
}
