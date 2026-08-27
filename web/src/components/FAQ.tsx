'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    q: "What are the standard Check-in and Check-out times?",
    a: "Standard check-in time is 1:00 PM and check-out time is 11:00 AM. Early check-in or late check-out is subject to room availability."
  },
  {
    q: "How far is the hotel from Mandovi River and Offshore Casinos?",
    a: "Casa Paradiso is located just 5 minutes (approx. 1.2 km) from the Mandovi riverfront, jetties, and casino boarding points."
  },
  {
    q: "Are vehicle rentals available at the property?",
    a: "Yes! We offer doorstep pickup and drop-off for scooters (Activa, Dio, Fascino at ₹400/day) and self-drive cars (Swift at ₹1,500/day & Ertiga 7-Seater at ₹2,500/day) directly at the hotel."
  },
  {
    q: "Do you offer free Wi-Fi and breakfast?",
    a: "Yes, high-speed fiber Wi-Fi is complimentary for all guests across the property, and breakfast options are available daily."
  }
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="faq">
      <div className="container faq__container">
        <span className="section-label" style={{ textAlign: 'center' }}>Got Questions?</span>
        <h2 className="section-title" style={{ textAlign: 'center' }}>Frequently Asked Questions</h2>

        <div style={{ marginTop: '40px' }}>
          {faqs.map((item, idx) => (
            <div key={idx} className={`faq__item ${openIdx === idx ? 'is-open' : ''}`}>
              <button className="faq__question" onClick={() => toggle(idx)}>
                <span className="faq__text">{item.q}</span>
                <span className="faq__icon">{openIdx === idx ? '−' : '+'}</span>
              </button>
              {openIdx === idx && (
                <div className="faq__answer">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link
            href="/faq"
            style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-champagne)', border: '1px solid rgba(5, 150, 105, 0.3)', borderRadius: '999px', padding: '8px 16px', textDecoration: 'none' }}
          >
            View Full FAQ →
          </Link>
        </div>
      </div>
    </section>
  );
}
