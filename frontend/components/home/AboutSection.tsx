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
                        <p className={styles.aboutText}>
                            {companyInfo.data.aboutUs || t.home.about.description}
                        </p>
                    </AnimateOnScroll>
                    {companyInfo.data.vision && (
                        <AnimateOnScroll delay={200}>
                            <div className={styles.visionSection}>
                                <h3>Алсын хараа</h3>
                                <p>{companyInfo.data.vision}</p>
                            </div>
                        </AnimateOnScroll>
                    )}
                    {companyInfo.data.mission && (
                        <AnimateOnScroll delay={300}>
                            <div>
                                <h3>Зорилго</h3>
                                <p>{companyInfo.data.mission}</p>
                            </div>
                        </AnimateOnScroll>
                    )}
                </div>
            </div>
        </section>
    );
}
