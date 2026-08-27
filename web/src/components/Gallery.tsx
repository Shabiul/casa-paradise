'use client';

import { CircularGallery, type GalleryItem } from '@/components/ui/circular-gallery-2';

const galleryItems: GalleryItem[] = [
  { image: '/assets/ChatGPT Image Aug 27, 2026, 01_21_12 PM.png', text: 'Heritage Villa' },
  { image: '/assets/WhatsApp Image 2026-08-07 at 4.34.56 PM.jpeg', text: 'Classic Suite' },
  { image: '/WhatsApp Image 2026-08-11 at 7.25.40 PM (1).jpeg', text: 'Fontainhas Heritage' },
  { image: '/assets/ChatGPT Image Aug 7, 2026, 06_03_51 PM.png', text: 'Heritage Room' },
  { image: '/WhatsApp Image 2026-08-11 at 6.56.52 PM.jpeg', text: 'Panjim Church' },
];

export default function Gallery() {
  return (
    <section id="gallery" className="gallery" style={{ padding: '70px 0 50px', overflow: 'hidden' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h2
          className="section-title"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(36px, 4.5vw, 62px)',
            fontWeight: 400,
            color: 'var(--color-navy, #111827)',
            marginBottom: '10px',
            lineHeight: 1.15,
          }}
        >
          Captured Moments
        </h2>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            color: 'var(--color-charcoal-light, #6B7280)',
            marginBottom: '36px',
          }}
        >
          Drag or scroll to rotate through the coastal memories of Casa Paradiso
        </p>

        <div style={{ position: 'relative', height: '720px', width: '100%', overflow: 'hidden' }}>
          <CircularGallery
            items={galleryItems}
            bend={1.6}
            borderRadius={0.05}
            scrollSpeed={2.2}
            scrollEase={0.04}
          />
        </div>
      </div>
    </section>
  );
}
