'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getPartner, createPartner, updatePartner, uploadFile } from '@/lib/admin-api';

export default function PartnerEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
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
  }, [id]);

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
      alert('Файл хуулахад алдаа гарлаа');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await createPartner(formData);
      } else {
        await updatePartner(id, formData);
      }
      router.push('/admin/partners');
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
      <h1 style={{ marginBottom: '2rem' }}>{isNew ? 'Шинэ хамтрагч' : 'Хамтрагч засах'}</h1>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2rem', borderRadius: '8px' }}>
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
            <img src={formData.logo} alt="Preview" style={{ maxWidth: '200px', marginTop: '1rem', display: 'block' }} />
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
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Хадгалж байна...' : 'Хадгалах'}
        </button>
      </form>
    </div>
  );
}
