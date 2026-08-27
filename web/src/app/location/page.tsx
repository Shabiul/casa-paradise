import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ATTRACTIONS_DATA } from '@/components/attractions/attractionData';
import { BUSINESS } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Location — Hotel in Panaji, Goa',
  description:
    'Casa Paradiso is located at Ghanekar Building, Rua José Falcão, Altinho, Panaji, Goa 403001 — on historic Altinho hill, close to the Mandovi riverfront, Fontainhas, and Panaji city centre.',
  alternates: { canonical: '/location' },
  openGraph: {
    title: 'Casa Paradiso Location | Hotel in Panaji, Goa',
    description: 'Find Casa Paradiso on Altinho hill in Panaji, Goa, close to the Mandovi riverfront and Fontainhas.',
    url: '/location',
    type: 'website',
  },
};

export default function LocationPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: 'Location' }]} />

      <section className="legal-page__hero" style={{ padding: '32px 0 40px' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--color-champagne-light)' }}>Find Us</span>
          <h1 className="legal-page__title">Casa Paradiso Location — Altinho, Panaji</h1>
          <p className="legal-page__subtitle">
            {BUSINESS.streetAddress}, {BUSINESS.addressLocality}, {BUSINESS.addressRegion} {BUSINESS.postalCode}
          </p>
        </div>
      </section>

      <section className="container" style={{ padding: '40px 24px 24px', maxWidth: 1140, margin: '0 auto' }}>
        <div className="legal-page__card">
          <div className="legal-page__section">
            <h2>Where Casa Paradiso Sits in Panaji</h2>
            <p>
              Casa Paradiso is a boutique hotel on historic Altinho hill, one of Panaji&apos;s oldest residential
              quarters, overlooking the city and the Mandovi River. The hotel is close to the Mandovi riverfront
              and its casino boarding points (about 5 minutes / 1.2 km away), and within reach of Panaji&apos;s
              cultural landmarks including the Fontainhas Latin Quarter and the Panjim Baroque Church.
            </p>
          </div>

          <div className="legal-page__section">
            <h2>Getting to Casa Paradiso</h2>
            <p>
              Guests arriving in Goa can reach Casa Paradiso by taxi, pre-booked transfer, or self-drive. Once at
              the hotel, scooters and self-drive cars are available for doorstep rental — see our{' '}
              <Link href="/rentals">rentals page</Link> for the full fleet and pricing.{' '}
              {/* TODO(manual verification): add a confirmed distance/drive-time from Goa's airport(s) once verified — not
                  invented here to avoid publishing an unverified travel-time claim. */}
            </p>
          </div>

          <div className="legal-page__section" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            <h2>Nearby Attractions</h2>
            <div className="info-grid">
              {ATTRACTIONS_DATA.map((a) => (
                <div className="info-grid__item" key={a.id}>
                  <h3><Link href={`/experiences/${a.id}`}>{a.title}</Link></h3>
                  <p>{a.location ?? a.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="legal-page__card" style={{ marginTop: 24 }}>
          <h2 style={{ marginBottom: 16 }}>Map & Directions</h2>
          <div className="footer__map-frame" style={{ height: 360 }}>
            <iframe
              title="Casa Paradiso location on Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.047!2d73.83!3d15.497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfc0fc3a58e44b%3A0x8a2bd60571ce41b3!2sCasa%20Paradiso%20Hotel!5e0!3m2!1sen!2sin!4v1693000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p style={{ marginTop: 16 }}>
            <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer" className="footer__map-directions">
              Get Directions on Google Maps →
            </a>
          </p>
          <div className="content-links">
            <Link href="/rooms">Rooms & Suites</Link>
            <Link href="/experiences">Things to Do Nearby</Link>
            <Link href="/contact">Contact Casa Paradiso</Link>
            <Link href="/#booking">Book Your Stay</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
