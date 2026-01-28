'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';
import styles from '@/app/home.module.css';

interface ProjectsSectionProps {
    projects: any[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
    const { t } = useLanguage();

    if (!projects || projects.length === 0) return null;

    return (
        <section>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">{t.home.projects.title}</h2>
                </motion.div>

                <div className="grid">
                    {projects.slice(0, 3).map((project: any, index: number) => {
                        const imageUrl = getImageUrl(project.image, 'building', index);
                        return (
                            <motion.div
                                key={project.id}
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
                                        alt={project.title}
                                        fill
                                        className={styles.cardImage}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{project.title}</h3>
                                    <p className={styles.cardDescription}>{project.description}</p>
                                    <Link href={`/projects/${project.slug}`} className="btn">
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
                    <Link href="/projects" className="btn btn-secondary">
                        {t.common.viewAll}
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
