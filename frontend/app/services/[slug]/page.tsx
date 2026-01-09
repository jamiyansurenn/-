import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getServiceBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug).catch(() => ({ data: null }));

  if (!service.data) {
    notFound();
  }

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="container">
            <h1>{service.data.title}</h1>
          </div>
        </section>

        <section>
          <div className="container">
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '8px', marginBottom: '2rem', overflow: 'hidden' }}>
                <Image
                  src={getImageUrl(service.data.image, 'service')}
                  alt={service.data.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 900px"
                />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#666' }}>
                  {service.data.description}
                </p>
              </div>
              {service.data.content && (
                <div style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                  {service.data.content}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
