import AnimateOnScroll from '@/components/AnimateOnScroll';
import styles from './corporate.module.css';

type PageHeroProps = {
  title: string;
  subtitle?: string;
  backgroundImage: string;
};

export default function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  return (
    <section
      className={styles.pageHero}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className={styles.heroOverlay} />
      <div className={`container ${styles.heroInner}`}>
        <AnimateOnScroll>
          <h1 className={styles.heroTitle}>{title}</h1>
          {subtitle ? <p className={styles.heroSubtitle}>{subtitle}</p> : null}
        </AnimateOnScroll>
      </div>
    </section>
  );
}
