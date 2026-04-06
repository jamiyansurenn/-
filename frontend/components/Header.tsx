'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import Logo from './Logo';
import DropdownMenu from './DropdownMenu';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

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

/** Same chrome as HeaderInner but no usePathname — safe when App Router context is missing (SSR / error boundary / turbo). */
function HeaderFallback() {
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

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

  return (
    <header className="site-header">
      <div className="container header-shell">
        <nav className="header-nav-row" aria-label={t.common.a11y.mainNav}>
          <Link href="/" className="header-brand" onClick={closeMobile}>
            <div className="logo-wrapper header-logo-wrap">
              <Logo width={72} height={72} className="logo-image" priority />
            </div>
          </Link>

          <ul className="header-nav-desktop">
            <li>
              <Link href="/about">{t.nav.about}</Link>
            </li>
            <li>
              <Link href="/projects">{t.nav.construction}</Link>
            </li>
            <li>
              <Link href="/news">{t.nav.news}</Link>
            </li>
            <li>
              <Link href="/careers">{t.nav.hr}</Link>
            </li>
            <li>
              <Link href="/contact">{t.nav.contact}</Link>
            </li>
            <li className="header-lang-desktop">
              <LanguageSwitcher />
            </li>
          </ul>

          <button
            type="button"
            className="header-menu-toggle"
            aria-expanded={mobileOpen}
            aria-controls="header-mobile-panel-fallback"
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
            id="header-mobile-panel-fallback"
            className="header-mobile-panel"
            role="dialog"
            aria-modal="true"
            aria-label={t.common.a11y.mobileMenu}
          >
            <div className="header-mobile-section">
              <div className="header-mobile-label">{t.nav.about}</div>
              {aboutMenuItems.map((item) => (
                <Link key={item.href} href={item.href} className="header-mobile-link" onClick={closeMobile}>
                  {(t.nav as any)[item.labelKey] || item.labelKey}
                </Link>
              ))}
            </div>
            <div className="header-mobile-section">
              <div className="header-mobile-label">{t.nav.construction}</div>
              {constructionMenuItems.map((item) => (
                <Link key={item.href} href={item.href} className="header-mobile-link" onClick={closeMobile}>
                  {(t.nav as any)[item.labelKey] || item.labelKey}
                </Link>
              ))}
            </div>
            <div className="header-mobile-section">
              <Link href="/news" className="header-mobile-link header-mobile-link-single" onClick={closeMobile}>
                {t.nav.news}
              </Link>
            </div>
            <div className="header-mobile-section">
              <div className="header-mobile-label">{t.nav.hr}</div>
              {hrMenuItems.map((item) => (
                <Link key={item.href} href={item.href} className="header-mobile-link" onClick={closeMobile}>
                  {(t.nav as any)[item.labelKey] || item.labelKey}
                </Link>
              ))}
            </div>
            <div className="header-mobile-section">
              <Link href="/contact" className="header-mobile-link header-mobile-link-single" onClick={closeMobile}>
                {t.nav.contact}
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

function HeaderInner() {
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
              <DropdownMenu labelKey="about" items={aboutMenuItems} href="/about" pathname={pathname} />
            </li>
            <li>
              <DropdownMenu
                labelKey="construction"
                items={constructionMenuItems}
                href="/projects"
                pathname={pathname}
              />
            </li>
            <li>
              <Link href="/news" className={isActivePrefix('/news') ? 'active' : ''}>
                {t.nav.news}
              </Link>
            </li>
            <li>
              <DropdownMenu labelKey="hr" items={hrMenuItems} href="/careers" pathname={pathname} />
            </li>
            <li>
              <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>
                {t.nav.contact}
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
            <div className="header-mobile-lang">
              <LanguageSwitcher />
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderInner />
    </Suspense>
  );
}
