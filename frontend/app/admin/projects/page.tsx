'use client';

import { useEffect, useState } from 'react';
import { getProjects, deleteProject } from '@/lib/admin-api';
import Link from 'next/link';
import styles from '../admin.module.css';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setError('Төслүүдийг уншихад алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return;
    try {
      await deleteProject(id);
      loadProjects();
    } catch (error) {
      alert('Алдаа гарлаа');
    }
  };

  if (loading) {
    return <div className={styles.loadingText}>Уншиж байна...</div>;
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Төслүүд</h1>
        <Link href="/admin/projects/new" className="btn">
          Шинэ төсөл
        </Link>
      </div>
      {error && <div className={styles.errorState}>{error}</div>}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>Гарчиг</th>
              <th>Slug</th>
              <th>Статус</th>
              <th style={{ textAlign: 'right' }}>Үйлдлүүд</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className={styles.tableRow}>
                <td>{project.title}</td>
                <td>{project.slug}</td>
                <td>
                  <span className={`${styles.statusBadge} ${project.status === 'PUBLISHED' ? styles.statusPublished : styles.statusDraft}`}>
                    {project.status === 'PUBLISHED' ? 'Нийтлэгдсэн' : 'Ноорог'}
                  </span>
                </td>
                <td>
                  <div className={styles.tableActions}>
                    <Link href={`/admin/projects/${project.id}`} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                      Засах
                    </Link>
                    <button onClick={() => handleDelete(project.id)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                      Устгах
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && !error && (
          <div className={styles.emptyState}>
            Төсөл олдсонгүй
          </div>
        )}
      </div>
    </div>
  );
}
