'use client';

import { useState, useEffect } from 'react';
import { getCRMStore, subscribeToCRM } from '@/lib/crmStore';
import { RoomPriceConfig } from '@/lib/types';
import { ScrollingFeatureShowcase, StorySlide } from '@/components/ui/interactive-scrolling-story-component';

const defaultPrices: RoomPriceConfig = {
  ac: { single: 1200, double: 1800, triple: 2000 },
  nonac: { single: 1200, double: 1500, triple: 800 }
};

export default function Rooms() {
  const [prices, setPrices] = useState<RoomPriceConfig>(defaultPrices);

  useEffect(() => {
    const updatePrices = () => {
      const store = getCRMStore();
      if (store.settings?.roomPrices) {
        setPrices(store.settings.roomPrices);
      }
    };
    updatePrices();
    const unsubscribe = subscribeToCRM(updatePrices);
    return () => unsubscribe();
  }, []);

  const accommodationSlides: StorySlide[] = [
    {
      badge: "Signature Collection · 10 Suites Available",
      title: "Paradise AC Suite",
      description: "Spacious climate-controlled sanctuary featuring a plush king-size bed, executive workstation, smart entertainment, and private Portuguese marble bath.",
      image: "/assets/wa-photo-8.jpeg",
      bgColor: "#FAF8F5",
      textColor: "#0F172A",
      price: `From ₹${prices.ac.single.toLocaleString('en-IN')}/night (Single) · ₹${prices.ac.double.toLocaleString('en-IN')} (Double)`,
      ctaText: "Reserve AC Suite",
      ctaLink: "#booking",
    },
    {
      badge: "Heritage Wing · 8 Rooms Available",
      title: "Heritage Non-AC Suite",
      description: "Classic Goan architecture with high vaulted ceilings, breezy arched windows, handcrafted rosewood furniture, and vintage colonial tranquility.",
      image: "/assets/heritage-room.png",
      bgColor: "#F5EFEB",
      textColor: "#1A202C",
      price: `From ₹${prices.nonac.single.toLocaleString('en-IN')}/night (Single) · ₹${prices.nonac.double.toLocaleString('en-IN')} (Double)`,
      ctaText: "Reserve Heritage Suite",
      ctaLink: "#booking",
    },
    {
      badge: "Panoramic Vista · Altinho Hilltop",
      title: "Altinho Mandovi Panorama",
      description: "Overlook the shimmering Mandovi River and Panaji's historic Latin Quarter with floor-to-ceiling vistas, private sun terrace, and dedicated evening concierge.",
      image: "/assets/hero.png",
      bgColor: "#0F291E",
      textColor: "#FFFFFF",
      price: "From ₹2,500/night · Sunset River Balcony",
      ctaText: "Reserve Panorama Suite",
      ctaLink: "#booking",
    },
    {
      badge: "Luxury Penthouse · Private Sanctuary",
      title: "Royal Goan Sanctuary",
      description: "The pinnacle of boutique Goan hospitality. Featuring artisanal terrazzo flooring, handcrafted brass fixtures, custom amenities, and direct pool lounge access.",
      image: "/assets/pool.png",
      bgColor: "#111827",
      textColor: "#FFFFFF",
      price: "From ₹3,500/night · Premium Living & Pool Access",
      ctaText: "Reserve Royal Suite",
      ctaLink: "#booking",
    },
  ];

  return (
    <section id="rooms" className="rooms-story-section" aria-label="Accommodations">
      <div className="rooms-story-header" style={{ padding: '5rem 1.5rem 2.5rem', textAlign: 'center', backgroundColor: '#FAF8F5' }}>
        <span className="section-label" style={{ display: 'inline-block', color: '#059669', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Accommodations
        </span>
        <h2 className="section-title" style={{ fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 700, color: '#0F172A', margin: '0 0 1rem' }}>
          Suites & Guest Rooms
        </h2>
        <p className="section-subtitle" style={{ maxWidth: '640px', margin: '0 auto', color: '#4B5563', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Explore our intimate 18 boutique suites perched on Altinho hill, blending timeless Portuguese heritage with contemporary quiet luxury.
        </p>
      </div>

      <ScrollingFeatureShowcase 
        slides={accommodationSlides} 
        ctaText="Book Your Stay"
        ctaHref="#booking"
      />
    </section>
  );
}
