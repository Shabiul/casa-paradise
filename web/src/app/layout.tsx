import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import WhatsAppButton from '@/components/WhatsAppButton';
import SmoothScroller from '@/components/SmoothScroller';

export const metadata: Metadata = {
  metadataBase: new URL('https://casaparadisohotel.in'),
  title: 'Casa Paradiso — Boutique Luxury Hotel in Panaji, Goa',
  description: "An intimate 18-room boutique hotel perched on Altinho hill in Panaji, Goa. Steps from the Mandovi River, casinos, and Goa's cultural heart. Book your escape at Casa Paradiso.",
  keywords: ['luxury hotel Panaji', 'boutique hotel Goa', 'Casa Paradiso', 'hotel near Mandovi River', 'hotel near Deltin Casino Goa', 'Panaji hotel with restaurant'],
  openGraph: {
    title: 'Casa Paradiso — Boutique Luxury Hotel in Panaji, Goa',
    description: "An intimate 18-room boutique hotel perched on Altinho hill in Panaji, Goa.",
    images: ['/assets/hero.png'],
    url: 'https://casaparadisohotel.in/',
    type: 'website',
    siteName: 'Casa Paradiso',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casa Paradiso — Boutique Luxury Hotel in Panaji, Goa',
    description: 'An intimate 18-room boutique hotel in the heart of Panaji, Goa.',
    images: ['/assets/hero.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-hero-state="intro">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Hotel",
              "name": "Casa Paradiso",
              "description": "An intimate 18-room boutique hotel perched on Altinho hill in Panaji, Goa.",
              "url": "https://casaparadisohotel.in/",
              "telephone": "+919881247847",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Ghanekar Building, Rua José Falcão, Altinho",
                "addressLocality": "Panaji",
                "addressRegion": "Goa",
                "postalCode": "403001",
                "addressCountry": "IN"
              },
              "numberOfRooms": 18
            })
          }}
        />
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
