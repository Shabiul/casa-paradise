import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import WhatsAppButton from '@/components/WhatsAppButton';
import SmoothScroller from '@/components/SmoothScroller';
import { BUSINESS, SITE_URL, SOCIAL_PROFILES, absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BUSINESS.name} | Best Boutique Hotel in Panjim, Goa | Near Mandovi River & Casinos`,
    template: `%s | ${BUSINESS.name} — Hotel in Panjim, Goa`,
  },
  description: BUSINESS.description,
  keywords: [
    'hotel in Panaji Goa',
    'hotel in Panjim Goa',
    'best hotel in Panjim Goa',
    'boutique hotel Panaji',
    'heritage hotel Panaji Goa',
    'hotel near Mandovi River',
    'hotels near Deltin Royale Panjim',
    'hotels near Big Daddy Casino Goa',
    'hotels near Fontainhas Latin Quarter',
    'budget luxury hotel Panjim',
    'hotel in Altinho Goa',
    'hotel with scooter rental Panjim',
    'Casa Paradiso',
    'Casa Paradiso Goa',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${BUSINESS.name} | Best Boutique Hotel in Panjim, Goa`,
    description: BUSINESS.description,
    images: [absoluteUrl('/assets/hero.png')],
    url: SITE_URL,
    type: 'website',
    siteName: BUSINESS.name,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BUSINESS.name} | Best Boutique Hotel in Panjim, Goa`,
    description: BUSINESS.description,
    images: [absoluteUrl('/assets/hero.png')],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

function JsonLd() {
  const hotelId = `${SITE_URL}/#hotel`;
  const orgId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;

  const graph = [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: BUSINESS.name,
      legalName: BUSINESS.legalName,
      url: SITE_URL,
      logo: absoluteUrl('/assets/hero.png'),
      sameAs: SOCIAL_PROFILES,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: BUSINESS.telephone,
        contactType: 'reservations & guest service',
        availableLanguage: ['English', 'Hindi', 'Konkani'],
        areaServed: 'IN',
      },
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: BUSINESS.name,
      url: SITE_URL,
      publisher: { '@id': orgId },
      inLanguage: 'en-IN',
    },
    {
      '@type': 'Hotel',
      '@id': hotelId,
      name: BUSINESS.name,
      alternateName: [
        'Casa Paradiso Hotel',
        'Panjim Hotel Casa Enterprises',
        'Hotel Casa Paradiso Panaji',
        'Casa Paradiso Goa',
      ],
      description: BUSINESS.description,
      url: SITE_URL,
      telephone: BUSINESS.telephone,
      email: BUSINESS.email,
      priceRange: '₹1,200 - ₹2,500',
      currenciesAccepted: 'INR',
      paymentAccepted: 'Cash, UPI, Credit Card, Debit Card, Net Banking',
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
      hasMap: BUSINESS.mapsUrl,
      sameAs: SOCIAL_PROFILES,
      numberOfRooms: BUSINESS.numberOfRooms,
      checkinTime: '13:00',
      checkoutTime: '11:00',
      starRating: {
        '@type': 'Rating',
        ratingValue: '4.5',
        bestRating: '5',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.6',
        reviewCount: '128',
        bestRating: '5',
      },
      knowsAbout: [
        'Panaji Hotels',
        'Goa Tourism',
        'Mandovi River Cruises',
        'Offshore Casinos Goa',
        'Fontainhas Latin Quarter',
        'Altinho Hill Panaji',
        'Scooter Rental Goa',
      ],
      areaServed: ['Panaji', 'North Goa', 'Goa', 'India'],
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Free High-Speed Fiber Wi-Fi', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Air Conditioning (Paradise AC Suites)', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'On-site Authentic Goan Restaurant', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Doorstep Scooter & Self-Drive Car Rental', value: true },
        { '@type': 'LocationFeatureSpecification', name: '24/7 Front Desk Support', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'In-Room Workstation & Desk', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Daily Housekeeping', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Smart Flat-Screen TVs', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'En-Suite Marble Bathrooms', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Walking Distance to Fontainhas Latin Quarter', value: true },
        { '@type': 'LocationFeatureSpecification', name: '5 Minutes to Mandovi River Jetties & Casinos', value: true },
      ],
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: [
          '.hero-cinematic__h1',
          '.hero__subtitle',
          '.section-title',
          '.legal-page__title',
        ],
      },
      image: [absoluteUrl('/assets/hero.png')],
      parentOrganization: { '@id': orgId },
      isPartOf: { '@id': websiteId },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': graph,
        }),
      }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-hero-state="intro">
      <head>
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLMs.txt Summary" />
        <link rel="alternate" type="text/markdown" href="/llms-full.txt" title="LLMs.txt Full Knowledge Base" />
        <JsonLd />
      </head>
      <body>
        <SmoothScroller />
        <Navbar />
        {children}
        <Footer />
        <BackToTop />
        <WhatsAppButton />
      </body>
    </html>
  );
}
