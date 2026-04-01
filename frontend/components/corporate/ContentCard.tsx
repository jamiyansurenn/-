import Image from 'next/image';
import styles from './corporate.module.css';

type ContentCardProps = {
  title: string;
  description?: string;
  image?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
};

export default function ContentCard({ title, description, image, children, action }: ContentCardProps) {
  return (
    <article className={styles.card}>
      {image ? (
        <div className={styles.cardMedia}>
          <Image src={image} alt={title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      ) : null}
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{title}</h3>
        {description ? <p className={styles.cardText}>{description}</p> : null}
        {children}
        {action}
      </div>
    </article>
  );
}
