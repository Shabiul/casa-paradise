import type { Metadata } from 'next';
import Link from 'next/link';
import Experiences from '@/components/Experiences';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ATTRACTIONS_DATA } from '@/components/attractions/attractionData';

export const metadata: Metadata = {
  title: 'Things to Do in Panaji, Goa',
  description:
    'Things to do near Casa Paradiso in Panaji: the Mandovi River and offshore casinos, Fontainhas Latin Quarter, Fort Aguada, Miramar & Dona Paula, and the Panjim Baroque Church.',
  alternates: { canonical: '/experiences' },
  openGraph: {
    title: 'Things to Do in Panaji, Goa | Casa Paradiso',
    description: 'Explore attractions near Casa Paradiso in Panaji, Goa — Mandovi River, Fontainhas, Fort Aguada, Miramar, Dona Paula, and Panjim Church.',
    url: '/experiences',
    type: 'website',
  },
};

export default function ExperiencesPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: 'Experiences' }]} />

      <section className="legal-page__hero" style={{ padding: '32px 0 40px' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--color-champagne-light)' }}>Goan Experiences</span>
          <h1 className="legal-page__title">Things to Do Near Casa Paradiso, Panaji</h1>
          <p className="legal-page__subtitle">
            Panaji&apos;s riverfront, heritage quarter, forts, beaches, and colonial landmarks — all within easy
            reach of the hotel on Altinho hill.
          </p>
        </div>
      </section>

      <Experiences />

      <section className="container" style={{ padding: '0 24px 80px', maxWidth: 1140, margin: '0 auto' }}>
        <div className="legal-page__card">
          <div className="legal-page__section" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            <h2>Explore Each Attraction</h2>
            <div className="info-grid">
              {ATTRACTIONS_DATA.map((a) => (
                <div className="info-grid__item" key={a.id}>
                  <h3><Link href={`/experiences/${a.id}`}>{a.title}</Link></h3>
                  <p>{a.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="content-links">
            <Link href="/location">Hotel Location</Link>
            <Link href="/rentals">Scooter & Car Rental</Link>
            <Link href="/rooms">Rooms & Suites</Link>
            <Link href="/#booking">Book Your Stay</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
