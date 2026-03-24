'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import styles from '@/app/home.module.css';
import { getHeroSettingsPublic } from '@/lib/admin-api';

const SLIDE_INTERVAL_MS = 7000;
const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');

function resolveHeroMediaUrl(url: string | undefined | null): string {
    if (!url) return '';
    const u = String(url).trim();
    if (!u) return '';
    if (u.startsWith('/uploads/')) return `${apiBase}${u}`;
    return u;
}

export default function HeroSection() {
    const { t } = useLanguage();
    const reduceMotion = useReducedMotion();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [heroSettings, setHeroSettings] = useState<any>(null);

    const slides = useMemo(() => {
        const list = t.home.heroSlides ?? [];
        return list.map((s) => ({
            title: s.title,
            subtitle: s.subtitle,
            description: '',
            cta: { label: s.ctaLabel, href: '/contact' },
        }));
    }, [t]);

    useEffect(() => {
        let alive = true;
        const load = async () => {
            try {
                const res = await getHeroSettingsPublic();
                if (!alive) return;
                setHeroSettings(res.data);
            } catch {
                // Keep fallback slides/backgrounds if endpoint fails.
            }
        };
        load();
        return () => {
            alive = false;
        };
    }, []);

    const resolvedSlides = (Array.isArray(heroSettings?.slides) && heroSettings.slides.length > 0 ? heroSettings.slides : slides) as any[];

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % resolvedSlides.length);
        }, SLIDE_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [isPaused, resolvedSlides.length]);

    const currentSlide = resolvedSlides[activeIndex % resolvedSlides.length];

    const goToSlide = (index: number) => {
        setActiveIndex(index);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + resolvedSlides.length) % resolvedSlides.length);
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % resolvedSlides.length);
    };

    const fallbackPairs = [
        {
            local: resolveHeroMediaUrl(heroSettings?.backgrounds?.[0]) || '/hero/hero-1.jpg',
            fallback: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=2070&auto=format&fit=crop',
        },
        {
            local: resolveHeroMediaUrl(heroSettings?.backgrounds?.[1]) || '/hero/hero-2.jpg',
            fallback: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070&auto=format&fit=crop',
        },
    ];
    const pooledBackground = fallbackPairs[activeIndex % fallbackPairs.length];
    const slideCustomBg = resolveHeroMediaUrl(currentSlide?.image);
    const activeBackground = slideCustomBg
        ? { local: slideCustomBg, fallback: pooledBackground.fallback }
        : pooledBackground;
    const heroFallbackImage = `url('${activeBackground.local}'), url('${activeBackground.fallback}')`;
    const posterUrl = activeBackground.fallback;
    const showHeroVideo = !slideCustomBg;
    const overlayUrl = resolveHeroMediaUrl(currentSlide?.overlayImage);
    const quickStats = [
        { value: '14+', label: t.common.heroStats.years },
        { value: '50+', label: t.common.heroStats.partners },
        { value: '100+', label: t.common.heroStats.projects },
    ];

    return (
        <section className={`hero ${styles.heroSection} ${reduceMotion ? styles.heroReducedMotion : ''}`}>
            <div className={styles.heroMedia}>
                <div
                    className={styles.heroImageFallback}
                    style={{ backgroundImage: heroFallbackImage }}
                    aria-hidden="true"
                />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={posterUrl}
                    className={styles.heroVideo}
                    style={showHeroVideo ? undefined : { opacity: 0, pointerEvents: 'none' }}
                >
                    <source src="https://cdn.pixabay.com/video/2021/08/29/86716-595085449_large.mp4" type="video/mp4" />
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-modern-city-skyscrapers-in-the-business-district-1442-large.mp4" type="video/mp4" />
                </video>
                <div className={styles.heroOverlay} />
                <div className={styles.heroAmbient} />
                <div className={styles.heroNoise} />
                {overlayUrl ? (
                    <img src={overlayUrl} alt="" className={styles.heroSlideOverlay} aria-hidden />
                ) : null}
            </div>

            <div className={`container ${styles.heroContent}`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        className={styles.heroSlide}
                        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                        animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                        transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <motion.span
                            className={styles.heroEyebrow}
                            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                            transition={{ duration: reduceMotion ? 0 : 0.3 }}
                        >
                            {currentSlide.subtitle}
                        </motion.span>
                        <h1 className={styles.heroTitle}>{currentSlide.title}</h1>
                        {(currentSlide.description || '').trim() ? (
                            <p className={styles.heroDescription}>{currentSlide.description}</p>
                        ) : null}
                        <div className={styles.heroCtas}>
                            <Link
                                href={currentSlide.cta?.href || currentSlide.ctaHref || '/contact'}
                                className="btn"
                            >
                                {currentSlide.cta?.label || currentSlide.ctaLabel || t.nav.contact}
                            </Link>
                            <Link href="/projects" className="btn btn-secondary">
                                {t.common.viewAll}
                            </Link>
                        </div>

                        <div className={styles.heroStats}>
                            {quickStats.map((stat) => (
                                <div key={stat.label} className={styles.heroStatCard}>
                                    <strong>{stat.value}</strong>
                                    <span>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div
                    className={styles.heroControls}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <button type="button" className={styles.heroNavButton} onClick={handlePrev} aria-label={t.common.a11y.prevSlide}>
                        ‹
                    </button>
                    <div className={styles.heroDots}>
                        {resolvedSlides.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`${styles.heroDot} ${index === activeIndex ? styles.heroDotActive : ''}`}
                                onClick={() => goToSlide(index)}
                                aria-label={t.common.a11y.slideDot.replace('{n}', String(index + 1))}
                            />
                        ))}
                    </div>
                    <button type="button" className={styles.heroNavButton} onClick={handleNext} aria-label={t.common.a11y.nextSlide}>
                        ›
                    </button>
                </div>
            </div>
        </section>
    );
}
