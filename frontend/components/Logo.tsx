'use client';

import Image from 'next/image';
import { useState } from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function Logo({ width = 60, height = 60, className, priority = false }: LogoProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Fallback placeholder with better styling to match logo design
    return (
      <div 
        className={`logo-placeholder ${className || ''}`} 
        style={{ 
          width, 
          height,
          background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: width > 50 ? '24px' : '18px',
          boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)'
        }}
      >
        ДАЦ
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Image 
        src="/logo.png"
        alt="ДААЦЫН ЦАМХАГ Групп"
        width={width}
        height={height}
        className={className}
        priority={priority}
        style={{
          objectFit: 'contain',
          width: '100%',
          height: '100%'
        }}
        onError={() => {
          setHasError(true);
        }}
        onLoad={() => {
          // Image loaded successfully
        }}
        unoptimized={true}
      />
    </div>
  );
}
