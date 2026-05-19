import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { getCompanyInfo, getTeamMembers } from '@/lib/api';
import Image from 'next/image';
import { getImageUrl, getTeamMemberDisplayImage } from '@/lib/imagePlaceholder';
import { getLanguage, getTranslations } from '@/lib/getLanguage';
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
import TeamMemberAvatar from '@/components/about/TeamMemberAvatar';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const t = await getTranslations();
  const lang = await getLanguage();
  let cmsPage = null;
  try {
    cmsPage = await getCmsPage('about');
  } catch {
    cmsPage = null;
  }
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

        {Array.isArray(teamMembers.data) && teamMembers.data.length > 0 ? (
          <section
            className="border-t border-slate-200/70 bg-[#fafafa] py-20 md:py-24 lg:py-28"
            aria-labelledby="leadership-heading"
          >
            <div className="container">
              <header className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
                <AnimateOnScroll>
                  <h2
                    id="leadership-heading"
                    className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl"
                  >
                    {pa.teamTitle || 'Удирдлагын баг'}
                  </h2>
                  {pa.teamLead ? (
                    <p className="mt-4 text-base font-normal leading-relaxed text-slate-500">{pa.teamLead}</p>
                  ) : null}
                </AnimateOnScroll>
              </header>
              <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-14 sm:gap-y-16 md:grid-cols-2 md:gap-x-12 xl:grid-cols-4 xl:gap-x-14 xl:gap-y-20">
                {teamMembers.data.map((member: any, index: number) => {
                  const imageUrl = getTeamMemberDisplayImage(member.image);
                  const subtitle =
                    typeof member.company === 'string' && member.company.trim()
                      ? member.company.trim()
                      : typeof member.subtitle === 'string' && member.subtitle.trim()
                        ? member.subtitle.trim()
                        : null;
                  const tertiary =
                    subtitle ||
                    (typeof member.bio === 'string' && member.bio.trim() ? member.bio.trim() : null);
                  return (
                    <AnimateOnScroll key={member.id} delay={Math.min(index, 12) * 40}>
                      <article className="flex h-full flex-col items-center px-2 text-center sm:px-3">
                        <TeamMemberAvatar src={imageUrl ?? ''} alt={member.name} />
                        <h3 className="mt-0 text-base font-semibold leading-snug text-slate-900">
                          {member.name}
                        </h3>
                        {member.position ? (
                          <p className="mt-1.5 max-w-[16rem] text-sm font-normal leading-relaxed text-slate-500">
                            {member.position}
                          </p>
                        ) : null}
                        {tertiary ? (
                          <p className="mt-2 max-w-[17rem] text-xs font-normal leading-relaxed text-slate-400 sm:text-[0.8125rem] line-clamp-4">
                            {tertiary}
                          </p>
                        ) : null}
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
