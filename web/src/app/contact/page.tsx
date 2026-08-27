import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BUSINESS, SITE_URL, absoluteUrl } from '@/lib/seo';

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
    images: [absoluteUrl('/assets/hero.png')],
  },
};

export default function ContactPage() {
  const telHref = `tel:${BUSINESS.telephoneDial}`;
  const whatsappHref = `https://wa.me/${BUSINESS.telephoneDial.replace('+', '')}?text=Hello%20Casa%20Paradiso%2C%20I%20would%20like%20to%20inquire%20about%20room%20availability.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Casa Paradiso Hotel',
    url: `${SITE_URL}/contact`,
    mainEntity: {
      '@type': 'Hotel',
      name: BUSINESS.name,
      telephone: BUSINESS.telephone,
      email: BUSINESS.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: BUSINESS.streetAddress,
        addressLocality: BUSINESS.addressLocality,
        addressRegion: BUSINESS.addressRegion,
        postalCode: BUSINESS.postalCode,
        addressCountry: BUSINESS.addressCountry,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: BUSINESS.telephone,
        contactType: 'reservations & front desk',
        availableLanguage: ['English', 'Hindi', 'Konkani'],
      },
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
              <p><a href={telHref} style={{ color: 'var(--color-champagne)', fontWeight: 600 }}>{BUSINESS.telephone}</a></p>
            </div>
            <div className="info-grid__item">
              <h3>WhatsApp Concierge</h3>
              <p><a href={whatsappHref} target="_blank" rel="noopener noreferrer" style={{ color: '#34D399', fontWeight: 600 }}>Message on WhatsApp →</a></p>
            </div>
            <div className="info-grid__item">
              <h3>Email</h3>
              <p><a href={`mailto:${BUSINESS.email}`} style={{ color: 'var(--color-champagne)', fontWeight: 600 }}>{BUSINESS.email}</a></p>
            </div>
            <div className="info-grid__item">
              <h3>Address</h3>
              <p>{BUSINESS.streetAddress}, {BUSINESS.addressLocality}, {BUSINESS.addressRegion} {BUSINESS.postalCode}</p>
            </div>
          </div>

          <div className="legal-page__section" style={{ marginTop: 32 }}>
            <h2>Direct Booking Inquiries</h2>
            <p>
              The fastest way to check availability and book is our online reservation form, which submits your enquiry
              directly to our front desk team. You can also call or message us on WhatsApp for instant assistance.
            </p>
          </div>

          <div className="legal-page__section" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            <h2>Frequently Asked Questions</h2>
            <div className="qa-block" style={{ marginTop: 16 }}>
              <p className="qa-block__q">What is the front desk operating hours?</p>
              <p className="qa-block__a">Our front desk operates 24/7 to assist arriving guests and handle inquiries.</p>
            </div>
            <div className="qa-block" style={{ marginTop: 16 }}>
              <p className="qa-block__q">How do I inquire about group or extended stay bookings?</p>
              <p className="qa-block__a">Please email {BUSINESS.email} or contact us directly via WhatsApp at {BUSINESS.telephone}.</p>
            </div>
          </div>

          <div className="content-links" style={{ marginTop: 28 }}>
            <Link href="/#booking">Book a Room</Link>
            <Link href="/rooms">Rooms & Suites</Link>
            <Link href="/location">Hotel Location & Map</Link>
            <Link href="/dining">Restaurant & Dining</Link>
            <Link href="/rentals">Vehicle Rentals</Link>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
