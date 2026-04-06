'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';
import Logo from '@/components/Logo';

export type LogoLoaderProps = {
  className?: string;
  /** Full viewport; use for route-level loading */
  fullBleed?: boolean;
  /** Reserve height when embedded to avoid CLS */
  minHeightClassName?: string;
  /** Approximate logo display width (px); height follows aspect */
  logoWidth?: number;
  /** Fires once when the intro motion sequence finishes (~0.9s) */
  onIntroComplete?: () => void;
};

const FADE = 0.3;
const BREATHE = 0.9;

/**
 * Branded intro-style loader: company logo with subtle fade + scale + soft amber glow.
 * No spinner; calm easeOut motion (~0.9s), not a looping wait state.
 */
export default function LogoLoader({
  className = '',
  fullBleed = true,
  minHeightClassName = 'min-h-[100dvh]',
  logoWidth = 128,
  onIntroComplete,
}: LogoLoaderProps) {
  const reduceMotion = useReducedMotion();
  const completeRef = useRef(false);

  const fireComplete = useCallback(() => {
    if (completeRef.current) return;
    completeRef.current = true;
    onIntroComplete?.();
  }, [onIntroComplete]);

  const shell = `${fullBleed ? `flex ${minHeightClassName} w-full` : 'flex min-h-[280px] w-full'} flex-col items-center justify-center bg-[#f8f8f8] px-8 ${className}`;

  useEffect(() => {
    if (!reduceMotion || !onIntroComplete) return;
    fireComplete();
  }, [reduceMotion, onIntroComplete, fireComplete]);

  if (reduceMotion) {
    return (
      <div className={shell} role="status" aria-live="polite" aria-busy="true">
        <Logo
          width={logoWidth}
          height={logoWidth}
          priority
          className="max-h-[min(32vw,9rem)] w-auto object-contain"
        />
      </div>
    );
  }

  return (
    <div className={shell} role="status" aria-live="polite" aria-busy="true">
      <div className="relative flex items-center justify-center" style={{ width: logoWidth * 2.4, height: logoWidth * 2.4 }}>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute rounded-full bg-gradient-to-br from-amber-400/35 via-brand-orange/25 to-amber-500/20 blur-3xl"
          style={{ width: logoWidth * 2, height: logoWidth * 2 }}
          initial={{ opacity: 0.4, scale: 0.88 }}
          animate={{
            opacity: [0.4, 0.65, 0.45],
            scale: [0.88, 1.08, 1],
          }}
          transition={{
            duration: BREATHE,
            ease: 'easeOut',
            times: [0, 0.5, 1],
          }}
        />
        <motion.div
          className="relative z-[1] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: FADE, ease: 'easeOut' }}
        >
          <motion.div
            className="flex items-center justify-center"
            initial={{ scale: 0.96 }}
            animate={{ scale: [0.96, 1.05, 1] }}
            transition={{ duration: BREATHE, ease: 'easeOut', times: [0, 0.5, 1] }}
            style={{
              filter: 'drop-shadow(0 6px 28px rgba(232, 93, 4, 0.2))',
            }}
            onAnimationComplete={fireComplete}
          >
            <Logo
              width={logoWidth}
              height={logoWidth}
              priority
              className="w-[min(32vw,8rem)] max-w-[min(32vw,8rem)] object-contain sm:w-[min(28vw,9rem)] sm:max-w-[min(28vw,9rem)]"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
