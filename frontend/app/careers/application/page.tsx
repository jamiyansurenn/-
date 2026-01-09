'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { createContactMessage } from '@/lib/api';

export default function ApplicationPage() {
  const [formData, setFormData] = useState({
    position: '',
    surname: '',
    fatherName: '',
    name: '',
    photo: null as File | null,
    regNumber: '',
    age: '',
    gender: '',
    birthDate: '',
    birthPlace: '',
    address: '',
    phone: '',
    email: '',
    workYears: '0',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    // Education
    education1: {
      school: '',
      location: '',
      major: '',
      startDate: '',
      endDate: '',
      gpa: '',
      diploma: '',
    },
    // Work experience
    currentWork: '',
    work1: {
      company: '',
      business: '',
      position: '',
      startDate: '',
      endDate: '',
      salary: '',
      managerName: '',
      managerPosition: '',
      managerPhone: '',
    },
    // Skills
    skills: '',
    computerSkills: '',
    languages: '',
    // Personal
    familySize: '3',
    familyInfo: '',
    strengths: '',
    weaknesses: '',
    hobbies: '',
    health: '',
    hasLicense: '',
    licenseType: '',
    hasCar: '',
    carType: '',
    canRest: '',
    restReason: '',
    availableDate: '',
    workDuration: '',
    expectedSalary: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof typeof formData];
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (typeof value === 'object' && value !== null) {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, String(value || ''));
        }
      });

      // Send as contact message with application data
      await createContactMessage({
        name: `${formData.surname} ${formData.name}`,
        email: formData.email,
        phone: formData.phone,
        subject: `Ажлын анкет - ${formData.position}`,
        message: JSON.stringify(formData, null, 2),
      });

      setSubmitStatus('success');
      // Reset form
      setFormData({
        position: '',
        surname: '',
        fatherName: '',
        name: '',
        photo: null,
        regNumber: '',
        age: '',
        gender: '',
        birthDate: '',
        birthPlace: '',
        address: '',
        phone: '',
        email: '',
        workYears: '0',
        emergencyName: '',
        emergencyPhone: '',
        emergencyRelation: '',
        education1: {
          school: '',
          location: '',
          major: '',
          startDate: '',
          endDate: '',
          gpa: '',
          diploma: '',
        },
        currentWork: '',
        work1: {
          company: '',
          business: '',
          position: '',
          startDate: '',
          endDate: '',
          salary: '',
          managerName: '',
          managerPosition: '',
          managerPhone: '',
        },
        skills: '',
        computerSkills: '',
        languages: '',
        familySize: '3',
        familyInfo: '',
        strengths: '',
        weaknesses: '',
        hobbies: '',
        health: '',
        hasLicense: '',
        licenseType: '',
        hasCar: '',
        carType: '',
        canRest: '',
        restReason: '',
        availableDate: '',
        workDuration: '',
        expectedSalary: '',
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="container">
            <AnimateOnScroll>
              <h1>МОНКОН ГРУПП ХХК-ИЙН АНКЕТ</h1>
              <p>Ажлын анкет бөглөх</p>
            </AnimateOnScroll>
          </div>
        </section>

        <section style={{ padding: '4rem 0', background: '#fafafa' }}>
          <div className="container">
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <AnimateOnScroll>
                <div style={{
                  background: '#fff3e0',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  marginBottom: '2rem',
                  border: '1px solid var(--primary-orange)',
                }}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--primary-orange)' }}>Санамж</h3>
                  <ul style={{ lineHeight: '1.8', color: 'var(--text-gray)', paddingLeft: '1.5rem' }}>
                    <li>"Монкон Групп" ХХК нь анкет хүлээн авснаар ажилд орохыг хүсэгчийн өмнө ямар нэгэн хариуцлага хүлээхгүй.</li>
                    <li>Анкет өгснөөр заавал ярилцлагад орохгүй бөгөөд эхний удаад анкетнаас ярилцлагагүй сонгон шалгаруулж дараагийн шатанд тэнцсэн хүмүүсийг ярилцлагад дуудах болохыг анхаарна уу.</li>
                    <li>Анкетийг зөвхөн өөрийн биеэр үнэн зөв бөглөх бөгөөд бүх асуултанд товч тодорхой үг товчлохгүй хариулахыг хүсэе.</li>
                    <li>Анкетанд бүрдүүлэх материалын жагсаалтанд орсон бичиг баримтыг заавал хавсаргах шаардлагатай.</li>
                    <li>Анкетанд хавсаргасан бичиг баримтыг буцаан олгохгүй.</li>
                    <li>Цээж зургийн заавал оруулсан байна.</li>
                  </ul>
                </div>
              </AnimateOnScroll>

              <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2rem', borderRadius: '12px' }}>
                {/* Position */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Албан тушаал <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    placeholder="Таны сонирхож буй албан тушаал"
                  />
                </div>

                {/* Basic Info */}
                <h2 style={{ marginBottom: '1rem', color: 'var(--primary-orange)' }}>НЭГ. ЕРӨНХИЙ МЭДЭЭЛЭЛ</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      Ургийн овог <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      Эцэг/эхийн нэр <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      Өөрийн нэр <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      Цээж зураг <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="file"
                      name="photo"
                      onChange={handleFileChange}
                      accept="image/*"
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      Регистерийн дугаар <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="regNumber"
                      value={formData.regNumber}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      Нас <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      Хүйс <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                      <option value="">Сонгох</option>
                      <option value="male">Эрэгтэй</option>
                      <option value="female">Эмэгтэй</option>
                      <option value="other">Бусад</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      Төрсөн огноо <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      Төрсөн газар <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="birthPlace"
                      value={formData.birthPlace}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Оршин суугаа хаяг <span style={{ color: 'red' }}>*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={2}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    placeholder="Аймаг/Хот, Сум/Дүүрэг, Баг/Хороо, Хороолол/Гудамж, Байр/Хашаа, Тоот"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      Гар утасны дугаар <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      И-мэйл хаяг <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  {submitStatus === 'success' && (
                    <div style={{ padding: '1rem', background: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '1rem' }}>
                      Анкет амжилттай илгээгдлээ!
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div style={{ padding: '1rem', background: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>
                      Алдаа гарлаа. Дахин оролдоно уу.
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn"
                    style={{ minWidth: '200px', fontSize: '1.1rem', padding: '1rem 2rem' }}
                  >
                    {submitting ? 'Илгээж байна...' : 'ИЛГЭЭХ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
