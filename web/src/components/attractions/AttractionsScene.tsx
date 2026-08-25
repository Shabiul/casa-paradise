'use client';

import React from 'react';
import { AttractionScene } from './attractionData';
import { AttractionImageSlot } from './AttractionImage';

interface AttractionsSceneProps {
  scenes: AttractionScene[];
  activeIndex: number;
  onSelectScene: (index: number) => void;
  slot0Ref: React.RefObject<HTMLDivElement>;
  slot1Ref: React.RefObject<HTMLDivElement>;
  slot2Ref: React.RefObject<HTMLDivElement>;
  titleRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  bgRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export default function AttractionsScene({
  scenes,
  activeIndex,
  onSelectScene,
  slot0Ref,
  slot1Ref,
  slot2Ref,
  titleRefs,
  bgRefs,
}: AttractionsSceneProps) {
  return (
    <div className="attractions-stage">
      {/* 1. Atmospheric Pinned Background Layers */}
      <div className="attractions-canvas-bg" aria-hidden="true">
        {scenes.map((scene, idx) => (
          <div
            key={`bg-${scene.id}`}
            ref={(el) => {
              bgRefs.current[idx] = el;
            }}
            className={`attractions-canvas-bg__layer ${idx === 0 ? 'is-visible' : ''}`}
            style={{
              backgroundImage: scene.background ? `url("${scene.background}")` : undefined,
            }}
          />
        ))}
        {/* Darkening & architectural overlay */}
        <div className="attractions-grid-pattern" />
        <div className="attractions-vignette-overlay" />
        <div className="attractions-dark-tint" />
      </div>

      {/* 2. Top Header Bar: Section Badge & Counter */}
      <header className="attractions-top-bar">
        <div className="attractions-top-bar__left">
          <span className="attractions-badge">LOCAL ATTRACTIONS</span>
          <span className="attractions-top-sub">PANAJI · GOA</span>
        </div>

        <div className="attractions-counter">
          <span className="attractions-counter__current">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <span className="attractions-counter__divider">/</span>
          <span className="attractions-counter__total">
            {String(scenes.length).padStart(2, '0')}
          </span>
        </div>
      </header>

      {/* 3. Left-Side Fixed Attraction Navigation (Stationary in Viewport) */}
      <nav
        className="attractions-left-nav"
        aria-label="Attraction Directory"
      >
        <div className="attractions-left-nav__header">
          <span className="attractions-left-nav__label">EXPERIENCES</span>
          <span className="attractions-left-nav__line" />
        </div>

        <ul className="attractions-left-nav__list">
          {scenes.map((scene, idx) => {
            const isActive = idx === activeIndex;
            return (
              <li key={`nav-${scene.id}`} className="attractions-left-nav__item">
                <button
                  type="button"
                  onClick={() => onSelectScene(idx)}
                  className={`attractions-left-nav__btn ${isActive ? 'is-active' : ''}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="attractions-left-nav__index">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="attractions-left-nav__title">
                    {scene.shortTitle || scene.title}
                  </span>
                  {isActive && <span className="attractions-left-nav__indicator" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 4. The 3 Independent Floating Image Slots (Morphed via GSAP) */}
      <div className="attractions-floating-canvas" aria-hidden="true">
        <AttractionImageSlot
          ref={slot0Ref}
          slotIndex={0}
          scenes={scenes}
          activeSceneIndex={activeIndex}
        />
        <AttractionImageSlot
          ref={slot1Ref}
          slotIndex={1}
          scenes={scenes}
          activeSceneIndex={activeIndex}
        />
        <AttractionImageSlot
          ref={slot2Ref}
          slotIndex={2}
          scenes={scenes}
          activeSceneIndex={activeIndex}
        />
      </div>

      {/* 5. Fixed Center Title Stage (Visual Anchor of the Entire Scene) */}
      <div className="attractions-center-anchor">
        {scenes.map((scene, idx) => {
          return (
            <div
              key={`title-${scene.id}`}
              ref={(el) => {
                titleRefs.current[idx] = el;
              }}
              className={`attractions-center-title-card ${idx === 0 ? 'is-initial-visible' : ''}`}
              data-scene-index={idx}
            >
              {scene.category && (
                <div className="attractions-center-tag">
                  <span
                    className="attractions-center-tag__dot"
                    style={{ backgroundColor: scene.accentColor || '#34D399' }}
                  />
                  <span className="attractions-center-tag__category">{scene.category}</span>
                  {scene.location && (
                    <>
                      <span className="attractions-center-tag__sep">·</span>
                      <span className="attractions-center-tag__loc">{scene.location}</span>
                    </>
                  )}
                </div>
              )}

              <h2 className="attractions-center-heading">{scene.title}</h2>

              {scene.subtitle && (
                <p className="attractions-center-subtitle">{scene.subtitle}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* 6. Bottom Bar: Progress Dots & Scroll Hint */}
      <footer className="attractions-bottom-bar">
        <div className="attractions-bottom-dots" role="tablist" aria-label="Attractions Progress">
          {scenes.map((scene, idx) => (
            <button
              key={`dot-${scene.id}`}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={`Go to ${scene.title}`}
              onClick={() => onSelectScene(idx)}
              className={`attraction-bottom-dot ${idx === activeIndex ? 'is-active' : ''}`}
            >
              <span className="attraction-bottom-dot__line" />
            </button>
          ))}
        </div>

        <div className="attractions-scroll-hint">
          <span className="attractions-scroll-hint__text">SCROLL TO EXPLORE</span>
          <span className="attractions-scroll-hint__arrow">↓</span>
        </div>
      </footer>
    </div>
  );
}
