'use client';

import { useState, useRef, useEffect, useCallback, useId } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const OPEN_DELAY_MS = 100;
const CLOSE_DELAY_MS = 240;

interface DropdownItem {
  labelKey: string;
  href: string;
}

interface DropdownMenuProps {
  labelKey: string;
  items: DropdownItem[];
  href?: string;
  /** From Header (single usePathname) — avoids nested navigation hooks under Suspense/Turbo SSR. */
  pathname: string;
}

export default function DropdownMenu({ labelKey, items, href, pathname }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t } = useLanguage();
  const menuId = useId();

  const clearOpenTimer = useCallback(() => {
    if (openTimerRef.current != null) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current != null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      closeTimerRef.current = null;
    }, CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  const closeImmediately = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    setIsOpen(false);
  }, [clearOpenTimer, clearCloseTimer]);

  const handlePointerEnter = useCallback(() => {
    clearCloseTimer();
    clearOpenTimer();
    if (isOpen) return;
    openTimerRef.current = setTimeout(() => {
      setIsOpen(true);
      openTimerRef.current = null;
    }, OPEN_DELAY_MS);
  }, [clearCloseTimer, clearOpenTimer, isOpen]);

  const handlePointerLeave = useCallback(() => {
    clearOpenTimer();
    scheduleClose();
  }, [clearOpenTimer, scheduleClose]);

  /** Keyboard / focus: open without delay; close only when focus leaves the whole control. */
  const handleTriggerFocus = useCallback(() => {
    clearCloseTimer();
    clearOpenTimer();
    setIsOpen(true);
  }, [clearCloseTimer, clearOpenTimer]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeImmediately();
      }
    },
    [closeImmediately]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, handleClickOutside]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeImmediately();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeImmediately]);

  useEffect(() => {
    return () => {
      if (openTimerRef.current != null) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current != null) clearTimeout(closeTimerRef.current);
    };
  }, []);

  /** Blur does not bubble; focusout does — keeps menu open while tabbing trigger → links. */
  useEffect(() => {
    const root = dropdownRef.current;
    if (!root) return;
    const onFocusOut = (e: FocusEvent) => {
      const next = e.relatedTarget as Node | null;
      if (next && root.contains(next)) return;
      clearOpenTimer();
      scheduleClose();
    };
    root.addEventListener('focusout', onFocusOut);
    return () => root.removeEventListener('focusout', onFocusOut);
  }, [clearOpenTimer, scheduleClose]);

  const isActive = items.some((item) => pathname === item.href) || pathname === href;
  const label = (t.nav as any)[labelKey] || labelKey;

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      clearCloseTimer();
      clearOpenTimer();
      setIsOpen((o) => !o);
    }
    if (e.key === 'ArrowDown' && !isOpen) {
      e.preventDefault();
      clearCloseTimer();
      clearOpenTimer();
      setIsOpen(true);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="dropdown-menu-root"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`nav-dropdown-trigger ${isActive ? 'active' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={menuId}
        id={`${menuId}-trigger`}
        onFocus={handleTriggerFocus}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{label}</span>
        <svg
          className={`dropdown-chevron ${isOpen ? 'open' : ''}`}
          viewBox="0 0 10 10"
          fill="currentColor"
          aria-hidden
        >
          <path d="M5 7L1 3h8z" />
        </svg>
      </button>
      {isOpen ? (
        <div className="dropdown-menu-flyout" id={menuId} role="menu" aria-labelledby={`${menuId}-trigger`}>
          <div className="dropdown-menu-panel">
            {items.map((item) => {
              const itemLabel = (t.nav as any)[item.labelKey] || item.labelKey;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  className={`dropdown-menu-link${active ? ' active' : ''}`}
                  onClick={() => closeImmediately()}
                >
                  {itemLabel}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
