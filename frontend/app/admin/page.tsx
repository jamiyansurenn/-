'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setError('Нэвтрэх шаардлагатай');
      return;
    }

    const fetchStats = async () => {
      try {
        const [services, projects, news, contacts] = await Promise.all([
          api.get('/services', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/projects', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/news', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/contact', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const servicesData = Array.isArray(services?.data) ? services.data : [];
        const projectsData = Array.isArray(projects?.data) ? projects.data : [];
        const newsData = Array.isArray(news?.data) ? news.data : [];
        const contactsData = Array.isArray(contacts?.data) ? contacts.data : [];

        setStats({
          services: servicesData.length,
          projects: projectsData.length,
          news: newsData.length,
          contacts: contactsData.length,
          unreadContacts: contactsData.filter((c: any) => !c.read).length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setError('Статистик уншихад алдаа гарлаа.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className={styles.loadingText}>Уншиж байна...</div>;
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Дашбоард</h1>
          <p className={styles.pageSubtitle}>Системийн ерөнхий статистик мэдээлэл</p>
        </div>
      </div>

      {error && <div className={styles.errorState}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statCardOrange}`}>
          <div className={styles.statHeader}>
            <h3 className={styles.statLabel}>Үйлчилгээнүүд</h3>
            <div className={styles.statIcon}>✨</div>
          </div>
          <p className={styles.statValue}>{stats?.services || 0}</p>
        </div>

        <div className={`${styles.statCard} ${styles.statCardGreen}`}>
          <div className={styles.statHeader}>
            <h3 className={styles.statLabel}>Төслүүд</h3>
            <div className={styles.statIcon}>🏗️</div>
          </div>
          <p className={styles.statValue}>{stats?.projects || 0}</p>
        </div>

        <div className={`${styles.statCard} ${styles.statCardBlue}`}>
          <div className={styles.statHeader}>
            <h3 className={styles.statLabel}>Мэдээ</h3>
            <div className={styles.statIcon}>📰</div>
          </div>
          <p className={styles.statValue}>{stats?.news || 0}</p>
        </div>

        <div className={`${styles.statCard} ${styles.statCardRed}`}>
          <div className={styles.statHeader}>
            <h3 className={styles.statLabel}>Холбоо барих</h3>
            <div className={styles.statIcon}>📬</div>
          </div>
          <p className={styles.statValue}>{stats?.contacts || 0}</p>
          {stats?.unreadContacts > 0 && (
            <div className={styles.badge}>{stats.unreadContacts} Шинэ</div>
          )}
        </div>
      </div>
    </div>
  );
}
