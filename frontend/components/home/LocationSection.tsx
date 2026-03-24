'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import AnimateOnScroll from '../AnimateOnScroll';
import styles from '@/app/home.module.css';

export default function LocationSection() {
  const { t, language } = useLanguage();
  const address = t?.contact?.address || '';
  const labels =
    language === 'en'
      ? {
          title: 'Location',
          company: 'Daatsiin Tsamkhag Group',
          addressNotFound: 'Address information not found.',
          openInMap: 'Open in Google Maps',
          mapTitle: 'Google Maps Location',
          mapFallback: 'Address information is not available.',
        }
      : {
          title: 'Байршил',
          company: 'Даацын Цамхаг Групп',
          addressNotFound: 'Хаяг мэдээлэл олдсонгүй.',
          openInMap: 'Газрын зураг дээр нээх',
          mapTitle: 'Google Maps Байршил',
          mapFallback: 'Хаяг мэдээлэл байхгүй байна.',
        };

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
          <h2 className="section-title">{labels.title}</h2>
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
                <h3 className={styles.locationCardTitle}>{labels.company}</h3>
                {address ? (
                  <p className={styles.locationAddress}>{address}</p>
                ) : (
                  <p className={styles.locationAddress}>{labels.addressNotFound}</p>
                )}

                <a className="btn btn-secondary" href={mapSearchHref} target="_blank" rel="noreferrer">
                  {labels.openInMap}
                </a>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <div className={styles.mapFrameWrap}>
              {mapEmbedSrc ? (
                <iframe
                  title={labels.mapTitle}
                  src={mapEmbedSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className={styles.mapFrame}
                />
              ) : (
                <div className={styles.mapFallback}>{labels.mapFallback}</div>
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}

