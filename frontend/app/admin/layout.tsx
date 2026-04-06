'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './admin.module.css';
import { getApiBaseUrl } from '@/lib/apiBase';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [navMenuOpen, setNavMenuOpen] = useState(true);

  // Skip auth check for login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      setLoading(false);
      return;
    }

    const authWaitMs = (() => {
      const raw = process.env.NEXT_PUBLIC_API_TIMEOUT_MS;
      const n = raw ? parseInt(raw, 10) : NaN;
      return !Number.isNaN(n) && n >= 5000 ? n : 45000;
    })();

    const apiUrl = getApiBaseUrl();

    const controller = new AbortController();
    const abortTimer = setTimeout(() => controller.abort(), authWaitMs);

    fetch(`${apiUrl}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    })
      .then((res) => {
        clearTimeout(abortTimer);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((error) => {
        clearTimeout(abortTimer);
        if (error?.name === 'AbortError') {
          console.error('Auth timeout - backend not responding (cold start can exceed 10s on Render free tier)');
        } else {
          console.error('Auth error:', error);
        }
        localStorage.removeItem('token');
        setLoading(false);
        router.push('/admin/login');
      });

    return () => {
      clearTimeout(abortTimer);
      controller.abort();
    };
  }, [router, isLoginPage]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} aria-hidden />
        <p className={styles.loadingText}>Уншиж байна...</p>
      </div>
    );
  }

  const navItems = [
    { name: 'Дашбоард', href: '/admin' },
    { name: 'Hero тохиргоо', href: '/admin/hero-settings' },
    { name: 'Компанийн мэдээлэл', href: '/admin/company-info' },
    { name: 'Үйлчилгээнүүд', href: '/admin/services' },
    { name: 'Төслүүд', href: '/admin/projects' },
    { name: 'Мэдээ', href: '/admin/news' },
    { name: 'Ажлын зар', href: '/admin/careers' },
    { name: 'Багийн гишүүд', href: '/admin/team-members' },
    { name: 'Хамтрагчид', href: '/admin/partners' },
    { name: 'Section Builder', href: '/admin/pages' },
    { name: 'Холбоо барих', href: '/admin/contact' },
  ];

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>
            <span className={styles.sidebarDot}></span>
            Удирдлага
          </h2>
          <p className={styles.sidebarEmail}>{user?.email}</p>
        </div>

        <nav className={styles.nav}>
          <button
            type="button"
            className={styles.navLabelButton}
            onClick={() => setNavMenuOpen((o) => !o)}
            aria-expanded={navMenuOpen}
            aria-controls="admin-nav-links"
          >
            <span className={styles.navLabelText}>Цэс</span>
            <span
              className={`${styles.navChevron} ${navMenuOpen ? styles.navChevronOpen : ''}`}
              aria-hidden
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </button>
          <div
            id="admin-nav-links"
            className={navMenuOpen ? styles.navLinksWrap : `${styles.navLinksWrap} ${styles.navLinksWrapCollapsed}`}
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              Системээс гарах
            </button>
          </div>
        </nav>
      </aside>

      <main className={styles.main}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={styles.contentCard}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className={styles.loadingScreen}>
          <div className={styles.loadingSpinner} aria-hidden />
          <p className={styles.loadingText}>Уншиж байна...</p>
        </div>
      }
    >
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </Suspense>
  );
}
