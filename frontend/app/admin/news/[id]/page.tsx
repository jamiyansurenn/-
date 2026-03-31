'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { getNewsItem, createNews, updateNews, uploadFile } from '@/lib/admin-api';
import styles from '../../admin.module.css';
import { getApiBaseUrl } from '@/lib/apiBase';

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u0400-\u04FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const isValidImageUrl = (value: string) => {
  const v = value.trim();
  if (!v) return true; // image is optional
  if (v.startsWith('/uploads/')) return true;
  if (v.startsWith('/')) return true;
  if (v.startsWith('http://') || v.startsWith('https://')) return true;
  if (v.startsWith('data:') || v.startsWith('blob:')) return true;
  return false;
};

const resolvePreviewUrl = (value: string) => {
  const v = value.trim();
  if (!v) return '';
  if (v.startsWith('/uploads/')) {
    const apiBase = getApiBaseUrl();
    return `${apiBase}${v}`;
  }
  return v;
};

export default function NewsEditPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const idParam = params.id as string | undefined;
  const isNew = idParam === 'new' || pathname.endsWith('/new');
  const id = isNew ? 'new' : (idParam as string);

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    status: 'DRAFT',
    featured: false,
    publishedAt: '',
  });

  useEffect(() => {
    if (!isNew) {
      loadNews();
    }
  }, [isNew, id]);

  const loadNews = async () => {
    try {
      const response = await getNewsItem(id);
      const news = response.data;
      if (!news) {
        setError('Мэдээ олдсонгүй.');
        setLoading(false);
        return;
      }
      setFormData({
        title: news.title || '',
        excerpt: news.excerpt || '',
        content: news.content || '',
        image: news.image || '',
        slug: news.slug || '',
        metaTitle: news.metaTitle || '',
        metaDescription: news.metaDescription || '',
        status: news.status || 'DRAFT',
        featured: news.featured || false,
        publishedAt: news.publishedAt ? new Date(news.publishedAt).toISOString().split('T')[0] : '',
      });
      setSlugTouched(true);
    } catch (error) {
      console.error('Failed to load news:', error);
      setError('Мэдээний мэдээлэл уншихад алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');

    try {
      const response = await uploadFile(file);
      if ((response as any)?.error) {
        setError((response as any).error || 'Зураг upload хийхэд алдаа гарлаа.');
        return;
      }
      const uploadedUrl = response?.data?.url;
      if (!uploadedUrl || !isValidImageUrl(uploadedUrl)) {
        setError('Зургийн URL буруу байна. Дахин upload хийнэ үү.');
        return;
      }
      setFormData({ ...formData, image: uploadedUrl });
    } catch (error) {
      setError('Файл хуулахад алдаа гарлаа.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const finalSlug = (formData.slug || toSlug(formData.title)).trim();
      if (!finalSlug) {
        setError('Slug хоосон байж болохгүй.');
        setSaving(false);
        return;
      }
      if (!isValidImageUrl(formData.image)) {
        setError('Зургийн холбоос буруу байна. Зураг дахин upload хийгээд хадгална уу.');
        setSaving(false);
        return;
      }
      const data = {
        ...formData,
        slug: finalSlug,
        publishedAt: formData.publishedAt || undefined,
      };
      const response = isNew ? await createNews(data) : await updateNews(id, data);
      if ((response as any)?.error || !(response as any)?.data) {
        setError((response as any)?.error || 'Хадгалахад алдаа гарлаа');
        return;
      }
      router.push('/admin/news');
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
        <h1 className={styles.pageTitle}>{isNew ? 'Шинэ мэдээ' : 'Мэдээ засах'}</h1>
      </div>
      {error && <div className={styles.errorState}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className="form-group">
          <label>Гарчиг *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => {
              const title = e.target.value;
              setFormData((prev) => ({
                ...prev,
                title,
                slug: slugTouched ? prev.slug : toSlug(title),
              }));
            }}
          />
        </div>
        <div className="form-group">
          <label>Товч тайлбар</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
          />
        </div>
        <div className="form-group">
          <label>Агуулга *</label>
          <textarea
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={15}
          />
        </div>
        <div className="form-group">
          <label>Зураг</label>
          <input type="file" accept="image/*" onChange={handleFileUpload} />
          {formData.image && (
            <img src={resolvePreviewUrl(formData.image)} alt="Preview" className={styles.imagePreview} />
          )}
        </div>
        <div className="form-group">
          <label>Slug *</label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setFormData({ ...formData, slug: toSlug(e.target.value) });
            }}
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            Онцлох мэдээ
          </label>
        </div>
        <div className="form-group">
          <label>Нийтлэх огноо</label>
          <input
            type="date"
            value={formData.publishedAt}
            onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
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
