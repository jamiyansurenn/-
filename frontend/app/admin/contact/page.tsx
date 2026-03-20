'use client';

import { useEffect, useState } from 'react';
import { getContactMessages, markContactAsRead, deleteContactMessage } from '@/lib/admin-api';
import styles from '../admin.module.css';

export default function ContactPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await getContactMessages();
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setError('Мессежүүдийг уншихад алдаа гарлаа.');
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
    return <div className={styles.loadingText}>Уншиж байна...</div>;
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Холбоо барих мессежүүд</h1>
      </div>
      {error && <div className={styles.errorState}>{error}</div>}
      <div className={styles.tableCard}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.messageCard} ${message.read ? '' : styles.messageUnread}`}
          >
            <div className={styles.messageMeta}>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>{message.name}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{message.email}</p>
                {message.phone && <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{message.phone}</p>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                  {new Date(message.createdAt).toLocaleString('mn-MN')}
                </p>
                {!message.read && (
                  <span className={`${styles.statusBadge} ${styles.statusDraft}`} style={{ marginTop: '0.5rem' }}>
                    Шинэ
                  </span>
                )}
              </div>
            </div>
            {message.subject && (
              <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#334155' }}>
                Гарчиг: {message.subject}
              </p>
            )}
            <p style={{ marginBottom: '1rem', whiteSpace: 'pre-line' }}>{message.message}</p>
            <div className={styles.messageActions}>
              {!message.read && (
                <button onClick={() => handleMarkAsRead(message.id)} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                  Уншсан гэж тэмдэглэх
                </button>
              )}
              <button onClick={() => handleDelete(message.id)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                Устгах
              </button>
            </div>
          </div>
        ))}
        {messages.length === 0 && !error && (
          <div className={styles.emptyState}>
            Мессеж олдсонгүй
          </div>
        )}
      </div>
    </div>
  );
}
