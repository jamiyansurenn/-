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
        <nav>
          <Link href="/" className="header-brand">
            <div className="logo-wrapper">
              <Logo width={60} height={60} className="logo-image" priority />
            </div>
            <div className="company-name">
              <h1>ДААЦЫН ЦАМХАГ</h1>
              <span>Групп</span>
            </div>
          </Link>
          <ul>
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
