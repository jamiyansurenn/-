'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import styles from '../../admin.module.css';
import { createCareerAdmin, getCareerAdmin, updateCareerAdmin } from '@/lib/admin-api';

export default function CareerEditPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const idParam = params.id as string | undefined;
  const isNew = idParam === 'new' || pathname.endsWith('/new');
  const id = isNew ? 'new' : (idParam as string);

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    details: '',
    order: 0,
    status: 'DRAFT',
  });

  useEffect(() => {
    if (!isNew) loadItem();
  }, [isNew, id]);

  const loadItem = async () => {
    try {
      const response = await getCareerAdmin(id);
      const item = response.data;
      setFormData({
        title: item.title || '',
        description: item.description || '',
        details: item.details || '',
        order: item.order ?? 0,
        status: item.status || 'DRAFT',
      });
    } catch {
      setError('Ажлын зарын мэдээлэл уншихад алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isNew) {
        await createCareerAdmin(formData);
      } else {
        await updateCareerAdmin(id, formData);
      }
      router.push('/admin/careers');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Хадгалахад алдаа гарлаа');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.loadingText}>Уншиж байна...</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isNew ? 'Шинэ ажлын зар' : 'Ажлын зар засах'}</h1>
      </div>
      {error && <div className={styles.errorState}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className="form-group">
          <label>Гарчиг *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Товч тайлбар *</label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Дэлгэрэнгүй</label>
          <textarea
            rows={12}
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Дараалал</label>
          <input
            type="number"
            min={0}
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) || 0 })}
          />
        </div>

        <div className="form-group">
          <label>Статус</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="DRAFT">Ноорог</option>
            <option value="PUBLISHED">Нийтлэгдсэн</option>
          </select>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Хадгалж байна...' : 'Хадгалах'}
          </button>
        </div>
      </form>
    </div>
  );
}
