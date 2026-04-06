'use client';

import { motion, useReducedMotion } from 'framer-motion';

export type PremiumLoaderProps = {
  /**
   * Optional caption. Pass `null` for a quieter full-page state (perceived faster).
   * @default "Уншиж байна..."
   */
  label?: string | null;
  className?: string;
  /** Minimum height to reserve space and reduce layout shift */
  minHeightClassName?: string;
  /** Full-viewport centered shell (e.g. route loading) */
  fullBleed?: boolean;
};

/** Calm loop: soft pulse + stagger; stays under “premium, not flashy”. */
const SPARKLE_LOOP = 1.35;
const STAGGER = 0.12;
const AMBIENT = 2.4;

/**
 * Premium brand loading: warm amber/orange glow, no spinner.
 * Tailwind utilities + Framer Motion; respects reduced motion.
 */
export default function PremiumLoader({
  label = 'Уншиж байна...',
  className = '',
  minHeightClassName = 'min-h-[min(48vh,380px)]',
  fullBleed = false,
}: PremiumLoaderProps) {
  const reduceMotion = useReducedMotion();

  const shell = fullBleed
    ? `flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[#f7f4f0] px-8 py-20 ${className}`
    : `flex w-full flex-col items-center justify-center px-8 py-14 ${minHeightClassName} ${className}`;

  return (
    <div className={shell} role="status" aria-live="polite" aria-busy="true">
      <motion.div
        className="relative flex flex-col items-center justify-center"
        animate={
          reduceMotion
            ? undefined
            : {
                opacity: [0.88, 1, 0.88],
                scale: [1, 1.02, 1],
              }
        }
        transition={{
          duration: AMBIENT,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="flex items-end justify-center gap-5 sm:gap-7" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="relative h-3 w-3 sm:h-3.5 sm:w-3.5"
              initial={false}
              animate={
                reduceMotion
                  ? { opacity: 0.88, scale: 1, y: 0 }
                  : {
                      scale: [1, 1.14, 1],
                      opacity: [0.44, 1, 0.44],
                      y: [0, -5, 0],
                    }
              }
              transition={{
                duration: SPARKLE_LOOP,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * STAGGER,
              }}
            >
              <span className="absolute inset-0 rotate-45 rounded-[3px] bg-gradient-to-br from-amber-200 via-brand-orange to-amber-400 shadow-glow-orange" />
              <span className="absolute -inset-2 rotate-45 rounded-md bg-amber-300/15 blur-lg" />
            </motion.span>
          ))}
        </div>
      </motion.div>
      {label != null && label !== '' ? (
        <p className="mt-9 text-center text-[10px] font-semibold uppercase tracking-[0.26em] text-amber-900/45">
          {label}
        </p>
      ) : null}
    </div>
  );
}
