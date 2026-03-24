'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { createContactMessage } from '@/lib/api';
import { getImageUrl } from '@/lib/imagePlaceholder';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ApplicationPage() {
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const labels = isEn
    ? {
        fullName: 'Full name',
        parentName: 'Parent name',
        position: 'Position',
        regNumber: 'Registration number',
        age: 'Age',
        gender: 'Gender',
        birthDate: 'Birth date',
        birthPlace: 'Birth place',
        address: 'Residential address',
        phone: 'Phone',
        email: 'Email',
        workYears: 'Years of experience',
        education: 'Education',
        school: 'School',
        location: 'Location',
        major: 'Major',
        startDate: 'Start date',
        endDate: 'End date',
        diploma: 'Diploma',
        workExperience: 'Work experience',
        currentWork: 'Current work',
        company: 'Company / Organization',
        business: 'Business / Sector',
        salary: 'Salary',
        managerName: 'Manager name',
        managerPosition: 'Manager position',
        managerPhone: 'Manager phone',
        skills: 'Skills',
        computerSkills: 'Computer skills',
        languages: 'Languages',
        familySize: 'Family size',
        familyInfo: 'Family information',
        strengths: 'Strengths',
        weaknesses: 'Weaknesses',
        hobbies: 'Hobbies',
        health: 'Health',
        hasLicense: 'Has license',
        licenseType: 'License type',
        hasCar: 'Has car',
        carType: 'Car type',
        canRest: 'Can request leave',
        restReason: 'Reason for leave',
        availableDate: 'Available date',
        workDuration: 'Expected work duration',
        expectedSalary: 'Expected salary',
      }
    : {
        fullName: 'Нэр',
        parentName: 'Эцэг/эхийн нэр',
        position: 'Албан тушаал',
        regNumber: 'Регистерийн дугаар',
        age: 'Нас',
        gender: 'Хүйс',
        birthDate: 'Төрсөн огноо',
        birthPlace: 'Төрсөн газар',
        address: 'Оршин суугаа хаяг',
        phone: 'Утас',
        email: 'И-мэйл',
        workYears: 'Ажлын жил',
        education: 'Боловсрол',
        school: 'Сургууль',
        location: 'Байршил',
        major: 'Мэргэжил',
        startDate: 'Эхлэх огноо',
        endDate: 'Дуусах огноо',
        diploma: 'Диплом',
        workExperience: 'Ажил туршлага',
        currentWork: 'Одоогийн ажил',
        company: 'Компани/байгууллага',
        business: 'Бизнес/салбар',
        salary: 'Цалин',
        managerName: 'Менежерийн нэр',
        managerPosition: 'Менежерийн албан тушаал',
        managerPhone: 'Менежерийн утас',
        skills: 'Ур чадвар',
        computerSkills: 'Компьютерийн ур чадвар',
        languages: 'Хэл',
        familySize: 'Гэр бүлийн тоо',
        familyInfo: 'Гэр бүлийн мэдээлэл',
        strengths: 'Нэмэрлэлийн давуу тал',
        weaknesses: 'Сул тал',
        hobbies: 'Хобби',
        health: 'Эрүүл мэнд',
        hasLicense: 'Лиценз байна',
        licenseType: 'Лиценз төрөл',
        hasCar: 'Машин байна',
        carType: 'Машины төрөл',
        canRest: 'Амралт/чөлөө хүсэх боломж',
        restReason: 'Амрах шалтгаан',
        availableDate: 'Боломжтой огноо',
        workDuration: 'Ажлын үргэлжлэх хугацаа',
        expectedSalary: 'Хүлээлт цалин',
      };
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get('position');
    if (!p) return;
    setFormData((prev) => ({ ...prev, position: prev.position.trim() ? prev.position : decodeURIComponent(p) }));
  }, []);

  const pushIfValue = (lines: string[], label: string, value: any) => {
    if (value === null || value === undefined) return;
    const str = String(value).trim();
    if (!str) return;
    lines.push(`${label}: ${str}`);
  };

  const buildApplicationMessage = (data: typeof formData) => {
    const lines: string[] = [];

    const fullName = [data.surname, data.name].filter(Boolean).join(' ');
    if (fullName) lines.push(`${labels.fullName}: ${fullName}`);
    pushIfValue(lines, labels.parentName, data.fatherName);
    pushIfValue(lines, labels.position, data.position);

    pushIfValue(lines, labels.regNumber, data.regNumber);
    pushIfValue(lines, labels.age, data.age);
    pushIfValue(lines, labels.gender, data.gender);

    pushIfValue(lines, labels.birthDate, data.birthDate);
    pushIfValue(lines, labels.birthPlace, data.birthPlace);
    pushIfValue(lines, labels.address, data.address);

    pushIfValue(lines, labels.phone, data.phone);
    pushIfValue(lines, labels.email, data.email);

    pushIfValue(lines, labels.workYears, data.workYears);

    // Education
    const eduLines: string[] = [];
    pushIfValue(eduLines, labels.school, data.education1?.school);
    pushIfValue(eduLines, labels.location, data.education1?.location);
    pushIfValue(eduLines, labels.major, data.education1?.major);
    pushIfValue(eduLines, labels.startDate, data.education1?.startDate);
    pushIfValue(eduLines, labels.endDate, data.education1?.endDate);
    pushIfValue(eduLines, 'GPA', data.education1?.gpa);
    pushIfValue(eduLines, labels.diploma, data.education1?.diploma);
    if (eduLines.length) {
      lines.push(`--- ${labels.education} ---`);
      lines.push(...eduLines);
    }

    // Work experience (current/work1)
    const workLines: string[] = [];
    pushIfValue(workLines, labels.currentWork, data.currentWork);
    pushIfValue(workLines, labels.company, data.work1?.company);
    pushIfValue(workLines, labels.business, data.work1?.business);
    pushIfValue(workLines, labels.position, data.work1?.position);
    pushIfValue(workLines, labels.startDate, data.work1?.startDate);
    pushIfValue(workLines, labels.endDate, data.work1?.endDate);
    pushIfValue(workLines, labels.salary, data.work1?.salary);
    pushIfValue(workLines, labels.managerName, data.work1?.managerName);
    pushIfValue(workLines, labels.managerPosition, data.work1?.managerPosition);
    pushIfValue(workLines, labels.managerPhone, data.work1?.managerPhone);
    if (workLines.length) {
      lines.push(`--- ${labels.workExperience} ---`);
      lines.push(...workLines);
    }

    pushIfValue(lines, labels.skills, data.skills);
    pushIfValue(lines, labels.computerSkills, data.computerSkills);
    pushIfValue(lines, labels.languages, data.languages);

    pushIfValue(lines, labels.familySize, data.familySize);
    pushIfValue(lines, labels.familyInfo, data.familyInfo);

    pushIfValue(lines, labels.strengths, data.strengths);
    pushIfValue(lines, labels.weaknesses, data.weaknesses);
    pushIfValue(lines, labels.hobbies, data.hobbies);
    pushIfValue(lines, labels.health, data.health);

    pushIfValue(lines, labels.hasLicense, data.hasLicense);
    pushIfValue(lines, labels.licenseType, data.licenseType);
    pushIfValue(lines, labels.hasCar, data.hasCar);
    pushIfValue(lines, labels.carType, data.carType);

    pushIfValue(lines, labels.canRest, data.canRest);
    pushIfValue(lines, labels.restReason, data.restReason);
    pushIfValue(lines, labels.availableDate, data.availableDate);
    pushIfValue(lines, labels.workDuration, data.workDuration);
    pushIfValue(lines, labels.expectedSalary, data.expectedSalary);

    return lines.join('\n');
  };

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
        subject: `${isEn ? 'Job application' : 'Ажлын анкет'} - ${formData.position}`,
        // Admin дээр JSON бүхлээр нь харагдуулахгүй, зөвхөн хоосон биш талбаруудыг товч гаргана.
        message: buildApplicationMessage(formData),
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
        <section className="hero" style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `url(${getImageUrl(undefined, 'default', 3)})`,
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
            <AnimateOnScroll>
              <h1>{t.pages.application.title}</h1>
              <p>{t.pages.application.subtitle}</p>
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
                  <h3 style={{ marginBottom: '1rem', color: 'var(--primary-orange)' }}>{t.pages.application.notice}</h3>
                  <ul style={{ lineHeight: '1.8', color: 'var(--text-gray)', paddingLeft: '1.5rem' }}>
                    {isEn ? (
                      <>
                        <li>Submitting this form does not create any obligation for the company to hire the applicant.</li>
                        <li>Not all applicants are invited to interviews; shortlisted candidates will be contacted in the next stage.</li>
                        <li>Please fill in all questions truthfully and clearly.</li>
                        <li>All required supporting documents must be attached.</li>
                        <li>Submitted documents will not be returned.</li>
                        <li>Please attach a profile photo.</li>
                      </>
                    ) : (
                      <>
                        <li>"ДААЦЫН ЦАМХАГ ГРУПП" ХХК нь анкет хүлээн авснаар ажилд орохыг хүсэгчийн өмнө ямар нэгэн хариуцлага хүлээхгүй.</li>
                        <li>Анкет өгснөөр заавал ярилцлагад орохгүй бөгөөд эхний удаад анкетнаас ярилцлагагүй сонгон шалгаруулж дараагийн шатанд тэнцсэн хүмүүсийг ярилцлагад дуудах болохыг анхаарна уу.</li>
                        <li>Анкетийг зөвхөн өөрийн биеэр үнэн зөв бөглөх бөгөөд бүх асуултанд товч тодорхой үг товчлохгүй хариулахыг хүсэе.</li>
                        <li>Анкетанд бүрдүүлэх материалын жагсаалтанд орсон бичиг баримтыг заавал хавсаргах шаардлагатай.</li>
                        <li>Анкетанд хавсаргасан бичиг баримтыг буцаан олгохгүй.</li>
                        <li>Цээж зургийн заавал оруулсан байна.</li>
                      </>
                    )}
                  </ul>
                </div>
              </AnimateOnScroll>

              <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2rem', borderRadius: '12px' }}>
                {/* Position */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    {labels.position} <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    placeholder={isEn ? 'Desired position' : 'Таны сонирхож буй албан тушаал'}
                  />
                </div>

                {/* Basic Info */}
                <h2 style={{ marginBottom: '1rem', color: 'var(--primary-orange)' }}>
                  {isEn ? 'I. GENERAL INFORMATION' : 'НЭГ. ЕРӨНХИЙ МЭДЭЭЛЭЛ'}
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      {isEn ? 'Surname' : 'Ургийн овог'} <span style={{ color: 'red' }}>*</span>
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
                      {labels.parentName} <span style={{ color: 'red' }}>*</span>
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
                      {isEn ? 'Given name' : 'Өөрийн нэр'} <span style={{ color: 'red' }}>*</span>
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
                      {isEn ? 'Profile photo' : 'Цээж зураг'} <span style={{ color: 'red' }}>*</span>
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
                      {labels.regNumber} <span style={{ color: 'red' }}>*</span>
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
                      {labels.age} <span style={{ color: 'red' }}>*</span>
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
                      {labels.gender} <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                      <option value="">{isEn ? 'Select' : 'Сонгох'}</option>
                      <option value="male">{isEn ? 'Male' : 'Эрэгтэй'}</option>
                      <option value="female">{isEn ? 'Female' : 'Эмэгтэй'}</option>
                      <option value="other">{isEn ? 'Other' : 'Бусад'}</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      {labels.birthDate} <span style={{ color: 'red' }}>*</span>
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
                      {labels.birthPlace} <span style={{ color: 'red' }}>*</span>
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
                    {labels.address} <span style={{ color: 'red' }}>*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={2}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    placeholder={
                      isEn
                        ? 'Province/City, District, Khoroo, Street, Building/House, Apartment'
                        : 'Аймаг/Хот, Сум/Дүүрэг, Баг/Хороо, Хороолол/Гудамж, Байр/Хашаа, Тоот'
                    }
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      {isEn ? 'Mobile phone number' : 'Гар утасны дугаар'} <span style={{ color: 'red' }}>*</span>
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
                      {isEn ? 'Email address' : 'И-мэйл хаяг'} <span style={{ color: 'red' }}>*</span>
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
                      {t.pages.application.submitSuccess}
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div style={{ padding: '1rem', background: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>
                      {t.pages.application.submitError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn"
                    style={{ minWidth: '200px', fontSize: '1.1rem', padding: '1rem 2rem' }}
                  >
                    {submitting ? t.pages.application.submitting : t.common.submit}
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
