import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Link from 'next/link';
import Image from 'next/image';
import { getNews } from '@/lib/api';
import { getImageUrl } from '@/lib/imagePlaceholder';
import { getLanguage, getTranslations } from '@/lib/getLanguage';

export default async function ConstructionPage() {
  const lang = await getLanguage();
  const t = await getTranslations();
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

  return (
    <>
      <Header />
      <main>
        <section className="hero" style={{ 
          position: 'relative', 
          overflow: 'hidden',
          backgroundImage: `url(${getImageUrl(undefined, 'construction', 0)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            zIndex: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }}></div>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <AnimateOnScroll>
              <h1>{isEn ? 'Completed Projects' : 'Хэрэгжүүлсэн төслүүд'}</h1>
              <p>{isEn ? 'Construction Works' : 'Барилгын ажил'}</p>
            </AnimateOnScroll>
          </div>
        </section>

        <section style={{ padding: '4rem 0', background: '#fafafa' }}>
          <div className="container">
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <AnimateOnScroll>
                <div style={{ 
                  background: '#fff', 
                  padding: '2rem', 
                  borderRadius: '12px', 
                  marginBottom: '2rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-orange)' }}>
                    {isEn ? 'Construction Works' : 'Барилгын ажил'}
                  </h2>
                  <div style={{ lineHeight: '1.8', color: 'var(--text-gray)' }}>
                    <p style={{ marginBottom: '1.5rem' }}>
                      {isEn
                        ? 'Daatsiin Tsamkhag Group provides professional construction, lifting mechanism, and industrial equipment services.'
                        : '“Даацын Цамхаг Групп” ХХК нь барилга, өргөх механизм, үйлдвэрлэлийн тоног төхөөрөмжийн чиглэлээр доорх үйлчилгээнүүдийг мэргэжлийн өндөр түвшинд үзүүлдэг.'}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>

              {serviceSections.map((section, idx) => (
                <AnimateOnScroll delay={100 + idx * 60} key={section.title}>
                  <div
                    style={{
                      background: '#fff',
                      padding: '2rem',
                      borderRadius: '12px',
                      marginBottom: '2rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  >
                    <h3 style={{ marginBottom: '0.9rem', color: 'var(--text-dark)' }}>{section.title}</h3>
                    <p style={{ marginBottom: '1rem', lineHeight: '1.8', color: 'var(--text-gray)' }}>{section.intro}</p>
                    {section.points && section.points.length > 0 ? (
                      <ul style={{ paddingLeft: '1.2rem', margin: 0, lineHeight: '1.9', color: 'var(--text-gray)' }}>
                        {section.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    ) : null}
                    {section.subSections?.map((sub) => (
                      <div key={sub.title} style={{ marginTop: '1rem' }}>
                        <h4 style={{ marginBottom: '0.45rem', color: 'var(--text-dark)' }}>{sub.title}</h4>
                        <ul style={{ paddingLeft: '1.2rem', margin: 0, lineHeight: '1.9', color: 'var(--text-gray)' }}>
                          {sub.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </AnimateOnScroll>
              ))}

              <AnimateOnScroll delay={220}>
                <div
                  style={{
                    background: '#fff',
                    padding: '2rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <h3 style={{ marginBottom: '0.9rem', color: 'var(--text-dark)' }}>
                    {isEn ? '✅ Our Advantages' : '✅ Манай давуу тал'}
                  </h3>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0, lineHeight: '1.9', color: 'var(--text-gray)' }}>
                    {isEn ? (
                      <>
                        <li>Experienced engineering and technical team</li>
                        <li>Quality-assured services</li>
                        <li>Fast and reliable execution</li>
                        <li>We operate in Ulaanbaatar and nationwide</li>
                      </>
                    ) : (
                      <>
                        <li>Туршлагатай инженер, техникийн баг</li>
                        <li>Чанарын баталгаатай үйлчилгээ</li>
                        <li>Түргэн шуурхай гүйцэтгэл</li>
                        <li>Улаанбаатар болон орон нутагт ажиллана</li>
                      </>
                    )}
                  </ul>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={240}>
                <div
                  style={{
                    background: '#fff',
                    padding: '2rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>
                    {isEn ? 'Project Gallery' : 'Төслийн зургууд'}
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '0.9rem',
                    }}
                  >
                    {(galleryImages.length > 0 ? galleryImages : [0, 1, 2, 3, 4, 5]).map((img: any, i: number) => {
                      const imageUrl = typeof img === 'string' ? getImageUrl(img, 'construction', i) : getImageUrl(undefined, 'construction', i);
                      return (
                        <div
                          key={`${imageUrl}-${i}`}
                          style={{
                            position: 'relative',
                            width: '100%',
                            height: '180px',
                            borderRadius: '10px',
                            overflow: 'hidden',
                          }}
                        >
                          <Image
                            src={imageUrl}
                            alt={`${isEn ? 'Construction work' : 'Барилгын ажил'} ${i + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </AnimateOnScroll>

              {constructionNews.length > 0 && (
                <AnimateOnScroll delay={200}>
                  <div>
                    <h2 className="section-title" style={{ marginBottom: '2rem' }}>
                      {t.pages.construction.latestNews}
                    </h2>
                    <div className="grid">
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
        </section>
      </main>
      <Footer />
    </>
  );
}
