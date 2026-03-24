import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Link from 'next/link';
import { getImageUrl } from '@/lib/imagePlaceholder';
import { getTranslations } from '@/lib/getLanguage';
import { getCareers } from '@/lib/api';

export default async function CareersPage() {
  const t = await getTranslations();
  const careersResponse = await getCareers();
  const jobPositions = careersResponse.data || [];

  return (
    <>
      <Header />
      <main>
        <section className="hero" style={{ 
          position: 'relative', 
          overflow: 'hidden',
          backgroundImage: `url(${getImageUrl(undefined, 'default', 3)})`,
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
              <h1>{t.pages.careers.title}</h1>
              <p>{t.pages.careers.subtitle}</p>
            </AnimateOnScroll>
          </div>
        </section>

        <section style={{ padding: '4rem 0', background: '#fafafa' }}>
          <div className="container">
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              {jobPositions.map((job: any, index: number) => (
                <AnimateOnScroll key={job.id} delay={index * 100}>
                  <div
                    style={{
                      background: '#fff',
                      borderRadius: '12px',
                      padding: '2rem',
                      marginBottom: '2rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                    className="job-card card"
                  >
                    <h2 style={{ marginBottom: '1rem', color: 'var(--primary-orange)' }}>{job.title}</h2>
                    <p style={{ marginBottom: '1.5rem', lineHeight: '1.8', color: 'var(--text-gray)' }}>
                      {job.description}
                    </p>
                    {job.details && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <p style={{ whiteSpace: 'pre-line', lineHeight: '1.8', color: 'var(--text-gray)' }}>
                          {job.details}
                        </p>
                      </div>
                    )}
                    <Link
                      href={`/careers/application?position=${encodeURIComponent(job.title)}`}
                      className="btn"
                    >
                      {t.pages.careers.apply}
                    </Link>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '4rem 0', textAlign: 'center' }}>
          <div className="container">
            <AnimateOnScroll>
              <h2 className="section-title">{t.pages.careers.otherJobs}</h2>
              <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: 'var(--text-gray)' }}>
                {t.pages.careers.contactForJobs}
              </p>
              <Link href="/contact" className="btn">
                {t.nav.contact}
              </Link>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
