import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getImageUrl } from '@/lib/imagePlaceholder';
import { getLanguage, getTranslations } from '@/lib/getLanguage';
import PageHero from '@/components/corporate/PageHero';
import SectionBlock from '@/components/corporate/SectionBlock';
import styles from '@/components/corporate/corporate.module.css';
import { getCmsPage } from '@/lib/page-cms';
import CmsSectionRenderer from '@/components/corporate/CmsSectionRenderer';
import { getProjects } from '@/lib/api';
import ProjectsPortfolioClient from '@/components/projects/ProjectsPortfolioClient';
import type { ProjectsPortfolioCopy } from '@/components/projects/ProjectsPortfolioClient';
import { normalizeProjectForPortfolio } from '@/lib/projectPortfolio';
import portfolioStyles from '@/components/projects/projects-portfolio.module.css';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const t = await getTranslations();
  const lang = await getLanguage();
  const cmsPage = await getCmsPage('projects', lang);
  const tp = t.pages.projects as typeof t.pages.projects & Record<string, string>;

  let projects = { data: [] as Record<string, unknown>[] };
  try {
    projects = (await getProjects().catch(() => ({ data: [] }))) as typeof projects;
  } catch {
    projects = { data: [] };
  }

  const allRaw = Array.isArray(projects.data) ? projects.data : [];
  const portfolioProjects = allRaw.map((p) => normalizeProjectForPortfolio(p));

  const copy: ProjectsPortfolioCopy = {
    filterAriaLabel: tp.filterAriaLabel,
    filterAll: tp.filterAll,
    filterResidential: tp.filterResidential,
    filterInProgress: tp.filterInProgress,
    statusCompleted: tp.statusCompleted,
    statusInProgress: tp.statusInProgress,
    labelLocation: tp.labelLocation,
    ctaViewProject: tp.ctaViewProject,
    featuredBadge: tp.featuredBadge,
    emptyFiltered: tp.emptyFiltered,
    noProjects: tp.noProjects,
  };

  return (
    <>
      <Header />
      <main>
        <PageHero
          title={cmsPage?.title || tp.title}
          subtitle={(cmsPage?.seoDescription as string) || tp.subtitle}
          backgroundImage={getImageUrl(undefined, 'building', 1)}
        />

        <SectionBlock muted>
          <div className="container">
            <div className={portfolioStyles.introBlock}>
              <header className={styles.sectionHeader}>
                <p className={styles.sectionEyebrow}>{tp.portfolioEyebrow}</p>
                <h2 className={styles.sectionTitle}>{tp.portfolioIntroTitle}</h2>
                <p className={styles.sectionDescription}>{tp.portfolioIntroDescription}</p>
              </header>
            </div>

            {cmsPage?.sections?.length ? (
              <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                {cmsPage.sections.map((section: { id: string } & Record<string, unknown>) => (
                  <CmsSectionRenderer key={section.id} section={section} />
                ))}
              </div>
            ) : null}

            <ProjectsPortfolioClient projects={portfolioProjects} copy={copy} />

            <div className={portfolioStyles.ctaBand}>
              <h2 className={portfolioStyles.ctaBandTitle}>{tp.ctaSectionTitle}</h2>
              <p className={portfolioStyles.ctaBandText}>{tp.ctaSectionDescription}</p>
              <Link href="/contact" className="btn btn-lg">
                {tp.ctaContactButton}
              </Link>
            </div>
          </div>
        </SectionBlock>
      </main>
      <Footer />
    </>
  );
}
