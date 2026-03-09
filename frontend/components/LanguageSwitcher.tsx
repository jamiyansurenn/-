'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

type Region = 'Asia Pacific' | 'Global / International';
type LanguageItem = { code: Language; label: string; country: string; region: Region };

const languages: LanguageItem[] = [
  { code: 'mn', country: 'Монгол Улс', label: 'Монгол', region: 'Asia Pacific' },
  { code: 'zh', country: '中国大陆', label: '中文', region: 'Asia Pacific' },
  { code: 'ja', country: '日本', label: '日本語', region: 'Asia Pacific' },
  { code: 'ko', country: '대한민국', label: '한국어', region: 'Asia Pacific' },
  { code: 'ru', country: 'Россия', label: 'Русский', region: 'Global / International' },
  { code: 'en', country: 'United States', label: 'English', region: 'Global / International' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setIsOpen(false);
    // Refresh Next.js server components so they pick up the new cookie if needed
    router.refresh();
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Group languages by region
  const groupedLanguages = languages.reduce((acc, lang) => {
    if (!acc[lang.region]) acc[lang.region] = [];
    acc[lang.region].push(lang);
    return acc;
  }, {} as Record<Region, LanguageItem[]>);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: '0.6rem 1.2rem',
          background: 'transparent',
          border: '1px solid currentColor',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          transition: 'all 0.2s',
          fontSize: '1.1rem',
          fontWeight: 500,
          borderRadius: '30px',
        }}
        className="language-switcher-btn"
        aria-label="Select Language"
      >
        <svg fill="currentColor" viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path>
        </svg>
        <span>{currentLang.label}</span>
      </button>

      {mounted && typeof document !== 'undefined'
        ? createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(4px)',
                  zIndex: 999999,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '1rem',
                }}
                onClick={() => setIsOpen(false)}
              >
                <motion.div
                  onClick={(e) => e.stopPropagation()}
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '24px',
                    padding: '2.5rem',
                    width: '100%',
                    maxWidth: '800px',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Header with Close Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.6rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#111' }}>
                      Сонгох хэл / Select Language
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      style={{
                        background: '#f1f1f1',
                        border: 'none',
                        width: '40px',
                        height: '40px',
                        fontSize: '1.5rem',
                        lineHeight: '1',
                        cursor: 'pointer',
                        color: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        borderRadius: '50%',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e0e0e0';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f1f1f1';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      aria-label="Close"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Regions Grid */}
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2.5rem', boxSizing: 'border-box' }}>
                    {Object.entries(groupedLanguages).map(([region, langs]) => (
                      <div key={region} style={{ boxSizing: 'border-box' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.2rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.8rem', color: '#777', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          {region}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                          {langs.map((lang) => (
                            <div
                              key={lang.code}
                              onClick={() => handleLanguageChange(lang.code)}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                cursor: 'pointer',
                                padding: '1rem 1.2rem',
                                borderRadius: '12px',
                                border: language === lang.code ? '2px solid #F97316' : '2px solid #eaeaea',
                                backgroundColor: language === lang.code ? '#fffaf5' : '#fff',
                                boxShadow: language === lang.code ? '0 4px 12px rgba(249,115,22,0.1)' : 'none',
                                transition: 'all 0.2s',
                                boxSizing: 'border-box'
                              }}
                              onMouseEnter={(e) => {
                                if (language !== lang.code) {
                                  e.currentTarget.style.borderColor = '#ccc';
                                  e.currentTarget.style.backgroundColor = '#f9f9f9';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (language !== lang.code) {
                                  e.currentTarget.style.borderColor = '#eaeaea';
                                  e.currentTarget.style.backgroundColor = '#fff';
                                }
                              }}
                            >
                              <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#111' }}>{lang.country}</span>
                              <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#666', marginTop: '4px' }}>{lang.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )
        : null}
    </>
  );
}
