'use client';

import { useEffect, useState } from 'react';
import { getPartners, deletePartner } from '@/lib/admin-api';
import Link from 'next/link';
import styles from '../admin.module.css';

export default function PartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const response = await getPartners();
      setPartners(response.data);
    } catch (error) {
      console.error('Failed to load partners:', error);
      setError('Хамтрагчдыг уншихад алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return;
    try {
      await deletePartner(id);
      loadPartners();
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
        <h1 className={styles.pageTitle}>Хамтрагчид</h1>
        <Link href="/admin/partners/new" className="btn">
          Шинэ хамтрагч
        </Link>
      </div>
      {error && <div className={styles.errorState}>{error}</div>}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>Нэр</th>
              <th>Вебсайт</th>
              <th>Статус</th>
              <th style={{ textAlign: 'right' }}>Үйлдлүүд</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id} className={styles.tableRow}>
                <td>{partner.name}</td>
                <td>{partner.website || '-'}</td>
                <td>
                  <span className={`${styles.statusBadge} ${partner.status === 'PUBLISHED' ? styles.statusPublished : styles.statusDraft}`}>
                    {partner.status === 'PUBLISHED' ? 'Нийтлэгдсэн' : 'Ноорог'}
                  </span>
                </td>
                <td>
                  <div className={styles.tableActions}>
                    <Link href={`/admin/partners/${partner.id}`} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                      Засах
                    </Link>
                    <button onClick={() => handleDelete(partner.id)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                      Устгах
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {partners.length === 0 && !error && (
          <div className={styles.emptyState}>
            Хамтрагч олдсонгүй
          </div>
        )}
      </div>
    </div>
  );
}
