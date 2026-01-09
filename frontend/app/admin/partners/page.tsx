'use client';

import { useEffect, useState } from 'react';
import { getPartners, deletePartner } from '@/lib/admin-api';
import Link from 'next/link';

export default function PartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const response = await getPartners();
      setPartners(response.data);
    } catch (error) {
      console.error('Failed to load partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return;
    try {
      await deletePartner(id);
      loadPartners();
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
        <h1>Хамтрагчид</h1>
        <Link href="/admin/partners/new" className="btn">
          Шинэ хамтрагч
        </Link>
      </div>
      <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Нэр</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Вебсайт</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Статус</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Үйлдлүүд</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: '1rem' }}>{partner.name}</td>
                <td style={{ padding: '1rem' }}>{partner.website || '-'}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', background: partner.status === 'PUBLISHED' ? '#d4edda' : '#fff3cd', color: partner.status === 'PUBLISHED' ? '#155724' : '#856404' }}>
                    {partner.status === 'PUBLISHED' ? 'Нийтлэгдсэн' : 'Ноорог'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <Link href={`/admin/partners/${partner.id}`} className="btn" style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                    Засах
                  </Link>
                  <button onClick={() => handleDelete(partner.id)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                    Устгах
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {partners.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            Хамтрагч олдсонгүй
          </div>
        )}
      </div>
    </div>
  );
}
