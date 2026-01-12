import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Link from 'next/link';
import Image from 'next/image';
import { getNews } from '@/lib/api';
import { getImageUrl } from '@/lib/imagePlaceholder';

export default async function ConstructionPage() {
  const news = await getNews(true).catch(() => ({ data: [] }));

  // Filter construction-related news
  const constructionNews = news.data?.filter((item: any) => 
    item.title?.toLowerCase().includes('барилг') || 
    item.title?.toLowerCase().includes('construction') ||
    item.content?.toLowerCase().includes('барилг')
  ) || [];

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
              <h1>Барилгын салбарын эргэн тойронд</h1>
              <p>Барилгын салбарын сүүлийн мэдээ, мэдээлэл</p>
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
                    Барилгын салбарын эргэн тойронд
                  </h2>
                  <div style={{ lineHeight: '1.8', color: 'var(--text-gray)' }}>
                    <p style={{ marginBottom: '1.5rem' }}>
                      Дэлхийн эдийн засгийн форумын (WEF) 2025 оны Хөдөлмөрийн зах зээлийн төлөвийн тайланд 2030 он гэхэд 78 сая ажлын байр шинээр бий болно гэж тооцоолжээ. Нийт 1000 гаруй компаниас цуглуулсан дата мэдээлэлд тулгуурлан 2030 он гэхэд олон улсын хэмжээнд 170 сая ажлын байр нэмэгдэх төлөвтэйг тооцоолсон байна. Технологийн дэвшил эрчимжиж байгаатай холбоотойгоор тухайн салбарт хамгийн их ажлын байр бий болно гэж үзэж байгаа аж.
                    </p>
                    <p style={{ marginBottom: '1.5rem', fontWeight: '600' }}>
                      Салбараар нь аваад үзвэл 2030 он барилгын салбарын ажилчдын эрэлт хэрэгцээ хамгийн өндөр байх төлөвтэй байгаа аж.
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={100}>
                <div style={{ 
                  background: '#fff', 
                  padding: '2rem', 
                  borderRadius: '12px', 
                  marginBottom: '2rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>
                    🔖 2025 онд ипотекийн зээлийн санхүүжилт
                  </h3>
                  <p style={{ lineHeight: '1.8', color: 'var(--text-gray)' }}>
                    2025 онд ипотекийн зээлийн санхүүжилт 500 орчим тэрбум төгрөгөөр нэмэгдэж 1.2 их наяд төгрөг олгохоор болсон билээ. Анх удаа байр худалдаж авч буй иргэнд 80 хүртэлх метр квадрат талбайтай орон сууцыг ипотекийн зээлээр авч болохоор заасан байдаг. Тэгвэл 2025 оноос орон сууцны хэмжээг багасгаж, 50 метр квадрат хүртэлх талбайтай орон сууц авах иргэнд олгохоор болжээ.
                  </p>
                  <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-gray)', fontStyle: 'italic' }}>
                    📌 Эх сурвалж: Barilga.mn
                  </p>
                </div>
              </AnimateOnScroll>

              {constructionNews.length > 0 && (
                <AnimateOnScroll delay={200}>
                  <div>
                    <h2 className="section-title" style={{ marginBottom: '2rem' }}>Сүүлийн мэдээ</h2>
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
                                Дэлгэрэнгүй
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
