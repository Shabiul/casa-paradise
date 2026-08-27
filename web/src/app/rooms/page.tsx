import type { Metadata } from 'next';
import Link from 'next/link';
import Rooms from '@/components/Rooms';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BUSINESS } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Rooms & Suites in Panaji, Goa',
  description:
    "Two room categories at Casa Paradiso in Panaji: the air-conditioned Paradise AC Suite and the Heritage Non-AC Room, across an intimate 18-room boutique hotel on Altinho hill.",
  alternates: { canonical: '/rooms' },
  openGraph: {
    title: 'Rooms & Suites in Panaji, Goa | Casa Paradiso',
    description:
      'Explore the Paradise AC Suite and Heritage Non-AC Room at Casa Paradiso, a boutique hotel on Altinho hill in Panaji, Goa.',
    url: '/rooms',
    type: 'website',
  },
};

export default function RoomsPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: 'Rooms' }]} />

      <section className="legal-page__hero" style={{ padding: '32px 0 40px' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--color-champagne-light)' }}>Accommodations</span>
          <h1 className="legal-page__title">Rooms & Suites at Casa Paradiso, Panaji</h1>
          <p className="legal-page__subtitle">
            {BUSINESS.numberOfRooms} rooms across two categories, set on historic Altinho hill in Panaji, Goa —
            steps from the Mandovi River and Panaji&apos;s cultural quarter.
          </p>
        </div>
      </section>

      <Rooms />

      <section className="container" style={{ padding: '0 24px 80px', maxWidth: 1140, margin: '0 auto' }}>
        <div className="legal-page__card">
          <div className="legal-page__section">
            <h2>Choosing a Room Type</h2>
            <p>
              Casa Paradiso offers two distinct room categories. The <strong>Paradise AC Suite</strong> is a
              climate-controlled suite with a king-size bed, workstation, smart TV, and private marble bath —
              suited to guests who want modern comfort. The <strong>Heritage Non-AC Room</strong> preserves
              classic Goan-Portuguese architecture with high ceilings, breezy windows, ceiling fans, and a
              vintage aesthetic — suited to guests who want an authentic heritage stay. Both room types include
              complimentary high-speed Wi-Fi and daily breakfast options.
            </p>
          </div>
          <div className="legal-page__section" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            <h2>Good to Know Before You Book</h2>
            <div className="info-grid">
              <div className="info-grid__item">
                <h3>Check-in / Check-out</h3>
                <p>Check-in from {BUSINESS.checkInTime}, check-out by {BUSINESS.checkOutTime}. Early check-in and late check-out are subject to availability.</p>
              </div>
              <div className="info-grid__item">
                <h3>Location</h3>
                <p>Perched on Altinho hill, roughly 5 minutes from the Mandovi riverfront and Panaji&apos;s offshore casino jetties.</p>
              </div>
              <div className="info-grid__item">
                <h3>Getting Around</h3>
                <p>Doorstep scooter and self-drive car rental is available directly at the hotel — see our <Link href="/rentals">rentals page</Link>.</p>
              </div>
            </div>
          </div>
          <div className="content-links">
            <Link href="/location">Hotel Location & Nearby Attractions</Link>
            <Link href="/experiences">Things to Do Near Casa Paradiso</Link>
            <Link href="/dining">On-site Dining</Link>
            <Link href="/faq">Full FAQ</Link>
            <Link href="/#booking">Book a Room</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
