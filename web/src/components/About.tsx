'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface AboutProps {
  leftTitle?: string;
  leftCopy?: string[];
  rightTitle?: string;
  rightCopy?: string[];
  finalStatement?: string[];
  images?: {
    opening?: string;
    leftSplit?: string;
    rightSplit?: string;
  };
  accentColor?: string;
  bgColor?: string;
}

const defaultImages = {
  opening: '/assets/exterior.png',
  leftSplit: '/assets/heritage-room.png',
  rightSplit: '/assets/pool.png',
};

const defaultLeftCopy = [
  'PERCHED ON HISTORIC ALTINHO HILL.',
  'WHERE 18 INTIMATE SUITES OVERLOOK THE',
  'MANDOVI RIVER, STEPS FROM FONTAINHAS',
  'AND PANAJI\'S VIBRANT CASINOS.',
];

const defaultRightCopy = [
  'TIMELESS RETREAT CRAFTED FOR REPOSE.',
  'TAILORED CONCIERGE, GOURMET DINING,',
  'AND THE SERENE BEAUTY OF OLD-WORLD',
  'PORTUGUESE-GOAN HOSPITALITY.',
];

const defaultFinalStatement = [
  'WHERE HERITAGE MEETS TRANQUILITY.',
  'AN INTIMATE SANCTUARY',
  'ABOVE THE MANDOVI.',
  'CASA PARADISO.',
];

export default function About({
  leftTitle = 'OUR HERITAGE',
  leftCopy = defaultLeftCopy,
  rightTitle = 'QUIET LUXURY',
  rightCopy = defaultRightCopy,
  finalStatement = defaultFinalStatement,
  images = defaultImages,
  accentColor = '#059669', // Brand emerald green from Casa Paradiso design system
  bgColor = '#FAF8F5',
}: AboutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Stage 1 & 2: Opening Full-screen Image and Rotating Strip
  const openingWrapperRef = useRef<HTMLDivElement>(null);
  const openingImgRef = useRef<HTMLImageElement>(null);
  const rotatingStripRef = useRef<HTMLDivElement>(null);

  // Text groups flanking the opening image
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const textStageRef = useRef<HTMLDivElement>(null);

  // Stage 3: Two Split Images (Left from Top, Right from Bottom)
  const splitStageRef = useRef<HTMLDivElement>(null);
  const leftSplitPanelRef = useRef<HTMLDivElement>(null);
  const rightSplitPanelRef = useRef<HTMLDivElement>(null);

  // Stage 4: Final Centered Statement Typography
  const finalStatementRef = useRef<HTMLDivElement>(null);

  const activeImages = { ...defaultImages, ...images };

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        // Immediate static layout for accessibility
        gsap.set(openingWrapperRef.current, { display: 'none' });
        gsap.set(rotatingStripRef.current, { display: 'none' });
        gsap.set(textStageRef.current, { display: 'none' });
        gsap.set(splitStageRef.current, { display: 'flex', opacity: 1 });
        gsap.set([leftSplitPanelRef.current, rightSplitPanelRef.current], {
          yPercent: 0,
        });
        gsap.set(finalStatementRef.current, { opacity: 1, y: 0 });
        return;
      }

      // =========================================================
      // 1. INITIAL ELEMENT STATES
      // =========================================================

      // Full-screen image covering the entire section fit to screen
      gsap.set(openingWrapperRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)', // 100% full screen
        display: 'block',
        opacity: 1,
        willChange: 'clip-path, transform',
      });

      gsap.set(openingImgRef.current, {
        scale: 1.06,
        willChange: 'transform',
      });

      // Rotating central 5% strip initially hidden (activates when opening image reaches 5%)
      gsap.set(rotatingStripRef.current, {
        opacity: 0,
        width: '3.5vw',
        height: '140vh',
        rotate: 0, // 12 o'clock (0 deg)
        scaleX: 1,
        scaleY: 1,
        xPercent: -50,
        yPercent: -50,
        left: '50%',
        top: '50%',
        transformOrigin: 'center center',
        backgroundColor: accentColor,
        willChange: 'transform, opacity, scale',
      });

      // Side text layers initially hidden behind outer edges
      gsap.set(leftColRef.current, {
        opacity: 0,
        x: -60,
        willChange: 'transform, opacity',
      });

      gsap.set(rightColRef.current, {
        opacity: 0,
        x: 60,
        willChange: 'transform, opacity',
      });

      // Split stage initially hidden
      gsap.set(splitStageRef.current, {
        display: 'none',
        opacity: 0,
      });

      // Left split image starts above screen (-100%)
      gsap.set(leftSplitPanelRef.current, {
        yPercent: -100,
        willChange: 'transform',
      });

      // Right split image starts below screen (+100%)
      gsap.set(rightSplitPanelRef.current, {
        yPercent: 100,
        willChange: 'transform',
      });

      // Final statement typography initially hidden
      gsap.set(finalStatementRef.current, {
        opacity: 0,
        y: 40,
        willChange: 'transform, opacity',
      });

      // =========================================================
      // 2. MASTER 150% SLOWER SCROLL-SCRUBBED TIMELINE (+=520vh)
      // =========================================================
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=520vh', // 150% slower, lavish scroll runway for ultra-fluid control
          pin: true,
          scrub: 1.2, // Velvety smooth momentum scrub
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // ---------------------------------------------------------
      // PHASE 1: [0.0s - 1.5s] EQUAL-TERM LEFT & RIGHT CROPPING
      // Image crops equally from left and right towards center (to 5% width).
      // As image crops inward, the text on left and right is revealed.
      // ---------------------------------------------------------
      tl.to(
        openingWrapperRef.current,
        {
          clipPath: 'inset(0% 47.5% 0% 47.5%)', // Cropped to center 5% vertical strip
          duration: 1.5,
          ease: 'power2.inOut',
        },
        '0.0'
      )
        .to(
          openingImgRef.current,
          {
            scale: 1.0,
            duration: 1.5,
            ease: 'sine.out',
          },
          '0.0'
        )
        // Reveal left & right text as the image progresses towards the center
        .to(
          [leftColRef.current, rightColRef.current],
          {
            opacity: 1,
            x: 0,
            duration: 1.0,
            stagger: 0.12,
            ease: 'power2.out',
          },
          '0.35'
        );

      // ---------------------------------------------------------
      // PHASE 2: [1.5s - 2.8s] 5% STRIP ROTATES CLOCKWISE 12 O'CLOCK -> 2:40
      // Orientation locks at 2:40 (~80 deg), text comes closer,
      // and then the strip resizes down until it disappears.
      // ---------------------------------------------------------
      tl.addLabel('rotateAndConverge', '1.5');

      // Hand off from clipped container to the precise rotating strip
      tl.set(
        openingWrapperRef.current,
        {
          display: 'none',
        },
        'rotateAndConverge'
      )
        .set(
          rotatingStripRef.current,
          {
            opacity: 1,
            rotate: 0, // 12 o'clock
            scaleX: 1,
            scaleY: 1,
          },
          'rotateAndConverge'
        )
        // Rotate clockwise from 12 o'clock (0°) to 2:40 (~80°)
        .to(
          rotatingStripRef.current,
          {
            rotate: 80, // 2:40 on a clock face (80 degrees)
            duration: 1.0,
            ease: 'power2.inOut',
          },
          'rotateAndConverge'
        )
        // As the strip tilts, text moves closer inward toward center
        .to(
          leftColRef.current,
          {
            x: 170,
            duration: 1.0,
            ease: 'power2.inOut',
          },
          'rotateAndConverge'
        )
        .to(
          rightColRef.current,
          {
            x: -170,
            duration: 1.0,
            ease: 'power2.inOut',
          },
          'rotateAndConverge'
        )
        // Lock orientation at 2:40, resize down along length/width until it disappears
        .to(
          rotatingStripRef.current,
          {
            scaleX: 0,
            scaleY: 0,
            opacity: 0,
            duration: 0.5,
            ease: 'power3.in',
          },
          'rotateAndConverge+=0.9'
        )
        // Text fades as the tilted strip disappears
        .to(
          [leftColRef.current, rightColRef.current],
          {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
          },
          'rotateAndConverge+=1.0'
        );

      // ---------------------------------------------------------
      // PHASE 3: [2.8s - 4.1s] 2 SPLIT IMAGES ENTER
      // Left from TOP (UP) and Right from BOTTOM (DOWN)
      // They reach the screen size (50/50 split canvas).
      // ---------------------------------------------------------
      tl.addLabel('splitEntrance', '2.8');

      tl.set(
        splitStageRef.current,
        {
          display: 'flex',
          opacity: 1,
        },
        'splitEntrance'
      )
        // Left image slides down from the top
        .to(
          leftSplitPanelRef.current,
          {
            yPercent: 0,
            duration: 1.3,
            ease: 'power3.inOut',
          },
          'splitEntrance'
        )
        // Right image slides up from the bottom
        .to(
          rightSplitPanelRef.current,
          {
            yPercent: 0,
            duration: 1.3,
            ease: 'power3.inOut',
          },
          'splitEntrance'
        );

      // ---------------------------------------------------------
      // PHASE 4: [4.1s - 5.2s] FINAL TEXT APPEARS & NEXT SECTION ARRIVES
      // When images reach screen size, the grand statement text appears.
      // ---------------------------------------------------------
      tl.addLabel('statementReveal', '4.0');

      tl.to(
        finalStatementRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
        },
        'statementReveal'
      )
        // Settled posture hold at end of timeline before unpinning
        .to(
          viewportRef.current,
          {
            duration: 0.5,
            ease: 'none',
          },
          '4.9'
        );
    },
    { scope: containerRef, dependencies: [images] }
  );

  return (
    <section
      id="about"
      className="editorial-cinematic"
      ref={containerRef}
      style={
        {
          '--editorial-bg': bgColor,
          '--editorial-accent': accentColor,
        } as React.CSSProperties
      }
      aria-label="Casa Paradiso Heritage Story"
    >
      <div className="editorial-viewport" ref={viewportRef}>
        {/* =========================================================
            STAGE 1 & 2: FULL-SCREEN OPENING IMAGE & 5% ROTATING STRIP
            ========================================================= */}
        {/* Full-Screen Image Container (Crops from left and right equally) */}
        <div ref={openingWrapperRef} className="editorial-fullscreen-wrapper">
          <img
            ref={openingImgRef}
            src={activeImages.opening}
            alt="Casa Paradiso Portuguese Heritage Villa"
            className="editorial-fullscreen-img"
            loading="eager"
          />
        </div>

        {/* 5% Central Strip (Rotates 12 o'clock -> 2:40 then shrinks to 0) */}
        <div ref={rotatingStripRef} className="editorial-rotating-strip" aria-hidden="true" />

        {/* Flanking Text Layers (Revealed as image crops towards center) */}
        <div ref={textStageRef} className="editorial-flanking-text-stage">
          {/* Left Column: OUR HERITAGE */}
          <div ref={leftColRef} className="editorial-side-col editorial-side-col--left">
            <span className="editorial-badge">PANJIM · GOA</span>
            <h2 className="editorial-title">{leftTitle}</h2>
            <div className="editorial-copy">
              {leftCopy.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>

          {/* Right Column: QUIET LUXURY */}
          <div ref={rightColRef} className="editorial-side-col editorial-side-col--right">
            <span className="editorial-badge">EST. ALTINHO</span>
            <h2 className="editorial-title">{rightTitle}</h2>
            <div className="editorial-copy">
              {rightCopy.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================
            STAGE 3: TWO SPLIT IMAGES (Left from UP, Right from DOWN)
            ========================================================= */}
        <div ref={splitStageRef} className="editorial-split-fullscreen-stage" aria-hidden="true">
          {/* Left Panel: Enters from Top */}
          <div className="editorial-split-col editorial-split-col--left">
            <div ref={leftSplitPanelRef} className="editorial-split-panel-inner">
              <img
                src={activeImages.leftSplit}
                alt="Casa Paradiso Heritage Suite Interior"
                className="editorial-split-img"
              />
            </div>
          </div>

          {/* Right Panel: Enters from Bottom */}
          <div className="editorial-split-col editorial-split-col--right">
            <div ref={rightSplitPanelRef} className="editorial-split-panel-inner">
              <img
                src={activeImages.rightSplit}
                alt="Casa Paradiso Pool & Sun Terrace"
                className="editorial-split-img"
              />
            </div>
          </div>

          {/* =========================================================
              STAGE 4: FINAL STATEMENT TEXT OVERLAY
              ========================================================= */}
          <div ref={finalStatementRef} className="editorial-split-statement">
            {finalStatement.map((line, idx) => (
              <div key={idx} className="editorial-split-statement__line">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
