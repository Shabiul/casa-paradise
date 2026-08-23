'use client';

import { useState } from 'react';
import { ThreeDPhotoCarousel } from '@/components/ui/3d-carousel';

const galleryImages = [
  { src: '/assets/wa-photo-2.jpeg', alt: 'Heritage Building' },
  { src: '/assets/wa-photo-4.jpeg', alt: 'AC Suite' },
  { src: '/assets/wa-photo-1.jpeg', alt: 'Heritage Room' },
  { src: '/assets/wa-photo-8.jpeg', alt: 'Fine Dining Restaurant' },
  { src: '/assets/wa-photo-5.jpeg', alt: 'Lounge Area' },
  { src: '/assets/wa-photo-3.jpeg', alt: 'Guest Room' },
  { src: '/assets/wa-photo-10.jpeg', alt: 'Scenic Views' },
  { src: '/assets/wa-photo-7.jpeg', alt: 'Suite Amenities' },
];

export default function Gallery() {
  const carouselImages = galleryImages.map(img => img.src);

  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <span className="section-label">Visual Tour</span>
        <h2 className="section-title">Property Gallery</h2>
        <p className="section-subtitle">
          Take a look inside Casa Paradiso and preview your luxury stay in Panaji.
        </p>

        <div className="gallery__carousel-wrapper">
          <ThreeDPhotoCarousel images={carouselImages} />
        </div>
      </div>
    </section>
  );
}
