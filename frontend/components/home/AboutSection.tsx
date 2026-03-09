'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import AnimateOnScroll from '../AnimateOnScroll';
import styles from '@/app/home.module.css';

interface AboutSectionProps {
    companyInfo: any;
}

export default function AboutSection({ companyInfo }: AboutSectionProps) {
    const { t } = useLanguage();

    if (!companyInfo?.data) return null;

    return (
        <section>
            <div className="container">
                <AnimateOnScroll>
                    <h2 className="section-title">{t.home.about.title}</h2>
                </AnimateOnScroll>
                <div className={styles.aboutSectionWrapper}>
                    <AnimateOnScroll delay={100}>
                        <p className={styles.aboutText} style={{ whiteSpace: 'pre-line' }}>
                            {t.home.about.aboutUs}
                        </p>
                    </AnimateOnScroll>
                    <AnimateOnScroll delay={200}>
                        <div className={styles.visionSection}>
                            <h3>{t.home.about.visionTitle}</h3>
                            <p>{t.home.about.vision}</p>
                        </div>
                    </AnimateOnScroll>
                    <AnimateOnScroll delay={300}>
                        <div>
                            <h3>{t.home.about.missionTitle}</h3>
                            <p>{t.home.about.mission}</p>
                        </div>
                    </AnimateOnScroll>
                </div>
            </div>
        </section>
    );
}
