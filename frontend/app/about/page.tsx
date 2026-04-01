import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { getCompanyInfo, getTeamMembers } from '@/lib/api';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';
import { getTranslations } from '@/lib/getLanguage';
import leadershipStyles from '@/app/about/aboutLeadership.module.css';

// Force dynamic rendering to prevent build-time static generation errors
export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const t = await getTranslations();
  const tx = t as any;
  let companyInfo: { data: any } = { data: null };
  let teamMembers: { data: any } = { data: [] };
  const serviceHighlights: string[] = tx.pages?.about?.serviceHighlights || [
    'Барилга угсралт',
    'Газо хөнгөн блок',
    'Тавилгын үйлдвэр',
    'Цамхагт краны нэгдсэн эксперт үйлчилгээ',
    'Авто болон суурин помпын үйлчилгээ',
    'Цахилгаан шат, урсдаг шат нийлүүлэлт',
    'ЭБА төв',
    'Амралтын газар',
  ];

  try {
    const results = await Promise.allSettled([
      getCompanyInfo().catch(() => ({ data: null })),
      getTeamMembers().catch(() => ({ data: [] })),
    ]);

    if (results[0].status === 'fulfilled') {
      companyInfo = results[0].value || { data: null };
    }
    if (results[1].status === 'fulfilled') {
      teamMembers = results[1].value || { data: [] };
    }
  } catch (error) {
    // Handle errors gracefully - page will render with empty data
  }

  return (
    <>
      <Header />
      <main>
        <section className="hero" style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `url(${getImageUrl(undefined, 'default', 1)})`,
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
              <h1>{t.pages.about.title}</h1>
            </AnimateOnScroll>
          </div>
        </section>

        {companyInfo.data && (
          <section>
            <div className="container">
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {companyInfo.data.aboutUs && (
                  <AnimateOnScroll delay={100}>
                    <div style={{ marginBottom: '3rem' }}>
                      <h2 style={{ marginBottom: '1.5rem' }}>{t.pages.about.title}</h2>
                      <p style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                        {companyInfo.data.aboutUs}
                      </p>
                    </div>
                  </AnimateOnScroll>
                )}

                {companyInfo.data.vision && (
                  <AnimateOnScroll delay={200}>
                    <div style={{ marginBottom: '3rem' }}>
                      <h2 style={{ marginBottom: '1.5rem' }}>{t.home.about.visionTitle}</h2>
                      <p style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                        {companyInfo.data.vision}
                      </p>
                    </div>
                  </AnimateOnScroll>
                )}

                {companyInfo.data.mission && (
                  <AnimateOnScroll delay={300}>
                    <div style={{ marginBottom: '3rem' }}>
                      <h2 style={{ marginBottom: '1.5rem' }}>{t.home.about.missionTitle}</h2>
                      <p style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                        {companyInfo.data.mission}
                      </p>
                    </div>
                  </AnimateOnScroll>
                )}

                {companyInfo.data.values && (
                  <AnimateOnScroll delay={400}>
                    <div style={{ marginBottom: '3rem' }}>
                      <h2 style={{ marginBottom: '1.5rem' }}>{tx.pages?.about?.valuesTitle || 'Үнэт зүйлс'}</h2>
                      <p style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                        {companyInfo.data.values}
                      </p>
                    </div>
                  </AnimateOnScroll>
                )}

                <AnimateOnScroll delay={450}>
                  <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>{tx.pages?.about?.serviceHighlightsTitle || 'Үндсэн чиглэлүүд'}</h2>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '0.9rem',
                      }}
                    >
                      {serviceHighlights.map((item: string, index: number) => (
                        <div
                          key={item}
                          style={{
                            border: '1px solid rgba(13, 27, 42, 0.08)',
                            borderRadius: '10px',
                            padding: '0.9rem 1rem',
                            background: index % 2 === 0 ? '#fff' : '#fafafa',
                            fontWeight: 600,
                            color: 'var(--text-dark)',
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimateOnScroll>

                <AnimateOnScroll delay={500}>
                  <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>{tx.pages?.about?.galleryTitle || 'Бүтээн байгуулалтын зураг'}</h2>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '1rem',
                      }}
                    >
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          style={{
                            position: 'relative',
                            width: '100%',
                            height: '170px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
                          }}
                        >
                          <Image
                            src={getImageUrl(undefined, i % 2 === 0 ? 'construction' : 'building', i)}
                            alt={`${tx.pages?.about?.galleryImageAlt || 'Бүтээн байгуулалтын зураг'} ${i + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimateOnScroll>

                {companyInfo.data.history && (
                  <AnimateOnScroll delay={550}>
                    <div>
                      <h2 style={{ marginBottom: '1.5rem' }}>{tx.pages?.about?.historyTitle || 'Түүх'}</h2>
                      <p style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                        {companyInfo.data.history}
                      </p>
                    </div>
                  </AnimateOnScroll>
                )}
              </div>
            </div>
          </section>
        )}

        {teamMembers.data && teamMembers.data.length > 0 && (
          <section className={leadershipStyles.leadershipSection}>
            <div className="container">
              <header className={leadershipStyles.sectionHeader}>
                <AnimateOnScroll>
                  <h2 className={leadershipStyles.sectionTitle}>
                    {tx.pages?.about?.teamTitle || 'Удирдлагын баг'}
                  </h2>
                  {tx.pages?.about?.teamLead ? (
                    <p className={leadershipStyles.sectionLead}>{tx.pages.about.teamLead}</p>
                  ) : null}
                </AnimateOnScroll>
              </header>
              <div className={leadershipStyles.grid}>
                {teamMembers.data.map((member: any, index: number) => {
                  const imageUrl = getImageUrl(member.image, 'team', index);
                  return (
                    <AnimateOnScroll key={member.id} delay={index * 100}>
                      <article className={leadershipStyles.card}>
                        <div className={leadershipStyles.photoWrap}>
                          <Image
                            src={imageUrl}
                            alt={member.name}
                            fill
                            style={{ objectFit: 'cover', objectPosition: index === 1 ? 'center 15%' : 'center center' }}
                            sizes="(max-width: 768px) 100vw, 320px"
                          />
                        </div>
                        <div className={leadershipStyles.cardBody}>
                          <h3 className={leadershipStyles.name}>{member.name}</h3>
                          <p className={leadershipStyles.position}>{member.position}</p>
                          {member.bio ? <p className={leadershipStyles.bio}>{member.bio}</p> : null}
                        </div>
                      </article>
                    </AnimateOnScroll>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
