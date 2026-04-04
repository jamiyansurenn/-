'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Logo from './Logo';
import DropdownMenu from './DropdownMenu';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen, closeMobile]);

  const aboutMenuItems = [
    { labelKey: 'aboutIntro', href: '/about' },
    { labelKey: 'aboutHistory', href: '/history' },
    { labelKey: 'aboutDirector', href: '/about/director' },
  ];

  const constructionMenuItems = [
    { labelKey: 'constructionProjects', href: '/projects' },
    { labelKey: 'constructionNews', href: '/construction' },
  ];

  const hrMenuItems = [
    { labelKey: 'hrJobs', href: '/careers' },
    { labelKey: 'hrApplication', href: '/careers/application' },
  ];

  const isActive = (href: string) => pathname === href;
  const isActivePrefix = (prefix: string) => pathname?.startsWith(prefix) ?? false;

  const headerClass = `site-header${scrolled ? ' site-header--scrolled' : ''}`;

  return (
    <header className={headerClass}>
      <div className="container header-shell">
        <nav className="header-nav-row" aria-label={t.common.a11y.mainNav}>
          <Link href="/" className="header-brand" onClick={closeMobile}>
            <div className="logo-wrapper header-logo-wrap">
              <Logo width={72} height={72} className="logo-image" priority />
            </div>
          </Link>

          <ul className="header-nav-desktop">
            <li>
              <DropdownMenu labelKey="about" items={aboutMenuItems} href="/about" />
            </li>
            <li>
              <DropdownMenu labelKey="construction" items={constructionMenuItems} href="/projects" />
            </li>
            <li>
              <Link href="/news" className={isActivePrefix('/news') ? 'active' : ''}>
                {t.nav.news}
              </Link>
            </li>
            <li>
              <DropdownMenu labelKey="hr" items={hrMenuItems} href="/careers" />
            </li>
            <li>
              <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>
                {t.nav.contact}
              </Link>
            </li>
            <li className="header-cta-wrap">
              <Link href="/contact" className="header-cta">
                {(t.common as any).ctaHeaderNav || t.nav.contact}
              </Link>
            </li>
            <li className="header-lang-desktop">
              <LanguageSwitcher />
            </li>
          </ul>

          <button
            type="button"
            className="header-menu-toggle"
            aria-expanded={mobileOpen}
            aria-controls="header-mobile-panel"
            aria-label={mobileOpen ? t.common.a11y.closeMenu : t.common.a11y.openMenu}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </nav>
      </div>

      {mobileOpen ? (
        <>
          <div className="header-mobile-backdrop" onClick={closeMobile} aria-hidden />
          <div
            id="header-mobile-panel"
            className="header-mobile-panel"
            role="dialog"
            aria-modal="true"
            aria-label={t.common.a11y.mobileMenu}
          >
            <div className="header-mobile-section">
              <div className="header-mobile-label">{t.nav.about}</div>
              {aboutMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`header-mobile-link ${isActive(item.href) ? 'header-mobile-link-active' : ''}`}
                  onClick={closeMobile}
                >
                  {(t.nav as any)[item.labelKey] || item.labelKey}
                </Link>
              ))}
            </div>
            <div className="header-mobile-section">
              <div className="header-mobile-label">{t.nav.construction}</div>
              {constructionMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`header-mobile-link ${isActive(item.href) ? 'header-mobile-link-active' : ''}`}
                  onClick={closeMobile}
                >
                  {(t.nav as any)[item.labelKey] || item.labelKey}
                </Link>
              ))}
            </div>
            <div className="header-mobile-section">
              <Link
                href="/news"
                className={`header-mobile-link header-mobile-link-single ${isActivePrefix('/news') ? 'header-mobile-link-active' : ''}`}
                onClick={closeMobile}
              >
                {t.nav.news}
              </Link>
            </div>
            <div className="header-mobile-section">
              <div className="header-mobile-label">{t.nav.hr}</div>
              {hrMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`header-mobile-link ${isActive(item.href) ? 'header-mobile-link-active' : ''}`}
                  onClick={closeMobile}
                >
                  {(t.nav as any)[item.labelKey] || item.labelKey}
                </Link>
              ))}
            </div>
            <div className="header-mobile-section">
              <Link
                href="/contact"
                className={`header-mobile-link header-mobile-link-single ${pathname === '/contact' ? 'header-mobile-link-active' : ''}`}
                onClick={closeMobile}
              >
                {t.nav.contact}
              </Link>
            </div>
            <div className="header-mobile-cta">
              <Link
                href="/contact"
                className="header-cta"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={closeMobile}
              >
                {(t.common as any).ctaHeaderNav || t.nav.contact}
              </Link>
            </div>
            <div className="header-mobile-lang">
              <LanguageSwitcher />
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
