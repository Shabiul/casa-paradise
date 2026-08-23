'use client';

import { useState, useEffect } from 'react';

const reviews = [
  {
    name: "Rohan & Ananya Sharma",
    origin: "Mumbai, Maharashtra",
    quote: "Casa Paradiso was the highlight of our Goa trip! Located right in Panaji, we could easily walk to Fontainhas and take river cruises at night. The AC suite was immaculate and incredibly comfortable."
  },
  {
    name: "Vikram Malhotra",
    origin: "Bengaluru, Karnataka",
    quote: "Exceptional boutique hospitality! The staff went above and beyond organizing our scooter rental and casino bookings. Outstanding Goan breakfast thali as well."
  },
  {
    name: "Elena Rostova",
    origin: "International Traveler",
    quote: "A peaceful sanctuary on Altinho hill away from the noisy crowds, yet 5 minutes from everything. High speed Wi-Fi made my workcation super smooth!"
  }
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="testimonials">
      <div className="container">
        <span className="section-label">Guest Stories</span>
        <h2 className="section-title">What Our Guests Say</h2>

        <div className="testimonials__carousel">
          <div className="testimonial-card">
            <p className="testimonial-card__quote">"{reviews[current].quote}"</p>
            <div className="testimonial-card__footer">
              <div className="testimonial-card__avatar">
                {reviews[current].name.charAt(0)}
              </div>
              <div>
                <div className="testimonial-card__name">{reviews[current].name}</div>
                <div className="testimonial-card__origin">{reviews[current].origin}</div>
              </div>
            </div>
          </div>

          <div className="testimonials__dots">
            {reviews.map((_, idx) => (
              <span 
                key={idx} 
                className={`testimonial-dot ${current === idx ? 'is-active' : ''}`}
                onClick={() => setCurrent(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
