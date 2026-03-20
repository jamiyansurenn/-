'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { getService, createService, updateService, uploadFile } from '@/lib/admin-api';
import styles from '../../admin.module.css';

export default function ServiceEditPage() {
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
    content: '',
    image: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    status: 'DRAFT',
    order: 0,
  });

  useEffect(() => {
    if (!isNew) {
      loadService();
    }
  }, [isNew, id]);

  const loadService = async () => {
    try {
      const response = await getService(id);
      const service = response.data;
      setFormData({
        title: service.title || '',
        description: service.description || '',
        content: service.content || '',
        image: service.image || '',
        slug: service.slug || '',
        metaTitle: service.metaTitle || '',
        metaDescription: service.metaDescription || '',
        status: service.status || 'DRAFT',
        order: service.order || 0,
      });
    } catch (error) {
      console.error('Failed to load service:', error);
      setError('Үйлчилгээний мэдээлэл уншихад алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await uploadFile(file);
      setFormData({ ...formData, image: response.data.url });
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
        await createService(formData);
      } else {
        await updateService(id, formData);
      }
      router.push('/admin/services');
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
        <h1 className={styles.pageTitle}>{isNew ? 'Шинэ үйлчилгээ' : 'Үйлчилгээ засах'}</h1>
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
          <label>Тайлбар *</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
        <div className="form-group">
          <label>Агуулга</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={10}
          />
        </div>
        <div className="form-group">
          <label>Зураг</label>
          <input type="file" accept="image/*" onChange={handleFileUpload} />
          {formData.image && (
            <img src={formData.image} alt="Preview" className={styles.imagePreview} />
          )}
        </div>
        <div className="form-group">
          <label>Slug *</label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Meta Title</label>
          <input
            type="text"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Meta Description</label>
          <textarea
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            rows={2}
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
        <div className="form-group">
          <label>Дараалал</label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
          />
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
