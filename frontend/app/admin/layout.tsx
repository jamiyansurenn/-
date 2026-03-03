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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5', fontFamily: 'var(--font-inter, sans-serif)' }}>
      <aside style={{
        width: '260px',
        background: '#1a1a1a',
        color: '#fff',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        overflowY: 'auto',
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #333' }}>
          <h2 style={{ color: '#FF6B35', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Admin Panel</h2>
          <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem', wordBreak: 'break-all' }}>{user?.email}</p>
        </div>
        <nav style={{ padding: '1.5rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'block',
                  padding: '0.8rem 1rem',
                  borderRadius: '6px',
                  color: isActive ? '#fff' : '#aaa',
                  background: isActive ? '#FF6B35' : 'transparent',
                  fontWeight: isActive ? '600' : '400',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                  marginBottom: '0.5rem'
                }}
              >
                {item.name}
              </Link>
            )
          })}
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #333' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '0.8rem',
                background: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background 0.2s'
              }}
            >
              Гарах
            </button>
          </div>
        </nav>
      </aside>
      <main style={{ flex: 1, marginLeft: '260px', padding: '2.5rem', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ maxWidth: '1200px', margin: '0 auto' }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
