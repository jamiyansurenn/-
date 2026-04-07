import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCompanyInfo, getProjects, getNews } from '@/lib/api';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import ValuesPillarsSection from '@/components/home/ValuesPillarsSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import NewsSection from '@/components/home/NewsSection';
import { filterProductionNews } from '@/lib/newsPlaceholder';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let companyInfo: { data: unknown } = { data: null };
  let projects: { data: unknown[] } = { data: [] };
  let news: { data: unknown[] } = { data: [] };

  try {
    const results = await Promise.allSettled([
      getCompanyInfo().catch(() => ({ data: null })),
      getProjects(true).catch(() => ({ data: [] })),
      getNews(true, 9, { useFallback: false }).catch(() => ({ data: [] })),
    ]);

    if (results[0].status === 'fulfilled') {
      companyInfo = (results[0].value as typeof companyInfo) || { data: null };
    }
    if (results[1].status === 'fulfilled') {
      projects = (results[1].value as typeof projects) || { data: [] };
    }
    if (results[2].status === 'fulfilled') {
      news = (results[2].value as typeof news) || { data: [] };
    }
  } catch {
    /* page still renders */
  }

  const newsForHome = filterProductionNews(news.data as any[]);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection companyInfo={companyInfo} />
        <ValuesPillarsSection maxItems={3} />
        <ProjectsSection projects={projects.data as any[]} />
        <NewsSection news={newsForHome} />
      </main>
      <Footer />
    </>
  );
}
