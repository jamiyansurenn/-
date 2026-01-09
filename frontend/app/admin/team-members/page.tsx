'use client';

import { useEffect, useState } from 'react';
import { getTeamMembers, deleteTeamMember } from '@/lib/admin-api';
import Link from 'next/link';

export default function TeamMembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await getTeamMembers();
      setMembers(response.data);
    } catch (error) {
      console.error('Failed to load team members:', error);
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

  if (loading) {
    return <div>Уншиж байна...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Багийн гишүүд</h1>
        <Link href="/admin/team-members/new" className="btn">
          Шинэ гишүүн
        </Link>
      </div>
      <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Нэр</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Албан тушаал</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Статус</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Үйлдлүүд</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: '1rem' }}>{member.name}</td>
                <td style={{ padding: '1rem' }}>{member.position}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', background: member.status === 'PUBLISHED' ? '#d4edda' : '#fff3cd', color: member.status === 'PUBLISHED' ? '#155724' : '#856404' }}>
                    {member.status === 'PUBLISHED' ? 'Нийтлэгдсэн' : 'Ноорог'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <Link href={`/admin/team-members/${member.id}`} className="btn" style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                    Засах
                  </Link>
                  <button onClick={() => handleDelete(member.id)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                    Устгах
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            Гишүүн олдсонгүй
          </div>
        )}
      </div>
    </div>
  );
}
