import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { getTranslations } from '@/lib/getLanguage';
import Image from 'next/image';
import styles from '../director.module.css';

export default async function DirectorPage() {
  const t = await getTranslations();
  const td = t.pages.director as typeof t.pages.director & {
    roleLine?: string;
    heroEyebrow?: string;
  };

  const directorImage = '/images/director-portrait.png';
  const heroImage = '/images/director-portrait.png';

  const paragraphs = [
    td.paragraph1,
    td.paragraph2,
    td.paragraph3,
    td.paragraph4,
  ].filter((text: string) => text && text.trim() !== '');

  return (
    <>
      <Header />
      <main>
        <section
          className={`hero ${styles.hero}`}
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className={styles.heroOverlay} />
          <div className="container">
            <div className={styles.heroInner}>
              <AnimateOnScroll>
                <p className={styles.heroEyebrow}>{td.heroEyebrow ?? td.title}</p>
                <h1 className={styles.heroTitle}>{td.title}</h1>
                <p className={styles.heroSubtitle}>{td.subtitle}</p>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className="container">
            <div className={styles.grid}>
              <AnimateOnScroll delay={100}>
                <div className={styles.photoCard}>
                  <Image
                    src={directorImage}
                    alt={`${td.signature} — ${td.roleLine ?? ''}`}
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center 18%' }}
                    priority
                    sizes="(max-width: 768px) 100vw, 42vw"
                  />
                  <div className={styles.photoCaption}>
                    <p className={styles.photoName}>{td.signature}</p>
                    <p className={styles.photoRole}>{td.roleLine ?? td.closing}</p>
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={300}>
                <div className={styles.messageCard}>
                  <div className={styles.quoteAccent} aria-hidden />
                  <h2 className={styles.greeting}>{td.greeting}</h2>
                  <div className={styles.body}>
                    {paragraphs.map((text: string, index: number) => (
                      <p key={index}>{text}</p>
                    ))}
                  </div>
                  <div className={styles.signoff}>
                    <p className={styles.signoffClosing}>{td.closing}</p>
                    <p className={styles.signoffName}>{td.signature}</p>
                    {td.roleLine ? <p className={styles.signoffRole}>{td.roleLine}</p> : null}
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
