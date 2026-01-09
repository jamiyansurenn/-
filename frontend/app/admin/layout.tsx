'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Skip auth check for login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Skip auth check on login page
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

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.error('Auth timeout - backend not responding');
      setLoading(false);
      localStorage.removeItem('token');
      router.push('/admin/login');
    }, 5000); // 5 second timeout

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

  // Show login page without layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Уншиж байна...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '250px', background: '#1a1a1a', color: '#fff', padding: '2rem 0' }}>
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Admin Panel</h2>
          <p style={{ fontSize: '0.9rem', color: '#999' }}>{user?.email}</p>
        </div>
        <nav style={{ padding: '0 1rem' }}>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link href="/admin" style={{ display: 'block', padding: '0.75rem', borderRadius: '4px', color: '#fff' }}>
                Дашбоард
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link href="/admin/company-info" style={{ display: 'block', padding: '0.75rem', borderRadius: '4px', color: '#fff' }}>
                Компанийн мэдээлэл
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link href="/admin/services" style={{ display: 'block', padding: '0.75rem', borderRadius: '4px', color: '#fff' }}>
                Үйлчилгээнүүд
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link href="/admin/projects" style={{ display: 'block', padding: '0.75rem', borderRadius: '4px', color: '#fff' }}>
                Төслүүд
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link href="/admin/news" style={{ display: 'block', padding: '0.75rem', borderRadius: '4px', color: '#fff' }}>
                Мэдээ
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link href="/admin/team-members" style={{ display: 'block', padding: '0.75rem', borderRadius: '4px', color: '#fff' }}>
                Багийн гишүүд
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link href="/admin/partners" style={{ display: 'block', padding: '0.75rem', borderRadius: '4px', color: '#fff' }}>
                Хамтрагчид
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link href="/admin/contact" style={{ display: 'block', padding: '0.75rem', borderRadius: '4px', color: '#fff' }}>
                Холбоо барих
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Гарах
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '2rem', background: '#f5f5f5' }}>
        {children}
      </main>
    </div>
  );
}
