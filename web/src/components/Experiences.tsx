'use client';

import Link from 'next/link';

export default function Experiences() {
  const items = [
    {
      title: "Mandovi River Cruise & Casinos",
      desc: "Just 5 minutes away. Enjoy luxury offshore casino gaming on Deltin Royale & Big Daddy, or scenic sunset cruises.",
      img: "/WhatsApp Image 2026-08-11 at 6.56.49 PM.jpeg"
    },
    {
      title: "Fontainhas Latin Quarter",
      desc: "Stroll through brightly painted Portuguese villas, art galleries, and cozy cafes in Panaji's iconic heritage district.",
      img: "/WhatsApp Image 2026-08-11 at 7.25.40 PM (1).jpeg"
    },
    {
      title: "Dona Paula Viewpoint",
      desc: "A stunning cliff-top viewpoint where the Mandovi and Zuari rivers meet the Arabian Sea. Perfect for photos.",
      img: "/WhatsApp Image 2026-08-11 at 6.56.50 PM (1).jpeg"
    },
    {
      title: "Miramar Beach",
      desc: "Golden sands and calm waters just minutes from the city center. Ideal for evening walks and sunset views.",
      img: "/WhatsApp Image 2026-08-11 at 6.56.50 PM.jpeg"
    },
    {
      title: "Panaji Market",
      desc: "Explore the bustling local market for fresh spices, Goan cashews, handicrafts, and authentic street food.",
      img: "/WhatsApp Image 2026-08-11 at 6.56.51 PM (1).jpeg"
    },
    {
      title: "Aguada Fort",
      desc: "A well-preserved 17th-century Portuguese fort with panoramic views of the Arabian Sea and a historic lighthouse.",
      img: "/WhatsApp Image 2026-08-11 at 6.56.52 PM (2).jpeg"
    },
    {
      title: "Panjim Church",
      desc: "The iconic Our Lady of the Immaculate Conception Church, a Baroque-style landmark in the heart of Panaji.",
      img: "/WhatsApp Image 2026-08-11 at 6.56.52 PM.jpeg"
    },
    {
      title: "Candolim Beach",
      desc: "A serene stretch of golden coastline popular for water sports, beach shacks, and vibrant nightlife.",
      img: "/WhatsApp Image 2026-08-11 at 6.56.52 PM (1).jpeg"
    }
  ];

  return (
    <section id="experiences" className="experiences">
      <div className="container">
        <span className="section-label">Local Attractions</span>
        <h2 className="section-title">Goan Experiences & Adventures</h2>
        <p className="section-subtitle">
          Immerse yourself in Panaji's rich culture, vibrant nightlife, and scenic beauty.
        </p>

        <div className="experiences__grid">
          {items.map((exp, idx) => (
            <div key={idx} className="experience-card">
              <div className="experience-card__img-wrapper">
                <img src={exp.img} alt={exp.title} className="experience-card__img" />
              </div>
              <div className="experience-card__body">
                <h3 className="experience-card__title">{exp.title}</h3>
                <p className="experience-card__desc">{exp.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href="/experiences" className="content-links" style={{ display: 'inline-flex' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-champagne)', border: '1px solid rgba(5, 150, 105, 0.3)', borderRadius: '999px', padding: '8px 16px' }}>
              View All Attractions & Distances →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
