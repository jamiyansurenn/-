'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchStats = async () => {
      try {
        const [services, projects, news, contacts] = await Promise.all([
          api.get('/services', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/projects', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/news', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/contact', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setStats({
          services: services.data.length,
          projects: projects.data.length,
          news: news.data.length,
          contacts: contacts.data.length,
          unreadContacts: contacts.data.filter((c: any) => !c.read).length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Уншиж байна...</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Дашбоард</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Үйлчилгээнүүд</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-orange, #FF6B35)' }}>{stats?.services || 0}</p>
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Төслүүд</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-orange, #FF6B35)' }}>{stats?.projects || 0}</p>
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Мэдээ</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-orange, #FF6B35)' }}>{stats?.news || 0}</p>
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Холбоо барих</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-orange, #FF6B35)' }}>{stats?.contacts || 0}</p>
          {stats?.unreadContacts > 0 && (
            <p style={{ fontSize: '0.9rem', color: '#dc3545', marginTop: '0.5rem' }}>
              Уншаагүй: {stats.unreadContacts}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
