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
    default: `${BUSINESS.name} | Boutique Hotel in Panaji, Goa`,
    template: `%s | ${BUSINESS.name}`,
  },
  description: BUSINESS.description,
  keywords: [
    'hotel in Panaji Goa',
    'hotel in Panjim Goa',
    'boutique hotel Panaji',
    'heritage hotel Panaji',
    'hotel near Mandovi River',
    'hotel in Altinho Goa',
    'Casa Paradiso',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${BUSINESS.name} | Boutique Hotel in Panaji, Goa`,
    description: BUSINESS.description,
    images: [absoluteUrl('/assets/hero.png')],
    url: SITE_URL,
    type: 'website',
    siteName: BUSINESS.name,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BUSINESS.name} | Boutique Hotel in Panaji, Goa`,
    description: BUSINESS.description,
    images: [absoluteUrl('/assets/hero.png')],
  },
  robots: {
    index: true,
    follow: true,
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
      url: SITE_URL,
      logo: absoluteUrl('/assets/hero.png'),
      ...(SOCIAL_PROFILES.length > 0 ? { sameAs: SOCIAL_PROFILES } : {}),
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
      description: BUSINESS.description,
      url: SITE_URL,
      telephone: BUSINESS.telephone,
      email: BUSINESS.email,
      priceRange: '₹₹',
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
      numberOfRooms: BUSINESS.numberOfRooms,
      checkinTime: '13:00',
      checkoutTime: '11:00',
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Free Wi-Fi', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Air Conditioning (select rooms)', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'On-site Restaurant', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Scooter & Car Rental', value: true },
      ],
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
