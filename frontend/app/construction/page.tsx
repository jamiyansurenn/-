import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Link from 'next/link';
import Image from 'next/image';
import { getNews } from '@/lib/api';
import { getImageUrl } from '@/lib/imagePlaceholder';
import { getLanguage, getTranslations } from '@/lib/getLanguage';
import PageHero from '@/components/corporate/PageHero';
import SectionBlock from '@/components/corporate/SectionBlock';
import styles from '@/components/corporate/corporate.module.css';
import { getCmsPage } from '@/lib/page-cms';

export default async function ConstructionPage() {
  const lang = await getLanguage();
  const t = await getTranslations();
  const cmsPage = await getCmsPage('construction', lang);
  const isEn = lang === 'en';
  const news = await getNews(true).catch(() => ({ data: [] }));
  type Section = {
    title: string;
    intro: string;
    points?: string[];
    subSections?: { title: string; points: string[] }[];
  };
  const serviceSections: Section[] = isEn
    ? [
        {
          title: 'REPAIR, INSTALLATION AND DISMANTLING',
          intro:
            'Daatsiin Tsamkhag Group provides crane and lifting mechanism repair, installation, and dismantling services with professional quality assurance.',
          points: [
            'Diagnose and repair mechanical faults in cranes and elevators',
            'Diagnose and repair electrical faults in lifting systems',
            'Diagnose and repair hydraulic lifting system faults',
            'Install and configure crane and elevator equipment',
            'Complete rail diagnostics and maintenance for cranes and elevators',
            'Provide routine, major, and full restoration maintenance works',
          ],
        },
        {
          title: 'BLOCK PRODUCTION',
          intro:
            'Since 2022, our company has been operating in gas block (lightweight block) production and supply.',
          points: ['Fire and water resistant', 'Durable and long-lasting', 'Good sound insulation', 'High thermal retention', 'Cost efficient', 'Easy to work with due to light weight'],
        },
        {
          title: 'TRADE AND SUPPLY',
          intro:
            'We supply construction, lifting, and industrial equipment along with related services.',
          points: [
            'Tower cranes and bridge cranes',
            'Construction cargo and suspended hoists',
            'Elevators and escalators',
            'Truck-mounted and stationary concrete pumps',
            'Specialized lifting vehicles',
            'Lightweight blocks and furniture',
          ],
        },
      ]
    : [
        {
          title: 'ЗАСВАР ҮЙЛЧИЛГЭЭ, УГСРАЛТ БУУЛГАЛТ',
          intro:
            '“Даацын Цамхаг Групп” ХХК нь кран, өргөх механизмын засвар үйлчилгээ, угсралт буулгалтын ажлыг мэргэжлийн өндөр түвшинд, чанарын баталгаатай гүйцэтгэж байна.',
          points: [
            'Кран болон лифтний механик эвдрэл гэмтлийг оношлох, засварлах',
            'Өргөх байгууламжийн цахилгааны гэмтлийг оношлох, засварлах',
            'Гидравлик буюу шингэний дамжлагатай өргөх төхөөрөмжийн гэмтлийг оношлох, засварлах',
            'Кран болон лифтний тоног төхөөрөмжийн суурилуулалт, тохиргоо хийх',
            'Кран болон лифтний зам төмрийн иж бүрэн оношлогоо, засвар үйлчилгээ хийх',
            'Өргөх байгууламжийн урсгал засвар, их засвар, иж бүрэн засвар болон сэргээн засварлах ажил гүйцэтгэх',
          ],
        },
        {
          title: 'УГСРАЛТ, БУУЛГАЛТЫН АЖИЛ',
          intro: 'Манай инженер техникийн баг дараах угсралт буулгалтын ажлуудыг найдвартай хийж гүйцэтгэнэ.',
          points: [
            'Гүүрэн төрлийн краны угсралт, буулгалт',
            'Лифтний угсралт болон буулгалт',
            'Барилгын ачааны болон дүүжин өргүүрийн угсралт, буулгалт',
            'Цамхагт краны угсралт, буулгалт, секц нэмэх, кран өндөрлөх',
            'Бүх төрлийн ачааны машинд манипулятор суурилуулах',
          ],
        },
        {
          title: 'БЛОКИЙН ҮЙЛДВЭР',
          intro:
            '“Даацын Цамхаг Групп” ХХК нь 2022 оноос эхлэн газоблок (хөнгөн блок) үйлдвэрлэлийн чиглэлээр үйл ажиллагаа явуулж байна.',
          points: [
            'Гал, усанд тэсвэртэй',
            'Бат бөх, удаан эдэлгээтэй',
            'Дуу тусгаарлалт сайн',
            'Дулаан хадгалалт өндөр',
            'Барилгын зардлыг бууруулдаг',
            'Хөнгөн тул өрлөг хийхэд хялбар',
          ],
        },
        {
          title: 'ХУДАЛДАА ҮЙЛЧИЛГЭЭ',
          intro:
            'Манай компани барилга, өргөх механизм болон үйлдвэрлэлийн тоног төхөөрөмжийн худалдаа, нийлүүлэлтийн үйлчилгээг үзүүлдэг.',
          points: [
            'Бүх төрлийн цамхагт кран, гүүрэн кран',
            'Барилгын ачааны болон дүүжин өргүүр (подъём)',
            'Бүх төрлийн лифт, цахилгаан шат',
            'Бетон зуурмагийн авто болон суурин помп',
            'Барилгын болон ачаа өргөх зориулалтын тусгай тоноглолтой автомашин',
            'Хөнгөн блок',
            'Бүх төрлийн гэрийн болон оффисын тавилга',
          ],
        },
        {
          title: 'ЛИФТ, ЦАХИЛГААН ШАТНЫ НИЙЛҮҮЛЭЛТ',
          intro: 'Лифт, цахилгаан шатны нийлүүлэлт, угсралт, засвар үйлчилгээний ажлыг мэргэжлийн түвшинд гүйцэтгэнэ.',
          points: [
            'Хүн тээврийн цахилгаан шатны нийлүүлэлт, угсралт',
            'Ачаа тээврийн лифтний угсралт',
            'Урсдаг шат (Escalator) нийлүүлэлт, угсралт',
            'Техникийн магадлал, аюулгүй ажиллагааны шалгалт',
            'Засвар үйлчилгээ, сэлбэг нийлүүлэлт',
          ],
        },
        {
          title: 'СУРГАЛТ',
          intro: 'Манай компани өргөх механизмын оператор болон тоног төхөөрөмжийн мэргэжлийн сургалт зохион байгуулдаг.',
          points: [
            'Бүх төрлийн краны операторын сургалт',
            'Оосорлогч, дохиочин бэлтгэх сургалт',
            'Ачаа өргүүр, дүүжин өргүүрийн операторын сургалт',
            'Лифтчин, лифт угсралтын засварчны сургалт',
          ],
        },
        {
          title: 'БАРИЛГА УГСРАЛТ',
          intro: 'Барилгын дараах угсралт, засварын ажлуудыг чанарын өндөр түвшинд гүйцэтгэнэ.',
          points: ['Гадна фасадны ажил', 'Барилгын засал чимэглэл', 'Төмөр хийцийн ажил', 'Гадна тохижилт', 'Барилгын угсралтын ажил'],
        },
        {
          title: 'БҮХ ТӨРЛИЙН ТӨМӨР ХИЙЦ',
          intro: '“Даацын Цамхаг Групп” ХХК нь бүх төрлийн төмөр хийцийг эх орондоо үйлдвэрлэж, угсралтын ажлыг гүйцэтгэж байна.',
          subSections: [
            {
              title: 'Даацын төмөр хийц',
              points: [
                'Барилгын төмөр хийц',
                'Спорт заал, агуулахын барилга',
                'Худалдаа үйлчилгээний барилга',
                'Үйлдвэрийн барилга, гараж',
                'Өргөтгөлийн барилга',
                'Угаалгын газар',
                'Оффисын барилга',
                'Угсардаг төмөр тулгуурт цамхаг гэр',
              ],
            },
            {
              title: 'Даацын бус төмөр хийц',
              points: ['Хашаа, хайс', 'Төмөр шат, тавцан', 'Цонхны хамгаалалтын хаалт', 'Гүйдэг сэндвичин хаалга'],
            },
            {
              title: 'Лифтний төмөр хийц',
              points: ['Лифтний рамны төмөр хийц', 'Урсдаг шатны хийц'],
            },
          ],
        },
        {
          title: 'АВТО БОЛОН СУУРИН ПОМП',
          intro: 'Бетон шахах авто болон суурин помпын худалдаа, түрээс, засвар үйлчилгээ үзүүлдэг.',
          points: [
            'М100 – М450 маркийн бетон зуурмагийг 50–300 метр хүртэл шахах',
            'Авто помп түрээс, худалдаа',
            'Суурин помпын худалдаа, түрээс',
            'Засвар үйлчилгээ',
            'Сэлбэг хэрэгслийн нийлүүлэлт',
          ],
        },
        {
          title: 'ТАВИЛГЫН ҮЙЛДВЭР',
          intro: 'Манай компани бүх төрлийн захиалгат тавилга үйлдвэрлэж байна.',
          subSections: [
            { title: 'Гэрийн тавилга', points: ['Гал тогооны тавилга', 'Унтлагын өрөөний тавилга', 'Зочны өрөөний тавилга'] },
            { title: 'Оффис тавилга', points: ['Номын тавиур', 'Ханын шкаф', 'Оффис ширээ, шүүгээ'] },
            { title: 'Гадна тохижилт', points: ['Хүүхдийн тоглоом', 'Сүүдрэвч', 'Гадна талбайн бүх төрлийн тавилга'] },
          ],
        },
        {
          title: 'КОМПАНИЙН ДЭРГЭДЭХ ЭБА ТӨВ',
          intro: 'Манай төв дараах цогц үйлчилгээг үзүүлдэг.',
          points: ['Авто угаалга', 'Автомат хувцас угаалга', 'Тавилгын захиалга', 'Фитнесс, спиннинг төв', 'Амралт, чөлөөт цагийн үйлчилгээ'],
        },
      ];
  const advantageSection: Section = isEn
    ? {
        title: 'Our Advantages',
        intro: 'We combine engineering, quality, and reliable execution into one integrated operating model.',
        points: [
          'Experienced engineering and technical team',
          'Quality-assured services',
          'Fast and reliable execution',
          'Operations in Ulaanbaatar and nationwide',
        ],
      }
    : {
        title: 'Манай давуу тал',
        intro: 'Манай компани дараах давуу талуудтай.',
        points: [
          'Туршлагатай инженер, техникийн баг',
          'Чанарын баталгаатай үйлчилгээ',
          'Түргэн шуурхай гүйцэтгэл',
          'Улаанбаатар болон орон нутагт ажиллана',
        ],
      };
  const masonrySections: Section[] = [...serviceSections, advantageSection];

  // Filter construction-related news
  const constructionNews = news.data?.filter((item: any) => 
    item.title?.toLowerCase().includes('барилг') || 
    item.title?.toLowerCase().includes('construction') ||
    item.content?.toLowerCase().includes('барилг')
  ) || [];
  const galleryImages = constructionNews
    .map((item: any) => item?.image)
    .filter(Boolean)
    .slice(0, 6);
  const sectionWrapStyle = {
    padding: '4.5rem 0',
    background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
  };
  const pageContentStyle = {
    maxWidth: '1040px',
    margin: '0 auto',
  };
  const baseCardStyle = {
    background: 'linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)',
    padding: '1.6rem 1.7rem',
    borderRadius: '14px',
    marginBottom: '1rem',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    boxShadow: '0 16px 32px -24px rgba(15, 23, 42, 0.35)',
  };
  const cardMediaStyle = {
    position: 'relative' as const,
    width: '100%',
    height: '140px',
    borderRadius: '12px',
    overflow: 'hidden' as const,
    marginBottom: '1rem',
    border: '1px solid rgba(15, 23, 42, 0.08)',
  };
  const headingStyle = {
    marginBottom: '0.85rem',
    color: 'var(--text-dark)',
    letterSpacing: '-0.01em',
  };
  const leadTextStyle = {
    marginBottom: '0.8rem',
    lineHeight: '1.75',
    color: '#475569',
    fontSize: '0.99rem',
  };
  const listStyle = {
    paddingLeft: '1.1rem',
    margin: 0,
    lineHeight: '1.75',
    color: '#334155',
    fontSize: '0.95rem',
  };
  const masonryStyle = {
    columnCount: 2,
    columnGap: '1rem',
  };
  const masonryItemStyle = {
    breakInside: 'avoid' as const,
    marginBottom: '1rem',
  };

  return (
    <>
      <Header />
      <main>
        <PageHero
          title={(cmsPage?.title as string) || (isEn ? 'Completed Projects' : 'Хэрэгжүүлсэн төслүүд')}
          subtitle={(cmsPage?.seoDescription as string) || (isEn ? 'Construction Works' : 'Барилгын ажил')}
          backgroundImage={getImageUrl(undefined, 'construction', 0)}
        />

        <SectionBlock muted>
          <div className="container">
            <div style={pageContentStyle}>
              <AnimateOnScroll>
                <div style={{ 
                  ...baseCardStyle,
                  marginBottom: '1.25rem',
                  borderLeft: '4px solid #e08e6d'
                }}>
                  <h2 style={{ marginBottom: '0.8rem', color: 'var(--primary-orange)' }}>
                    {isEn ? 'Construction Works' : 'Барилгын ажил'}
                  </h2>
                  <div style={{ lineHeight: '1.8', color: 'var(--text-gray)' }}>
                    <p style={{ ...leadTextStyle, marginBottom: 0 }}>
                      {isEn
                        ? 'Daatsiin Tsamkhag Group provides professional construction, lifting mechanism, and industrial equipment services.'
                        : '“Даацын Цамхаг Групп” ХХК нь барилга, өргөх механизм, үйлдвэрлэлийн тоног төхөөрөмжийн чиглэлээр доорх үйлчилгээнүүдийг мэргэжлийн өндөр түвшинд үзүүлдэг.'}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>

              <div style={masonryStyle}>
                {masonrySections.map((section, idx) => (
                  <div key={section.title} style={masonryItemStyle}>
                    <AnimateOnScroll delay={100 + idx * 60}>
                      <div
                        style={{
                          ...baseCardStyle,
                          marginBottom: 0,
                          borderLeft:
                            section.title === (isEn ? 'Our Advantages' : 'Манай давуу тал')
                              ? '4px solid #16a34a'
                              : '4px solid rgba(224, 142, 109, 0.55)',
                          boxShadow: '0 20px 38px -24px rgba(15, 23, 42, 0.42)',
                        }}
                      >
                        <div style={cardMediaStyle}>
                          <Image
                            src={getImageUrl(undefined, section.title === (isEn ? 'Our Advantages' : 'Манай давуу тал') ? 'building' : 'construction', idx)}
                            alt={section.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, 520px"
                          />
                        </div>
                        <h3 style={headingStyle}>{section.title}</h3>
                        <p style={leadTextStyle}>{section.intro}</p>
                        {section.points && section.points.length > 0 ? (
                          <ul style={listStyle}>
                            {section.points.map((point) => (
                              <li key={point}>{point}</li>
                            ))}
                          </ul>
                        ) : null}
                        {section.subSections?.map((sub) => (
                          <div key={sub.title} style={{ marginTop: '0.95rem' }}>
                            <h4 style={{ marginBottom: '0.4rem', color: 'var(--text-dark)' }}>{sub.title}</h4>
                            <ul style={listStyle}>
                              {sub.points.map((point) => (
                                <li key={point}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </AnimateOnScroll>
                  </div>
                ))}
              </div>


              {constructionNews.length > 0 && (
                <AnimateOnScroll delay={200}>
                  <div>
                    <h2 className="section-title" style={{ marginBottom: '2rem' }}>
                      {t.pages.construction.latestNews}
                    </h2>
                    <div className={styles.cardGrid}>
                      {constructionNews.slice(0, 3).map((item: any, index: number) => {
                        const imageUrl = getImageUrl(item.image, 'news', index);
                        return (
                        <AnimateOnScroll key={item.id} delay={index * 100}>
                          <div className="card">
                            <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
                              <Image
                                src={imageUrl}
                                alt={item.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                              <h3 style={{ marginBottom: '1rem' }}>{item.title}</h3>
                              {item.excerpt && (
                                <p style={{ marginBottom: '1rem', color: '#666' }}>{item.excerpt}</p>
                              )}
                              <Link href={`/news/${item.slug}`} className="btn">
                                {t.common.readMore}
                              </Link>
                            </div>
                          </div>
                        </AnimateOnScroll>
                        );
                      })}
                    </div>
                  </div>
                </AnimateOnScroll>
              )}
            </div>
          </div>
        </SectionBlock>
      </main>
      <Footer />
    </>
  );
}
