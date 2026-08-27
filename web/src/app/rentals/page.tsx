import type { Metadata } from 'next';
import Link from 'next/link';
import Rentals from '@/components/Rentals';
import Breadcrumbs from '@/components/Breadcrumbs';

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
  },
};

export default function RentalsPage() {
  return (
    <main>
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
          <div className="legal-page__section" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            <h2>Rental Fleet at a Glance</h2>
            <div className="info-grid">
              <div className="info-grid__item">
                <h3>2-Wheeler Scooters</h3>
                <p>Honda Activa, Honda Dio, and Yamaha Fascino — each with two helmets included and unlimited kilometers.</p>
              </div>
              <div className="info-grid__item">
                <h3>Self-Drive Cars</h3>
                <p>Maruti Suzuki Swift (5-seater hatchback) and Maruti Suzuki Ertiga (7-seater MPV), both air-conditioned.</p>
              </div>
              <div className="info-grid__item">
                <h3>Pick-up & Drop-off</h3>
                <p>All vehicles are delivered to and collected from the hotel doorstep — no separate rental office visit required.</p>
              </div>
            </div>
          </div>
          <div className="content-links">
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
