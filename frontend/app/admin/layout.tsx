'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

    const timeoutId = setTimeout(() => {
      console.error('Auth timeout - backend not responding');
      setLoading(false);
      localStorage.removeItem('token');
      router.push('/admin/login');
    }, 5000);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    fetch(`${apiUrl}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        clearTimeout(timeoutId);
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
        clearTimeout(timeoutId);
        console.error('Auth error:', error);
        localStorage.removeItem('token');
        setLoading(false);
        router.push('/admin/login');
      });

    return () => clearTimeout(timeoutId);
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#fafafa' }}>
        <p style={{ color: '#FF6B35', fontWeight: 'bold' }}>Уншиж байна...</p>
      </div>
    );
  }

  const navItems = [
    { name: 'Дашбоард', href: '/admin' },
    { name: 'Компанийн мэдээлэл', href: '/admin/company-info' },
    { name: 'Үйлчилгээнүүд', href: '/admin/services' },
    { name: 'Төслүүд', href: '/admin/projects' },
    { name: 'Мэдээ', href: '/admin/news' },
    { name: 'Багийн гишүүд', href: '/admin/team-members' },
    { name: 'Хамтрагчид', href: '/admin/partners' },
    { name: 'Холбоо барих', href: '/admin/contact' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'var(--font-inter, sans-serif)' }}>
      <aside style={{
        width: '280px',
        background: '#0F172A', // Slate 900
        color: '#fff',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        overflowY: 'auto',
        boxShadow: '4px 0 24px rgba(0,0,0,0.06)',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '2.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--brand-gradient, linear-gradient(135deg, #F97316 0%, #E52E71 100%))' }}></span>
            Удирдлага
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.8rem', wordBreak: 'break-all', fontWeight: '500' }}>{user?.email}</p>
        </div>

        <nav style={{ padding: '2rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', paddingLeft: '1rem' }}>Тэс цэс</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.9rem 1.2rem',
                  borderRadius: '12px',
                  color: isActive ? '#fff' : '#94A3B8',
                  background: isActive ? 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)' : 'transparent',
                  fontWeight: isActive ? '600' : '500',
                  textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  marginBottom: '0.3rem',
                  boxShadow: isActive ? '0 4px 15px rgba(249, 115, 22, 0.3)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94A3B8';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                {item.name}
              </Link>
            )
          })}

          <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '0.9rem',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#EF4444';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.color = '#EF4444';
              }}
            >
              Системээс гарах
            </button>
          </div>
        </nav>
      </aside>

      <main style={{ flex: 1, marginLeft: '280px', padding: '3rem', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ maxWidth: '1400px', margin: '0 auto', background: '#fff', padding: '3rem', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', minHeight: 'calc(100vh - 6rem)' }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
