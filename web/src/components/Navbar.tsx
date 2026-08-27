'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCRMStore, subscribeToCRM } from '@/lib/crmStore';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hotelName, setHotelName] = useState('Casa Paradiso');

  useEffect(() => {
    const updateSettings = () => {
      const store = getCRMStore();
      if (store.settings?.hotelName) {
        setHotelName(store.settings.hotelName);
      }
    };
    updateSettings();
    const unsubscribe = subscribeToCRM(updateSettings);

    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (pathname && pathname !== '/') {
      document.documentElement.setAttribute('data-hero-state', 'settled');
    }
  }, [pathname]);

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const getHref = (hash: string) => (pathname === '/' ? hash : `/${hash}`);

  return (
    <>
      <nav className={`nav ${scrolled || pathname !== '/' ? 'nav--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="container nav__inner">
          <Link href={getHref('#hero')} className="nav__logo" aria-label={`${hotelName} - Home`}>
            <span className="nav__logo-text">{hotelName}</span>
            <span className="nav__logo-sub">Panaji · Goa</span>
          </Link>

          <ul className="nav__links" role="menubar">
            <li role="none"><Link href={getHref('#about')} className="nav__link">About</Link></li>
            <li role="none"><Link href={getHref('#rooms')} className="nav__link">Rooms</Link></li>
            <li role="none"><Link href={getHref('#rentals')} className="nav__link">Rentals</Link></li>
            <li role="none"><Link href={getHref('#experiences')} className="nav__link">Experiences</Link></li>
            <li role="none"><Link href={getHref('#dining')} className="nav__link">Dining</Link></li>
            <li role="none"><Link href={getHref('#gallery')} className="nav__link">Gallery</Link></li>
            <li role="none"><Link href={getHref('#contact')} className="nav__link">Contact</Link></li>
          </ul>

          <Link href={getHref('#booking')} className="nav__cta">
            Book Now
          </Link>

          <button 
            className={`nav__hamburger ${mobileOpen ? 'is-active' : ''}`} 
            onClick={toggleMobile} 
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`nav__mobile-menu ${mobileOpen ? 'is-open' : ''}`}>
        <div className="nav__mobile-header">
          <span className="nav__logo-text">{hotelName}</span>
          <button 
            className="nav__mobile-close" 
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <div className="nav__mobile-links">
          <Link href={getHref('#about')} onClick={() => setMobileOpen(false)}>About Us</Link>
          <Link href={getHref('#rooms')} onClick={() => setMobileOpen(false)}>Suites & Rooms</Link>
          <Link href={getHref('#rentals')} onClick={() => setMobileOpen(false)}>Vehicle Rentals</Link>
          <Link href={getHref('#experiences')} onClick={() => setMobileOpen(false)}>Goan Experiences</Link>
          <Link href={getHref('#dining')} onClick={() => setMobileOpen(false)}>In-House Dining</Link>
          <Link href={getHref('#gallery')} onClick={() => setMobileOpen(false)}>Property Gallery</Link>
          <Link href={getHref('#contact')} onClick={() => setMobileOpen(false)}>Contact & Location</Link>
        </div>
        <div className="nav__mobile-actions">
          <Link href={getHref('#booking')} className="btn btn--primary" style={{ width: '100%' }} onClick={() => setMobileOpen(false)}>
            Book Your Stay
          </Link>
          <a 
            href="https://wa.me/919881247847?text=Hello%20Casa%20Paradiso,%20I%20would%20like%20to%20inquire%20about%20room%20availability." 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn--secondary" 
            style={{ width: '100%', marginTop: '8px' }}
            onClick={() => setMobileOpen(false)}
          >
            WhatsApp Concierge
          </a>
        </div>
      </div>
    </>
  );
}
