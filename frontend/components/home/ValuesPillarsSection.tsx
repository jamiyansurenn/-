'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useReducedMotion } from 'framer-motion';
import { STOCK_PILLAR_IMAGES } from '@/lib/stockConstructionImages';
import styles from '@/app/home.module.css';
import SectionHeader from './SectionHeader';

type Props = {
  /** Cap pillars on home (e.g. 3) to shorten the page; omit for full list (e.g. future /values page). */
  maxItems?: number;
};

export default function ValuesPillarsSection({ maxItems }: Props) {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const p = (t as any).home?.pillars;
  const raw: Array<{ title: string; description: string; imageSeed?: string }> = p?.items;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const items =
    typeof maxItems === 'number' && maxItems > 0 ? raw.slice(0, maxItems) : raw;

  return (
    <section className={styles.homePillarsSection}>
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
          <SectionHeader title={p.title} subtitle={p.subtitle} />
        </motion.div>
        <div className={styles.homePillarsGrid}>
          {items.map((item, index) => {
            const delay = reduceMotion ? 0 : Math.min(index * 0.04, 0.1);
            return (
              <motion.article
                key={`${item.title}-${index}`}
                className={styles.homePillarCard}
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0.94, y: 6 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: '80px 0px' },
                      transition: { duration: 0.32, delay, ease: [0.22, 1, 0.36, 1] },
                    })}
              >
                <div className={styles.homePillarImageWrap}>
                  <span className={styles.homePillarIndex}>{String(index + 1).padStart(2, '0')}</span>
                  <img
                    src={STOCK_PILLAR_IMAGES[index % STOCK_PILLAR_IMAGES.length]}
                    alt=""
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={index === 0 ? 'high' : 'low'}
                    className={styles.homePillarImg}
                  />
                  <div className={styles.homePillarImageOverlay} aria-hidden />
                </div>
                <div className={styles.homePillarBody}>
                  <h3 className={styles.homePillarTitle}>{item.title}</h3>
                  <p className={styles.homePillarDesc}>{item.description}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
