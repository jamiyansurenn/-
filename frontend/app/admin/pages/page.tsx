'use client';

import { useEffect, useState } from 'react';
import styles from '../admin.module.css';
import {
  createPageAdmin,
  createPageSectionAdmin,
  deletePageSectionAdmin,
  getPageAdmin,
  getPagesAdmin,
  reorderPageSectionsAdmin,
  togglePageSectionVisibilityAdmin,
  updatePageAdmin,
  updatePageSectionAdmin,
} from '@/lib/admin-api';

function tryParseJson(raw: string): { ok: true; value: unknown } | { ok: false; message: string } {
  try {
    JSON.parse(raw);
    return { ok: true, value: null };
  } catch (e: any) {
    return { ok: false, message: e?.message || 'Invalid JSON' };
  }
}

const PUBLIC_SLUG_HINTS = ['services', 'news', 'projects'] as const;

export default function AdminPagesBuilderPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [activePageId, setActivePageId] = useState('');
  const [activePage, setActivePage] = useState<any>(null);
  const [newSlug, setNewSlug] = useState('');
  const [newSectionType, setNewSectionType] = useState('text');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionLocale, setNewSectionLocale] = useState('mn');
  const [newSectionJson, setNewSectionJson] = useState('{}');
  const [editingSectionId, setEditingSectionId] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const [editingType, setEditingType] = useState('text');
  const [editingLocale, setEditingLocale] = useState('mn');
  const [editingJson, setEditingJson] = useState('{}');
  const [pageTitleEd, setPageTitleEd] = useState('');
  const [pageSeoTitleEd, setPageSeoTitleEd] = useState('');
  const [pageSeoDescEd, setPageSeoDescEd] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadPages = async () => {
    const res = await getPagesAdmin();
    const list = Array.isArray(res?.data) ? res.data : [];
    setPages(list);
    if (!activePageId && list.length > 0) setActivePageId(list[0].id);
  };

  const loadPageDetail = async (pageId: string) => {
    if (!pageId) return;
    const res = await getPageAdmin(pageId);
    const p = res?.data || null;
    setActivePage(p);
    if (p) {
      setPageTitleEd(p.title ?? '');
      setPageSeoTitleEd(p.seoTitle ?? '');
      setPageSeoDescEd(p.seoDescription ?? '');
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadPages();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    loadPageDetail(activePageId);
  }, [activePageId]);

  const createPage = async () => {
    if (!newSlug.trim()) return;
    setError('');
    await createPageAdmin({ slug: newSlug.trim(), title: newSlug.trim(), status: 'DRAFT' });
    setNewSlug('');
    await loadPages();
    setMessage('Page үүслээ.');
  };

  const savePageMeta = async () => {
    if (!activePage) return;
    setError('');
    await updatePageAdmin(activePage.id, {
      title: pageTitleEd || activePage.slug,
      seoTitle: pageSeoTitleEd || undefined,
      seoDescription: pageSeoDescEd || undefined,
    });
    await loadPageDetail(activePage.id);
    await loadPages();
    setMessage('Хуудсын мэдээлэл хадгалагдлаа.');
  };

  const addSection = async () => {
    if (!activePageId) return;
    setError('');
    const parsed = tryParseJson(newSectionJson.trim() || '{}');
    if (!parsed.ok) {
      setError(`contentJson: ${parsed.message}`);
      return;
    }
    await createPageSectionAdmin({
      pageId: activePageId,
      type: newSectionType,
      title: newSectionTitle || newSectionType,
      locale: newSectionLocale,
      contentJson: newSectionJson.trim() || '{}',
      isVisible: true,
      order: activePage?.sections?.length || 0,
    });
    setNewSectionTitle('');
    setNewSectionJson('{}');
    await loadPageDetail(activePageId);
    setMessage('Section нэмэгдлээ.');
  };

  const sectionTemplateByType = (type: string) => {
    if (type === 'hero') return { eyebrow: 'Section', title: 'Title', subtitle: 'Subtitle' };
    if (type === 'list') return { description: 'List description', items: ['Item 1', 'Item 2'] };
    if (type === 'cards') return { items: [{ title: 'Card 1', description: 'Description' }] };
    if (type === 'timeline') return { items: [{ year: '2026', title: 'Milestone', description: '...' }] };
    if (type === 'gallery') return { images: [{ url: '/uploads/sample.jpg', caption: 'Image caption' }] };
    return { description: 'Text section content' };
  };

  const applyTemplate = () => {
    setNewSectionJson(JSON.stringify(sectionTemplateByType(newSectionType), null, 2));
  };

  const formatEditingJson = () => {
    const p = tryParseJson(editingJson);
    if (!p.ok) {
      setError(`JSON: ${p.message}`);
      return;
    }
    setEditingJson(JSON.stringify(JSON.parse(editingJson), null, 2));
    setError('');
  };

  const formatNewJson = () => {
    const p = tryParseJson(newSectionJson);
    if (!p.ok) {
      setError(`JSON: ${p.message}`);
      return;
    }
    setNewSectionJson(JSON.stringify(JSON.parse(newSectionJson), null, 2));
    setError('');
  };

  const togglePagePublish = async () => {
    if (!activePage) return;
    setError('');
    const next = activePage.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    await updatePageAdmin(activePage.id, { status: next });
    await loadPageDetail(activePage.id);
    await loadPages();
    setMessage(`Page ${next === 'PUBLISHED' ? 'нийтлэгдлээ' : 'draft боллоо'}.`);
  };

  const moveSection = async (idx: number, dir: -1 | 1) => {
    const sections = [...(activePage?.sections || [])];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sections.length) return;
    const current = sections[idx];
    sections[idx] = sections[swapIdx];
    sections[swapIdx] = current;
    await reorderPageSectionsAdmin(activePage.id, sections.map((s: any) => s.id));
    await loadPageDetail(activePage.id);
  };

  const openEditSection = (section: any) => {
    setError('');
    setEditingSectionId(section.id);
    setEditingTitle(section.title || '');
    setEditingType(section.type || 'text');
    setEditingLocale(section.locale || 'mn');
    const cj = section.contentJson;
    setEditingJson(typeof cj === 'string' ? cj : JSON.stringify(cj ?? {}, null, 2));
  };

  const saveEditSection = async () => {
    setError('');
    const parsed = tryParseJson(editingJson.trim() || '{}');
    if (!parsed.ok) {
      setError(`contentJson: ${parsed.message}`);
      return;
    }
    await updatePageSectionAdmin(editingSectionId, {
      title: editingTitle,
      type: editingType,
      locale: editingLocale,
      contentJson: editingJson.trim() || '{}',
    });
    setEditingSectionId('');
    await loadPageDetail(activePage.id);
    setMessage('Section шинэчлэгдлээ.');
  };

  if (loading) return <p className={styles.loadingText}>Уншиж байна...</p>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Section Builder</h1>
          <p className={styles.pageSubtitle}>
            Slug нь public хуудастай таарах ёстой: <strong>{PUBLIC_SLUG_HINTS.join(', ')}</strong>. Сайт дээр харагдахын тулд page{' '}
            <strong>PUBLISHED</strong> байх ёстой.
          </p>
        </div>
      </div>

      {message ? <div className={styles.successState}>{message}</div> : null}
      {error ? <div className={styles.errorState}>{error}</div> : null}

      <div className={styles.formCard} style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Шинэ page</h3>
        <div className="form-group">
          <label>Slug</label>
          <input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="services эсвэл news" />
        </div>
        <button type="button" className="btn" onClick={createPage}>
          Үүсгэх
        </button>
      </div>

      <div className={styles.formCard} style={{ marginBottom: '1.25rem' }}>
        <div className="form-group">
          <label>Page сонгох</label>
          <select value={activePageId} onChange={(e) => setActivePageId(e.target.value)}>
            <option value="">-- Сонгох --</option>
            {pages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.slug} ({p.status})
              </option>
            ))}
          </select>
        </div>
        {activePage ? (
          <button type="button" className="btn btn-secondary" onClick={togglePagePublish}>
            Publish / Draft солих (одоо: {activePage.status})
          </button>
        ) : null}
      </div>

      {activePage ? (
        <>
          <div className={styles.formCard} style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>Хуудсын гарчиг &amp; SEO</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
              Slug: <code>{activePage.slug}</code> — өөрчлөхийн тулд шинэ page үүсгэнэ.
            </p>
            <div className="form-group">
              <label>Гарчиг (title)</label>
              <input value={pageTitleEd} onChange={(e) => setPageTitleEd(e.target.value)} />
            </div>
            <div className="form-group">
              <label>SEO title</label>
              <input value={pageSeoTitleEd} onChange={(e) => setPageSeoTitleEd(e.target.value)} />
            </div>
            <div className="form-group">
              <label>SEO description</label>
              <textarea rows={2} value={pageSeoDescEd} onChange={(e) => setPageSeoDescEd(e.target.value)} />
            </div>
            <button type="button" className="btn" onClick={savePageMeta}>
              Хуудсын мэдээлэл хадгалах
            </button>
          </div>

          <div className={styles.formCard} style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>Section нэмэх</h3>
            <div className="form-group">
              <label>Type</label>
              <select value={newSectionType} onChange={(e) => setNewSectionType(e.target.value)}>
                <option value="text">text</option>
                <option value="hero">hero</option>
                <option value="list">list</option>
                <option value="cards">cards</option>
                <option value="gallery">gallery</option>
                <option value="timeline">timeline</option>
              </select>
            </div>
            <div className="form-group">
              <label>Locale</label>
              <select value={newSectionLocale} onChange={(e) => setNewSectionLocale(e.target.value)}>
                <option value="mn">mn</option>
                <option value="en">en</option>
              </select>
            </div>
            <div className="form-group">
              <label>Title</label>
              <input value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>contentJson</label>
              <textarea rows={6} value={newSectionJson} onChange={(e) => setNewSectionJson(e.target.value)} />
            </div>
            <button type="button" className="btn btn-secondary" onClick={applyTemplate} style={{ marginRight: '0.5rem' }}>
              Template
            </button>
            <button type="button" className="btn btn-secondary" onClick={formatNewJson} style={{ marginRight: '0.5rem' }}>
              JSON format
            </button>
            <button type="button" className="btn" onClick={addSection}>
              Section нэмэх
            </button>
          </div>

          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th>Order</th>
                  <th>Type</th>
                  <th>Locale</th>
                  <th>Title</th>
                  <th>Visible</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(activePage.sections || []).map((section: any, idx: number) => (
                  <tr key={section.id} className={styles.tableRow}>
                    <td>{idx + 1}</td>
                    <td>{section.type}</td>
                    <td>{section.locale || 'mn'}</td>
                    <td>{section.title || '-'}</td>
                    <td>{section.isVisible ? 'Yes' : 'No'}</td>
                    <td className={styles.tableActions}>
                      <button type="button" className="btn btn-secondary" onClick={() => moveSection(idx, -1)}>
                        Up
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => moveSection(idx, 1)}>
                        Down
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={async () => {
                          await togglePageSectionVisibilityAdmin(section.id, !section.isVisible);
                          await loadPageDetail(activePage.id);
                        }}
                      >
                        {section.isVisible ? 'Hide' : 'Show'}
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => openEditSection(section)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={async () => {
                          await deletePageSectionAdmin(section.id);
                          await loadPageDetail(activePage.id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {editingSectionId ? (
            <div className={styles.formCard} style={{ marginTop: '1.25rem' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>Section засах</h3>
              <div className="form-group">
                <label>Type</label>
                <select value={editingType} onChange={(e) => setEditingType(e.target.value)}>
                  <option value="text">text</option>
                  <option value="hero">hero</option>
                  <option value="list">list</option>
                  <option value="cards">cards</option>
                  <option value="gallery">gallery</option>
                  <option value="timeline">timeline</option>
                </select>
              </div>
              <div className="form-group">
                <label>Locale</label>
                <select value={editingLocale} onChange={(e) => setEditingLocale(e.target.value)}>
                  <option value="mn">mn</option>
                  <option value="en">en</option>
                </select>
              </div>
              <div className="form-group">
                <label>Title</label>
                <input value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label>contentJson</label>
                <textarea rows={10} value={editingJson} onChange={(e) => setEditingJson(e.target.value)} />
              </div>
              <button type="button" className="btn btn-secondary" onClick={formatEditingJson} style={{ marginRight: '0.5rem' }}>
                JSON format
              </button>
              <button type="button" className="btn" onClick={saveEditSection}>
                Хадгалах
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ marginLeft: '0.5rem' }}
                onClick={() => setEditingSectionId('')}
              >
                Болих
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
