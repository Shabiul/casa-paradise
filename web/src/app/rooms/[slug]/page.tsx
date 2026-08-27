import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ROOMS_DATA, RoomDetail } from '@/lib/roomsData';
import { absoluteUrl, BUSINESS, SITE_URL } from '@/lib/seo';

export function generateStaticParams() {
  return ROOMS_DATA.map((room) => ({ slug: room.id }));
}

function getRoom(slug: string): RoomDetail | undefined {
  return ROOMS_DATA.find((r) => r.id === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const room = getRoom(params.slug);
  if (!room) return {};

  const title = `${room.name} — Hotel Room in Panaji, Goa`;
  const description = `${room.description} Stay at ${room.name} at Casa Paradiso, an intimate 18-room boutique hotel on Altinho hill in Panaji, Goa.`;

  return {
    title,
    description,
    alternates: { canonical: `/rooms/${room.id}` },
    openGraph: {
      title: `${room.name} | Casa Paradiso, Panaji, Goa`,
      description,
      url: `/rooms/${room.id}`,
      type: 'website',
      images: [absoluteUrl(room.image)],
    },
  };
}

export default function RoomDetailPage({ params }: { params: { slug: string } }) {
  const room = getRoom(params.slug);
  if (!room) notFound();

  const hotelId = `${SITE_URL}/#hotel`;
  const otherRooms = ROOMS_DATA.filter((r) => r.id !== room.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HotelRoom',
    name: room.name,
    description: room.longDescription,
    url: `${SITE_URL}/rooms/${room.id}`,
    image: absoluteUrl(room.image),
    bed: room.bedType,
    occupancy: {
      '@type': 'QuantitativeValue',
      minValue: 1,
      maxValue: 3,
    },
    amenityFeature: room.amenities.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
      value: true,
    })),
    containedInPlace: {
      '@id': hotelId,
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Rooms', href: '/rooms' },
          { label: room.name },
        ]}
      />

      <section className="legal-page__hero" style={{ padding: '32px 0 40px' }}>
        <div className="container">
          {room.badge && (
            <span className="section-label" style={{ color: 'var(--color-champagne-light)' }}>
              {room.badge}
            </span>
          )}
          <h1 className="legal-page__title">{room.name}</h1>
          <p className="legal-page__subtitle">{room.tagline}</p>
        </div>
      </section>

      <section className="container" style={{ padding: '40px 24px 80px', maxWidth: 1000, margin: '0 auto' }}>
        <div className="legal-page__card">
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
            <Image
              src={room.image}
              alt={room.alt}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 900px"
              priority
            />
          </div>

          <div className="legal-page__section">
            <h2>Overview & Architecture</h2>
            <p>{room.longDescription}</p>
          </div>

          <div className="legal-page__section">
            <h2>Room Key Highlights</h2>
            <div className="info-grid">
              <div className="info-grid__item">
                <h3>Climate & Airflow</h3>
                <p>{room.climateControl}</p>
              </div>
              <div className="info-grid__item">
                <h3>Bed & Sleeping Setup</h3>
                <p>{room.bedType}</p>
              </div>
              <div className="info-grid__item">
                <h3>En-Suite Bath</h3>
                <p>{room.bathroom}</p>
              </div>
              <div className="info-grid__item">
                <h3>Room View</h3>
                <p>{room.view}</p>
              </div>
            </div>
          </div>

          <div className="legal-page__section">
            <h2>Room Amenities & Inclusions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: '16px' }}>
              {room.amenities.map((amenity, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px' }}>
                  <span style={{ color: 'var(--color-champagne)' }}>✓</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="legal-page__section">
            <h2>Tariff & Pricing Overview</h2>
            <p style={{ marginBottom: 16 }}>
              Standard direct tariffs per night (subject to seasonal variation and taxes):
            </p>
            <div className="info-grid">
              <div className="info-grid__item">
                <h3>Single Occupancy</h3>
                <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-champagne)' }}>
                  ₹{room.startingPrice.single.toLocaleString('en-IN')}{' '}
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>/ night</span>
                </p>
              </div>
              <div className="info-grid__item">
                <h3>Double Occupancy</h3>
                <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-champagne)' }}>
                  ₹{room.startingPrice.double.toLocaleString('en-IN')}{' '}
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>/ night</span>
                </p>
              </div>
              <div className="info-grid__item">
                <h3>Triple Occupancy</h3>
                <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-champagne)' }}>
                  ₹{room.startingPrice.triple.toLocaleString('en-IN')}{' '}
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>/ night</span>
                </p>
              </div>
            </div>
          </div>

          <div className="legal-page__section" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            <h2>Frequently Asked Questions</h2>
            {room.faqs.map((faq, idx) => (
              <div className="qa-block" key={idx} style={{ marginTop: 16 }}>
                <p className="qa-block__q">{faq.q}</p>
                <p className="qa-block__a">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="content-links" style={{ marginTop: 28 }}>
            <Link href="/#booking">Book {room.shortName}</Link>
            <Link href="/rooms">All Rooms & Suites</Link>
            <Link href="/location">Hotel Location</Link>
            <Link href="/dining">In-House Dining</Link>
            <Link href="/rentals">Scooter & Car Rental</Link>
          </div>
        </div>

        {/* Other Room Category */}
        <div className="legal-page__card" style={{ marginTop: 24 }}>
          <h2 style={{ marginBottom: 16 }}>Explore Other Room Types</h2>
          <div className="info-grid">
            {otherRooms.map((r) => (
              <div className="info-grid__item" key={r.id}>
                <h3><Link href={`/rooms/${r.id}`}>{r.name}</Link></h3>
                <p>{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
