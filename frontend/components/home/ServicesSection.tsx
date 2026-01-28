'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';
import styles from '@/app/home.module.css';

interface ServicesSectionProps {
    services: any[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
    const { t } = useLanguage();

    if (!services || services.length === 0) return null;

    return (
        <section className={styles.servicesSection}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">{t.home.services.title}</h2>
                </motion.div>

                <div className="grid">
                    {services.slice(0, 3).map((service: any, index: number) => {
                        const imageUrl = getImageUrl(service.image, 'service', index);
                        return (
                            <motion.div
                                key={service.id}
                                className="card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ y: -10 }}
                            >
                                <div className={styles.cardImageWrapper}>
                                    <Image
                                        src={imageUrl}
                                        alt={service.title}
                                        fill
                                        className={styles.cardImage}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{service.title}</h3>
                                    <p className={styles.cardDescription}>{service.description}</p>
                                    <Link href={`/services/${service.slug}`} className="btn">
                                        {t.common.readMore}
                                    </Link>
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
                    <Link href="/services" className="btn btn-secondary">
                        {t.common.viewAll}
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
