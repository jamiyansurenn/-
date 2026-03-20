'use client';

import { useEffect, useState } from 'react';
import { getNews, deleteNews } from '@/lib/admin-api';
import Link from 'next/link';
import styles from '../admin.module.css';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const response = await getNews();
      setNews(response.data);
    } catch (error) {
      console.error('Failed to load news:', error);
      setError('Мэдээг уншихад алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return;
    try {
      await deleteNews(id);
      loadNews();
    } catch (error) {
      alert('Алдаа гарлаа');
    }
  };

  if (loading) {
    return <div className={styles.loadingText}>Уншиж байна...</div>;
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Мэдээ</h1>
        <Link href="/admin/news/new" className="btn">
          Шинэ мэдээ
        </Link>
      </div>
      {error && <div className={styles.errorState}>{error}</div>}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>Гарчиг</th>
              <th>Slug</th>
              <th>Статус</th>
              <th style={{ textAlign: 'right' }}>Үйлдлүүд</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item.id} className={styles.tableRow}>
                <td>{item.title}</td>
                <td>{item.slug}</td>
                <td>
                  <span className={`${styles.statusBadge} ${item.status === 'PUBLISHED' ? styles.statusPublished : styles.statusDraft}`}>
                    {item.status === 'PUBLISHED' ? 'Нийтлэгдсэн' : 'Ноорог'}
                  </span>
                </td>
                <td>
                  <div className={styles.tableActions}>
                    <Link href={`/admin/news/${item.id}`} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                      Засах
                    </Link>
                    <button onClick={() => handleDelete(item.id)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                      Устгах
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {news.length === 0 && !error && (
          <div className={styles.emptyState}>
            Мэдээ олдсонгүй
          </div>
        )}
      </div>
    </div>
  );
}
