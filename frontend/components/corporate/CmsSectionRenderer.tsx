import SectionHeader from './SectionHeader';
import ContentCard from './ContentCard';
import styles from './corporate.module.css';

function parseContent(contentJson?: string) {
  if (!contentJson) return {};
  try {
    return JSON.parse(contentJson);
  } catch {
    return {};
  }
}

export default function CmsSectionRenderer({ section }: { section: any }) {
  const content = parseContent(section?.contentJson);
  const type = section?.type || 'text';

  if (type === 'hero') {
    return (
      <SectionHeader
        eyebrow={content.eyebrow}
        title={content.title || section?.title || 'Hero'}
        description={content.subtitle || content.description}
      />
    );
  }

  if (type === 'list') {
    return (
      <ContentCard title={section?.title || content.title || 'List'} description={content.description}>
        <ul className={styles.bulletList}>
          {(content.items || []).map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ContentCard>
    );
  }

  if (type === 'timeline') {
    return (
      <div className={styles.cardGrid}>
        {(content.items || []).map((item: any, index: number) => (
          <ContentCard
            key={`${item.year || ''}-${index}`}
            title={`${item.year || ''} ${item.title || ''}`.trim() || `Timeline ${index + 1}`}
            description={item.description || ''}
          />
        ))}
      </div>
    );
  }

  if (type === 'gallery') {
    return (
      <div className={styles.cardGrid}>
        {(content.images || []).map((img: any, index: number) => (
          <ContentCard
            key={img.url || index}
            title={img.caption || `Image ${index + 1}`}
            description={img.description}
            image={img.url}
          />
        ))}
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className={styles.cardGrid}>
        {(content.items || []).map((item: any, index: number) => (
          <ContentCard
            key={item.title || index}
            title={item.title || `Card ${index + 1}`}
            description={item.description}
            image={item.image}
          />
        ))}
      </div>
    );
  }

  return <ContentCard title={section?.title || 'Text'} description={content.description || content.text || ''} />;
}
