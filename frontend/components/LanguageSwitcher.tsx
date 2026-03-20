'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';

type Region = 'Asia Pacific' | 'Global / International';
type LanguageItem = { code: Language; label: string; country: string; region: Region; flagCode: string };

const languages: LanguageItem[] = [
  { code: 'mn', country: 'Монгол Улс', label: 'Монгол', region: 'Asia Pacific', flagCode: 'mn' },
  { code: 'en', country: 'United States', label: 'English', region: 'Global / International', flagCode: 'us' },
  { code: 'zh', country: '中国大陆', label: '中文', region: 'Asia Pacific', flagCode: 'cn' },
  { code: 'ja', country: '日本', label: '日本語', region: 'Asia Pacific', flagCode: 'jp' },
  { code: 'ko', country: '대한민국', label: '한국어', region: 'Asia Pacific', flagCode: 'kr' },
  { code: 'ru', country: 'Россия', label: 'Русский', region: 'Global / International', flagCode: 'ru' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  let closeTimeout: NodeJS.Timeout;

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setIsOpen(false);
    // Refresh Next.js server components so they pick up the new cookie if needed
    router.refresh();
  };

  const handleMouseEnter = () => {
    clearTimeout(closeTimeout);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Add a slight delay before closing to prevent accidental closes when moving mouse
    closeTimeout = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  // Close dropdown when clicking outside (fallback for mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(closeTimeout);
    };
  }, []);

  return (
    <div
      style={{ position: 'relative' }}
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0.5rem 0.8rem',
          background: isOpen ? 'rgba(255,255,255,0.08)' : 'transparent',
          border: '1px solid rgba(255,255,255,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          fontSize: '0.95rem',
          borderRadius: '30px',
          color: 'inherit'
        }}
        className={`language-switcher-btn ${isOpen ? 'active' : ''}`}
        aria-label="Select Language"
        title={currentLang.country}
      >
        <div style={{ width: '22px', height: '16px', borderRadius: '3px', overflow: 'hidden', display: 'flex', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
          <img
            src={`https://flagcdn.com/w40/${currentLang.flagCode}.png`}
            alt={currentLang.country}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{currentLang.code}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            opacity: 0.8
          }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 0.8rem)',
              right: 0,
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '0.6rem',
              minWidth: '220px',
              boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15), 0 0 20px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(0,0,0,0.05)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
              // Use pseudo element for tooltip arrow
            }}
          >
            {/* Tooltip triangle */}
            <div style={{
              position: 'absolute',
              top: '-6px',
              right: '30px',
              width: '12px',
              height: '12px',
              backgroundColor: '#fff',
              transform: 'rotate(45deg)',
              boxShadow: '-2px -2px 3px rgba(0,0,0,0.02)',
              zIndex: -1
            }} />

            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  width: '100%',
                  padding: '0.7rem 0.8rem',
                  border: 'none',
                  background: language === lang.code ? '#fff4eb' : 'transparent',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  color: language === lang.code ? 'var(--primary-orange)' : '#444',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (language !== lang.code) {
                    e.currentTarget.style.backgroundColor = '#f7f7f7';
                    e.currentTarget.style.color = '#111';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (language !== lang.code) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#444';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <div style={{
                  width: '26px',
                  height: '18px',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  flexShrink: 0
                }}>
                  <img
                    src={`https://flagcdn.com/w40/${lang.flagCode}.png`}
                    alt={lang.country}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: language === lang.code ? 700 : 500, lineHeight: 1.2 }}>
                    {lang.label}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: language === lang.code ? '#fb923c' : '#888', lineHeight: 1 }}>
                    {lang.country}
                  </span>
                </div>

                {language === lang.code && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{ marginLeft: 'auto' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-orange)' }}>
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </motion.div>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
