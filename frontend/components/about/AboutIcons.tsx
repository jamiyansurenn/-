import type { ReactNode } from 'react';

type IconProps = { className?: string };

function SvgWrap({ children, className }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function AboutServiceGlyph({ index }: { index: number }) {
  const i = index % 6;
  switch (i) {
    case 0:
      return (
        <SvgWrap>
          <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
          <path d="M9 9v0M9 13v0M9 17v0" />
        </SvgWrap>
      );
    case 1:
      return (
        <SvgWrap>
          <path d="M12 2v20M9 10l3 3 3-3" />
          <path d="M5 22h14" />
        </SvgWrap>
      );
    case 2:
      return (
        <SvgWrap>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </SvgWrap>
      );
    case 3:
      return (
        <SvgWrap>
          <path d="M14.7 6.3a4 4 0 0 0-6 5.6L12 16l3.3-4.1a4 4 0 0 0-.6-5.6z" />
          <circle cx="12" cy="9" r="1.2" fill="currentColor" stroke="none" />
        </SvgWrap>
      );
    case 4:
      return (
        <SvgWrap>
          <path d="M4 16l4-6 4 4 4-8 4 10" />
          <path d="M4 20h16" />
        </SvgWrap>
      );
    default:
      return (
        <SvgWrap>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4l3 2" />
        </SvgWrap>
      );
  }
}

export function AboutHighlightGlyph({ variant }: { variant: 'vision' | 'mission' | 'values' }) {
  if (variant === 'vision') {
    return (
      <SvgWrap>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </SvgWrap>
    );
  }
  if (variant === 'mission') {
    return (
      <SvgWrap>
        <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
        <path d="M9 12l2 2 4-4" />
      </SvgWrap>
    );
  }
  return (
    <SvgWrap>
      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
    </SvgWrap>
  );
}
