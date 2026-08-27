import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ATTRACTIONS_DATA } from '@/components/attractions/attractionData';
import { BUSINESS, SITE_URL, absoluteUrl } from '@/lib/seo';

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
    images: [absoluteUrl('/assets/hero.png')],
  },
};

export default function LocationPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: BUSINESS.name,
    description: BUSINESS.description,
    url: `${SITE_URL}/location`,
    telephone: BUSINESS.telephone,
    hasMap: BUSINESS.mapsUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            <h2>Where Casa Paradiso Sits in Panaji, Goa</h2>
            <p>
              Casa Paradiso is a boutique heritage hotel situated on historic Altinho hill, one of Panaji&apos;s oldest
              and most prestigious residential quarters. Overlooking the city and the Mandovi River, the hotel offers a
              quiet hilltop haven while remaining within minutes of Panaji&apos;s most sought-after cultural, dining, and
              entertainment destinations.
            </p>
          </div>

          <div className="legal-page__section">
            <h2>Proximity to Major Landmarks & Attractions</h2>
            <div className="info-grid">
              <div className="info-grid__item">
                <h3>Mandovi River & Offshore Casinos</h3>
                <p>Located roughly 5 minutes (1.2 km) downhill from the hotel to the jetty boarding points for Deltin Royale, Big Daddy, and scenic sunset catamarans.</p>
              </div>
              <div className="info-grid__item">
                <h3>Fontainhas Latin Quarter</h3>
                <p>Asia’s only surviving Latin quarter is located just down the hill, renowned for Portuguese villas, art galleries, and heritage bakeries.</p>
              </div>
              <div className="info-grid__item">
                <h3>Panjim Baroque Church</h3>
                <p>Our Lady of the Immaculate Conception Church at Church Square is a short 5-minute ride from the property.</p>
              </div>
              <div className="info-grid__item">
                <h3>Miramar & Dona Paula</h3>
                <p>Golden shoreline walks and the Arabian Sea coastline are easily accessible within 10 to 15 minutes by scooter or car.</p>
              </div>
            </div>
          </div>

          <div className="legal-page__section">
            <h2>How to Reach Casa Paradiso</h2>
            <p>
              Guests can reach Casa Paradiso via prepaid airport/railway taxi, private cab, or self-drive vehicle. We offer
              doorstep scooter and car rentals directly at the hotel — visit our <Link href="/rentals">rentals page</Link> for
              options and vehicle reservations.
            </p>
          </div>

          <div className="legal-page__section" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            <h2>Location & Access FAQ</h2>
            <div className="qa-block" style={{ marginTop: 16 }}>
              <p className="qa-block__q">What is the exact street address of Casa Paradiso?</p>
              <p className="qa-block__a">{BUSINESS.streetAddress}, {BUSINESS.addressLocality}, {BUSINESS.addressRegion} {BUSINESS.postalCode}, India.</p>
            </div>
            <div className="qa-block" style={{ marginTop: 16 }}>
              <p className="qa-block__q">Is parking or vehicle access available on Altinho hill?</p>
              <p className="qa-block__a">Yes, Altinho hill is fully accessible by two-wheelers and four-wheelers with convenient doorstep drop-off and pickup.</p>
            </div>
            <div className="qa-block" style={{ marginTop: 16 }}>
              <p className="qa-block__q">How close is the hotel to Panaji city center?</p>
              <p className="qa-block__a">Casa Paradiso is located within central Panaji, less than 5 minutes from Church Square, MG Road, and the central market.</p>
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
          <div className="content-links" style={{ marginTop: 24 }}>
            <Link href="/rooms">Rooms & Suites</Link>
            <Link href="/experiences">Things to Do Nearby</Link>
            <Link href="/rentals">Scooter & Car Rentals</Link>
            <Link href="/contact">Contact Casa Paradiso</Link>
            <Link href="/#booking">Book Your Stay</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
