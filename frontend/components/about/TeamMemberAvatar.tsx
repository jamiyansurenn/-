'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { getPlaceholderImage } from '@/lib/imagePlaceholder';

type Props = {
  src: string;
  alt: string;
  index: number;
};

/**
 * Зургийн 404 / алдаа гарвал сток руу шилжинэ (нэр зургийн оройд давхцах визуал алдагдана).
 */
export default function TeamMemberAvatar({ src, alt, index }: Props) {
  const [current, setCurrent] = useState(src);
  const onError = useCallback(() => {
    setCurrent(getPlaceholderImage('team', index));
  }, [index]);

  return (
    <div className="relative z-[1] mb-6 h-36 w-36 shrink-0 overflow-hidden rounded-full bg-slate-200/60 shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-inset ring-slate-900/[0.06] sm:mb-7 sm:h-40 sm:w-40">
      <Image
        src={current}
        alt={alt}
        fill
        className="object-cover object-center"
        sizes="(max-width: 768px) 160px, 176px"
        onError={onError}
      />
    </div>
  );
}
