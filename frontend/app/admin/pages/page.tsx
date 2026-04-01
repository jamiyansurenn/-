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

export default function AdminPagesBuilderPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [activePageId, setActivePageId] = useState('');
  const [activePage, setActivePage] = useState<any>(null);
  const [newSlug, setNewSlug] = useState('');
  const [newSectionType, setNewSectionType] = useState('text');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionJson, setNewSectionJson] = useState('{}');
  const [editingSectionId, setEditingSectionId] = useState('');
  const [editingJson, setEditingJson] = useState('{}');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadPages = async () => {
    const res = await getPagesAdmin();
    const list = Array.isArray(res?.data) ? res.data : [];
    setPages(list);
    if (!activePageId && list.length > 0) setActivePageId(list[0].id);
  };

  const loadPageDetail = async (pageId: string) => {
    if (!pageId) return;
    const res = await getPageAdmin(pageId);
    setActivePage(res?.data || null);
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
    await createPageAdmin({ slug: newSlug.trim(), title: newSlug.trim(), status: 'DRAFT' });
    setNewSlug('');
    await loadPages();
    setMessage('Page үүслээ.');
  };

  const addSection = async () => {
    if (!activePageId) return;
    await createPageSectionAdmin({
      pageId: activePageId,
      type: newSectionType,
      title: newSectionTitle || newSectionType,
      locale: 'mn',
      contentJson: newSectionJson || '{}',
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

  const togglePagePublish = async () => {
    if (!activePage) return;
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

  if (loading) return <p className={styles.loadingText}>Уншиж байна...</p>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Section Builder</h1>
          <p className={styles.pageSubtitle}>Page + Section CMS удирдлага (CRUD, reorder, visibility, publish)</p>
        </div>
      </div>

      {message ? <div className={styles.successState}>{message}</div> : null}

      <div className={styles.formCard} style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Шинэ page</h3>
        <div className="form-group">
          <label>Slug</label>
          <input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="construction" />
        </div>
        <button className="btn" onClick={createPage}>Үүсгэх</button>
      </div>

      <div className={styles.formCard} style={{ marginBottom: '1.25rem' }}>
        <div className="form-group">
          <label>Page сонгох</label>
          <select value={activePageId} onChange={(e) => setActivePageId(e.target.value)}>
            <option value="">-- Сонгох --</option>
            {pages.map((p) => <option key={p.id} value={p.id}>{p.slug} ({p.status})</option>)}
          </select>
        </div>
        {activePage ? <button className="btn btn-secondary" onClick={togglePagePublish}>Publish/Draft солих</button> : null}
      </div>

      {activePage ? (
        <>
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
            <div className="form-group"><label>Title</label><input value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} /></div>
            <div className="form-group"><label>contentJson</label><textarea rows={5} value={newSectionJson} onChange={(e) => setNewSectionJson(e.target.value)} /></div>
            <button className="btn btn-secondary" onClick={applyTemplate} style={{ marginRight: '0.5rem' }}>Template</button>
            <button className="btn" onClick={addSection}>Section нэмэх</button>
          </div>

          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr><th>Order</th><th>Type</th><th>Title</th><th>Visible</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {(activePage.sections || []).map((section: any, idx: number) => (
                  <tr key={section.id} className={styles.tableRow}>
                    <td>{idx + 1}</td>
                    <td>{section.type}</td>
                    <td>{section.title || '-'}</td>
                    <td>{section.isVisible ? 'Yes' : 'No'}</td>
                    <td className={styles.tableActions}>
                      <button className="btn btn-secondary" onClick={() => moveSection(idx, -1)}>Up</button>
                      <button className="btn btn-secondary" onClick={() => moveSection(idx, 1)}>Down</button>
                      <button className="btn btn-secondary" onClick={async () => {
                        await togglePageSectionVisibilityAdmin(section.id, !section.isVisible);
                        await loadPageDetail(activePage.id);
                      }}>{section.isVisible ? 'Hide' : 'Show'}</button>
                      <button className="btn btn-secondary" onClick={() => {
                        setEditingSectionId(section.id);
                        setEditingJson(section.contentJson || '{}');
                      }}>Edit</button>
                      <button className="btn btn-secondary" onClick={async () => {
                        await deletePageSectionAdmin(section.id);
                        await loadPageDetail(activePage.id);
                      }}>Delete</button>
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
                <label>contentJson</label>
                <textarea rows={8} value={editingJson} onChange={(e) => setEditingJson(e.target.value)} />
              </div>
              <button
                className="btn"
                onClick={async () => {
                  await updatePageSectionAdmin(editingSectionId, { contentJson: editingJson });
                  setEditingSectionId('');
                  setEditingJson('{}');
                  await loadPageDetail(activePage.id);
                  setMessage('Section шинэчлэгдлээ.');
                }}
              >
                Хадгалах
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
