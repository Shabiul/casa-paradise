import type { Metadata } from 'next';
import Link from 'next/link';
import Dining from '@/components/Dining';
import Breadcrumbs from '@/components/Breadcrumbs';

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
  },
};

export default function DiningPage() {
  return (
    <main>
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
          <div className="legal-page__section" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            <h2>What&apos;s on the Menu?</h2>
            <p>
              The on-site restaurant at Casa Paradiso serves both vegetarian and non-vegetarian menus rooted in
              Goan cooking. Vegetarian guests can order Goan veg curries, paneer specialties, dal tadka, fresh
              breads, and thalis. Non-vegetarian guests can order fresh Mandovi river catch, authentic Goan fish
              curry, prawn balchão, chicken, and mutton. In-room dining is available alongside restaurant seating,
              across the full 7:00 AM – 11:00 PM service window.
            </p>
          </div>
          <div className="content-links">
            <Link href="/rooms">Rooms & Suites</Link>
            <Link href="/location">Hotel Location</Link>
            <Link href="/#booking">Book Your Stay</Link>
            <Link href="/#contact">Contact for Table Reservations</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
