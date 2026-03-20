'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import DropdownMenu from './DropdownMenu';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();

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

  return (
    <header>
      <div className="container">
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', height: '90px' }}>
          <Link href="/" className="header-brand">
            <div className="logo-wrapper" style={{ height: '80px', display: 'flex', alignItems: 'center' }}>
              <Logo width={80} height={80} className="logo-image" priority />
            </div>
          </Link>
          <ul
            style={{
              display: 'flex',
              listStyle: 'none',
              gap: '2.5rem',
              alignItems: 'center',
              height: '100%',
              margin: 0,
              padding: 0,
            }}
          >
            <li>
              <DropdownMenu labelKey="about" items={aboutMenuItems} href="/about" />
            </li>
            <li>
              <DropdownMenu labelKey="construction" items={constructionMenuItems} href="/projects" />
            </li>
            <li>
              <Link href="/news" className={pathname?.startsWith('/news') ? 'active' : ''}>
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
            <li>
              <LanguageSwitcher />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
