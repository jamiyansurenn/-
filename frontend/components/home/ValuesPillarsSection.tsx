'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { STOCK_PILLAR_IMAGES } from '@/lib/stockConstructionImages';
import styles from '@/app/home.module.css';

export default function ValuesPillarsSection() {
  const { t } = useLanguage();
  const p = (t as any).home?.pillars;
  const items: Array<{ title: string; description: string; imageSeed?: string }> = p?.items;
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <section className={styles.homePillarsSection}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">{p.title}</h2>
          <p className={styles.sectionLead}>{p.subtitle}</p>
        </motion.div>
        <div className={styles.homePillarsGrid}>
          {items.map((item, index) => (
            <motion.article
              key={`${item.title}-${index}`}
              className={styles.homePillarCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
            >
              <div className={styles.homePillarImageWrap}>
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
          ))}
        </div>
      </div>
    </section>
  );
}
