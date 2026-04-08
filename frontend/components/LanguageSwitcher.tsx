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

const bubbleEase = [0.45, 0.05, 0.55, 0.95] as const;

export default function LanguageSwitcher() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  let closeTimeout: NodeJS.Timeout;

  const currentLang = languages.find((lang) => lang.code === language) || languages[0];

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setIsOpen(false);
    router.refresh();
  };

  const handleMouseEnter = () => {
    clearTimeout(closeTimeout);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setIsOpen(false);
    }, 90);
  };

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
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`language-switcher-btn ${isOpen ? 'active' : ''}`}
        aria-label="Select Language"
        aria-expanded={isOpen}
        title={currentLang.country}
      >
        <div className="language-switcher-flag">
          <img
            src={`https://flagcdn.com/w40/${currentLang.flagCode}.png`}
            alt=""
            width={22}
            height={16}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
        <span>{currentLang.code}</span>
        <svg
          className={`language-switcher-chevron ${isOpen ? 'language-switcher-chevron--open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="language-switcher-panel"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.26, ease: bubbleEase }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 0.75rem)',
              right: 0,
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '0.5rem',
              minWidth: '228px',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-6px',
                right: '30px',
                width: '12px',
                height: '12px',
                backgroundColor: '#fff',
                transform: 'rotate(45deg)',
                boxShadow: '-2px -2px 4px rgba(232, 93, 4, 0.06)',
                zIndex: -1,
              }}
              aria-hidden
            />

            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                className={`language-switcher-option${language === lang.code ? ' language-switcher-option--current' : ''}`}
              >
                <div className="language-switcher-option-flag">
                  <img
                    src={`https://flagcdn.com/w40/${lang.flagCode}.png`}
                    alt=""
                    width={26}
                    height={18}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>

                <div className="language-switcher-option-text">
                  <span className="language-switcher-option-label">{lang.label}</span>
                  <span className="language-switcher-option-sub">{lang.country}</span>
                </div>

                {language === lang.code && (
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                    style={{ marginLeft: 'auto' }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: 'var(--primary-orange)' }}
                      aria-hidden
                    >
                      <polyline points="20 6 9 17 4 12" />
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
