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
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', color: '#1E293B', letterSpacing: '-0.02em' }}>Дашбоард</h1>
        <p style={{ marginTop: '0.5rem', fontSize: '1.1rem', color: '#64748B' }}>Системийн ерөнхий статистик мэдээлэл</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>

        {/* Services Card */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fef8f5 100%)',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 10px 30px -5px rgba(249, 115, 22, 0.08)',
          border: '1px solid rgba(249, 115, 22, 0.1)',
          transition: 'transform 0.3s ease, boxShadow 0.3s ease'
        }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px -5px rgba(249, 115, 22, 0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(249, 115, 22, 0.08)'; }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#475569', fontSize: '1.1rem', fontWeight: '600' }}>Үйлчилгээнүүд</h3>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316', fontSize: '1.2rem' }}>✨</div>
          </div>
          <p style={{ margin: 0, fontSize: '2.8rem', fontWeight: '800', color: '#1E293B', letterSpacing: '-0.03em' }}>{stats?.services || 0}</p>
        </div>

        {/* Projects Card */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 10px 30px -5px rgba(34, 197, 94, 0.08)',
          border: '1px solid rgba(34, 197, 94, 0.1)',
          transition: 'transform 0.3s ease, boxShadow 0.3s ease'
        }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px -5px rgba(34, 197, 94, 0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(34, 197, 94, 0.08)'; }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#475569', fontSize: '1.1rem', fontWeight: '600' }}>Төслүүд</h3>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', fontSize: '1.2rem' }}>🏗️</div>
          </div>
          <p style={{ margin: 0, fontSize: '2.8rem', fontWeight: '800', color: '#1E293B', letterSpacing: '-0.03em' }}>{stats?.projects || 0}</p>
        </div>

        {/* News Card */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 10px 30px -5px rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.1)',
          transition: 'transform 0.3s ease, boxShadow 0.3s ease'
        }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px -5px rgba(59, 130, 246, 0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(59, 130, 246, 0.08)'; }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#475569', fontSize: '1.1rem', fontWeight: '600' }}>Мэдээ</h3>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontSize: '1.2rem' }}>📰</div>
          </div>
          <p style={{ margin: 0, fontSize: '2.8rem', fontWeight: '800', color: '#1E293B', letterSpacing: '-0.03em' }}>{stats?.news || 0}</p>
        </div>

        {/* Contacts Card */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 10px 30px -5px rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.1)',
          transition: 'transform 0.3s ease, boxShadow 0.3s ease',
          position: 'relative'
        }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px -5px rgba(239, 68, 68, 0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(239, 68, 68, 0.08)'; }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#475569', fontSize: '1.1rem', fontWeight: '600' }}>Холбоо барих</h3>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontSize: '1.2rem' }}>📬</div>
          </div>
          <p style={{ margin: 0, fontSize: '2.8rem', fontWeight: '800', color: '#1E293B', letterSpacing: '-0.03em' }}>{stats?.contacts || 0}</p>

          {stats?.unreadContacts > 0 && (
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              background: '#ef4444',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: '700',
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)'
            }}>
              {stats.unreadContacts} Шинэ
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
