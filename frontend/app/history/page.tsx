import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { getCompanyInfo } from '@/lib/api';
import { getImageUrl } from '@/lib/imagePlaceholder';

export default async function HistoryPage() {
  const companyInfo = await getCompanyInfo().catch(() => ({ data: null }));

  // Timeline data - can be moved to database later
  const timeline = [
    {
      year: '2009',
      title: 'Үйл ажиллагаа эхлэв',
      description: 'Манай байгууллага нь 2009 онд үүсгэн байгуулагдсан бөгөөд, барилга дэд бүтцийн салбарын хөгжлийн гол хэрэглэгдэхүүн болох өргөн тээвэрлэх машин механизм цамхагт кран, гүүрэн кран ачаа болон хүн зөөврийн угсралт буулгалт, засвар үйлчилгээ, нийлүүлэлт, түрээсийн үйлчилгээ болон барилга угсралтын ажлыг мэргэжлийн өндөр түвшинд чадварлаг баг хамт олон бүрдүүлэн үйл ажиллагаагаа тогтвортой явуулж байна.',
    },
    {
      year: '2015',
      title: 'БАГАНАТ ӨРГӨӨ, Sky town2',
      description: 'Улаанбаатар хот, Баянзүрх дүүрэг, 38-р хороонд байрлах "Баганат Өргөө" хотхоны 407,408 байрны барилга угсралт, цамхагт краны нэгдсэн үйлчилгээ, дотор засалын хамт хийж гүйцэтгэв.',
    },
    {
      year: '2016',
      title: 'Sky town2, International school',
      description: 'SKY TOWN-2, ФИНАНС ЛАЙН, цамхагт кран угсралт, буулгалт, засвар үйлчилгээ техникийн магадлал болон дотоод засал чимэглэл хийж гүйцэтгэв. International school of Ulaanbaatar сургуулийн ажилчдын орон сууцны барилга угсралт болон цамхагт кран угсралт буулгалт, подём, люлка- зэрэг өргөх механизмын ажлыг хийж гүйцэтгэв.',
    },
    {
      year: '2017',
      title: 'Хөшигтийн хөндийн шинэ нисэх буудал',
      description: 'Төв аймгийн сэргэлэн хотод байрлах Хөшигтийн хөндийн шинэ нисэх буудал төслийн барилга угсралтын ажлыг хийж гүйцэтгэв.',
    },
    {
      year: '2023',
      title: 'Мал аж ахуй',
      description: 'Бид "Эрүүл монгол хүн" хөтөлбөрийн хүрээнд элдэв химийн найрлага бодис ороогүй сүү сүүн бүтээгдэхүүн, мах махан бүтээгдэхүүнийг бэлчээрээс хэрэглэгчийн гарт шууд нийлүүлэх зорилт тавин ажиллаж байна.',
    },
    {
      year: '2023-2026',
      title: 'ЦАМХАГ жуулчны бааз',
      description: 'Монгол улсын томоохон эдийн засгийг бүрдүүлэгч болох аялал жуулчлалын талбарт Завхан аймгийн, Тосонцэнгэл суманд "Цамхаг" жуулчны баазыг байгуулаад байна. Уг төсөл нь 2026 он гэхэд бүрэн хөгжиж дуусах юм.',
    },
    {
      year: '2024-2025',
      title: 'ШИНЭ АМГАЛАН 6 төсөл',
      description: 'Шинэ Амгалан цогцолбор хорооллын үргэлжлэл болох 6 дугаар ээлжийн Б7, Б8 блок маань 300 айлын орон сууцны төслийн ажил эхлээд барилга угсралтын ажил хэвийн үргэлжилж байна.',
    },
  ];

  return (
    <>
      <Header />
      <main>
        <section className="hero" style={{ 
          position: 'relative', 
          overflow: 'hidden',
          backgroundImage: `url(${getImageUrl(undefined, 'building', 2)})`,
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
              <h1>Түүхэн замнал</h1>
              <p>Манай компанийн хөгжлийн замнал</p>
            </AnimateOnScroll>
          </div>
        </section>

        <section style={{ padding: '4rem 0', background: '#fafafa' }}>
          <div className="container">
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              {timeline.map((item, index) => (
                <AnimateOnScroll key={index} delay={index * 100}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '2rem',
                      marginBottom: '3rem',
                      padding: '2rem',
                      background: '#fff',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                    className="timeline-item card"
                  >
                    <div
                      style={{
                        minWidth: '120px',
                        textAlign: 'center',
                        padding: '1rem',
                        background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--dark-orange) 100%)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                      }}
                    >
                      {item.year}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>{item.title}</h2>
                      <p style={{ lineHeight: '1.8', color: 'var(--text-gray)' }}>{item.description}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {companyInfo.data?.history && (
          <section style={{ padding: '4rem 0' }}>
            <div className="container">
              <AnimateOnScroll>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                  <h2 className="section-title">Бидний түүх</h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                    {companyInfo.data.history}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
