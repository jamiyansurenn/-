'use client';

import Link from 'next/link';
import Logo from './Logo';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const copyright = t.footer.copyright.replace(/\{\{year\}\}/g, String(year));

  return (
    <footer>
      <div className="container">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="footer-logo-bg" style={{ padding: '8px', background: 'rgba(255,255,255,0.95)', display: 'flex', justifyContent: 'center' }}>
              <Logo width={120} height={120} />
            </div>
          </div>
          <p style={{ color: '#94A3B8', lineHeight: '1.8', fontSize: '1.05rem' }}>{t.footer.aboutInfo}</p>
          <p style={{ color: '#64748B', marginTop: '1.5rem', fontSize: '0.95rem', fontStyle: 'italic' }}>
            {t.footer.tagline}
          </p>
        </div>
        <div>
          <h3>{t.footer.linksTitle}</h3>
          <ul style={{ listStyle: 'none' }}>
            <li>
              <Link href="/about">{t.nav.about}</Link>
            </li>
            <li>
              <Link href="/history">{t.nav.aboutHistory}</Link>
            </li>
            <li>
              <Link href="/services">{t.home.services.title}</Link>
            </li>
            <li>
              <Link href="/projects">{t.home.projects.title}</Link>
            </li>
            <li>
              <Link href="/news">{t.nav.news}</Link>
            </li>
            <li>
              <Link href="/careers">{t.nav.hrJobs}</Link>
            </li>
            <li>
              <Link href="/contact">{t.nav.contact}</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3>{t.footer.contactTitle}</h3>
          <div className="footer-contact">
            <p><span>📧</span> {t.contact.email}</p>
            <p><span>📞</span> {t.contact.phone}</p>
            <p style={{ alignItems: 'flex-start' }}>
              <span style={{ marginTop: '4px' }}>📍</span>
              <span style={{ lineHeight: '1.6' }}>{t.contact.address}</span>
            </p>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>{copyright}</p>
      </div>
    </footer>
  );
}
