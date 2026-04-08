'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl, resolveProjectCoverImage } from '@/lib/imagePlaceholder';
import styles from '@/app/home.module.css';
import SectionHeader from './SectionHeader';

interface ProjectsSectionProps {
  projects: any[];
  /** While true, show layout + skeletons instead of blocking the whole page on API data. */
  loading?: boolean;
}

function ProjectsFeedSkeleton() {
  return (
    <div className={styles.projectsGridHome} aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className={`${styles.projectCardPremium} ${styles.homeFeedSkeletonCard}`}>
          <div className={`${styles.projectCardImageShell} ${styles.homeFeedSkeletonShimmer}`} />
          <div className={styles.projectCardBody}>
            <div className={`${styles.homeFeedSkeletonLine} ${styles.homeFeedSkeletonTitle}`} />
            <div className={`${styles.homeFeedSkeletonLine} ${styles.homeFeedSkeletonLineWide}`} />
            <div className={`${styles.homeFeedSkeletonLine} ${styles.homeFeedSkeletonLineMed}`} />
            <div className={`${styles.homeFeedSkeletonLine} ${styles.homeFeedSkeletonCta}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProjectsSection({ projects, loading = false }: ProjectsSectionProps) {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const tx = t as any;

  if (loading) {
    return (
      <section className={styles.projectsSectionHome} aria-busy="true" aria-label={t.home.projects.title}>
        <div className="container">
          <SectionHeader title={t.home.projects.title} subtitle={t.home.projects.description} />
          <ProjectsFeedSkeleton />
        </div>
      </section>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <section className={styles.projectsSectionHome}>
        <div className="container">
          <SectionHeader title={t.home.projects.title} subtitle={t.home.projects.description} />
          <div className={styles.emptySectionCard}>
            <p>{t.pages.projects.noProjects}</p>
            <Link href="/contact" className="btn btn-lg">
              {(t.common as any).ctaConsultation || t.nav.contact}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.projectsSectionHome}>
      <div className="container">
        <motion.div
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0.94, y: 6 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: '80px 0px' },
                transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
              })}
        >
          <SectionHeader title={t.home.projects.title} subtitle={t.home.projects.description} />
        </motion.div>

        <div className={styles.projectsGridHome}>
          {projects.slice(0, 3).map((project: any, index: number) => {
            const imageUrl = getImageUrl(resolveProjectCoverImage(project), 'building', index);
            const delay = reduceMotion ? 0 : Math.min(index * 0.02, 0.05);
            return (
              <motion.article
                key={project.id}
                className={styles.projectCardPremium}
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0.94, y: 6 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: '80px 0px' },
                      transition: { duration: 0.24, delay, ease: [0.22, 1, 0.36, 1] },
                    })}
              >
                <div className={styles.projectCardImageShell}>
                  <div className={styles.projectCardBadges}>
                    {project.featured ? (
                      <span className={`${styles.projectBadge} ${styles.projectBadgeAccent}`}>
                        {tx.home?.projectFeaturedBadge ?? 'Featured'}
                      </span>
                    ) : null}
                    <span className={styles.projectBadge}>{tx.home?.projectTypeBadge ?? 'Project'}</span>
                  </div>
                  <Image
                    src={imageUrl}
                    alt={project.title}
                    fill
                    priority={index === 0}
                    className={styles.projectCardImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className={styles.projectCardBody}>
                  <h3 className={styles.projectCardTitle}>{project.title}</h3>
                  <p className={styles.projectCardExcerpt}>{project.description}</p>
                  <Link href={`/projects/${project.slug}`} className={styles.projectCardLink}>
                    {t.common.readMore}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          className={styles.viewAllContainer}
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0.95, y: 5 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: '60px 0px' },
                transition: { duration: 0.28, delay: 0.03 },
              })}
        >
          <Link href="/projects" className="btn btn-secondary btn-lg">
            {(t.common as any).ctaExploreProjects || t.common.viewAll}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
