import type { Metadata } from 'next';
import Link from 'next/link';
import Experiences from '@/components/Experiences';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ATTRACTIONS_DATA } from '@/components/attractions/attractionData';
import { SITE_URL, absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Things to Do in Panaji, Goa',
  description:
    'Things to do near Casa Paradiso in Panaji: the Mandovi River and offshore casinos, Fontainhas Latin Quarter, Fort Aguada, Miramar & Dona Paula, and the Panjim Baroque Church.',
  alternates: { canonical: '/experiences' },
  openGraph: {
    title: 'Things to Do in Panaji, Goa | Casa Paradiso',
    description: 'Explore attractions near Casa Paradiso in Panaji, Goa — Mandovi River, Fontainhas, Fort Aguada, Miramar, Dona Paula, and Panjim Church.',
    url: '/experiences',
    type: 'website',
    images: [absoluteUrl('/WhatsApp Image 2026-08-11 at 7.25.40 PM (1).jpeg')],
  },
};

export default function ExperiencesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top Things to Do Near Casa Paradiso in Panaji, Goa',
    description: 'Curated attractions, heritage walks, river cruises, and beaches close to Casa Paradiso on Altinho hill.',
    itemListElement: ATTRACTIONS_DATA.map((attraction, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: attraction.title,
      url: `${SITE_URL}/experiences/${attraction.id}`,
      description: attraction.description,
      image: absoluteUrl(attraction.images[0].src),
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs items={[{ label: 'Experiences' }]} />

      <section className="legal-page__hero" style={{ padding: '32px 0 40px' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--color-champagne-light)' }}>Goan Experiences</span>
          <h1 className="legal-page__title">Things to Do Near Casa Paradiso, Panaji</h1>
          <p className="legal-page__subtitle">
            Panaji&apos;s riverfront, heritage quarter, forts, beaches, and colonial landmarks — all within easy
            reach of the hotel on Altinho hill.
          </p>
        </div>
      </section>

      <Experiences />

      <section className="container" style={{ padding: '0 24px 80px', maxWidth: 1140, margin: '0 auto' }}>
        <div className="legal-page__card">
          <div className="legal-page__section">
            <h2>Explore Each Attraction In-Depth</h2>
            <div className="info-grid">
              {ATTRACTIONS_DATA.map((a) => (
                <div className="info-grid__item" key={a.id}>
                  <h3>
                    <Link href={`/experiences/${a.id}`}>{a.title}</Link>
                  </h3>
                  <p>{a.description}</p>
                  <p style={{ marginTop: '8px' }}>
                    <Link href={`/experiences/${a.id}`} style={{ color: 'var(--color-champagne)', fontWeight: 600 }}>
                      Read Guide & Directions →
                    </Link>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="legal-page__section" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            <h2>Frequently Asked Questions About Sightseeing</h2>
            <div className="qa-block" style={{ marginTop: 16 }}>
              <p className="qa-block__q">How far is Fontainhas Latin Quarter from Casa Paradiso?</p>
              <p className="qa-block__a">Fontainhas is located just down Altinho hill, reachable in about 3 to 5 minutes by walking or scooter.</p>
            </div>
            <div className="qa-block" style={{ marginTop: 16 }}>
              <p className="qa-block__q">What is the best way to explore Panaji attractions?</p>
              <p className="qa-block__a">Renting a scooter or self-drive car directly at Casa Paradiso provides the greatest flexibility to visit beaches, forts, and heritage sites.</p>
            </div>
          </div>

          <div className="content-links" style={{ marginTop: 28 }}>
            <Link href="/location">Hotel Location & Map</Link>
            <Link href="/rentals">Scooter & Car Rental</Link>
            <Link href="/rooms">Rooms & Suites</Link>
            <Link href="/dining">In-House Dining</Link>
            <Link href="/#booking">Book Your Stay</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
