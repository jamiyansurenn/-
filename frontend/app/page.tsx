import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { getCompanyInfo, getServices, getProjects, getNews } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';
import styles from './home.module.css';

// Force dynamic rendering to prevent build-time static generation errors
// This ensures pages render at request time, not build time
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Debug: Log API URL (server-side only)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  if (process.env.NODE_ENV !== 'production') {
    console.log('[DEBUG] API URL:', apiUrl);
  }

  // Initialize with safe defaults - page will always render
  let companyInfo: { data: any } = { data: null };
  let services: { data: any[] } = { data: [] };
  let projects: { data: any[] } = { data: [] };
  let news: { data: any[] } = { data: [] };

  try {
    // Use Promise.allSettled to ensure all promises complete
    const results = await Promise.allSettled([
      getCompanyInfo().catch(() => ({ data: null })),
      getServices().catch(() => ({ data: [] })),
      getProjects(true).catch(() => ({ data: [] })),
      getNews(true, 3).catch(() => ({ data: [] })),
    ]);

    // Safely extract data from each result
    if (results[0].status === 'fulfilled') {
      companyInfo = results[0].value || { data: null };
    }
    if (results[1].status === 'fulfilled') {
      services = results[1].value || { data: [] };
    }
    if (results[2].status === 'fulfilled') {
      projects = results[2].value || { data: [] };
    }
    if (results[3].status === 'fulfilled') {
      news = results[3].value || { data: [] };
    }
  } catch (error) {
    // Final safety net - page will render with empty data
    // This should never happen due to Promise.allSettled, but just in case
  }

  return (
    <>
      <Header />
      <main>
        <section className={`hero ${styles.heroSection}`} style={{ 
          backgroundImage: `url(${getImageUrl(undefined, 'building', 0)})`,
        }}>
          <div className={styles.heroOverlay}></div>
          <div className={`container ${styles.heroContent}`}>
            <AnimateOnScroll>
              <h1>Тавтай морилно уу</h1>
              <p>Манай компанийн албан ёсны вэбсайтад тавтай морилно уу</p>
              <h4 className={styles.heroSubtitle}>
                Бид заслын шинэлэг шийдлийг төслүүддээ шингээж орчин үеийн технологийг нэвтруүлээд байна
              </h4>
              <Link href="/contact" className="btn">
                Холбоо барих
              </Link>
            </AnimateOnScroll>
          </div>
        </section>

        {companyInfo.data && (
          <section>
            <div className="container">
              <AnimateOnScroll>
                <h2 className="section-title">Бидний тухай</h2>
              </AnimateOnScroll>
              <div className={styles.aboutSectionWrapper}>
                <AnimateOnScroll delay={100}>
                  <p className={styles.aboutText}>
                    {(companyInfo.data as any)?.aboutUs || 'Бидний тухай мэдээлэл...'}
                  </p>
                </AnimateOnScroll>
                {(companyInfo.data as any)?.vision && (
                  <AnimateOnScroll delay={200}>
                    <div className={styles.visionSection}>
                      <h3>Алсын хараа</h3>
                      <p>{(companyInfo.data as any).vision}</p>
                    </div>
                  </AnimateOnScroll>
                )}
                {(companyInfo.data as any)?.mission && (
                  <AnimateOnScroll delay={300}>
                    <div>
                      <h3>Зорилго</h3>
                      <p>{(companyInfo.data as any).mission}</p>
                    </div>
                  </AnimateOnScroll>
                )}
              </div>
            </div>
          </section>
        )}

        {services.data && services.data.length > 0 && (
          <section className={styles.servicesSection}>
            <div className="container">
              <AnimateOnScroll>
                <h2 className="section-title">Үйлчилгээнүүд</h2>
              </AnimateOnScroll>
              <div className="grid">
                {services.data.slice(0, 3).map((service: any, index: number) => {
                  const imageUrl = getImageUrl(service.image, 'service', index);
                  return (
                  <AnimateOnScroll key={service.id} delay={index * 100}>
                    <div className="card">
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
                        Дэлгэрэнгүй
                      </Link>
                    </div>
                  </div>
                  </AnimateOnScroll>
                  );
                })}
              </div>
              <AnimateOnScroll delay={400}>
                <div className={styles.viewAllContainer}>
                  <Link href="/services" className="btn btn-secondary">
                    Бүх үйлчилгээ
                  </Link>
                </div>
              </AnimateOnScroll>
            </div>
          </section>
        )}

        {projects.data && projects.data.length > 0 && (
          <section>
            <div className="container">
              <AnimateOnScroll>
                <h2 className="section-title">Төслүүд</h2>
              </AnimateOnScroll>
              <div className="grid">
                {projects.data.slice(0, 3).map((project: any, index: number) => {
                  const imageUrl = getImageUrl(project.image, 'building', index);
                  return (
                  <AnimateOnScroll key={project.id} delay={index * 100}>
                    <div className="card">
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
                        Дэлгэрэнгүй
                      </Link>
                    </div>
                  </div>
                  </AnimateOnScroll>
                  );
                })}
              </div>
              <AnimateOnScroll delay={400}>
                <div className={styles.viewAllContainer}>
                  <Link href="/projects" className="btn btn-secondary">
                    Бүх төслүүд
                  </Link>
                </div>
              </AnimateOnScroll>
            </div>
          </section>
        )}

        {news.data && news.data.length > 0 && (
          <section className={styles.servicesSection}>
            <div className="container">
              <AnimateOnScroll>
                <h2 className="section-title">Сүүлийн мэдээ</h2>
              </AnimateOnScroll>
              <div className="grid">
                {news.data.map((item: any, index: number) => {
                  const imageUrl = getImageUrl(item.image, 'news', index);
                  return (
                  <AnimateOnScroll key={item.id} delay={index * 100}>
                    <div className="card">
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
                      <Link href={`/news/${item.slug}`} className="btn">
                        Унших
                      </Link>
                    </div>
                  </div>
                  </AnimateOnScroll>
                  );
                })}
              </div>
              <AnimateOnScroll delay={400}>
                <div className={styles.viewAllContainer}>
                  <Link href="/news" className="btn btn-secondary">
                    Бүх мэдээ
                  </Link>
                </div>
              </AnimateOnScroll>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
