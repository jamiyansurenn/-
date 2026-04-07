'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { getProject, createProject, updateProject, uploadFile } from '@/lib/admin-api';
import { getImageUrl, resolveImageFieldToUrl } from '@/lib/imagePlaceholder';
import styles from '../../admin.module.css';

export default function ProjectEditPage() {
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
    images: [] as string[],
    slug: '',
    metaTitle: '',
    metaDescription: '',
    status: 'DRAFT',
    featured: false,
    order: 0,
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (!isNew) {
      loadProject();
    }
  }, [isNew, id]);

  const loadProject = async () => {
    try {
      const response = await getProject(id);
      const project = response.data;
      const normalizedImage = resolveImageFieldToUrl(project.image) ?? '';
      setFormData({
        title: project.title || '',
        description: project.description || '',
        content: project.content || '',
        image: normalizedImage,
        images: project.images || [],
        slug: project.slug || '',
        metaTitle: project.metaTitle || '',
        metaDescription: project.metaDescription || '',
        status: project.status || 'DRAFT',
        featured: project.featured || false,
        order: project.order || 0,
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      });
    } catch (error) {
      console.error('Failed to load project:', error);
      setError('Төслийн мэдээлэл уншихад алдаа гарлаа.');
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
      const normalizedImage = resolveImageFieldToUrl(formData.image.trim());
      const data = {
        ...formData,
        image: normalizedImage || undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
      };
      if (isNew) {
        await createProject(data);
      } else {
        await updateProject(id, data);
      }
      router.push('/admin/projects');
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
        <h1 className={styles.pageTitle}>{isNew ? 'Шинэ төсөл' : 'Төсөл засах'}</h1>
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
            <img src={getImageUrl(formData.image, 'building', 0)} alt="Preview" className={styles.imagePreview} />
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
          <label>
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            Онцлох төсөл
          </label>
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
