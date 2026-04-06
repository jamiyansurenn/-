'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { getImageUrl } from '@/lib/imagePlaceholder';
import {
  filterPortfolioProjects,
  type PortfolioFilter,
  type PortfolioProject,
} from '@/lib/projectPortfolio';
import styles from './projects-portfolio.module.css';

export type ProjectsPortfolioCopy = {
  filterAriaLabel: string;
  filterAll: string;
  filterResidential: string;
  filterInProgress: string;
  statusCompleted: string;
  statusInProgress: string;
  labelLocation: string;
  ctaViewProject: string;
  featuredBadge: string;
  emptyFiltered: string;
  noProjects: string;
};

type FilterLabelKey = 'filterAll' | 'filterResidential' | 'filterInProgress';

const FILTERS: { id: PortfolioFilter; labelKey: FilterLabelKey }[] = [
  { id: 'all', labelKey: 'filterAll' },
  { id: 'residential', labelKey: 'filterResidential' },
  { id: 'in_progress', labelKey: 'filterInProgress' },
];

type Props = {
  projects: PortfolioProject[];
  copy: ProjectsPortfolioCopy;
};

export default function ProjectsPortfolioClient({ projects, copy }: Props) {
  const [filter, setFilter] = useState<PortfolioFilter>('all');

  const visible = useMemo(() => filterPortfolioProjects(projects, filter), [projects, filter]);

  if (projects.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>{copy.noProjects}</p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div
        className={styles.filterBar}
        role="toolbar"
        aria-label={copy.filterAriaLabel}
      >
        {FILTERS.map(({ id, labelKey }) => (
          <button
            key={id}
            type="button"
            className={`${styles.filterBtn} ${filter === id ? styles.filterBtnActive : ''}`}
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
          >
            {copy[labelKey]}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className={styles.emptyState}>
          <p>{copy.emptyFiltered}</p>
        </div>
      ) : (
        <ul className={styles.grid} aria-live="polite">
          {visible.map((project, index) => {
            const imageUrl = getImageUrl(project.image ?? undefined, 'building', index);
            const statusLabel =
              project.meta.progress === 'completed' ? copy.statusCompleted : copy.statusInProgress;
            const showLocation = Boolean(project.meta.location);

            return (
              <li key={String(project.id)}>
                <AnimateOnScroll delay={Math.min(index * 40, 140)}>
                  <article className={styles.card}>
                    <Link href={`/projects/${project.slug}`} className={styles.cardLink}>
                      <div className={styles.cardMedia}>
                        <Image
                          src={imageUrl}
                          alt={project.title}
                          fill
                          className={styles.cardImage}
                          sizes="(max-width: 639px) 100vw, (max-width: 1099px) 50vw, 33vw"
                        />
                        <div className={styles.cardMediaOverlay} aria-hidden />
                        <div className={styles.badges}>
                          <span
                            className={
                              project.meta.progress === 'completed'
                                ? styles.badgeStatusDone
                                : styles.badgeStatusActive
                            }
                          >
                            {statusLabel}
                          </span>
                          {project.featured ? (
                            <span className={styles.badgeFeatured}>{copy.featuredBadge}</span>
                          ) : null}
                        </div>
                      </div>
                      <div className={styles.cardBody}>
                        <h2 className={styles.cardTitle}>{project.title}</h2>
                        {showLocation ? (
                          <p className={styles.cardLocation}>
                            <span className={styles.locIcon} aria-hidden>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 21s-8-4.5-8-11a8 8 0 0 1 16 0c0 6.5-8 11-8 11z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                            </span>
                            {project.meta.location}
                          </p>
                        ) : null}
                        <p className={styles.cardDesc}>{project.description}</p>
                        <span className={styles.cardCta}>
                          {copy.ctaViewProject}
                          <span className={styles.cardCtaIcon} aria-hidden>
                            →
                          </span>
                        </span>
                      </div>
                    </Link>
                  </article>
                </AnimateOnScroll>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
