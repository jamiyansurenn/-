'use client';

import { useEffect, useState } from 'react';
import { getServices, deleteService } from '@/lib/admin-api';
import Link from 'next/link';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await getServices();
      setServices(response.data);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return;
    try {
      await deleteService(id);
      loadServices();
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
        <h1>Үйлчилгээнүүд</h1>
        <Link href="/admin/services/new" className="btn">
          Шинэ үйлчилгээ
        </Link>
      </div>
      <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Гарчиг</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Slug</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Статус</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Үйлдлүүд</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: '1rem' }}>{service.title}</td>
                <td style={{ padding: '1rem' }}>{service.slug}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', background: service.status === 'PUBLISHED' ? '#d4edda' : '#fff3cd', color: service.status === 'PUBLISHED' ? '#155724' : '#856404' }}>
                    {service.status === 'PUBLISHED' ? 'Нийтлэгдсэн' : 'Ноорог'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <Link href={`/admin/services/${service.id}`} className="btn" style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                    Засах
                  </Link>
                  <button onClick={() => handleDelete(service.id)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                    Устгах
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {services.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            Үйлчилгээ олдсонгүй
          </div>
        )}
      </div>
    </div>
  );
}
