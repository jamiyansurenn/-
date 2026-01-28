import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCompanyInfo, getServices, getProjects, getNews } from '@/lib/api';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import ServicesSection from '@/components/home/ServicesSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import NewsSection from '@/components/home/NewsSection';

// Force dynamic rendering to prevent build-time static generation errors
// This ensures pages render at request time, not build time
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Debug: Log API URL (server-side only)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  if (process.env.NODE_ENV !== 'production') {
    console.log('[DEBUG] API URL:', apiUrl);
  }

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
      getNews(true, 3).catch(() => ({ data: [] })),
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
      </main>
      <Footer />
    </>
  );
}
