'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';
import styles from '@/app/home.module.css';
import SectionHeader from './SectionHeader';

interface ProjectsSectionProps {
  projects: any[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const tx = t as any;

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
                initial: { opacity: 0, y: 18 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: '-40px' },
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              })}
        >
          <SectionHeader title={t.home.projects.title} subtitle={t.home.projects.description} />
        </motion.div>

        <div className={styles.projectsGridHome}>
          {projects.slice(0, 3).map((project: any, index: number) => {
            const imageUrl = getImageUrl(project.image, 'building', index);
            const delay = reduceMotion ? 0 : Math.min(index * 0.07, 0.21);
            return (
              <motion.article
                key={project.id}
                className={styles.projectCardPremium}
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 20 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: '-32px' },
                      transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
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
                initial: { opacity: 0, y: 10 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.45, delay: 0.08 },
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
