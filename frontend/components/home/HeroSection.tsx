'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import styles from '@/app/home.module.css';
import { getHeroSettingsPublic } from '@/lib/admin-api';
import { STOCK_HERO_BACKGROUNDS } from '@/lib/stockConstructionImages';
import { getApiBaseUrl } from '@/lib/apiBase';

const SLIDE_INTERVAL_MS = 7000;
const apiBase = getApiBaseUrl();

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
    /** Increments when slide index changes; first value keeps initial={false} for instant readable hero. */
    const heroSlideEnterGen = useRef(0);
    const heroPrevIndex = useRef(activeIndex);
    if (heroPrevIndex.current !== activeIndex) {
        heroSlideEnterGen.current += 1;
        heroPrevIndex.current = activeIndex;
    }

    const slides = useMemo(() => {
        const list = t.home.heroSlides ?? [];
        return list.map((s: any) => ({
            title: s.title,
            subtitle: s.subtitle,
            description: '',
            supportLine: s.supportLine,
            cta: {
                label: s.ctaLabel,
                href: typeof s.ctaHref === 'string' && s.ctaHref ? s.ctaHref : '/contact',
            },
            ctaHref: s.ctaHref,
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
        if (typeof document === 'undefined') return;
        const list = resolvedSlides;
        if (!list.length) return;
        const idx = activeIndex % list.length;
        const cur = list[idx];
        const stockPrimary = STOCK_HERO_BACKGROUNDS[idx % STOCK_HERO_BACKGROUNDS.length];
        const adminB = resolveHeroMediaUrl(heroSettings?.backgrounds?.[idx]);
        const slideCustomB = resolveHeroMediaUrl(cur?.image);
        const url = slideCustomB || adminB || stockPrimary;
        if (!url) return;
        const id = 'hero-lcp-preload';
        let link = document.getElementById(id) as HTMLLinkElement | null;
        if (!link) {
            link = document.createElement('link');
            link.id = id;
            link.rel = 'preload';
            link.as = 'image';
            document.head.appendChild(link);
        }
        link.href = url;
    }, [activeIndex, heroSettings, slides]);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % resolvedSlides.length);
        }, SLIDE_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [isPaused, resolvedSlides.length]);

    const currentSlide = resolvedSlides[activeIndex % resolvedSlides.length];
    const heroMeta = (t as any).home?.hero ?? {};
    const supportHeadline =
        (typeof currentSlide?.supportLine === 'string' && currentSlide.supportLine.trim()) ||
        (typeof heroMeta.defaultSupport === 'string' && heroMeta.defaultSupport.trim()) ||
        '';
    const brandEyebrow =
        (typeof heroMeta.brandEyebrow === 'string' && heroMeta.brandEyebrow.trim()) ||
        (t as any).home?.hero?.subtitle ||
        '';

    const goToSlide = (index: number) => {
        setActiveIndex(index);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + resolvedSlides.length) % resolvedSlides.length);
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % resolvedSlides.length);
    };

    const slideIdx = activeIndex % Math.max(resolvedSlides.length, 1);
    const stockPrimary = STOCK_HERO_BACKGROUNDS[slideIdx % STOCK_HERO_BACKGROUNDS.length];
    const stockSecondary = STOCK_HERO_BACKGROUNDS[(slideIdx + 1) % STOCK_HERO_BACKGROUNDS.length];
    const adminBg = resolveHeroMediaUrl(heroSettings?.backgrounds?.[slideIdx]);
    const slideCustomBg = resolveHeroMediaUrl(currentSlide?.image);
    const activeBackground = slideCustomBg
        ? { local: slideCustomBg, fallback: stockPrimary }
        : {
              local: adminBg || stockPrimary,
              fallback: stockSecondary,
          };
    const heroFallbackImage = `url('${activeBackground.local}'), url('${activeBackground.fallback}')`;
    const posterUrl = activeBackground.fallback;
    /** Still image–first hero for a calmer, lighter composition (video adds visual noise). */
    const showHeroVideo = false;
    const overlayUrl = resolveHeroMediaUrl(currentSlide?.overlayImage);
    const quickStats = [
        { value: '14+', label: t.common.heroStats.years },
        { value: '50+', label: t.common.heroStats.partners },
        { value: '100+', label: t.common.heroStats.projects },
    ];

    return (
        <section
            className={`hero hero-home ${styles.heroSection} ${reduceMotion ? styles.heroReducedMotion : ''}`}
        >
            <div className={styles.heroMedia}>
                <div
                    className={styles.heroImageFallback}
                    style={{ backgroundImage: heroFallbackImage }}
                    aria-hidden="true"
                />
                {showHeroVideo ? (
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={posterUrl}
                        className={styles.heroVideo}
                    >
                        <source src="https://cdn.pixabay.com/video/2021/08/29/86716-595085449_large.mp4" type="video/mp4" />
                        <source src="https://assets.mixkit.co/videos/preview/mixkit-modern-city-skyscrapers-in-the-business-district-1442-large.mp4" type="video/mp4" />
                    </video>
                ) : null}
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
                        initial={
                            reduceMotion
                                ? false
                                : heroSlideEnterGen.current === 0
                                  ? false
                                  : { opacity: 0.92, y: 4 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                        transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {brandEyebrow ? <span className={styles.heroEyebrow}>{brandEyebrow}</span> : null}
                        <h1 className={styles.heroTitle}>{currentSlide.title}</h1>
                        {supportHeadline ? <p className={styles.heroDescription}>{supportHeadline}</p> : null}
                        {(currentSlide.description || '').trim() ? (
                            <p className={styles.heroDescriptionSecondary}>{currentSlide.description}</p>
                        ) : null}
                        <div className={styles.heroCtas}>
                            <Link
                                href={currentSlide.cta?.href || currentSlide.ctaHref || '/contact'}
                                className="btn btn-lg btn-hero-primary"
                            >
                                {currentSlide.cta?.label ||
                                    currentSlide.ctaLabel ||
                                    (t.common as any).ctaConsultation ||
                                    t.nav.contact}
                            </Link>
                            <Link href="/projects" className="btn btn-lg btn-hero-outline">
                                {(t.common as any).ctaExploreProjects || t.common.viewAll}
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
