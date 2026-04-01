import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { getCompanyInfo, getTeamMembers } from '@/lib/api';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';
import { getTranslations } from '@/lib/getLanguage';
import leadershipStyles from '@/app/about/aboutLeadership.module.css';
import contentStyles from '@/app/about/aboutContent.module.css';
import { mergeCompanyAboutBlocks } from '@/lib/companyAboutMerge';
import PageHero from '@/components/corporate/PageHero';
import { getCmsPage } from '@/lib/page-cms';

// Force dynamic rendering to prevent build-time static generation errors
export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const t = await getTranslations();
  const cmsPage = await getCmsPage('about');
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

  const ha = tx.home?.about ?? {};
  const aboutBlocks = mergeCompanyAboutBlocks(companyInfo.data, {
    aboutUs: ha.aboutUs,
    vision: ha.vision,
    mission: ha.mission,
    values: ha.values,
  });

  return (
    <>
      <Header />
      <main>
        <PageHero title={(cmsPage?.title as string) || t.pages.about.title} backgroundImage={getImageUrl(undefined, 'default', 1)} />

        <section className={contentStyles.section}>
          <div className="container">
            {aboutBlocks.aboutUs && (
              <AnimateOnScroll delay={80}>
                <div className={contentStyles.introBlock}>
                  {ha.introEyebrow ? (
                    <p className={contentStyles.introEyebrow}>{ha.introEyebrow}</p>
                  ) : null}
                  {ha.brandLine ? <p className={contentStyles.introBrand}>{ha.brandLine}</p> : null}
                  <h2 className={contentStyles.introTitle}>{t.pages.about.title}</h2>
                  <p className={contentStyles.introBody}>{aboutBlocks.aboutUs}</p>
                </div>
              </AnimateOnScroll>
            )}

            {(aboutBlocks.vision || aboutBlocks.mission || aboutBlocks.values) && (
              <div className={`${contentStyles.subSectionsWrap} ${contentStyles.pillarSection}`}>
                <div className={contentStyles.pillarGrid}>
                  {aboutBlocks.vision && (
                    <AnimateOnScroll delay={120}>
                      <article className={contentStyles.pillarCard}>
                        <h3 className={contentStyles.pillarTitle}>{t.home.about.visionTitle}</h3>
                        <p className={contentStyles.pillarBody}>{aboutBlocks.vision}</p>
                      </article>
                    </AnimateOnScroll>
                  )}
                  {aboutBlocks.mission && (
                    <AnimateOnScroll delay={180}>
                      <article className={contentStyles.pillarCard}>
                        <h3 className={contentStyles.pillarTitle}>{t.home.about.missionTitle}</h3>
                        <p className={contentStyles.pillarBody}>{aboutBlocks.mission}</p>
                      </article>
                    </AnimateOnScroll>
                  )}
                  {aboutBlocks.values && (
                    <AnimateOnScroll delay={240}>
                      <article className={contentStyles.pillarCard}>
                        <h3 className={contentStyles.pillarTitle}>
                          {tx.pages?.about?.valuesTitle || 'Үнэт зүйлс'}
                        </h3>
                        <p className={contentStyles.pillarBody}>{aboutBlocks.values}</p>
                      </article>
                    </AnimateOnScroll>
                  )}
                </div>
              </div>
            )}

            <div className={contentStyles.subSectionsWrap}>
              <AnimateOnScroll delay={300}>
                <div className={contentStyles.serviceHighlightsBlock}>
                  <h2 className={contentStyles.sectionHeading}>
                    {tx.pages?.about?.serviceHighlightsTitle || 'Үндсэн чиглэлүүд'}
                  </h2>
                  <div className={contentStyles.serviceGrid}>
                    {serviceHighlights.map((item: string) => (
                      <div key={item} className={contentStyles.serviceCard}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={360}>
                <div
                  className={contentStyles.galleryBlock}
                  style={{ marginBottom: aboutBlocks.history ? undefined : '2rem' }}
                >
                  <h2 className={contentStyles.sectionHeading}>
                    {tx.pages?.about?.galleryTitle || 'Бүтээн байгуулалтын зураг'}
                  </h2>
                  <div className={contentStyles.galleryGrid}>
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
            </div>

            {aboutBlocks.history && (
              <AnimateOnScroll delay={420}>
                <div className={contentStyles.introBlock} style={{ marginBottom: 0 }}>
                  <h2 className={contentStyles.introTitle}>{tx.pages?.about?.historyTitle || 'Түүх'}</h2>
                  <p className={contentStyles.introBody}>{aboutBlocks.history}</p>
                </div>
              </AnimateOnScroll>
            )}
          </div>
        </section>

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
