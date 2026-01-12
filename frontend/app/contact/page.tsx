'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createContactMessage } from '@/lib/api';
import { getImageUrl } from '@/lib/imagePlaceholder';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await createContactMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main>
        <section className="hero" style={{ 
          position: 'relative', 
          overflow: 'hidden',
          backgroundImage: `url(${getImageUrl(undefined, 'default', 0)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            zIndex: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }}></div>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <h1>Холбоо барих</h1>
          </div>
        </section>

        <section>
          <div className="container">
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              {success && (
                <div style={{ background: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '4px', marginBottom: '2rem' }}>
                  Амжилттай илгээгдлээ. Бид удахгүй танд хариу өгөх болно.
                </div>
              )}
              {error && (
                <div style={{ background: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '4px', marginBottom: '2rem' }}>
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Нэр *</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Имэйл *</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Утас</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Гарчиг</label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Мессеж *</label>
                  <textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Илгээж байна...' : 'Илгээх'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
