'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getCRMStore, subscribeToCRM } from '@/lib/crmStore';

interface CycleImage {
  src: string;
  alt: string;
}

const CYCLE_IMAGES: CycleImage[] = [
  { src: '/assets/exterior.png', alt: 'Casa Paradiso Portuguese Villa Architecture' },
  { src: '/assets/lobby.png', alt: 'Casa Paradiso Boutique Luxury Reception' },
  { src: '/assets/heritage-room.png', alt: 'Casa Paradiso Heritage Suite' },
  { src: '/assets/restaurant.png', alt: 'Casa Paradiso Fine Dining' },
  { src: '/assets/pool.png', alt: 'Casa Paradiso Serene Swimming Pool' },
  { src: '/assets/hero.png', alt: 'Casa Paradiso Sanctuary of Timeless Goan Elegance' },
];

export default function Hero() {
  const [heroImg, setHeroImg] = useState('/assets/hero.png');
  const [tagline, setTagline] = useState('Boutique Luxury Hotel · Panaji, Goa');
  const [phase, setPhase] = useState<'intro' | 'open' | 'cycling' | 'expanding' | 'settled'>('intro');
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with CRM Store and check prefers-reduced-motion
  useEffect(() => {
    const updateFromCRM = () => {
      const store = getCRMStore();
      if (store.settings?.heroImageOverride) {
        setHeroImg(store.settings.heroImageOverride);
      }
      if (store.settings?.tagline) {
        setTagline(store.settings.tagline);
      }
    };
    updateFromCRM();
    const unsubscribe = subscribeToCRM(updateFromCRM);

    if (typeof window !== 'undefined') {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (motionQuery.matches) {
        setReducedMotion(true);
        setPhase('settled');
        document.documentElement.setAttribute('data-hero-state', 'settled');
      }
    }

    return () => unsubscribe();
  }, []);

  // Preload cycle images for buttery smooth playback
  useEffect(() => {
    if (reducedMotion) return;
    CYCLE_IMAGES.forEach((img) => {
      const imageObj = new Image();
      imageObj.src = img.src;
    });
  }, [reducedMotion]);

  // Orchestrate the cinematic timeline
  useEffect(() => {
    if (reducedMotion) return;

    // Clear any previous timers
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (intervalRef.current) clearInterval(intervalRef.current);

    document.documentElement.setAttribute('data-hero-state', 'intro');

    // 1. Text settles, then aperture opens between CASA and PARADISO
    const tOpen = setTimeout(() => {
      setPhase('open');
      document.documentElement.setAttribute('data-hero-state', 'open');
    }, 900);
    timeoutsRef.current.push(tOpen);

    // 2. Cycling starts inside the aperture
    const tCycleStart = setTimeout(() => {
      setPhase('cycling');
      document.documentElement.setAttribute('data-hero-state', 'cycling');
      let idx = 0;
      intervalRef.current = setInterval(() => {
        idx++;
        if (idx < CYCLE_IMAGES.length) {
          setCurrentCycleIndex(idx);
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 420);
    }, 1300);
    timeoutsRef.current.push(tCycleStart);

    // 3. Image expansion breaks out of the typography
    const tExpand = setTimeout(() => {
      setPhase('expanding');
      document.documentElement.setAttribute('data-hero-state', 'expanding');
    }, 3600);
    timeoutsRef.current.push(tExpand);

    // 4. Final hero settles into place
    const tSettled = setTimeout(() => {
      setPhase('settled');
      document.documentElement.setAttribute('data-hero-state', 'settled');
    }, 4800);
    timeoutsRef.current.push(tSettled);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [reducedMotion]);

  return (
    <section id="hero" className={`hero-cinematic hero-cinematic--${phase}`} aria-label="Hero Section">
      {/* Background layer during intro/cycling */}
      <div className="hero-cinematic__canvas-bg" aria-hidden="true" />

      {/* Intro Typography Stage (Semantic single H1 horizontal composition) */}
      <div className={`hero-cinematic__intro-stage ${phase === 'settled' ? 'is-faded' : ''}`}>
        <h1 className="hero-cinematic__h1" aria-label="CASA PARADISO">
          <span className="hero-cinematic__word hero-cinematic__word--casa">
            CASA
          </span>

          {/* Central Image Aperture Window */}
          <span 
            className={`hero-cinematic__aperture ${
              phase === 'open' || phase === 'cycling' || phase === 'expanding' ? 'is-open' : ''
            } ${phase === 'expanding' ? 'is-expanding' : ''}`}
            aria-hidden="true"
          >
            <span className="hero-cinematic__aperture-inner">
              {CYCLE_IMAGES.map((img, index) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt=""
                  className={`hero-cinematic__aperture-img ${
                    index === currentCycleIndex ? 'is-active' : ''
                  }`}
                  loading="eager"
                />
              ))}
            </span>
          </span>

          <span className="hero-cinematic__word hero-cinematic__word--paradiso">
            PARADISO
          </span>
        </h1>
      </div>

      {/* Full-bleed Expanding Image Layer */}
      <div 
        className={`hero-cinematic__expansion-layer ${
          phase === 'expanding' || phase === 'settled' ? 'is-expanded' : ''
        }`}
        aria-hidden="true"
      >
        <img 
          src={heroImg} 
          alt="Casa Paradiso Luxury Hotel Panaji" 
          className="hero-cinematic__expansion-img"
        />
        <div className="hero-cinematic__overlay" />
      </div>

      {/* Final Settled Hero Content (Preserves all branding, CTAs, and copy) */}
      <div className={`hero-cinematic__content ${phase === 'settled' ? 'is-visible' : ''}`}>
        <span className="hero__label">{tagline}</span>
        <h2 className="hero__title">Sanctuary of Timeless Goan Elegance</h2>
        <p className="hero__subtitle">
          An intimate 18-room boutique haven on Altinho hill, steps from the Mandovi River, vibrant casinos, and historic Latin Quarter.
        </p>

        <div className="hero__actions">
          <Link href="#booking" className="hero__cta hero__cta--primary">
            Reserve Your Escape
          </Link>
          <Link href="#rooms" className="hero__cta hero__cta--secondary">
            Explore Accommodations
          </Link>
        </div>
      </div>
    </section>
  );
}
