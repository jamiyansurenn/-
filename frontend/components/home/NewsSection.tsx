'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';
import styles from '@/app/home.module.css';
import SectionHeader from './SectionHeader';

interface NewsSectionProps {
  news: any[];
}

function formatPublishedDate(value: string | null | undefined) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

const HOME_NEWS_LIMIT = 3;

export default function NewsSection({ news }: NewsSectionProps) {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  const th = (t as any).home ?? {};

  if (!news || news.length === 0) {
    const emptyTitle = th.newsEmptyTitle || (t.common as any).newsSectionEmpty;
    const emptyBody = th.newsEmptyBody || '';
    return (
      <section className={styles.newsSection}>
        <div className="container">
          <SectionHeader title={t.pages.construction.latestNews} />
          <div className={styles.newsEmptyHome}>
            <p className={styles.newsEmptyHomeTitle}>{emptyTitle}</p>
            {emptyBody ? <p className={styles.newsEmptyHomeBody}>{emptyBody}</p> : null}
            <div className={styles.newsEmptyHomeActions}>
              <Link href="/projects" className="btn btn-secondary">
                {(t.common as any).ctaExploreProjects || t.common.viewAll}
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                {t.nav.contact}
              </Link>
              <Link href="/news" className={styles.newsEmptyHomeLink}>
                {th.newsViewArchive || t.common.viewAll}
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const list = news.slice(0, HOME_NEWS_LIMIT);

  return (
    <section className={styles.newsSection}>
      <div className="container">
        <motion.div
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0.94, y: 6 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: '80px 0px' },
                transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
              })}
        >
          <SectionHeader title={t.pages.construction.latestNews} />
        </motion.div>

        <div className={styles.newsGridHome}>
          {list.map((item: any, index: number) => {
            const imageUrl = getImageUrl(item.image, 'news', index);
            const delay = reduceMotion ? 0 : Math.min(index * 0.04, 0.1);
            return (
              <motion.article
                key={item.id}
                className={styles.newsCardHome}
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0.94, y: 6 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: '80px 0px' },
                      transition: { duration: 0.32, delay, ease: [0.22, 1, 0.36, 1] },
                    })}
              >
                <div className={styles.newsCardImageWrap}>
                  <Image
                    src={imageUrl}
                    alt={item.title}
                    fill
                    priority={index === 0}
                    className={styles.newsCardImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className={styles.newsCardBody}>
                  <div className={styles.newsMetaRow}>
                    <span className={styles.newsCardLabel}>{t.nav.news}</span>
                    {formatPublishedDate(item.publishedAt) ? (
                      <span className={styles.cardDate}>{formatPublishedDate(item.publishedAt)}</span>
                    ) : null}
                  </div>
                  <h3 className={styles.newsCardTitle}>{item.title}</h3>
                  {item.excerpt ? <p className={styles.newsCardExcerpt}>{item.excerpt}</p> : null}
                  <div className={styles.newsCardFooter}>
                    <Link href={`/news/${item.slug}`} className={styles.newsReadLink}>
                      {t.common.readMore}
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
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
          <Link href="/news" className="btn btn-secondary btn-lg">
            {t.common.viewAll}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
