'use client';

import DiningReservation from './DiningReservation';

export default function Dining() {
  return (
    <section id="dining" className="dining">
      <div className="container">
        <div className="dining__content">
          <span className="section-label" style={{ color: 'var(--color-champagne)' }}>In-House Gastronomy</span>
          <h2 className="section-title">Vegetarian & Non-Vegetarian Goan Dining</h2>
          <p className="section-subtitle">
            Savor authentic pure vegetarian delicacies, fresh Mandovi seafood specialties, classic Goan curries, and handcrafted refreshments at our on-site restaurant.
          </p>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#10B981', fontSize: '18px', fontWeight: 800 }}>🌱</span>
              <span><strong>Vegetarian (Veg):</strong> Authentic Goan Veg Curries, Paneer Specialties, Dal Tadka, Fresh Breads & Thalis</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#EF4444', fontSize: '18px', fontWeight: 800 }}>🍗</span>
              <span><strong>Non-Vegetarian (Non-Veg):</strong> Fresh Mandovi Catch, Authentic Goan Fish Curry, Prawn Balchão, Chicken & Mutton</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--color-champagne)', fontSize: '20px' }}>✓</span>
              <span>Daily Complimentary Breakfast Buffet & In-Room Dining (7:00 AM – 11:00 PM)</span>
            </li>
          </ul>

          {/* Interactive Table Reservation Widget */}
          <DiningReservation />
        </div>
      </div>
    </section>
  );
}
