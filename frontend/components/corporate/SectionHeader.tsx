import styles from './corporate.module.css';

type SectionHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
};

export default function SectionHeader({ title, description, eyebrow }: SectionHeaderProps) {
  return (
    <header className={styles.sectionHeader}>
      {eyebrow ? <p className={styles.sectionEyebrow}>{eyebrow}</p> : null}
      <h2 className={styles.sectionTitle}>{title}</h2>
      {description ? <p className={styles.sectionDescription}>{description}</p> : null}
    </header>
  );
}
