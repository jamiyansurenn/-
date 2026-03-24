'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';
import styles from '@/app/home.module.css';

interface NewsSectionProps {
    news: any[];
}

function formatPublishedDate(value: string | null | undefined) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
}

export default function NewsSection({ news }: NewsSectionProps) {
    const { t } = useLanguage();

    if (!news || news.length === 0) {
        return (
            <section className={styles.newsSection}>
                <div className="container">
                    <h2 className="section-title">{t.pages.construction.latestNews}</h2>
                    <div className={styles.emptySectionCard}>
                        <p>{t.pages.construction.noNews}</p>
                        <Link href="/news" className="btn btn-secondary">
                            {t.nav.news}
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.newsSection}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">{t.pages.construction.latestNews}</h2>
                </motion.div>

                <div className={`grid ${styles.newsGrid}`}>
                    {news.map((item: any, index: number) => {
                        const imageUrl = getImageUrl(item.image, 'news', index);
                        return (
                            <motion.div
                                key={item.id}
                                className={`card ${styles.newsCard}`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ y: -4 }}
                            >
                                <div className={styles.cardImageWrapper}>
                                    <Image
                                        src={imageUrl}
                                        alt={item.title}
                                        fill
                                        className={styles.cardImage}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                    {item.excerpt && (
                                        <p className={styles.cardDescription}>{item.excerpt}</p>
                                    )}
                                    <div className={styles.cardFooter}>
                                        <span className={styles.cardDate}>
                                            {formatPublishedDate(item.publishedAt)}
                                        </span>
                                        <Link href={`/news/${item.slug}`} className="btn">
                                            {t.common.readMore}
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    className={styles.viewAllContainer}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    <Link href="/news" className="btn btn-secondary">
                        {t.common.viewAll}
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
