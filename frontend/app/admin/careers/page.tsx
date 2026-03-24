'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';
import { deleteCareerAdmin, getCareersAdmin } from '@/lib/admin-api';

export default function CareersAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await getCareersAdmin();
      setItems(response.data || []);
    } catch (e) {
      console.error(e);
      setError('Ажлын заруудыг уншихад алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return;
    try {
      await deleteCareerAdmin(id);
      loadItems();
    } catch {
      alert('Устгахад алдаа гарлаа');
    }
  };

  if (loading) return <div className={styles.loadingText}>Уншиж байна...</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Ажлын зар</h1>
        <Link href="/admin/careers/new" className="btn">
          Шинэ ажлын зар
        </Link>
      </div>

      {error && <div className={styles.errorState}>{error}</div>}

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>Гарчиг</th>
              <th>Тайлбар</th>
              <th>Дараалал</th>
              <th>Статус</th>
              <th style={{ textAlign: 'right' }}>Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className={styles.tableRow}>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.order ?? 0}</td>
                <td>
                  <span className={`${styles.statusBadge} ${item.status === 'PUBLISHED' ? styles.statusPublished : styles.statusDraft}`}>
                    {item.status === 'PUBLISHED' ? 'Нийтлэгдсэн' : 'Ноорог'}
                  </span>
                </td>
                <td>
                  <div className={styles.tableActions}>
                    <Link href={`/admin/careers/${item.id}`} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
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
        {items.length === 0 && !error && <div className={styles.emptyState}>Ажлын зар алга байна</div>}
      </div>
    </div>
  );
}
