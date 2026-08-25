'use client';

import React, { forwardRef } from 'react';
import { AttractionScene } from './attractionData';

interface AttractionImageSlotProps {
  slotIndex: number; // 0, 1, or 2
  scenes: AttractionScene[];
  activeSceneIndex: number;
}

export const AttractionImageSlot = forwardRef<HTMLDivElement, AttractionImageSlotProps>(
  ({ slotIndex, scenes, activeSceneIndex }, ref) => {
    return (
      <div
        ref={ref}
        className={`attraction-floating-slot attraction-floating-slot--${slotIndex}`}
        aria-hidden="true"
      >
        <div className="attraction-floating-slot__inner">
          {scenes.map((scene, sceneIdx) => {
            const imgConfig = scene.images[slotIndex];
            if (!imgConfig) return null;

            return (
              <div
                key={`${scene.id}-slot-${slotIndex}`}
                className={`attraction-slot-photo attraction-slot-photo--scene-${sceneIdx} ${
                  sceneIdx === 0 ? 'is-initial-visible' : ''
                }`}
                data-scene={sceneIdx}
                data-slot={slotIndex}
              >
                <img
                  src={imgConfig.src}
                  alt={imgConfig.alt || `${scene.title} visual ${slotIndex + 1}`}
                  className="attraction-slot-photo__img"
                  style={{
                    objectPosition: imgConfig.objectPosition || 'center center',
                  }}
                  loading={sceneIdx <= 1 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                {/* Subtle subtle depth gradient edge */}
                <div className="attraction-slot-photo__overlay" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

AttractionImageSlot.displayName = 'AttractionImageSlot';

export default AttractionImageSlot;
