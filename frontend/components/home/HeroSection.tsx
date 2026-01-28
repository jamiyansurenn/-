'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getImageUrl } from '@/lib/imagePlaceholder';
import styles from '@/app/home.module.css';

export default function HeroSection() {
    const { t } = useLanguage();

    return (
        <section className={`hero ${styles.heroSection}`} style={{
            backgroundImage: `url(${getImageUrl(undefined, 'building', 0)})`,
        }}>
            <div className={styles.heroOverlay}></div>
            <div className={`container ${styles.heroContent}`}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        {t.home.hero.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        {t.home.hero.subtitle}
                    </motion.p>
                    <motion.h4
                        className={styles.heroSubtitle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.9 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        {t.pages.director.paragraph1}
                    </motion.h4>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        <Link href="/contact" className="btn">
                            {t.nav.contact}
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
