'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import AnimateOnScroll from '../AnimateOnScroll';
import styles from '@/app/home.module.css';

export default function LocationSection() {
  const { t } = useLanguage();
  const address = t?.contact?.address || '';

  const mapEmbedSrc = address
    ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
    : undefined;

  const mapSearchHref = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : '/contact';

  return (
    <section className={styles.locationSection}>
      <div className="container">
        <AnimateOnScroll>
          <h2 className="section-title">Байршил</h2>
        </AnimateOnScroll>

        <div className={styles.locationGrid}>
          <AnimateOnScroll delay={100}>
            <div className={styles.locationCard}>
              <div className={styles.locationImageWrap} aria-hidden="true">
                <Image
                  src="/images/projects/hos_tsamhag.jpeg"
                  alt=""
                  fill
                  className={styles.locationImage}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={false}
                />
              </div>

              <div className={styles.locationCardBody}>
                <h3 className={styles.locationCardTitle}>Даацын Цамхаг Групп</h3>
                {address ? (
                  <p className={styles.locationAddress}>{address}</p>
                ) : (
                  <p className={styles.locationAddress}>Хаяг мэдээлэл олдсонгүй.</p>
                )}

                <a className="btn btn-secondary" href={mapSearchHref} target="_blank" rel="noreferrer">
                  Газрын зураг дээр нээх
                </a>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <div className={styles.mapFrameWrap}>
              {mapEmbedSrc ? (
                <iframe
                  title="Google Maps Байршил"
                  src={mapEmbedSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className={styles.mapFrame}
                />
              ) : (
                <div className={styles.mapFallback}>Хаяг мэдээлэл байхгүй байна.</div>
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}

