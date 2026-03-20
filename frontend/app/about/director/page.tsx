import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { getTranslations } from '@/lib/getLanguage';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';

export default async function DirectorPage() {
  const t = await getTranslations();

  // Use a nice office or team image for the director section
  const directorImage = 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1632&auto=format&fit=crop';
  const heroImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop';

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero" style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '12rem 0 8rem 0'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            background: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4))'
          }}></div>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <AnimateOnScroll>
              <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: '#fff' }}>
                {t.pages.director.title}
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#e2e8f0', maxWidth: '600px' }}>
                {t.pages.director.subtitle}
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Content Section */}
        <section style={{ padding: '6rem 0', background: '#fafafa' }}>
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '4rem',
              alignItems: 'center'
            }}>

              <AnimateOnScroll delay={100}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '600px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>
                  <Image
                    src={directorImage}
                    alt="Director"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '2rem',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                  }}>
                    <h3 style={{ color: '#fff', marginBottom: '0.2rem', fontSize: '1.5rem' }}>{t.pages.director.signature}</h3>
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={300}>
                <div style={{
                  background: '#fff',
                  padding: '3rem',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  position: 'relative'
                }}>
                  {/* Decorative Quote Icon */}
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '2rem',
                    background: 'var(--primary-orange)',
                    color: '#fff',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    boxShadow: 'var(--glow-orange)'
                  }}>
                    &quot;
                  </div>

                  <h2 style={{
                    marginBottom: '2rem',
                    color: 'var(--text-dark)',
                    fontSize: '2rem',
                    lineHeight: '1.3'
                  }}>
                    {t.pages.director.greeting}
                  </h2>

                  <div style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.9',
                    color: 'var(--text-medium)'
                  }}>
                    {[t.pages.director.paragraph1, t.pages.director.paragraph2, t.pages.director.paragraph3, t.pages.director.paragraph4]
                      .filter((text: string) => text && text.trim() !== '')
                      .map((text: string, index: number) => (
                        <p key={index} style={{ marginBottom: '1.5rem' }}>
                          {text}
                        </p>
                      ))}

                    <div style={{
                      marginTop: '3rem',
                      paddingTop: '2rem',
                      borderTop: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem'
                    }}>
                      <div>
                        <p style={{
                          fontWeight: '700',
                          color: 'var(--text-dark)',
                          fontSize: '1.2rem',
                          marginBottom: '0.2rem'
                        }}>
                          {t.pages.director.closing}
                        </p>
                        <p style={{ color: 'var(--primary-orange)', fontWeight: '600' }}>
                          {t.pages.director.signature}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
