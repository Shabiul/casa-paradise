'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCRMStore, subscribeToCRM } from '@/lib/crmStore';

export default function Footer() {
  const pathname = usePathname();
  const [hotelName, setHotelName] = useState('Casa Paradiso');
  const [tagline, setTagline] = useState('Boutique Luxury Heritage Hotel in Panaji, Goa');
  const [address, setAddress] = useState('Ghanekar Building, Rua José Falcão, Altinho, Panaji, Goa 403001');
  const [phone, setPhone] = useState('+91 98812 47847');
  const [email, setEmail] = useState('Paradisepanjim@gmail.com');

  useEffect(() => {
    const updateSettings = () => {
      const store = getCRMStore();
      if (store.settings) {
        if (store.settings.hotelName) setHotelName(store.settings.hotelName);
        if (store.settings.tagline) setTagline(store.settings.tagline);
        if (store.settings.address) setAddress(store.settings.address);
        if (store.settings.phone1) setPhone(store.settings.phone1);
        if (store.settings.email) setEmail(store.settings.email);
      }
    };
    updateSettings();
    const unsubscribe = subscribeToCRM(updateSettings);
    return () => unsubscribe();
  }, []);

  const getHref = (hash: string) => (pathname === '/' ? hash : `/${hash}`);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link href={getHref('#hero')} className="nav__logo">
              <span className="nav__logo-text">{hotelName}</span>
              <span className="nav__logo-sub">Panaji · Goa</span>
            </Link>
            <p className="footer__desc">
              {tagline || "Boutique luxury hotel on Altinho hill, offering serene hospitality, gourmet dining, and easy access to Panaji's cultural heart."}
            </p>
          </div>

          <div>
            <h4 className="footer__title">Quick Links</h4>
            <ul className="footer__links">
              <li><Link href={getHref('#about')}>About Us</Link></li>
              <li><Link href="/rooms">Rooms & Suites</Link></li>
              <li><Link href="/experiences">Things to Do Nearby</Link></li>
              <li><Link href="/rentals">Scooter & Car Rentals</Link></li>
              <li><Link href="/location">Location & Map</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer__title">Guest Info</h4>
            <ul className="footer__links">
              <li><Link href="/dining">Restaurant & Dining</Link></li>
              <li><Link href={getHref('#gallery')}>Property Gallery</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href={getHref('#booking')}>Book Room</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer__title">Contact & Location</h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.6, marginBottom: '8px' }}>
              {address}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.6 }}>
              Tel: <a href={`tel:${phone.replace(/\s+/g, '')}`} style={{ color: 'var(--color-champagne)' }}>{phone}</a><br />
              Email: <a href={`mailto:${email}`} style={{ color: 'var(--color-champagne)' }}>{email}</a>
            </p>
          </div>
        </div>

        {/* ── Google Maps ── */}
        <div className="footer__map-wrapper">
          <div className="footer__map-header">
            <h4 className="footer__title" style={{ margin: 0 }}>Find Us</h4>
            <a
              href="https://maps.app.goo.gl/iKyFhnt8Q5JwUMD46"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__map-directions"
            >
              Get Directions →
            </a>
          </div>
          <div className="footer__map-frame">
            <iframe
              title="Casa Paradiso location on Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.047!2d73.83!3d15.497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfc0fc3a58e44b%3A0x8a2bd60571ce41b3!2sCasa%20Paradiso%20Hotel!5e0!3m2!1sen!2sin!4v1693000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <div className="footer__bottom-row">
              <span>© {new Date().getFullYear()} {hotelName}. All rights reserved.</span>
              <span className="footer__divider">•</span>
              <Link href="/terms">Terms & Conditions</Link>
              <span className="footer__divider">•</span>
              <Link href="/privacy">Privacy Policy</Link>
            </div>
            <p className="footer__credits">
              Designed and Developed by{' '}
              <a 
                href="https://naazailabs.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer__credit-link"
              >
                NAAZ AI Labs
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
