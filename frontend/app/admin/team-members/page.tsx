'use client';

import { useEffect, useState } from 'react';
import { getTeamMembers, deleteTeamMember, updateTeamMember } from '@/lib/admin-api';
import Link from 'next/link';
import styles from '../admin.module.css';

function normalizeMembers(input: unknown): any[] {
  const list = Array.isArray(input) ? input : [];
  const byId = new Map<string, any>();
  for (const item of list) {
    const id = item?.id;
    if (typeof id !== 'string' || !id) continue;
    // If backend accidentally returns duplicates, keep the latest occurrence.
    byId.set(id, item);
  }
  const out = Array.from(byId.values());
  out.sort((a, b) => {
    const ao = typeof a?.order === 'number' ? a.order : 0;
    const bo = typeof b?.order === 'number' ? b.order : 0;
    if (ao !== bo) return ao - bo;
    const an = typeof a?.name === 'string' ? a.name : '';
    const bn = typeof b?.name === 'string' ? b.name : '';
    return an.localeCompare(bn);
  });
  return out;
}

export default function TeamMembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await getTeamMembers();
      const list = response?.data;
      setMembers(normalizeMembers(list));
    } catch (error) {
      console.error('Failed to load team members:', error);
      setError('Багийн гишүүдийг уншихад алдаа гарлаа.');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return;
    try {
      await deleteTeamMember(id);
      loadMembers();
    } catch (error) {
      alert('Алдаа гарлаа');
    }
  };

  const handleSetStatus = async (id: string, status: 'PUBLISHED' | 'DRAFT') => {
    try {
      await updateTeamMember(id, { status });
      loadMembers();
    } catch {
      alert('Статус солиход алдаа гарлаа');
    }
  };

  if (loading) {
    return <div className={styles.loadingText}>Уншиж байна...</div>;
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Багийн гишүүд</h1>
        <Link href="/admin/team-members/new" className="btn">
          Шинэ гишүүн
        </Link>
      </div>
      {error && <div className={styles.errorState}>{error}</div>}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>Нэр</th>
              <th>Албан тушаал</th>
              <th>Статус</th>
              <th style={{ textAlign: 'right' }}>Үйлдлүүд</th>
            </tr>
          </thead>
          <tbody>
            {(members ?? []).map((member) => (
              <tr key={member.id} className={styles.tableRow}>
                <td>{member.name}</td>
                <td>{member.position}</td>
                <td>
                  <span className={`${styles.statusBadge} ${member.status === 'PUBLISHED' ? styles.statusPublished : styles.statusDraft}`}>
                    {member.status === 'PUBLISHED' ? 'Нийтлэгдсэн' : 'Ноорог'}
                  </span>
                </td>
                <td>
                  <div className={styles.tableActions}>
                    {member.status === 'DRAFT' ? (
                      <button
                        type="button"
                        onClick={() => handleSetStatus(member.id, 'PUBLISHED')}
                        className="btn"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                      >
                        Сайт дээр гаргах
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetStatus(member.id, 'DRAFT')}
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                      >
                        Ноороглох
                      </button>
                    )}
                    <Link href={`/admin/team-members/${member.id}`} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                      Засах
                    </Link>
                    <button onClick={() => handleDelete(member.id)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                      Устгах
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && !error && (
          <div className={styles.emptyState}>
            Гишүүн олдсонгүй
          </div>
        )}
      </div>
    </div>
  );
}
