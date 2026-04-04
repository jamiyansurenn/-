'use client';

import Link from 'next/link';
import Logo from './Logo';
import { useLanguage } from '@/contexts/LanguageContext';

function IconMail() {
  return (
    <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.45-1.19a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useLanguage();
  const tf = t.footer as any;
  const year = new Date().getFullYear();
  const copyright = t.footer.copyright.replace(/\{\{year\}\}/g, String(year));
  const mapHref = t.contact?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.contact.address)}`
    : '';

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-col-brand">
          <div className="footer-brand-mark">
            <Logo width={88} height={88} />
          </div>
          <p className="footer-lead">{t.footer.aboutInfo}</p>
          {tf.missionLine ? <p className="footer-mission">{tf.missionLine}</p> : null}
          <p className="footer-tagline">{t.footer.tagline}</p>
        </div>

        <div>
          <h3>{tf.exploreTitle || t.footer.linksTitle}</h3>
          <ul className="footer-link-list">
            <li>
              <Link href="/services">{t.home.services.title}</Link>
            </li>
            <li>
              <Link href="/projects">{t.home.projects.title}</Link>
            </li>
            <li>
              <Link href="/construction">{(t.nav as any).constructionNews || t.nav.construction}</Link>
            </li>
            <li>
              <Link href="/news">{t.nav.news}</Link>
            </li>
            <li>
              <Link href="/contact">{t.nav.contact}</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3>{tf.companyTitle || t.nav.about}</h3>
          <ul className="footer-link-list">
            <li>
              <Link href="/about">{t.nav.aboutIntro}</Link>
            </li>
            <li>
              <Link href="/history">{t.nav.aboutHistory}</Link>
            </li>
            <li>
              <Link href="/about/director">{t.nav.aboutDirector}</Link>
            </li>
            <li>
              <Link href="/careers">{t.nav.hrJobs}</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3>{t.footer.contactTitle}</h3>
          <div className="footer-contact-list">
            <p className="footer-contact-row">
              <IconMail />
              <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
            </p>
            <p className="footer-contact-row">
              <IconPhone />
              <a href={`tel:${t.contact.phone.replace(/\s/g, '')}`}>{t.contact.phone}</a>
            </p>
            <p className="footer-contact-row">
              <IconPin />
              <span>{t.contact.address}</span>
            </p>
            {mapHref ? (
              <p className="footer-contact-row footer-map-row">
                <a href={mapHref} target="_blank" rel="noreferrer" className="footer-map-link">
                  {(tf as { openInMaps?: string }).openInMaps || 'Google Maps'}
                </a>
              </p>
            ) : null}
          </div>
        </div>

        <div className="footer-bottom">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
