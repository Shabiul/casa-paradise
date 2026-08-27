'use client';

import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --- Data for each slide ---
export interface StorySlide {
  title: string;
  description: string;
  image: string;
  bgColor: string;
  textColor: string;
  badge?: string;
  price?: string;
  ctaText?: string;
  ctaLink?: string;
}

const defaultSlidesData: StorySlide[] = [
  {
    title: "Heritage Villa Sanctuary",
    description: "Nestled on Altinho hill overlooking the Mandovi River, experience the timeless charm of Portuguese-Goan architecture.",
    image: "/assets/wa-photo-1.jpeg",
    bgColor: "#FAF8F5",
    textColor: "#111827",
  },
  {
    title: "Artisanal Heritage Suites",
    description: "Classic hand-crafted teak furniture, high airy ceilings, and modern comforts curated for restorative tranquility.",
    image: "/assets/wa-photo-6.jpeg",
    bgColor: "#FAF8F5",
    textColor: "#111827",
  },
  {
    title: "In-House Hospitality & Reception",
    description: "Warm personalized concierge service, curated Goan excursions, and attentive boutique care.",
    image: "/assets/wa-photo-3.jpeg",
    bgColor: "#FAF8F5",
    textColor: "#111827",
  },
  {
    title: "Restorative Suite Accommodations",
    description: "Unwind in serene luxury surrounded by tropical Goan flora and peaceful hill breezes.",
    image: "/assets/wa-photo-8.jpeg",
    bgColor: "#FAF8F5",
    textColor: "#111827",
  },
];

export interface ScrollingFeatureShowcaseProps {
  slides?: StorySlide[];
  ctaText?: string;
  ctaHref?: string;
}

// --- Main App Component ---
export function ScrollingFeatureShowcase({
  slides = defaultSlidesData,
  ctaText = "Get Started",
  ctaHref = "#get-started",
}: ScrollingFeatureShowcaseProps) {
  // State to track the currently active slide index
  const [activeIndex, setActiveIndex] = useState(0);
  // Ref to the outer scroll runway container
  const containerRef = useRef<HTMLDivElement>(null);
  // Ref to the sticky content panel
  const stickyPanelRef = useRef<HTMLDivElement>(null);

  // --- ScrollTrigger-based Page Scroll Handler ---
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const step = 1 / slides.length;
          // Calculate the active index based on scroll progress through the section
          const newActiveIndex = Math.min(
            slides.length - 1,
            Math.max(0, Math.floor(self.progress / step))
          );
          setActiveIndex(newActiveIndex);
        },
      });

      return () => {
        st.kill();
      };
    },
    { scope: containerRef, dependencies: [slides.length] }
  );

  const handlePaginationClick = (index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentScroll = window.scrollY || window.pageYOffset;
    const sectionTop = currentScroll + rect.top;
    const sectionHeight = containerRef.current.offsetHeight - window.innerHeight;
    if (sectionHeight <= 0) return;
    const targetScroll = sectionTop + (sectionHeight / slides.length) * (index + 0.1);
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };
  
  // Dynamic styles for the background and text color transitions
  const currentSlide = slides[activeIndex] || slides[0];
  const dynamicStyles: React.CSSProperties = {
    backgroundColor: currentSlide?.bgColor || '#FAF8F5',
    color: currentSlide?.textColor || '#0F172A',
    transition: 'background-color 0.7s cubic-bezier(0.16, 1, 0.3, 1), color 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  // Styles for the grid pattern on the right side
  const gridPatternStyle: React.CSSProperties = {
    backgroundImage: `
      linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px)
    `,
    backgroundSize: '3.5rem 3.5rem',
  };

  return (
    <div 
      ref={containerRef}
      className="interactive-story-scroller"
      style={{
        position: 'relative',
        width: '100%',
        height: `${slides.length * 100}vh`, // Natural scroll runway pinned to page scroll
      }}
    >
      <div 
        ref={stickyPanelRef} 
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center" 
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          ...dynamicStyles,
        }}
      >
        <div 
          className="grid grid-cols-1 md:grid-cols-2 h-full w-full max-w-7xl mx-auto"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            height: '100%',
            width: '100%',
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
          
          {/* Left Column: Text Content, Pagination & Button */}
          <div 
            className="interactive-story-left-col relative flex flex-col justify-center p-8 md:p-16 border-r border-black/10"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 'clamp(2rem, 5vw, 4rem)',
              borderRight: '1px solid rgba(0, 0, 0, 0.08)',
              zIndex: 2,
            }}
          >
            {/* Pagination Bars */}
            <div 
              className="interactive-story-pagination absolute top-16 left-16 flex space-x-2"
              style={{
                position: 'absolute',
                top: '2.5rem',
                left: 'clamp(2rem, 5vw, 4rem)',
                display: 'flex',
                gap: '0.5rem',
                zIndex: 10,
              }}
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePaginationClick(index)}
                  className="h-1 rounded-full transition-all duration-500 ease-in-out"
                  style={{
                    height: '4px',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    width: index === activeIndex ? '3rem' : '1.5rem',
                    backgroundColor: index === activeIndex ? 'currentColor' : 'rgba(0, 0, 0, 0.2)',
                    opacity: index === activeIndex ? 1 : 0.4,
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            <div 
              className="interactive-story-text-container relative h-64 w-full"
              style={{
                position: 'relative',
                minHeight: '260px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="absolute inset-0 transition-all duration-700 ease-in-out"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: index === activeIndex ? 1 : 0,
                    transform: index === activeIndex ? 'translateY(0)' : 'translateY(24px)',
                    pointerEvents: index === activeIndex ? 'auto' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  {slide.badge && (
                    <span 
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '2.5px',
                        marginBottom: '0.75rem',
                        display: 'inline-block',
                        color: '#059669',
                      }}
                    >
                      {slide.badge}
                    </span>
                  )}
                  <h2 
                    className="text-4xl md:text-5xl font-bold tracking-tighter"
                    style={{
                      fontFamily: 'var(--font-display, serif)',
                      fontSize: 'clamp(2rem, 3.8vw, 3.25rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.15,
                      margin: 0,
                    }}
                  >
                    {slide.title}
                  </h2>
                  <p 
                    className="mt-4 text-base md:text-lg max-w-md"
                    style={{
                      fontFamily: 'var(--font-body, sans-serif)',
                      marginTop: '1rem',
                      fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
                      lineHeight: 1.6,
                      opacity: 0.85,
                      maxWidth: '460px',
                    }}
                  >
                    {slide.description}
                  </p>
                  {slide.price && (
                    <div 
                      style={{
                        marginTop: '1.25rem',
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: '#059669',
                        fontFamily: 'var(--font-display, serif)',
                      }}
                    >
                      {slide.price}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Get Started / CTA Button */}
            <div 
              className="interactive-story-cta-container absolute bottom-16 left-16"
              style={{
                position: 'absolute',
                bottom: '2.5rem',
                left: 'clamp(2rem, 5vw, 4rem)',
                zIndex: 10,
              }}
            >
              <a
                href={currentSlide.ctaLink || ctaHref}
                className="px-10 py-4 bg-black text-white font-semibold rounded-full uppercase tracking-wider hover:bg-gray-800 transition-colors"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.85rem 2.2rem',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0F172A';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {currentSlide.ctaText || ctaText}
              </a>
            </div>
          </div>

          {/* Right Column: Image Content with Grid Background */}
          <div 
            className="hidden md:flex items-center justify-center p-8" 
            style={{
              ...gridPatternStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              position: 'relative',
            }}
          >
            <div 
              className="relative w-[50%] h-[80vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-black/5"
              style={{
                position: 'relative',
                width: 'clamp(300px, 80%, 480px)',
                height: 'min(76vh, 600px)',
                borderRadius: '1.25rem',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '4px solid rgba(0, 0, 0, 0.06)',
                backgroundColor: '#E2E8F0',
              }}
            >
              <div 
                className="absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: `translateY(-${activeIndex * 100}%)`,
                }}
              >
                {slides.map((slide, index) => (
                  <div 
                    key={index} 
                    className="w-full h-full"
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                      style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      onError={(e) => { 
                        const target = e.currentTarget;
                        target.onerror = null; 
                        target.src = `https://placehold.co/800x1200/e2e8f0/4a5568?text=Casa+Paradiso`; 
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
