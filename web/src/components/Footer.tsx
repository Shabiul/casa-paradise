'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link href="#hero" className="nav__logo">
              <span className="nav__logo-text">Casa Paradiso</span>
              <span className="nav__logo-sub">Panaji · Goa</span>
            </Link>
            <p className="footer__desc">
              Boutique luxury hotel on Altinho hill, offering serene hospitality, gourmet dining, and easy access to Panaji's cultural heart.
            </p>
          </div>

          <div>
            <h4 className="footer__title">Quick Links</h4>
            <ul className="footer__links">
              <li><Link href="#about">About Us</Link></li>
              <li><Link href="#rooms">Suites & Rates</Link></li>
              <li><Link href="#experiences">Attractions</Link></li>
              <li><Link href="#rentals">Car & Bike Rentals</Link></li>
              <li><Link href="/admin">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer__title">Guest Info</h4>
            <ul className="footer__links">
              <li><Link href="#dining">Restaurant & Dining</Link></li>
              <li><Link href="#gallery">Property Gallery</Link></li>
              <li><Link href="#booking">Book Room</Link></li>
              <li><Link href="#contact">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer__title">Address</h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.6 }}>
              Ghanekar Building, Rua José Falcão, Altinho, Panaji, Goa 403001
            </p>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Casa Paradiso. All rights reserved. Boutique Hotel Panaji, Goa.</p>
        </div>
      </div>
    </footer>
  );
}
