'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Props = {
  src: string;
  alt: string;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

/**
 * DB-аас ирсэн зургийг л харуулна. 404 бол сток/Unsplash руу шилжихгүй.
 */
export default function TeamMemberAvatar({ src, alt }: Props) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const label = initialsFromName(alt);

  return (
    <div className="relative z-[1] mb-6 flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200/60 shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-inset ring-slate-900/[0.06] sm:mb-7 sm:h-40 sm:w-40">
      {!failed && src ? (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 160px, 176px"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-xl font-semibold text-slate-500" aria-hidden>
          {label}
        </span>
      )}
    </div>
  );
}
