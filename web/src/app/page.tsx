import Hero from '@/components/Hero';
import About from '@/components/About';
import Rooms from '@/components/Rooms';
import Rentals from '@/components/Rentals';
import Experiences from '@/components/Experiences';
import Dining from '@/components/Dining';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import BookingForm from '@/components/BookingForm';

const homeFaqs = [
  {
    q: 'What are the standard Check-in and Check-out times at Casa Paradiso?',
    a: 'Standard check-in time is 1:00 PM and check-out time is 11:00 AM. Early check-in or late check-out is subject to room availability.',
  },
  {
    q: 'How far is Casa Paradiso from the Mandovi River and Offshore Casinos?',
    a: 'Casa Paradiso is located just 5 minutes (approx. 1.2 km) downhill from the Mandovi riverfront, jetties, and casino boarding points (Deltin Royale, Big Daddy).',
  },
  {
    q: 'Are scooter and self-drive car rentals available at the hotel?',
    a: 'Yes! We offer doorstep pickup and drop-off for scooters (Honda Activa, Dio, Fascino at ₹400/day) and self-drive cars (Maruti Swift at ₹1,500/day & Ertiga 7-Seater at ₹2,500/day) directly at Casa Paradiso.',
  },
  {
    q: 'Does Casa Paradiso provide free high-speed Wi-Fi and breakfast?',
    a: 'Yes, high-speed fiber Wi-Fi is complimentary for all guests across the property, and freshly prepared Goan and Indian breakfast options are available daily.',
  },
];

export default function HomePage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: homeFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <About />
      <Rooms />
      <Rentals />
      <Experiences />
      <Dining />
      <Gallery />
      <Testimonials />
      <FAQ />
      <BookingForm />
    </main>
  );
}
