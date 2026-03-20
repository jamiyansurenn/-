'use client';

import { useEffect, useState } from 'react';
import { getServices, deleteService } from '@/lib/admin-api';
import Link from 'next/link';
import styles from '../admin.module.css';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await getServices();
      setServices(response.data);
    } catch (error) {
      console.error('Failed to load services:', error);
      setError('Үйлчилгээнүүдийг уншихад алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return;
    try {
      await deleteService(id);
      loadServices();
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
        <h1 className={styles.pageTitle}>Үйлчилгээнүүд</h1>
        <Link href="/admin/services/new" className="btn">
          Шинэ үйлчилгээ
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
            {services.map((service) => (
              <tr key={service.id} className={styles.tableRow}>
                <td>{service.title}</td>
                <td>{service.slug}</td>
                <td>
                  <span className={`${styles.statusBadge} ${service.status === 'PUBLISHED' ? styles.statusPublished : styles.statusDraft}`}>
                    {service.status === 'PUBLISHED' ? 'Нийтлэгдсэн' : 'Ноорог'}
                  </span>
                </td>
                <td>
                  <div className={styles.tableActions}>
                    <Link href={`/admin/services/${service.id}`} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                      Засах
                    </Link>
                    <button onClick={() => handleDelete(service.id)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                      Устгах
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {services.length === 0 && !error && (
          <div className={styles.emptyState}>
            Үйлчилгээ олдсонгүй
          </div>
        )}
      </div>
    </div>
  );
}
