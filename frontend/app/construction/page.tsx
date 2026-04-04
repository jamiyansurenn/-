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
import SectionHeader from '@/components/home/SectionHeader';
import styles from '@/components/corporate/corporate.module.css';
import homeStyles from '@/app/home.module.css';
import { getCmsPage } from '@/lib/page-cms';

function formatPublishedDate(value: string | null | undefined) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

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
  const constructionNews =
    news.data?.filter(
      (item: any) =>
        item.title?.toLowerCase().includes('барилг') ||
        item.title?.toLowerCase().includes('construction') ||
        item.content?.toLowerCase().includes('барилг')
    ) || [];

  const introTitle = isEn ? 'Construction Works' : 'Барилгын ажил';
  const introSubtitle = isEn
    ? 'Daatsiin Tsamkhag Group provides professional construction, lifting mechanism, and industrial equipment services.'
    : '“Даацын Цамхаг Групп” ХХК нь барилга, өргөх механизм, үйлдвэрлэлийн тоног төхөөрөмжийн чиглэлээр доорх үйлчилгээнүүдийг мэргэжлийн өндөр түвшинд үзүүлдэг.';

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
            <div className={styles.constructionPageInner}>
              <AnimateOnScroll>
                <SectionHeader title={introTitle} subtitle={introSubtitle} />
              </AnimateOnScroll>

              <div className={styles.premiumMasonry}>
                {masonrySections.map((section, idx) => {
                  const isAdvantage = section.title === (isEn ? 'Our Advantages' : 'Манай давуу тал');
                  return (
                    <div key={section.title} className={styles.premiumMasonryItem}>
                      <AnimateOnScroll delay={80 + idx * 50}>
                        <article
                          className={`${styles.premiumDetailCard} ${isAdvantage ? styles.premiumDetailCardAdvantage : ''}`}
                        >
                          <div className={styles.premiumDetailMedia}>
                            <Image
                              src={getImageUrl(undefined, isAdvantage ? 'building' : 'construction', idx)}
                              alt={section.title}
                              fill
                              className={styles.premiumDetailImage}
                              sizes="(max-width: 768px) 100vw, 520px"
                            />
                          </div>
                          <div className={styles.premiumDetailBody}>
                            <h3 className={styles.premiumDetailTitle}>{section.title}</h3>
                            <p className={styles.premiumDetailIntro}>{section.intro}</p>
                            {section.points && section.points.length > 0 ? (
                              <ul className={styles.premiumDetailList}>
                                {section.points.map((point) => (
                                  <li key={point}>{point}</li>
                                ))}
                              </ul>
                            ) : null}
                            {section.subSections?.map((sub) => (
                              <div key={sub.title} className={styles.premiumSubBlock}>
                                <h4 className={styles.premiumSubTitle}>{sub.title}</h4>
                                <ul className={styles.premiumDetailList}>
                                  {sub.points.map((point) => (
                                    <li key={point}>{point}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </article>
                      </AnimateOnScroll>
                    </div>
                  );
                })}
              </div>

              {constructionNews.length > 0 ? (
                <AnimateOnScroll delay={120}>
                  <div style={{ marginTop: 'clamp(2.5rem, 5vw, 4rem)' }}>
                    <SectionHeader title={t.pages.construction.latestNews} />
                    <div className={homeStyles.newsGridHome}>
                      {constructionNews.slice(0, 3).map((item: any, index: number) => {
                        const imageUrl = getImageUrl(item.image, 'news', index);
                        const dateStr = formatPublishedDate(item.publishedAt);
                        return (
                          <AnimateOnScroll key={item.id} delay={index * 70}>
                            <article className={homeStyles.newsCardHome}>
                              <div className={homeStyles.newsCardImageWrap}>
                                <Image
                                  src={imageUrl}
                                  alt={item.title}
                                  fill
                                  className={homeStyles.newsCardImage}
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              </div>
                              <div className={homeStyles.newsCardBody}>
                                <div className={homeStyles.newsMetaRow}>
                                  <span className={homeStyles.newsCardLabel}>{t.nav.news}</span>
                                  {dateStr ? <span className={homeStyles.cardDate}>{dateStr}</span> : null}
                                </div>
                                <h3 className={homeStyles.newsCardTitle}>{item.title}</h3>
                                {item.excerpt ? <p className={homeStyles.newsCardExcerpt}>{item.excerpt}</p> : null}
                                <div className={homeStyles.newsCardFooter}>
                                  <Link href={`/news/${item.slug}`} className={homeStyles.newsReadLink}>
                                    {t.common.readMore}
                                    <span aria-hidden>→</span>
                                  </Link>
                                </div>
                              </div>
                            </article>
                          </AnimateOnScroll>
                        );
                      })}
                    </div>
                  </div>
                </AnimateOnScroll>
              ) : null}
            </div>
          </div>
        </SectionBlock>
      </main>
      <Footer />
    </>
  );
}
