import type { Metadata } from 'next';
import Link from 'next/link';
import Rentals from '@/components/Rentals';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BUSINESS, SITE_URL, absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Scooter & Self-Drive Car Rental in Panaji',
  description:
    'Rent a scooter or self-drive car at Casa Paradiso in Panaji with doorstep hotel pick-up and drop-off — Honda Activa, Honda Dio, Yamaha Fascino scooters, and Maruti Suzuki Swift or Ertiga self-drive cars.',
  alternates: { canonical: '/rentals' },
  openGraph: {
    title: 'Scooter & Self-Drive Car Rental in Panaji | Casa Paradiso',
    description: 'Doorstep scooter and self-drive car rental at Casa Paradiso, Panaji — Activa, Dio, Fascino, Swift, and Ertiga.',
    url: '/rentals',
    type: 'website',
    images: [absoluteUrl('/activa.png')],
  },
};

export default function RentalsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: 'Casa Paradiso Vehicle & Scooter Rentals Panaji',
    description:
      'Doorstep scooter and self-drive car rentals for guests and visitors in Panaji, Goa. Honda Activa, Dio, Fascino, Maruti Swift, and Ertiga 7-Seater.',
    url: `${SITE_URL}/rentals`,
    telephone: BUSINESS.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.addressCountry,
    },
    parentOrganization: {
      '@id': `${SITE_URL}/#organization`,
    },
    priceRange: '₹400 - ₹2,500 per day',
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs items={[{ label: 'Rentals' }]} />

      <section className="legal-page__hero" style={{ padding: '32px 0 40px' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--color-champagne-light)' }}>Seamless Mobility</span>
          <h1 className="legal-page__title">Scooter & Self-Drive Car Rental in Panaji</h1>
          <p className="legal-page__subtitle">
            Explore Goa at your own pace with doorstep pick-up and drop-off directly at Casa Paradiso.
          </p>
        </div>
      </section>

      <Rentals />

      <section className="container" style={{ padding: '0 24px 80px', maxWidth: 1140, margin: '0 auto' }}>
        <div className="legal-page__card">
          <div className="legal-page__section">
            <h2>Rental Fleet at a Glance</h2>
            <div className="info-grid">
              <div className="info-grid__item">
                <h3>2-Wheeler Scooters</h3>
                <p>Honda Activa, Honda Dio, and Yamaha Fascino (starting ₹400/day) — each with two helmets included, unlimited kilometers, and hotel doorstep delivery.</p>
              </div>
              <div className="info-grid__item">
                <h3>Self-Drive Cars</h3>
                <p>Maruti Suzuki Swift (5-seater hatchback at ₹1,500/day) and Maruti Suzuki Ertiga (7-seater MPV at ₹2,500/day), both air-conditioned with airport/hotel delivery.</p>
              </div>
              <div className="info-grid__item">
                <h3>Pick-up & Drop-off</h3>
                <p>All vehicles are delivered to and collected directly from Casa Paradiso doorstep — no need to visit a remote rental office.</p>
              </div>
            </div>
          </div>

          <div className="legal-page__section" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            <h2>Rental FAQs & Requirements</h2>
            <div className="qa-block" style={{ marginTop: 16 }}>
              <p className="qa-block__q">What documents are required to rent a vehicle?</p>
              <p className="qa-block__a">A valid original driving license (2-wheeler or 4-wheeler) and a government-issued photo ID are required at the time of handover.</p>
            </div>
            <div className="qa-block" style={{ marginTop: 16 }}>
              <p className="qa-block__q">Are helmets provided with scooters?</p>
              <p className="qa-block__a">Yes, two ISI-standard helmets are provided with every scooter rental in accordance with Goa traffic regulations.</p>
            </div>
            <div className="qa-block" style={{ marginTop: 16 }}>
              <p className="qa-block__q">Can non-hotel guests rent vehicles?</p>
              <p className="qa-block__a">Yes, visitors in Panaji may reserve scooters and cars subject to vehicle availability and ID verification.</p>
            </div>
          </div>

          <div className="content-links" style={{ marginTop: 28 }}>
            <Link href="/location">Where to Ride From Casa Paradiso</Link>
            <Link href="/experiences">Places to Visit Nearby</Link>
            <Link href="/rooms">Rooms & Suites</Link>
            <Link href="/#booking">Book Your Stay</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
