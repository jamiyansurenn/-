'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useReducedMotion } from 'framer-motion';
import { STOCK_PILLAR_IMAGES } from '@/lib/stockConstructionImages';
import styles from '@/app/home.module.css';
import SectionHeader from './SectionHeader';

export default function ValuesPillarsSection() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const p = (t as any).home?.pillars;
  const items: Array<{ title: string; description: string; imageSeed?: string }> = p?.items;
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <section className={styles.homePillarsSection}>
      <div className="container">
        <motion.div
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 14 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: '-40px' },
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              })}
        >
          <SectionHeader title={p.title} subtitle={p.subtitle} />
        </motion.div>
        <div className={styles.homePillarsGrid}>
          {items.map((item, index) => {
            const delay = reduceMotion ? 0 : Math.min(index * 0.06, 0.18);
            return (
              <motion.article
                key={`${item.title}-${index}`}
                className={styles.homePillarCard}
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 16 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: '-28px' },
                      transition: { duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] },
                    })}
              >
                <div className={styles.homePillarImageWrap}>
                  <span className={styles.homePillarIndex}>{String(index + 1).padStart(2, '0')}</span>
                  <img
                    src={STOCK_PILLAR_IMAGES[index % STOCK_PILLAR_IMAGES.length]}
                    alt=""
                    loading="lazy"
                    decoding="async"
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
