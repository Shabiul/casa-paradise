import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ATTRACTIONS_DATA } from '@/components/attractions/attractionData';
import { absoluteUrl, BUSINESS, SITE_URL } from '@/lib/seo';

export function generateStaticParams() {
  return ATTRACTIONS_DATA.map((a) => ({ slug: a.id }));
}

function getAttraction(slug: string) {
  return ATTRACTIONS_DATA.find((a) => a.id === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const attraction = getAttraction(params.slug);
  if (!attraction) return {};

  const title = `${attraction.title} — Near Casa Paradiso, Panaji`;
  const description = `${attraction.description} Casa Paradiso, a boutique hotel on Altinho hill in Panaji, is one of the closest places to stay for visiting ${attraction.title}.`;

  return {
    title,
    description,
    alternates: { canonical: `/experiences/${attraction.id}` },
    openGraph: {
      title,
      description,
      url: `/experiences/${attraction.id}`,
      type: 'article',
      images: [absoluteUrl(attraction.images[0].src)],
    },
  };
}

export default function ExperienceDetailPage({ params }: { params: { slug: string } }) {
  const attraction = getAttraction(params.slug);
  if (!attraction) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: attraction.title,
    description: attraction.description,
    url: `${SITE_URL}/experiences/${attraction.id}`,
    image: absoluteUrl(attraction.images[0].src),
    ...(attraction.location ? { address: attraction.location } : {}),
  };

  const others = ATTRACTIONS_DATA.filter((a) => a.id !== attraction.id);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs
        items={[
          { label: 'Experiences', href: '/experiences' },
          { label: attraction.shortTitle ?? attraction.title },
        ]}
      />

      <section className="legal-page__hero" style={{ padding: '32px 0 40px' }}>
        <div className="container">
          {attraction.category && (
            <span className="section-label" style={{ color: 'var(--color-champagne-light)' }}>{attraction.category}</span>
          )}
          <h1 className="legal-page__title">{attraction.title}</h1>
          {attraction.subtitle && <p className="legal-page__subtitle">{attraction.subtitle}</p>}
        </div>
      </section>

      <section className="container" style={{ padding: '40px 24px 80px', maxWidth: 1000, margin: '0 auto' }}>
        <div className="legal-page__card">
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
            <Image
              src={attraction.images[0].src}
              alt={attraction.images[0].alt || attraction.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 900px"
              priority={false}
            />
          </div>

          <div className="legal-page__section" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            <h2>About {attraction.title}</h2>
            <p>{attraction.description}</p>

            {attraction.location && (
              <p style={{ marginTop: 16 }}>
                <strong>Where it is:</strong> {attraction.location}.
              </p>
            )}

            <div className="qa-block" style={{ marginTop: 28 }}>
              <p className="qa-block__q">How far is {attraction.title} from Casa Paradiso?</p>
              <p className="qa-block__a">
                Casa Paradiso is located on Altinho hill in central Panaji, close to the city&apos;s main
                riverfront and heritage sites.{' '}
                {attraction.id === 'mandovi-cruise-casinos'
                  ? 'The Mandovi riverfront and its casino boarding points are approximately 5 minutes (about 1.2 km) from the hotel.'
                  : 'Exact travel time depends on traffic and mode of transport; ask our front desk or book a scooter or self-drive car directly at the hotel for the easiest way to get there.'}
              </p>
            </div>
          </div>

          <div className="content-links">
            <Link href="/experiences">All Experiences</Link>
            <Link href="/location">Hotel Location</Link>
            <Link href="/rentals">Scooter & Car Rental</Link>
            <Link href="/#booking">Book Your Stay</Link>
          </div>
        </div>

        <div className="legal-page__card" style={{ marginTop: 24 }}>
          <h2 style={{ marginBottom: 16 }}>Other Nearby Experiences</h2>
          <div className="info-grid">
            {others.map((a) => (
              <div className="info-grid__item" key={a.id}>
                <h3><Link href={`/experiences/${a.id}`}>{a.title}</Link></h3>
                <p>{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
