'use client';

import {
  CircularGallery,
  type GalleryItem,
} from "@/components/ui/circular-gallery-2";

// Define the items to be passed as props
const galleryItems: GalleryItem[] = [
  {
    image: "/assets/wa-photo-10.jpeg",
    text: "Heritage Villa",
  },
  {
    image: "/assets/WhatsApp Image 2026-08-07 at 4.34.56 PM.jpeg",
    text: "Classic Suite",
  },
  {
    image: "/WhatsApp Image 2026-08-11 at 7.25.40 PM (1).jpeg",
    text: "Fontainhas Heritage",
  },
  {
    image: "/assets/ChatGPT Image Aug 7, 2026, 06_03_51 PM.png",
    text: "Heritage Room",
  },
  {
    image: "/WhatsApp Image 2026-08-11 at 6.56.52 PM.jpeg",
    text: "Panjim Church",
  },
];

/**
 * Default demo for the CircularGallery.
 * It automatically adapts to light/dark mode text colors.
 */
export default function CircularGalleryDemo() {
  return (
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden">
      <CircularGallery
        items={galleryItems}
        bend={3}
        borderRadius={0.05}
        scrollEase={0.02}
      />
    </div>
  );
}
