'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/i18n';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'mn', label: 'Монгол', flag: '🇲🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setIsOpen(false);
    // Refresh Next.js server components so they pick up the new cookie
    router.refresh();
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, handleClickOutside]);

  return (
    <div
      ref={dropdownRef}
      style={{ position: 'relative' }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0.5rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          fontSize: '1.5rem',
          borderRadius: '50%',
        }}
        className="language-switcher"
        aria-label="Select Language"
      >
        <span>{currentLang.flag}</span>
      </button>
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            right: '50%',
            transform: 'translateX(50%)',
            background: '#fff',
            display: 'flex',
            flexDirection: 'row',
            gap: '0.5rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            borderRadius: '30px',
            padding: '0.25rem 0.5rem',
            zIndex: 1000,
            border: '1px solid #eee',
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              title={lang.label}
              style={{
                width: '40px',
                height: '40px',
                padding: '0',
                background: language === lang.code ? '#fff5f0' : 'transparent',
                border: language === lang.code ? '1px solid var(--primary-orange)' : '1px solid transparent',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                opacity: language === lang.code ? 1 : 0.6,
              }}
              onMouseEnter={(e) => {
                if (language !== lang.code) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
              onMouseLeave={(e) => {
                if (language !== lang.code) {
                  e.currentTarget.style.opacity = '0.6';
                }
              }}
            >
              <span>{lang.flag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
