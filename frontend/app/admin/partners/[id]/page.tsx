'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { getPartner, createPartner, updatePartner, uploadFile } from '@/lib/admin-api';
import styles from '../../admin.module.css';

export default function PartnerEditPage() {
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
    name: '',
    logo: '',
    website: '',
    description: '',
    order: 0,
    status: 'DRAFT',
  });

  useEffect(() => {
    if (!isNew) {
      loadPartner();
    }
  }, [isNew, id]);

  const loadPartner = async () => {
    try {
      const response = await getPartner(id);
      const partner = response.data;
      setFormData({
        name: partner.name || '',
        logo: partner.logo || '',
        website: partner.website || '',
        description: partner.description || '',
        order: partner.order || 0,
        status: partner.status || 'DRAFT',
      });
    } catch (error) {
      console.error('Failed to load partner:', error);
      setError('Хамтрагчийн мэдээлэл уншихад алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await uploadFile(file);
      setFormData({ ...formData, logo: response.data.url });
    } catch (error) {
      setError('Файл хуулахад алдаа гарлаа.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isNew) {
        await createPartner(formData);
      } else {
        await updatePartner(id, formData);
      }
      router.push('/admin/partners');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Алдаа гарлаа');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loadingText}>Уншиж байна...</div>;
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isNew ? 'Шинэ хамтрагч' : 'Хамтрагч засах'}</h1>
      </div>
      {error && <div className={styles.errorState}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className="form-group">
          <label>Нэр *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Лого</label>
          <input type="file" accept="image/*" onChange={handleFileUpload} />
          {formData.logo && (
            <img src={formData.logo} alt="Preview" className={styles.imagePreview} />
          )}
        </div>
        <div className="form-group">
          <label>Вебсайт</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Тайлбар</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={5}
          />
        </div>
        <div className="form-group">
          <label>Дараалал</label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
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
