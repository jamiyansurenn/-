import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { getProjects } from '@/lib/api';
import Link from 'next/link';
import { getImageUrl } from '@/lib/imagePlaceholder';
import { getTranslations } from '@/lib/getLanguage';
import PageHero from '@/components/corporate/PageHero';
import SectionBlock from '@/components/corporate/SectionBlock';
import ContentCard from '@/components/corporate/ContentCard';
import styles from '@/components/corporate/corporate.module.css';
import { getCmsPage } from '@/lib/page-cms';
import SectionHeader from '@/components/corporate/SectionHeader';
import CmsSectionRenderer from '@/components/corporate/CmsSectionRenderer';

// Force dynamic rendering to prevent build-time static generation errors
export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const t = await getTranslations();
  const cmsPage = await getCmsPage('projects');
  let projects = { data: [] };

  try {
    projects = await getProjects().catch(() => ({ data: [] }));
  } catch (error) {
    // Handle errors gracefully - page will render with empty data
    projects = { data: [] };
  }
  const allProjects = Array.isArray(projects.data) ? projects.data : [];
  const ownProjects = allProjects.filter((p: any) => p.featured);
  const contractedProjects =
    ownProjects.length > 0 ? allProjects.filter((p: any) => !p.featured) : allProjects.slice(Math.ceil(allProjects.length / 2));
  const fallbackOwn = ownProjects.length > 0 ? ownProjects : allProjects.slice(0, Math.ceil(allProjects.length / 2));

  return (
    <>
      <Header />
      <main>
        <PageHero
          title={cmsPage?.title || t.pages.projects.title}
          subtitle={(cmsPage?.seoDescription as string) || t.pages.projects.subtitle}
          backgroundImage={getImageUrl(undefined, 'building', 1)}
        />

        <SectionBlock>
          <div className="container">
            {cmsPage?.sections?.length ? (
              <div style={{ marginBottom: '1.5rem' }}>
                {cmsPage.sections.map((section: any) => (
                  <CmsSectionRenderer key={section.id} section={section} />
                ))}
              </div>
            ) : null}
            {allProjects.length > 0 ? (
              <>
              <SectionHeader title="Өөрийн хэрэгжүүлсэн төслүүд" />
              <div className={styles.cardGrid} style={{ marginBottom: '1.5rem' }}>
                {fallbackOwn.map((project: any, index: number) => {
                  const imageUrl = getImageUrl(project.image, 'building', index);
                  return (
                    <AnimateOnScroll key={project.id} delay={index * 100}>
                      <ContentCard
                        title={project.title}
                        description={project.description}
                        image={imageUrl}
                        action={<Link href={`/projects/${project.slug}`} className="btn">{t.common.readMore}</Link>}
                      />
                    </AnimateOnScroll>
                  );
                })}
              </div>
              {contractedProjects.length > 0 ? (
                <>
                  <SectionHeader title="Гэрээт төслүүд" />
                  <div className={styles.cardGrid}>
                    {contractedProjects.map((project: any, index: number) => (
                      <AnimateOnScroll key={project.id} delay={index * 100}>
                        <ContentCard
                          title={project.title}
                          description={project.description}
                          image={getImageUrl(project.image, 'construction', index)}
                          action={<Link href={`/projects/${project.slug}`} className="btn">{t.common.readMore}</Link>}
                        />
                      </AnimateOnScroll>
                    ))}
                  </div>
                </>
              ) : null}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <AnimateOnScroll>
                  <p style={{ fontSize: '1.2rem', color: '#666' }}>{t.pages.projects.noProjects}</p>
                </AnimateOnScroll>
              </div>
            )}
          </div>
        </SectionBlock>
      </main>
      <Footer />
    </>
  );
}
