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

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="container nav__inner">
          <Link href="#hero" className="nav__logo" aria-label={`${hotelName} - Home`}>
            <span className="nav__logo-text">{hotelName}</span>
            <span className="nav__logo-sub">Panaji · Goa</span>
          </Link>

          <ul className="nav__links" role="menubar">
            <li role="none"><Link href="#about" className="nav__link">About</Link></li>
            <li role="none"><Link href="#rooms" className="nav__link">Rooms</Link></li>
            <li role="none"><Link href="#experiences" className="nav__link">Experiences</Link></li>
            <li role="none"><Link href="#rentals" className="nav__link">Rentals</Link></li>
            <li role="none"><Link href="#dining" className="nav__link">Dining</Link></li>
            <li role="none"><Link href="#gallery" className="nav__link">Gallery</Link></li>
            <li role="none"><Link href="#contact" className="nav__link">Contact</Link></li>
          </ul>

          <Link href="#booking" className="nav__cta">
            Book Now
          </Link>

          <button 
            className="nav__hamburger" 
            onClick={toggleMobile} 
            aria-label="Toggle Navigation Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`nav__mobile-menu ${mobileOpen ? 'is-open' : ''}`}>
        <Link href="#about" onClick={() => setMobileOpen(false)}>About</Link>
        <Link href="#rooms" onClick={() => setMobileOpen(false)}>Rooms</Link>
        <Link href="#experiences" onClick={() => setMobileOpen(false)}>Experiences</Link>
        <Link href="#rentals" onClick={() => setMobileOpen(false)}>Rentals</Link>
        <Link href="#dining" onClick={() => setMobileOpen(false)}>Dining</Link>
        <Link href="#gallery" onClick={() => setMobileOpen(false)}>Gallery</Link>
        <Link href="#contact" onClick={() => setMobileOpen(false)}>Contact</Link>
        <Link href="#booking" className="btn btn--primary" onClick={() => setMobileOpen(false)}>Book Your Stay</Link>
      </div>
    </>
  );
}
