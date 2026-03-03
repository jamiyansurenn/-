'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '@/app/home.module.css';
import { getImageUrl } from '@/lib/imagePlaceholder';

const heroImages = [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', // Modern glass building
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop', // Apartment building
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop', // Interior / Home
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop', // Real estate
];

export default function HeroSection() {
    const { t } = useLanguage();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <section className={`hero ${styles.heroSection}`}>
            <AnimatePresence>
                <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url('${heroImages[currentImageIndex]}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: -2,
                    }}
                />
            </AnimatePresence>
            <div className={styles.heroOverlay}></div>
            <div className={`container ${styles.heroContent}`}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ maxWidth: '800px', margin: '0 auto' }}
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        style={{
                            textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                            color: '#ffffff',
                            fontWeight: '800',
                            fontSize: '3.5rem',
                            marginBottom: '1.5rem',
                        }}
                    >
                        {t.home.hero.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        style={{
                            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                            color: '#f8f9fa',
                            fontWeight: '500',
                            fontSize: '1.4rem',
                            marginBottom: '2rem',
                        }}
                    >
                        {t.home.hero.subtitle}
                    </motion.p>
                    <motion.h4
                        className={styles.heroSubtitle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        style={{
                            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                            color: '#e9ecef',
                            lineHeight: '1.6',
                            fontWeight: '400',
                            fontSize: '1.1rem',
                            marginBottom: '3rem',
                        }}
                    >
                        {t.pages.director.paragraph1}
                    </motion.h4>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        <Link href="/contact" className="btn" style={{
                            boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
                            padding: '1rem 2rem',
                            fontSize: '1.1rem'
                        }}>
                            {t.nav.contact}
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
