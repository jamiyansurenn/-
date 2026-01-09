'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getNewsItem, createNews, updateNews, uploadFile } from '@/lib/admin-api';

export default function NewsEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
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
  }, [id]);

  const loadNews = async () => {
    try {
      const response = await getNewsItem(id);
      const news = response.data;
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
    } catch (error) {
      console.error('Failed to load news:', error);
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
      alert('Файл хуулахад алдаа гарлаа');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...formData,
        publishedAt: formData.publishedAt || undefined,
      };
      if (isNew) {
        await createNews(data);
      } else {
        await updateNews(id, data);
      }
      router.push('/admin/news');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Алдаа гарлаа');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Уншиж байна...</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>{isNew ? 'Шинэ мэдээ' : 'Мэдээ засах'}</h1>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2rem', borderRadius: '8px' }}>
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
            <img src={formData.image} alt="Preview" style={{ maxWidth: '200px', marginTop: '1rem', display: 'block' }} />
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
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Хадгалж байна...' : 'Хадгалах'}
        </button>
      </form>
    </div>
  );
}
