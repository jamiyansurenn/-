'use client';

import { useEffect, useState } from 'react';
import { getContactMessages, markContactAsRead, deleteContactMessage } from '@/lib/admin-api';

export default function ContactPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await getContactMessages();
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markContactAsRead(id);
      loadMessages();
    } catch (error) {
      alert('Алдаа гарлаа');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return;
    try {
      await deleteContactMessage(id);
      loadMessages();
    } catch (error) {
      alert('Алдаа гарлаа');
    }
  };

  if (loading) {
    return <div>Уншиж байна...</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Холбоо барих мессежүүд</h1>
      <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              padding: '1.5rem',
              borderBottom: '1px solid #eee',
              background: message.read ? '#fff' : '#f8f9fa',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>{message.name}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>{message.email}</p>
                {message.phone && <p style={{ color: '#666', fontSize: '0.9rem' }}>{message.phone}</p>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.9rem', color: '#999' }}>
                  {new Date(message.createdAt).toLocaleString('mn-MN')}
                </p>
                {!message.read && (
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: '#0070f3', color: '#fff', borderRadius: '4px', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Шинэ
                  </span>
                )}
              </div>
            </div>
            {message.subject && (
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Гарчиг: {message.subject}</p>
            )}
            <p style={{ marginBottom: '1rem', whiteSpace: 'pre-line' }}>{message.message}</p>
            <div>
              {!message.read && (
                <button onClick={() => handleMarkAsRead(message.id)} className="btn" style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                  Уншсан гэж тэмдэглэх
                </button>
              )}
              <button onClick={() => handleDelete(message.id)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                Устгах
              </button>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            Мессеж олдсонгүй
          </div>
        )}
      </div>
    </div>
  );
}
