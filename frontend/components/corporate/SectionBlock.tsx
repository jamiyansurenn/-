import styles from './corporate.module.css';

type SectionBlockProps = {
  children: React.ReactNode;
  muted?: boolean;
};

export default function SectionBlock({ children, muted = false }: SectionBlockProps) {
  return <section className={`${styles.section} ${muted ? styles.sectionMuted : ''}`}>{children}</section>;
}
