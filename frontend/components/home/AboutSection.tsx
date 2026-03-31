'use client';

import { useCallback, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import AnimateOnScroll from '../AnimateOnScroll';
import { ABOUT_COLLAGE_IMAGE_CHAINS } from '@/lib/imagePlaceholder';
import styles from '@/app/home.module.css';

function AboutCollageSlot({ slot }: { slot: 0 | 1 }) {
  const chain = ABOUT_COLLAGE_IMAGE_CHAINS[slot];
  const len = chain.length;
  const [idx, setIdx] = useState(0);
  const src = chain[Math.min(idx, len - 1)];

  const onError = useCallback(() => {
    setIdx((i) => (i + 1 < len ? i + 1 : i));
  }, [len]);

  return (
    <img
      src={src}
      alt=""
      className={styles.homeAboutImg}
      loading={slot === 0 ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={onError}
    />
  );
}

interface AboutSectionProps {
  companyInfo: any;
}

const SERVICE_BULLETS_MN = [
  'Барилга угсралт',
  'Газо хөнгөн блок',
  'Тавилгын үйлдвэр',
  'Цамхагт краны нэгдсэн эксперт үйлчилгээ',
  'Авто болон суурин помпын үйлчилгээ',
  'Цахилгаан шат, урсдаг шат нийлүүлэлт',
  'ЭБА төв',
  'Амралтын газар',
];

const SERVICE_BULLETS_EN = [
  'Construction and Installation',
  'Lightweight Gas Block',
  'Furniture Manufacturing',
  'Integrated Tower Crane Expert Service',
  'Truck and Stationary Pump Services',
  'Elevator and Escalator Supply',
  'EBA Center',
  'Resort / Recreation Area',
];

function serviceBulletsForLang(language: string, tx: any): string[] {
  const fromPages = tx.pages?.about?.serviceHighlights;
  if (Array.isArray(fromPages) && fromPages.length > 0) {
    return fromPages;
  }
  if (language === 'en') return SERVICE_BULLETS_EN;
  return SERVICE_BULLETS_MN;
}

export default function AboutSection({ companyInfo: _companyInfo }: AboutSectionProps) {
  const { language, t } = useLanguage();
  const tx = t as any;
  const ha = tx.home?.about ?? {};

  const introLead =
    typeof ha.aboutUs === 'string' && ha.aboutUs.includes('\n\n')
      ? ha.aboutUs.split('\n\n')[0].trim()
      : ha.aboutUs;

  const bullets = serviceBulletsForLang(language, tx);

  const eyebrow = ha.introEyebrow ?? ha.title;
  const brand = ha.brandLine ?? t.home.hero.title;
  const badge = ha.experienceBadge ?? '';

  return (
    <section className={styles.homeAboutSection}>
      <div className="container">
        <div className={styles.homeAboutGrid}>
          <AnimateOnScroll className={styles.homeAboutVisualWrap}>
            <div className={styles.homeAboutCollage}>
              <div className={styles.homeAboutCell}>
                <AboutCollageSlot slot={0} />
              </div>
              <div className={styles.homeAboutCell}>
                <AboutCollageSlot slot={1} />
              </div>
            </div>
            {badge ? (
              <div className={styles.homeAboutBadgeBar} aria-hidden>
                {badge}
              </div>
            ) : null}
          </AnimateOnScroll>

          <AnimateOnScroll delay={80} className={styles.homeAboutContentWrap}>
            <div className={styles.homeAboutContent}>
              <p className={styles.homeAboutEyebrow}>{eyebrow}</p>
              <h2 className={styles.homeAboutBrand}>{brand}</h2>
              <p className={styles.homeAboutLead}>{introLead}</p>
              <ul className={styles.homeAboutBullets}>
                {bullets.map((item) => (
                  <li key={item} className={styles.homeAboutBullet}>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/about" className={`btn ${styles.homeAboutCta}`}>
                {t.common.readMore}
                <span className={styles.homeAboutCtaArrow} aria-hidden>
                  →
                </span>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
