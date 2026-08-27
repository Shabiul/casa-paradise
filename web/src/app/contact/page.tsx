import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BUSINESS } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact Casa Paradiso — Panaji Hotel, Goa',
  description:
    'Contact Casa Paradiso in Panaji, Goa by phone, WhatsApp, or email, or use the booking form to reserve a room, dining table, or vehicle rental directly.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Casa Paradiso | Panaji Hotel, Goa',
    description: 'Phone, WhatsApp, email, and address for Casa Paradiso, a boutique hotel in Panaji, Goa.',
    url: '/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  const telHref = `tel:${BUSINESS.telephoneDial}`;
  const whatsappHref = `https://wa.me/${BUSINESS.telephoneDial.replace('+', '')}?text=Hello%20Casa%20Paradiso%2C%20I%20would%20like%20to%20inquire%20about%20room%20availability.`;

  return (
    <main>
      <Breadcrumbs items={[{ label: 'Contact' }]} />

      <section className="legal-page__hero" style={{ padding: '32px 0 40px' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--color-champagne-light)' }}>Get in Touch</span>
          <h1 className="legal-page__title">Contact Casa Paradiso</h1>
          <p className="legal-page__subtitle">We&apos;re happy to help with bookings, dining, and rentals.</p>
        </div>
      </section>

      <section className="container" style={{ padding: '40px 24px 80px', maxWidth: 900, margin: '0 auto' }}>
        <div className="legal-page__card">
          <div className="info-grid">
            <div className="info-grid__item">
              <h3>Phone</h3>
              <p><a href={telHref}>{BUSINESS.telephone}</a></p>
            </div>
            <div className="info-grid__item">
              <h3>WhatsApp</h3>
              <p><a href={whatsappHref} target="_blank" rel="noopener noreferrer">Message on WhatsApp</a></p>
            </div>
            <div className="info-grid__item">
              <h3>Email</h3>
              <p><a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></p>
            </div>
            <div className="info-grid__item">
              <h3>Address</h3>
              <p>{BUSINESS.streetAddress}, {BUSINESS.addressLocality}, {BUSINESS.addressRegion} {BUSINESS.postalCode}</p>
            </div>
          </div>

          <div className="legal-page__section" style={{ borderBottom: 'none', marginTop: 32, marginBottom: 0, paddingBottom: 0 }}>
            <h2>Book Directly</h2>
            <p>
              The fastest way to check availability is our online booking form, which sends your enquiry
              straight to the front desk. You can also call or WhatsApp us directly using the details above.
            </p>
          </div>

          <div className="content-links">
            <Link href="/#booking">Book a Room</Link>
            <Link href="/location">Hotel Location & Map</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/rooms">Rooms & Suites</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
