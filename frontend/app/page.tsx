import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCompanyInfo, getServices, getProjects, getNews } from '@/lib/api';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import ServicesSection from '@/components/home/ServicesSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import NewsSection from '@/components/home/NewsSection';
import LocationSection from '@/components/home/LocationSection';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';
import { getTranslations } from '@/lib/getLanguage';

// Force dynamic rendering to prevent build-time static generation errors
// This ensures pages render at request time, not build time
export const dynamic = 'force-dynamic';

export default async function Home() {
  const t = await getTranslations();
  const tx = t as any;
  // Initialize with safe defaults - page will always render
  let companyInfo: { data: any } = { data: null };
  let services: { data: any[] } = { data: [] };
  let projects: { data: any[] } = { data: [] };
  let news: { data: any[] } = { data: [] };

  try {
    // Use Promise.allSettled to ensure all promises complete
    const results = await Promise.allSettled([
      getCompanyInfo().catch(() => ({ data: null })),
      getServices().catch(() => ({ data: [] })),
      getProjects(true).catch(() => ({ data: [] })),
      getNews(true, 9).catch(() => ({ data: [] })),
    ]);

    // Safely extract data from each result
    if (results[0].status === 'fulfilled') {
      companyInfo = results[0].value || { data: null };
    }
    if (results[1].status === 'fulfilled') {
      services = results[1].value || { data: [] };
    }
    if (results[2].status === 'fulfilled') {
      projects = results[2].value || { data: [] };
    }
    if (results[3].status === 'fulfilled') {
      news = results[3].value || { data: [] };
    }
  } catch (error) {
    // Final safety net - page will render with empty data
    // This should never happen due to Promise.allSettled, but just in case
  }

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection companyInfo={companyInfo} />
        <ServicesSection services={services.data} />
        <ProjectsSection projects={projects.data} />
        <NewsSection news={news.data} />
        <section style={{ padding: '3rem 0', background: '#fafafa' }}>
          <div className="container">
            <h2 className="section-title">{tx.home?.featuredPages?.title || 'Онцлох хуудсууд'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {[
                {
                  title: tx.home?.featuredPages?.aboutTitle || 'Танилцуулга',
                  href: '/about',
                  desc: tx.home?.featuredPages?.aboutDesc || 'Компанийн зорилго, чиглэл, үнэт зүйлс',
                  cat: 'building' as const,
                },
                {
                  title: tx.home?.featuredPages?.historyTitle || 'Түүхэн замнал',
                  href: '/history',
                  desc: tx.home?.featuredPages?.historyDesc || '2009 оноос хойшх бүтээн байгуулалтын замнал',
                  cat: 'construction' as const,
                },
                {
                  title: tx.home?.featuredPages?.constructionTitle || 'Хэрэгжүүлсэн төслүүд',
                  href: '/construction',
                  desc: tx.home?.featuredPages?.constructionDesc || 'Үйлчилгээ, нийлүүлэлт, мэргэжлийн баг',
                  cat: 'construction' as const,
                },
              ].map((item, index) => (
                <div key={item.href} className="card">
                  <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                    <Image
                      src={getImageUrl(undefined, item.cat, index)}
                      alt={item.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div style={{ padding: '1.2rem' }}>
                    <h3 style={{ marginBottom: '0.6rem' }}>{item.title}</h3>
                    <p style={{ marginBottom: '1rem', color: '#64748b' }}>{item.desc}</p>
                    <Link href={item.href} className="btn">{t.common.learnMore}</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <LocationSection />
      </main>
      <Footer />
    </>
  );
}
