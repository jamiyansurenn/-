'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

interface DropdownItem {
  labelKey: string;
  href: string;
}

interface DropdownMenuProps {
  labelKey: string;
  items: DropdownItem[];
  href?: string;
}

export default function DropdownMenu({ labelKey, items, href }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { t } = useLanguage();

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

  const isActive = items.some(item => pathname === item.href) || pathname === href;

  const handleMouseEnter = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsOpen(false);
  }, []);

  const label = (t.nav as any)[labelKey] || labelKey;

  return (
    <div 
      ref={dropdownRef} 
      style={{ position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          padding: '0.5rem 0',
          color: isActive ? 'var(--primary-orange)' : 'var(--text-dark)',
          fontWeight: isActive ? '600' : '500',
          transition: 'color 0.2s',
          userSelect: 'none',
        }}
      >
        <span>{label}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="currentColor"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <path d="M5 7L1 3h8z" />
        </svg>
      </div>
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            background: '#fff',
            minWidth: '220px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            borderRadius: '6px',
            padding: '0.5rem 0',
            zIndex: 1000,
            border: '1px solid #eee',
          }}
        >
          {items.map((item, index) => {
            const itemLabel = (t.nav as any)[item.labelKey] || item.labelKey;
            return (
              <Link
                key={index}
                href={item.href}
                style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: pathname === item.href ? 'var(--primary-orange)' : 'var(--text-dark)',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontWeight: pathname === item.href ? '600' : '400',
                  backgroundColor: pathname === item.href ? '#fff5f0' : 'transparent',
                }}
                onClick={() => setIsOpen(false)}
                onMouseEnter={(e) => {
                  if (pathname !== item.href) {
                    e.currentTarget.style.backgroundColor = '#f9f9f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== item.href) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {itemLabel}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
