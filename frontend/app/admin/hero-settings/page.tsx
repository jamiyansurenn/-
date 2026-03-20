'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { uploadFile, getHeroSettingsAdmin, updateHeroSettingsAdmin } from '@/lib/admin-api';
import { useRouter } from 'next/navigation';
import styles from '../admin.module.css';

type HeroSlide = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

type HeroSettingsForm = {
  backgrounds: string[];
  slides: HeroSlide[];
};

const DEFAULT_SLIDE_COUNT = 5;
const DEFAULT_BACKGROUND_COUNT = 2;

function normalizeSettings(input: any): HeroSettingsForm {
  const backgrounds = Array.isArray(input?.backgrounds) ? input.backgrounds : [];
  const slides = Array.isArray(input?.slides) ? input.slides : [];

  const normalizedBackgrounds = Array.from({ length: DEFAULT_BACKGROUND_COUNT }, (_, i) => backgrounds[i] || '');
  const normalizedSlides = Array.from({ length: DEFAULT_SLIDE_COUNT }, (_, i) => slides[i] || {});

  return { backgrounds: normalizedBackgrounds, slides: normalizedSlides };
}

export default function HeroSettingsPage() {
  const router = useRouter();
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState<HeroSettingsForm>({
    backgrounds: Array.from({ length: DEFAULT_BACKGROUND_COUNT }, () => ''),
    slides: Array.from({ length: DEFAULT_SLIDE_COUNT }, () => ({})),
  });

  const slideIndices = useMemo(() => Array.from({ length: DEFAULT_SLIDE_COUNT }, (_, i) => i), []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        setSuccess('');
        const res = await getHeroSettingsAdmin();
        const normalized = normalizeSettings(res.data);
        normalized.backgrounds = normalized.backgrounds.map((u) => (u && u.startsWith('/uploads/') ? `${apiBase}${u}` : u));
        setForm(normalized);
      } catch (e: any) {
        setError(e?.message || 'Hero тохиргоо уншихад алдаа гарлаа');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleBackgroundUpload = async (index: number, file: File | null) => {
    if (!file) return;
    setError('');
    setSuccess('');
    try {
      const res = await uploadFile(file);
      const rawUrl = res.data?.url || '';
      const url = rawUrl.startsWith('/uploads/') ? `${apiBase}${rawUrl}` : rawUrl;
      setForm((prev) => {
        const next = { ...prev, backgrounds: [...prev.backgrounds] };
        next.backgrounds[index] = url;
        return next;
      });
    } catch (e: any) {
      setError(e?.message || 'Зураг хуулахад алдаа гарлаа');
    }
  };

  const handleSlideChange = (index: number, key: keyof HeroSlide, value: string) => {
    setForm((prev) => {
      const nextSlides = [...prev.slides];
      nextSlides[index] = { ...nextSlides[index], [key]: value };
      return { ...prev, slides: nextSlides };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateHeroSettingsAdmin({
        backgrounds: form.backgrounds.filter(Boolean),
        slides: form.slides.map((s) => ({
          title: s.title || '',
          subtitle: s.subtitle || '',
          ctaLabel: s.ctaLabel || 'Холбоо барих',
          ctaHref: s.ctaHref || '/contact',
        })),
      });
      setSuccess('Hero тохиргоо амжилттай хадгалагдлаа');
      router.refresh();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Хадгалж чадсангүй');
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
        <div>
          <h1 className={styles.pageTitle}>Hero тохиргоо</h1>
          <p className={styles.pageSubtitle}>Background зураг + Slider мессежүүд</p>
        </div>
      </div>

      {error && <div className={styles.errorState}>{error}</div>}
      {success && <div className={styles.successState}>{success}</div>}

      <form onSubmit={handleSave} className={styles.formCard}>
        <h2 className={styles.pageTitle} style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
          Background зураг
        </h2>

        <div className="form-group">
          <label>Hero зураг 1</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleBackgroundUpload(0, e.target.files?.[0] || null)}
          />
          {form.backgrounds[0] ? (
            <div style={{ marginTop: '1rem' }}>
              <Image src={form.backgrounds[0]} alt="Hero 1" width={480} height={280} style={{ borderRadius: 12 }} />
            </div>
          ) : null}
        </div>

        <div className="form-group">
          <label>Hero зураг 2</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleBackgroundUpload(1, e.target.files?.[0] || null)}
          />
          {form.backgrounds[1] ? (
            <div style={{ marginTop: '1rem' }}>
              <Image src={form.backgrounds[1]} alt="Hero 2" width={480} height={280} style={{ borderRadius: 12 }} />
            </div>
          ) : null}
        </div>

        <h2 className={styles.pageTitle} style={{ fontSize: '1.4rem', margin: '2rem 0 1rem' }}>
          Slider мессежүүд
        </h2>

        {slideIndices.map((i) => (
          <div key={i} style={{ padding: '1rem', borderRadius: 14, border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>
              Slide {i + 1}
            </h3>

            <div className="form-group">
              <label>Title</label>
              <input value={form.slides[i]?.title || ''} onChange={(e) => handleSlideChange(i, 'title', e.target.value)} type="text" />
            </div>

            <div className="form-group">
              <label>Subtitle</label>
              <textarea value={form.slides[i]?.subtitle || ''} onChange={(e) => handleSlideChange(i, 'subtitle', e.target.value)} rows={4} />
            </div>

            <div className="form-group">
              <label>CTA Label</label>
              <input value={form.slides[i]?.ctaLabel || ''} onChange={(e) => handleSlideChange(i, 'ctaLabel', e.target.value)} type="text" />
            </div>

            <div className="form-group">
              <label>CTA Href</label>
              <input value={form.slides[i]?.ctaHref || ''} onChange={(e) => handleSlideChange(i, 'ctaHref', e.target.value)} type="text" />
            </div>
          </div>
        ))}

        <div className={styles.formActions}>
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Хадгалж байна...' : 'Хадгалах'}
          </button>
        </div>
      </form>
    </div>
  );
}

