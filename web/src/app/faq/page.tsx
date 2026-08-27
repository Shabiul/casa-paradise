import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BUSINESS } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Casa Paradiso Hotel FAQs — Panaji, Goa',
  description:
    'Answers to common questions about Casa Paradiso in Panaji: check-in/check-out times, room types, Wi-Fi and breakfast, on-site dining, vehicle rentals, and how to book directly.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Casa Paradiso Hotel FAQs | Panaji, Goa',
    description: 'Check-in times, room types, dining, rentals, and booking questions answered for Casa Paradiso, Panaji.',
    url: '/faq',
    type: 'website',
  },
};

// Every answer here is grounded in facts already established elsewhere in the
// codebase (Footer.tsx, Rooms.tsx, Dining.tsx, Rentals.tsx, terms/page.tsx,
// crmStore.ts default settings). Nothing here is invented for SEO purposes.
const faqs = [
  {
    q: 'Where is Casa Paradiso located?',
    a: `Casa Paradiso is located at ${BUSINESS.streetAddress}, ${BUSINESS.addressLocality}, ${BUSINESS.addressRegion} ${BUSINESS.postalCode}, India — on historic Altinho hill in central Panaji, close to the Mandovi River.`,
  },
  {
    q: 'What are the check-in and check-out times?',
    a: `Standard check-in is at ${BUSINESS.checkInTime} and check-out is at ${BUSINESS.checkOutTime}. Early check-in or late check-out is available subject to room availability.`,
  },
  {
    q: 'How many rooms does Casa Paradiso have?',
    a: `Casa Paradiso is an intimate ${BUSINESS.numberOfRooms}-room boutique hotel.`,
  },
  {
    q: 'What room types are available?',
    a: 'Two room categories: the air-conditioned Paradise AC Suite with a king-size bed, workstation, smart TV, and marble bath; and the Heritage Non-AC Room with high ceilings, breezy windows, and ceiling fans.',
  },
  {
    q: 'Does Casa Paradiso offer Wi-Fi and breakfast?',
    a: 'Yes. High-speed fiber Wi-Fi is complimentary across the property, and breakfast options are available daily.',
  },
  {
    q: 'Does Casa Paradiso have an on-site restaurant?',
    a: 'Yes. The hotel restaurant serves vegetarian and non-vegetarian Goan cuisine, including fresh Mandovi seafood, with all-day restaurant and in-room dining service from 7:00 AM to 11:00 PM.',
  },
  {
    q: 'How far is the hotel from the Mandovi River and offshore casinos?',
    a: 'Casa Paradiso is roughly 5 minutes (about 1.2 km) from the Mandovi riverfront, jetties, and casino boarding points.',
  },
  {
    q: 'Can guests rent a scooter or self-drive car at the hotel?',
    a: 'Yes. Casa Paradiso offers doorstep pick-up and drop-off for scooters (Honda Activa, Honda Dio, Yamaha Fascino at ₹400/day) and self-drive cars (Maruti Suzuki Swift at ₹1,500/day and Maruti Suzuki Ertiga 7-seater at ₹2,500/day) directly at the hotel.',
  },
  {
    q: 'How can I book Casa Paradiso directly?',
    a: 'You can book directly through the reservation form on this website, or contact the hotel by phone or WhatsApp — see our Contact page for details.',
  },
];

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs items={[{ label: 'FAQ' }]} />

      <section className="legal-page__hero" style={{ padding: '32px 0 40px' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--color-champagne-light)' }}>Got Questions?</span>
          <h1 className="legal-page__title">Casa Paradiso Hotel FAQs</h1>
          <p className="legal-page__subtitle">Direct answers about staying at Casa Paradiso in Panaji, Goa.</p>
        </div>
      </section>

      <section className="container" style={{ padding: '40px 24px 80px', maxWidth: 900, margin: '0 auto' }}>
        <div className="legal-page__card">
          {faqs.map((item, idx) => (
            <div className="qa-block" key={idx}>
              <p className="qa-block__q">{item.q}</p>
              <p className="qa-block__a">{item.a}</p>
            </div>
          ))}

          <div className="content-links">
            <Link href="/rooms">Rooms & Suites</Link>
            <Link href="/dining">Dining</Link>
            <Link href="/rentals">Rentals</Link>
            <Link href="/location">Location</Link>
            <Link href="/#booking">Book Now</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
