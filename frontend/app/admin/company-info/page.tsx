'use client';

import { useEffect, useState } from 'react';
import { getCompanyInfo, updateCompanyInfo, createCompanyInfo } from '@/lib/admin-api';
import { useRouter } from 'next/navigation';

export default function CompanyInfoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    aboutUs: '',
    vision: '',
    mission: '',
    values: '',
    history: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    status: 'DRAFT',
  });
  const [companyInfo, setCompanyInfo] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await getCompanyInfo();
      if (response.data && response.data.length > 0) {
        const info = response.data[0];
        setCompanyInfo(info);
        setFormData({
          aboutUs: info.aboutUs || '',
          vision: info.vision || '',
          mission: info.mission || '',
          values: info.values || '',
          history: info.history || '',
          slug: info.slug || '',
          metaTitle: info.metaTitle || '',
          metaDescription: info.metaDescription || '',
          status: info.status || 'DRAFT',
        });
      }
    } catch (error) {
      console.error('Failed to load company info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (companyInfo) {
        await updateCompanyInfo(companyInfo.id, formData);
      } else {
        await createCompanyInfo(formData);
      }
      alert('Амжилттай хадгаллаа');
      loadData();
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
      <h1 style={{ marginBottom: '2rem' }}>Компанийн мэдээлэл</h1>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2rem', borderRadius: '8px' }}>
        <div className="form-group">
          <label>Бидний тухай</label>
          <textarea
            value={formData.aboutUs}
            onChange={(e) => setFormData({ ...formData, aboutUs: e.target.value })}
            rows={5}
          />
        </div>
        <div className="form-group">
          <label>Алсын хараа</label>
          <textarea
            value={formData.vision}
            onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
            rows={3}
          />
        </div>
        <div className="form-group">
          <label>Зорилго</label>
          <textarea
            value={formData.mission}
            onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
            rows={3}
          />
        </div>
        <div className="form-group">
          <label>Үнэт зүйлс</label>
          <textarea
            value={formData.values}
            onChange={(e) => setFormData({ ...formData, values: e.target.value })}
            rows={3}
          />
        </div>
        <div className="form-group">
          <label>Түүх</label>
          <textarea
            value={formData.history}
            onChange={(e) => setFormData({ ...formData, history: e.target.value })}
            rows={5}
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
