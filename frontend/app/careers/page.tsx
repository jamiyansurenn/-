import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Link from 'next/link';
import { getImageUrl } from '@/lib/imagePlaceholder';
import { getTranslations } from '@/lib/getLanguage';
import { getCareers } from '@/lib/api';
import PageHero from '@/components/corporate/PageHero';
import SectionBlock from '@/components/corporate/SectionBlock';
import ContentCard from '@/components/corporate/ContentCard';
import { getCmsPage } from '@/lib/page-cms';
import styles from '@/components/corporate/corporate.module.css';
import SectionHeader from '@/components/corporate/SectionHeader';

export default async function CareersPage() {
  const t = await getTranslations();
  const cmsPage = await getCmsPage('careers');
  const careersResponse = await getCareers();
  const jobPositions = careersResponse.data || [];

  return (
    <>
      <Header />
      <main>
        <PageHero
          title={cmsPage?.title || t.pages.careers.title}
          subtitle={(cmsPage?.seoDescription as string) || t.pages.careers.subtitle}
          backgroundImage={getImageUrl(undefined, 'default', 3)}
        />

        <SectionBlock muted>
          <div className="container">
            <div style={{ marginBottom: '1.5rem' }}>
              <SectionHeader
                eyebrow="Human Resources"
                title="Хүний нөөцийн бодлого"
                description="Бид ур чадварт суурилсан сонгон шалгаруулалт, өсөлт хөгжил, аюулгүй ажлын орчны бодлогыг баримтална."
              />
              <div className={styles.cardGrid}>
                <ContentCard title="Сонгон шалгаруулалт" description="Нээлттэй, шударга, ур чадварт тулгуурласан процесс." />
                <ContentCard title="Өсөлт хөгжил" description="Сургалт, карьерын шатлал, гүйцэтгэлийн үнэлгээтэй." />
                <ContentCard title="Ажлын орчин" description="ХАБЭА, багийн соёл, тогтвортой ажлын нөхцөлийг эрхэмлэнэ." />
              </div>
            </div>
            <div className={styles.cardGrid} style={{ maxWidth: '1000px', margin: '0 auto' }}>
              {jobPositions.map((job: any, index: number) => (
                <AnimateOnScroll key={job.id} delay={index * 100}>
                  <ContentCard
                    title={job.title}
                    description={`${job.description || ''}${job.details ? `\n${job.details}` : ''}`}
                    action={<Link href={`/careers/application?position=${encodeURIComponent(job.title)}`} className="btn">{t.pages.careers.apply}</Link>}
                  />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </SectionBlock>

        <section style={{ padding: '4rem 0', textAlign: 'center' }}>
          <div className="container">
            <AnimateOnScroll>
              <h2 className="section-title">{t.pages.careers.otherJobs}</h2>
              <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: 'var(--text-gray)' }}>
                {t.pages.careers.contactForJobs}
              </p>
              <Link href="/contact" className="btn">
                {t.nav.contact}
              </Link>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
