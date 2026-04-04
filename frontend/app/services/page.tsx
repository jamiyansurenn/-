import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { getServices } from '@/lib/api';
import Link from 'next/link';
import { getImageUrl } from '@/lib/imagePlaceholder';
import { getLanguage, getTranslations } from '@/lib/getLanguage';
import PageHero from '@/components/corporate/PageHero';
import SectionBlock from '@/components/corporate/SectionBlock';
import SectionHeader from '@/components/home/SectionHeader';
import ContentCard from '@/components/corporate/ContentCard';
import styles from '@/components/corporate/corporate.module.css';
import { getCmsPage } from '@/lib/page-cms';
import CmsSectionRenderer from '@/components/corporate/CmsSectionRenderer';

// Force dynamic rendering to prevent build-time static generation errors
export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const t = await getTranslations();
  const lang = await getLanguage();
  const cmsPage = await getCmsPage('services', lang);
  let services = { data: [] };

  try {
    services = await getServices().catch(() => ({ data: [] }));
  } catch (error) {
    // Handle errors gracefully - page will render with empty data
    services = { data: [] };
  }

  return (
    <>
      <Header />
      <main>
        <PageHero
          title={cmsPage?.title || t.home.services.title}
          subtitle={(cmsPage?.seoDescription as string) || ''}
          backgroundImage={getImageUrl(undefined, 'service', 0)}
        />

        <SectionBlock>
          <div className="container">
            <SectionHeader title={t.home.services.title} subtitle={t.home.services.description} />
            {cmsPage?.sections?.length ? (
              <div className={styles.cardGrid} style={{ marginBottom: '1.5rem' }}>
                {cmsPage.sections.map((section: any) => {
                  return (
                    <CmsSectionRenderer key={section.id} section={section} />
                  );
                })}
              </div>
            ) : null}
            {services.data && services.data.length > 0 ? (
              <div className={styles.cardGrid}>
                {services.data.map((service: any, index: number) => {
                  const imageUrl = getImageUrl(service.image, 'service', index);
                  return (
                  <AnimateOnScroll key={service.id} delay={index * 100}>
                    <ContentCard
                      title={service.title}
                      description={service.description}
                      image={imageUrl}
                      action={
                        <Link href={`/services/${service.slug}`} className="btn btn-secondary">
                          {t.common.readMore}
                        </Link>
                      }
                    />
                  </AnimateOnScroll>
                  );
                })}
              </div>
            ) : (
              <div className={styles.listingEmpty}>
                <p>{(t.pages as any)?.services?.noServices || (t.home.services as any)?.noServices || '—'}</p>
              </div>
            )}
          </div>
        </SectionBlock>
      </main>
      <Footer />
    </>
  );
}
