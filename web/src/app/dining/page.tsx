import type { Metadata } from 'next';
import Link from 'next/link';
import Dining from '@/components/Dining';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BUSINESS, SITE_URL, absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Dining & Goan Cuisine in Panaji',
  description:
    'On-site vegetarian and non-vegetarian Goan dining at Casa Paradiso in Panaji — fresh Mandovi seafood, classic Goan curries, and all-day restaurant service from 7:00 AM to 11:00 PM.',
  alternates: { canonical: '/dining' },
  openGraph: {
    title: 'Dining & Goan Cuisine in Panaji | Casa Paradiso',
    description: 'Vegetarian and non-vegetarian Goan dining at Casa Paradiso, Panaji, including fresh Mandovi seafood and classic Goan curries.',
    url: '/dining',
    type: 'website',
    images: [absoluteUrl('/assets/wa-photo-3.jpeg')],
  },
};

export default function DiningPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Casa Paradiso Restaurant & In-Room Dining',
    description:
      'On-site restaurant serving vegetarian and non-vegetarian authentic Goan cuisine, seafood, thalis, and refreshments.',
    url: `${SITE_URL}/dining`,
    image: absoluteUrl('/assets/wa-photo-3.jpeg'),
    telephone: BUSINESS.telephone,
    servesCuisine: ['Goan', 'Indian', 'Seafood'],
    priceRange: '₹₹',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '07:00',
        closes: '23:00',
      },
    ],
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
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs items={[{ label: 'Dining' }]} />

      <section className="legal-page__hero" style={{ padding: '32px 0 40px' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--color-champagne-light)' }}>In-House Gastronomy</span>
          <h1 className="legal-page__title">Dining at Casa Paradiso, Panaji</h1>
          <p className="legal-page__subtitle">
            Authentic vegetarian and non-vegetarian Goan cuisine, served on-site from 7:00 AM to 11:00 PM.
          </p>
        </div>
      </section>

      <Dining />

      <section className="container" style={{ padding: '0 24px 80px', maxWidth: 1140, margin: '0 auto' }}>
        <div className="legal-page__card">
          <div className="legal-page__section">
            <h2>Culinary Philosophy & Menu Highlights</h2>
            <p>
              The on-site restaurant at Casa Paradiso serves both vegetarian and non-vegetarian menus rooted in
              traditional Goan cooking. Vegetarian guests can order Goan veg curries, paneer specialties, dal tadka, fresh
              breads, and wholesome breakfast thalis. Non-vegetarian guests can enjoy fresh Mandovi river catch, authentic Goan fish
              curry, prawn balchão, chicken, and mutton delicacies. In-room dining is available alongside intimate restaurant seating,
              across the full 7:00 AM – 11:00 PM service window.
            </p>
          </div>

          <div className="legal-page__section" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            <h2>Dining FAQ & Direct Information</h2>
            <div className="qa-block" style={{ marginTop: 16 }}>
              <p className="qa-block__q">What are the restaurant operating hours?</p>
              <p className="qa-block__a">The restaurant and in-room dining service operate daily from 7:00 AM to 11:00 PM.</p>
            </div>
            <div className="qa-block" style={{ marginTop: 16 }}>
              <p className="qa-block__q">Does Casa Paradiso offer pure vegetarian options?</p>
              <p className="qa-block__a">Yes. We offer dedicated pure vegetarian preparations including Goan veg curries, paneer dishes, dal, and fresh breads.</p>
            </div>
            <div className="qa-block" style={{ marginTop: 16 }}>
              <p className="qa-block__q">Can outside visitors reserve a table?</p>
              <p className="qa-block__a">Table reservations are welcome for both hotel guests and visitors. Contact our front desk or use the reservation form above.</p>
            </div>
          </div>

          <div className="content-links" style={{ marginTop: 28 }}>
            <Link href="/rooms">Rooms & Suites</Link>
            <Link href="/location">Hotel Location</Link>
            <Link href="/rentals">Scooter & Car Rental</Link>
            <Link href="/#booking">Book Your Stay</Link>
            <Link href="/#contact">Contact for Table Reservations</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
