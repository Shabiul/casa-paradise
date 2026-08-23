'use client';

import DiningReservation from './DiningReservation';

export default function Dining() {
  return (
    <section id="dining" className="dining">
      <div className="container">
        <div className="dining__content">
          <span className="section-label" style={{ color: 'var(--color-champagne)' }}>In-House Gastronomy</span>
          <h2 className="section-title">Gourmet Goan & International Dining</h2>
          <p className="section-subtitle">
            Savor authentic Goan Fish Curry, fresh Mandovi seafood catches, wood-fired pizzas, and handcrafted cocktails at our on-site restaurant.
          </p>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--color-champagne)', fontSize: '20px' }}>✓</span>
              <span>Authentic Goan Seafood & Thali Specialties</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--color-champagne)', fontSize: '20px' }}>✓</span>
              <span>Daily Complimentary Breakfast Buffet for Guests</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--color-champagne)', fontSize: '20px' }}>✓</span>
              <span>In-Room Dining Service (7:00 AM – 11:00 PM)</span>
            </li>
          </ul>

          {/* Interactive Table Reservation Widget */}
          <DiningReservation />
        </div>
      </div>
    </section>
  );
}
