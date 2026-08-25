'use client';

import React, { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { AttractionScene, AttractionImageConfig, ATTRACTIONS_DATA } from './attractionData';
import AttractionsScene from './AttractionsScene';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface AttractionsProps {
  attractions?: AttractionScene[];
}

function getResponsiveCoords(img: AttractionImageConfig, width: number, height: number) {
  let scale = 1;
  let xFactor = 1;
  let yFactor = 1;

  if (width < 640) {
    // Mobile devices (under 640px)
    scale = 0.44;
    xFactor = 0.38;
    yFactor = 0.42;
  } else if (width < 1024) {
    // Tablet devices (640px to 1024px)
    scale = 0.68;
    xFactor = 0.62;
    yFactor = 0.65;
  } else if (width < 1440) {
    // Smaller desktop / laptop
    scale = Math.max(0.78, width / 1440);
    xFactor = scale;
    yFactor = Math.min(1, Math.max(0.8, height / 900));
  } else {
    // Large desktop
    scale = Math.min(1.15, width / 1440);
    xFactor = scale;
    yFactor = scale;
  }

  return {
    x: Math.round(img.x * xFactor),
    y: Math.round(img.y * yFactor),
    width: Math.round(img.width * scale),
    height: Math.round(img.height * scale),
    rotation: img.rotation || 0,
    zIndex: img.zIndex || 2,
  };
}

export default function Attractions({ attractions = ATTRACTIONS_DATA }: AttractionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // References for the 3 persistent floating image slots
  const slot0Ref = useRef<HTMLDivElement>(null);
  const slot1Ref = useRef<HTMLDivElement>(null);
  const slot2Ref = useRef<HTMLDivElement>(null);

  // References for center title cards & background layers
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Keep a reference to ScrollTrigger instance for programmatic navigation
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);

  const handleSelectScene = useCallback(
    (index: number) => {
      const st = scrollTriggerInstanceRef.current;
      if (!st || attractions.length <= 1) return;

      const totalDistance = st.end - st.start;
      const targetProgress = index / (attractions.length - 1);
      const targetScroll = st.start + targetProgress * totalDistance;

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    },
    [attractions.length]
  );

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion || !containerRef.current || attractions.length === 0) return;

      const numScenes = attractions.length;
      const slotRefs = [slot0Ref.current, slot1Ref.current, slot2Ref.current];

      if (!slotRefs[0] || !slotRefs[1] || !slotRefs[2]) return;

      const winWidth = window.innerWidth;
      const winHeight = window.innerHeight;

      // 1. Initial configuration for Scene 0
      const initialScene = attractions[0];
      slotRefs.forEach((slotEl, slotIdx) => {
        if (!slotEl) return;
        const coords = getResponsiveCoords(initialScene.images[slotIdx], winWidth, winHeight);

        gsap.set(slotEl, {
          x: coords.x,
          y: coords.y,
          width: coords.width,
          height: coords.height,
          rotate: coords.rotation,
          zIndex: coords.zIndex,
          opacity: 1,
          xPercent: -50,
          yPercent: -50,
          transformOrigin: 'center center',
          willChange: 'transform, width, height',
        });

        // Set all internal photos inside this slot
        const photos = slotEl.querySelectorAll<HTMLElement>('.attraction-slot-photo');
        photos.forEach((photoEl, pIdx) => {
          gsap.set(photoEl, {
            opacity: pIdx === 0 ? 1 : 0,
            willChange: 'opacity',
          });
        });
      });

      // Set initial state for Center Titles
      titleRefs.current.forEach((titleEl, tIdx) => {
        if (!titleEl) return;
        gsap.set(titleEl, {
          opacity: tIdx === 0 ? 1 : 0,
          y: tIdx === 0 ? 0 : 15,
          pointerEvents: tIdx === 0 ? 'auto' : 'none',
          willChange: 'transform, opacity',
        });
      });

      // Set initial state for Backgrounds
      bgRefs.current.forEach((bgEl, bIdx) => {
        if (!bgEl) return;
        gsap.set(bgEl, {
          opacity: bIdx === 0 ? 1 : 0,
          willChange: 'opacity',
        });
      });

      // 2. Build continuous morphing timeline
      const totalScrollHeight = `${numScenes * 140}vh`;
      const stepDuration = 1.0; // Time unit per transition

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${totalScrollHeight}`,
          pin: true,
          scrub: 1.0, // Silky smooth responsive scrub
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const raw = self.progress * (numScenes - 1);
            const currentIdx = Math.min(numScenes - 1, Math.max(0, Math.round(raw)));
            setActiveIndex((prev) => (prev !== currentIdx ? currentIdx : prev));
          },
        },
      });

      scrollTriggerInstanceRef.current = tl.scrollTrigger || null;

      // 3. Chain transitions across the 5 scenes
      for (let i = 0; i < numScenes - 1; i++) {
        const startTime = i * stepDuration;
        const currentScene = attractions[i];
        const nextScene = attractions[i + 1];

        const holdDuration = 0.22;
        const morphStartTime = startTime + holdDuration;
        const morphDuration = 0.72;

        // Animate each of the 3 independent floating image slots
        slotRefs.forEach((slotEl, slotIdx) => {
          if (!slotEl) return;
          const nextCoords = getResponsiveCoords(nextScene.images[slotIdx], winWidth, winHeight);

          // Morph position, size, and rotation of the slot
          tl.to(
            slotEl,
            {
              x: nextCoords.x,
              y: nextCoords.y,
              width: nextCoords.width,
              height: nextCoords.height,
              rotate: nextCoords.rotation,
              zIndex: nextCoords.zIndex,
              duration: morphDuration,
              ease: 'power2.inOut',
            },
            morphStartTime
          );

          // Crossfade photos inside the slot
          const currentPhoto = slotEl.querySelector<HTMLElement>(
            `.attraction-slot-photo--scene-${i}`
          );
          const nextPhoto = slotEl.querySelector<HTMLElement>(
            `.attraction-slot-photo--scene-${i + 1}`
          );

          if (currentPhoto) {
            tl.to(
              currentPhoto,
              {
                opacity: 0,
                duration: morphDuration * 0.65,
                ease: 'power1.inOut',
              },
              morphStartTime + morphDuration * 0.15
            );
          }

          if (nextPhoto) {
            tl.to(
              nextPhoto,
              {
                opacity: 1,
                duration: morphDuration * 0.65,
                ease: 'power1.inOut',
              },
              morphStartTime + morphDuration * 0.25
            );
          }
        });

        // Subtle Center Title Exit and Enter (Title remains at center)
        const currentTitle = titleRefs.current[i];
        const nextTitle = titleRefs.current[i + 1];

        if (currentTitle) {
          tl.to(
            currentTitle,
            {
              opacity: 0,
              y: -12,
              duration: morphDuration * 0.45,
              ease: 'power2.in',
            },
            morphStartTime
          );
        }

        if (nextTitle) {
          tl.fromTo(
            nextTitle,
            {
              opacity: 0,
              y: 12,
            },
            {
              opacity: 1,
              y: 0,
              duration: morphDuration * 0.45,
              ease: 'power2.out',
            },
            morphStartTime + morphDuration * 0.45
          );
        }

        // Subtly crossfade background layers
        const currentBg = bgRefs.current[i];
        const nextBg = bgRefs.current[i + 1];

        if (currentBg) {
          tl.to(
            currentBg,
            {
              opacity: 0,
              duration: morphDuration * 0.8,
              ease: 'power1.inOut',
            },
            morphStartTime
          );
        }

        if (nextBg) {
          tl.to(
            nextBg,
            {
              opacity: 1,
              duration: morphDuration * 0.8,
              ease: 'power1.inOut',
            },
            morphStartTime + morphDuration * 0.1
          );
        }
      }

      // Small concluding hold buffer at end of pinned timeline
      tl.to({}, { duration: 0.15 });
    },
    { scope: containerRef, dependencies: [attractions] }
  );

  return (
    <section
      id="experiences"
      className="attractions-section"
      ref={containerRef}
      aria-label="Casa Paradiso Local Attractions"
    >
      {/* Anchor target for #attractions */}
      <div
        id="attractions"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      />

      {/* Cinematic Pinned Visual Stage */}
      <AttractionsScene
        scenes={attractions}
        activeIndex={activeIndex}
        onSelectScene={handleSelectScene}
        slot0Ref={slot0Ref}
        slot1Ref={slot1Ref}
        slot2Ref={slot2Ref}
        titleRefs={titleRefs}
        bgRefs={bgRefs}
      />

      {/* Accessible Static Grid for Prefers-Reduced-Motion */}
      <div className="attractions-accessible-grid">
        <div className="container">
          <span className="section-label">Local Attractions</span>
          <h2 className="section-title">Goan Experiences & Heritage Compositions</h2>
          <p className="section-subtitle">
            Immerse yourself in Panaji's vibrant culture, historic landmarks, and scenic beauty.
          </p>

          <div className="attractions-accessible-list">
            {attractions.map((attr, idx) => (
              <article key={attr.id} className="attraction-accessible-card">
                <div className="attraction-accessible-card__header">
                  <span className="attraction-accessible-card__tag">{attr.category}</span>
                  <h3 className="attraction-accessible-card__title">
                    {String(idx + 1).padStart(2, '0')}. {attr.title}
                  </h3>
                  {attr.subtitle && (
                    <h4 className="attraction-accessible-card__subtitle">{attr.subtitle}</h4>
                  )}
                  <p className="attraction-accessible-card__desc">{attr.description}</p>
                </div>

                <div className="attraction-accessible-card__images">
                  {attr.images.map((img, imgIdx) => (
                    <div key={imgIdx} className="attraction-accessible-card__img-wrap">
                      <img src={img.src} alt={img.alt || attr.title} />
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
