'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCRMStore, subscribeToCRM } from '@/lib/crmStore';
import { RoomPriceConfig } from '@/lib/types';

const defaultPrices: RoomPriceConfig = {
  ac: { single: 1200, double: 1800, triple: 2000 },
  nonac: { single: 1200, double: 1500, triple: 800 }
};

export default function Rooms() {
  const [prices, setPrices] = useState<RoomPriceConfig>(defaultPrices);
  const [acCount, setAcCount] = useState<number>(10);
  const [nonAcCount, setNonAcCount] = useState<number>(8);

  useEffect(() => {
    const updateFromStore = () => {
      const store = getCRMStore();
      if (store.settings?.roomPrices) {
        setPrices(store.settings.roomPrices);
      }
      if (store.rooms && store.rooms.length > 0) {
        const acAvailable = store.rooms.filter(r => r.roomType === 'ac' && !r.isOccupied && r.cleanliness !== 'out_of_order').length;
        const nonAcAvailable = store.rooms.filter(r => r.roomType === 'nonac' && !r.isOccupied && r.cleanliness !== 'out_of_order').length;
        setAcCount(acAvailable);
        setNonAcCount(nonAcAvailable);
      }
    };
    updateFromStore();
    const unsubscribe = subscribeToCRM(updateFromStore);
    return () => unsubscribe();
  }, []);

  return (
    <section id="rooms" className="rooms">
      <div className="container">
        <span className="section-label">Accommodations</span>
        <h2 className="section-title">Suites & Guest Rooms</h2>
        <p className="section-subtitle">
          Elegantly decorated rooms featuring plush bedding, modern amenities, and tranquil Altinho hill views.
        </p>

        <div className="rooms__grid">
          {/* AC Suite */}
          <div className="room-card">
            <div className="room-card__image-wrapper">
              <span className="room-card__badge">Air Conditioned</span>
              <img 
                src="/assets/wa-photo-8.jpeg" 
                alt="AC Paradise Suite" 
                className="room-card__image"
              />
            </div>
            <div className="room-card__content">
              <div className="room-card__header">
                <h3 className="room-card__title">Paradise AC Suite</h3>
                <span className="room-card__count">{acCount} Available Today</span>
              </div>
              <p className="room-card__description">
                Spacious climate-controlled suite with king-size bed, workstation, smart TV, and private marble bath.
              </p>
              
              <div className="room-card__pricing">
                <div className="room-card__prices">
                  <div className="room-card__price-item">
                    <span className="room-card__price-label">Single</span>
                    <span className="room-card__price-value">₹{prices.ac.single.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="room-card__price-item">
                    <span className="room-card__price-label">Double</span>
                    <span className="room-card__price-value">₹{prices.ac.double.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="room-card__price-item">
                    <span className="room-card__price-label">Triple</span>
                    <span className="room-card__price-value">₹{prices.ac.triple.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <Link href="#booking" className="room-card__cta">Book AC Suite</Link>
            </div>
          </div>

          {/* Non-AC Suite */}
          <div className="room-card">
            <div className="room-card__image-wrapper">
              <span className="room-card__badge room-card__badge--heritage">Heritage Non-AC</span>
              <img 
                src="/assets/heritage-room.png" 
                alt="Non-AC Heritage Room" 
                className="room-card__image"
              />
            </div>
            <div className="room-card__content">
              <div className="room-card__header">
                <h3 className="room-card__title">Heritage Non-AC Room</h3>
                <span className="room-card__count">{nonAcCount} Available Today</span>
              </div>
              <p className="room-card__description">
                Classic Goan architecture with high ceilings, breezy windows, ceiling fans, and vintage aesthetic.
              </p>
              
              <div className="room-card__pricing">
                <div className="room-card__prices">
                  <div className="room-card__price-item">
                    <span className="room-card__price-label">Single</span>
                    <span className="room-card__price-value">₹{prices.nonac.single.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="room-card__price-item">
                    <span className="room-card__price-label">Double</span>
                    <span className="room-card__price-value">₹{prices.nonac.double.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="room-card__price-item">
                    <span className="room-card__price-label">Triple</span>
                    <span className="room-card__price-value">₹{prices.nonac.triple.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <Link href="#booking" className="room-card__cta">Book Heritage Room</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
