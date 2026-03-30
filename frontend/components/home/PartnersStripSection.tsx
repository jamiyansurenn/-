'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/lib/imagePlaceholder';
import styles from '@/app/home.module.css';

const PLACEHOLDER_COUNT = 6;

export default function PartnersStripSection({ partners }: { partners: any[] }) {
  const { t } = useLanguage();
  const tx = (t as any).home?.partnersStrip;
  const list = Array.isArray(partners) ? partners : [];

  return (
    <section className={styles.homePartnersSection}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">{tx?.title ?? ''}</h2>
          <p className={styles.sectionLead}>{tx?.subtitle ?? ''}</p>
        </motion.div>

        {list.length === 0 ? (
          <>
            <p className={styles.homePartnersHint}>{tx?.empty}</p>
            <div className={styles.homePartnersRow} aria-hidden>
              {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
                <div key={i} className={`${styles.homePartnerCell} ${styles.homePartnerPlaceholder}`} />
              ))}
            </div>
          </>
        ) : (
          <div className={styles.homePartnersRow}>
            {list.map((partner: any, i: number) => (
              <div key={partner.id ?? i} className={styles.homePartnerCell}>
                <img
                  src={getImageUrl(partner.logo, 'default', i)}
                  alt={partner.name ? String(partner.name) : ''}
                  className={styles.homePartnerLogoImg}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
