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

export default function HomePage() {
  return (
    <main>
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
