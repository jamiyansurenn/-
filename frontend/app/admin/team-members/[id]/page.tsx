'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { getTeamMember, createTeamMember, updateTeamMember, uploadFile } from '@/lib/admin-api';
import { getImageUrl } from '@/lib/imagePlaceholder';
import styles from '../../admin.module.css';

export default function TeamMemberEditPage() {
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
    position: '',
    bio: '',
    image: '',
    email: '',
    phone: '',
    linkedin: '',
    order: 0,
    status: 'DRAFT',
  });

  useEffect(() => {
    if (!isNew) {
      loadMember();
    }
  }, [isNew, id]);

  const loadMember = async () => {
    try {
      const response = await getTeamMember(id);
      const member = response.data;
      setFormData({
        name: member.name || '',
        position: member.position || '',
        bio: member.bio || '',
        image: member.image || '',
        email: member.email || '',
        phone: member.phone || '',
        linkedin: member.linkedin || '',
        order: member.order || 0,
        status: member.status || 'DRAFT',
      });
    } catch (error) {
      console.error('Failed to load team member:', error);
      setError('Багийн гишүүний мэдээлэл уншихад алдаа гарлаа.');
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
        await createTeamMember(formData);
      } else {
        await updateTeamMember(id, formData);
      }
      router.push('/admin/team-members');
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
        <h1 className={styles.pageTitle}>{isNew ? 'Шинэ гишүүн' : 'Гишүүн засах'}</h1>
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
          <label>Албан тушаал *</label>
          <input
            type="text"
            required
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Товч мэдээлэл</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={5}
          />
        </div>
        <div className="form-group">
          <label>Зураг</label>
          <input type="file" accept="image/*" onChange={handleFileUpload} />
          {formData.image && (
            <img src={getImageUrl(formData.image, 'team', 0)} alt="Preview" className={styles.imagePreview} />
          )}
        </div>
        <div className="form-group">
          <label>Имэйл</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Утас</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>LinkedIn</label>
          <input
            type="url"
            value={formData.linkedin}
            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
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
