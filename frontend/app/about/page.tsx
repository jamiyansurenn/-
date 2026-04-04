import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { getCompanyInfo, getTeamMembers } from '@/lib/api';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';
import { getLanguage, getTranslations } from '@/lib/getLanguage';
import leadershipStyles from '@/app/about/aboutLeadership.module.css';
import contentStyles from '@/app/about/aboutContent.module.css';
import { mergeCompanyAboutBlocks } from '@/lib/companyAboutMerge';
import {
  splitIntoParagraphs,
  splitVisionAndWhatWeDo,
  formatValuesForDisplay,
} from '@/lib/aboutContentParse';
import PageHero from '@/components/corporate/PageHero';
import { getCmsPage } from '@/lib/page-cms';
import { AboutHighlightGlyph, AboutServiceGlyph } from '@/components/about/AboutIcons';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const t = await getTranslations();
  const lang = await getLanguage();
  const cmsPage = await getCmsPage('about');
  const tx = t as any;
  const pa = tx.pages?.about ?? {};

  let companyInfo: { data: any } = { data: null };
  let teamMembers: { data: any } = { data: [] };
  const serviceHighlights: string[] = pa.serviceHighlights || [
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
    if (results[0].status === 'fulfilled') companyInfo = results[0].value || { data: null };
    if (results[1].status === 'fulfilled') teamMembers = results[1].value || { data: [] };
  } catch {
    /* empty */
  }

  const ha = tx.home?.about ?? {};
  const aboutBlocks = mergeCompanyAboutBlocks(companyInfo.data, {
    aboutUs: ha.aboutUs,
    vision: ha.vision,
    mission: ha.mission,
    values: ha.values,
  });

  const introParagraphs = splitIntoParagraphs(aboutBlocks.aboutUs);
  const { visionIntro, whatWeDoBlocks } = splitVisionAndWhatWeDo(aboutBlocks.vision, lang);
  const visionForCard = whatWeDoBlocks.length > 0 ? visionIntro : (aboutBlocks.vision || '').trim();
  const visionParagraphs = splitIntoParagraphs(visionForCard);
  const missionParagraphs = splitIntoParagraphs(aboutBlocks.mission);
  const { paragraphs: valuesParagraphs, bullets: valuesBullets } = formatValuesForDisplay(aboutBlocks.values);
  const historyParagraphs = splitIntoParagraphs(aboutBlocks.history);

  const whatWeDoTitle = pa.whatWeDoTitle || 'Бид юу хийдэг вэ?';
  const introSectionTitle = pa.introSectionTitle || pa.title || t.pages.about.title;

  const hasHighlightRow =
    (visionForCard && visionParagraphs.length > 0) ||
    (aboutBlocks.mission && missionParagraphs.length > 0) ||
    (aboutBlocks.values && (valuesParagraphs.length > 0 || valuesBullets.length > 0));

  return (
    <>
      <Header />
      <main>
        <PageHero title={(cmsPage?.title as string) || t.pages.about.title} backgroundImage={getImageUrl(undefined, 'default', 1)} />

        <section className={contentStyles.section}>
          <div className="container">
            <div className={contentStyles.pageInner}>
              {introParagraphs.length > 0 && (
                <AnimateOnScroll delay={60}>
                  <div className={contentStyles.introStack}>
                    <div className={contentStyles.introMeta}>
                      {ha.introEyebrow ? <p className={contentStyles.introEyebrow}>{ha.introEyebrow}</p> : null}
                      {ha.brandLine ? <p className={contentStyles.introBrand}>{ha.brandLine}</p> : null}
                      <h2 className={contentStyles.introSectionLabel}>{introSectionTitle}</h2>
                    </div>
                    <div className={contentStyles.introPanels}>
                      {introParagraphs.map((para, i) => (
                        <div
                          key={i}
                          className={`${contentStyles.introPanel} ${i === 0 ? contentStyles.introPanelLead : ''}`}
                        >
                          <p>{para}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimateOnScroll>
              )}

              {hasHighlightRow ? (
                <div className={contentStyles.highlightSection}>
                  <div className={contentStyles.highlightGrid}>
                    {visionParagraphs.length > 0 ? (
                      <AnimateOnScroll delay={80}>
                        <article className={contentStyles.highlightCard}>
                          <div className={contentStyles.highlightIcon}>
                            <AboutHighlightGlyph variant="vision" />
                          </div>
                          <h3 className={contentStyles.highlightTitle}>{t.home.about.visionTitle}</h3>
                          <div className={contentStyles.highlightBody}>
                            {visionParagraphs.map((p, i) => (
                              <p key={i}>{p}</p>
                            ))}
                          </div>
                        </article>
                      </AnimateOnScroll>
                    ) : null}

                    {missionParagraphs.length > 0 ? (
                      <AnimateOnScroll delay={120}>
                        <article className={contentStyles.highlightCard}>
                          <div className={contentStyles.highlightIcon}>
                            <AboutHighlightGlyph variant="mission" />
                          </div>
                          <h3 className={contentStyles.highlightTitle}>{t.home.about.missionTitle}</h3>
                          <div className={contentStyles.highlightBody}>
                            {missionParagraphs.map((p, i) => (
                              <p key={i}>{p}</p>
                            ))}
                          </div>
                        </article>
                      </AnimateOnScroll>
                    ) : null}

                    {valuesParagraphs.length > 0 || valuesBullets.length > 0 ? (
                      <AnimateOnScroll delay={160}>
                        <article className={contentStyles.highlightCard}>
                          <div className={contentStyles.highlightIcon}>
                            <AboutHighlightGlyph variant="values" />
                          </div>
                          <h3 className={contentStyles.highlightTitle}>{pa.valuesTitle || 'Үнэт зүйлс'}</h3>
                          <div className={contentStyles.highlightBody}>
                            {valuesParagraphs.map((p, i) => (
                              <p key={i}>{p}</p>
                            ))}
                            {valuesBullets.length > 0 ? (
                              <ul className={contentStyles.highlightList}>
                                {valuesBullets.map((b) => (
                                  <li key={b}>{b}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        </article>
                      </AnimateOnScroll>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {whatWeDoBlocks.length > 0 ? (
                <AnimateOnScroll delay={100}>
                  <div className={contentStyles.whatWeDoSection}>
                    <h2 className={contentStyles.blockSectionTitle}>{whatWeDoTitle}</h2>
                    <div className={contentStyles.whatWeDoGrid}>
                      {whatWeDoBlocks.map((block, idx) => (
                        <article key={`${block.title}-${idx}`} className={contentStyles.whatWeDoCard}>
                          <h4 className={contentStyles.whatWeDoCardTitle}>{block.title}</h4>
                          {block.detail ? <p className={contentStyles.whatWeDoCardBody}>{block.detail}</p> : null}
                        </article>
                      ))}
                    </div>
                  </div>
                </AnimateOnScroll>
              ) : null}

              <div className={contentStyles.subSectionsWrap}>
                <AnimateOnScroll delay={140}>
                  <div className={contentStyles.serviceHighlightsBlock}>
                    <h2 className={contentStyles.sectionHeading}>
                      {pa.serviceHighlightsTitle || 'Үндсэн чиглэлүүд'}
                    </h2>
                    <div className={contentStyles.serviceGrid}>
                      {serviceHighlights.map((item: string, index: number) => (
                        <div key={item} className={contentStyles.serviceHighlightCard}>
                          <div className={contentStyles.serviceIconWrap}>
                            <AboutServiceGlyph index={index} />
                          </div>
                          <p className={contentStyles.serviceHighlightLabel}>{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimateOnScroll>

                <AnimateOnScroll delay={180}>
                  <div className={contentStyles.galleryBlock}>
                    <h2 className={contentStyles.sectionHeading}>
                      {pa.galleryTitle || 'Бүтээн байгуулалтын зураг'}
                    </h2>
                    <div className={contentStyles.galleryGrid}>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={contentStyles.galleryCell}>
                          <Image
                            src={getImageUrl(undefined, i % 2 === 0 ? 'construction' : 'building', i)}
                            alt={`${pa.galleryImageAlt || 'Gallery'} ${i + 1}`}
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

              {historyParagraphs.length > 0 ? (
                <AnimateOnScroll delay={200}>
                  <div className={contentStyles.historyBlock}>
                    <h2 className={contentStyles.historyTitle}>{pa.historyTitle || 'Түүх'}</h2>
                    <div className={contentStyles.introPanels}>
                      {historyParagraphs.map((para, i) => (
                        <div key={i} className={contentStyles.introPanel}>
                          <p>{para}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimateOnScroll>
              ) : null}
            </div>
          </div>
        </section>

        {teamMembers.data && teamMembers.data.length > 0 ? (
          <section className={leadershipStyles.leadershipSection}>
            <div className="container">
              <header className={leadershipStyles.sectionHeader}>
                <AnimateOnScroll>
                  <h2 className={leadershipStyles.sectionTitle}>{pa.teamTitle || 'Удирдлагын баг'}</h2>
                  {pa.teamLead ? <p className={leadershipStyles.sectionLead}>{pa.teamLead}</p> : null}
                </AnimateOnScroll>
              </header>
              <div className={leadershipStyles.grid}>
                {teamMembers.data.map((member: any, index: number) => {
                  const imageUrl = getImageUrl(member.image, 'team', index);
                  return (
                    <AnimateOnScroll key={member.id} delay={index * 70}>
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
                          {member.position ? <span className={leadershipStyles.rolePill}>{member.position}</span> : null}
                          {member.bio ? <p className={leadershipStyles.bio}>{member.bio}</p> : null}
                        </div>
                      </article>
                    </AnimateOnScroll>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
