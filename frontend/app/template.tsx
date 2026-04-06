'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Subtle content fade after each navigation so handoff from LogoLoader feels soft, not a hard cut.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0.94 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-0 w-full"
    >
      {children}
    </motion.div>
  );
}
