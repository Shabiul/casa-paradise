export interface AttractionImageConfig {
  src: string;
  alt?: string;
  x: number; // Offset X in px relative to stage center on standard 1440px desktop
  y: number; // Offset Y in px relative to stage center
  width: number; // Width in px
  height: number; // Height in px
  rotation?: number; // Subtle tilt angle in degrees
  zIndex?: number;
  objectPosition?: string;
}

export interface AttractionScene {
  id: string;
  title: string;
  shortTitle?: string;
  subtitle?: string;
  category?: string;
  location?: string;
  description: string;
  tag?: string;
  accentColor?: string;
  background?: string;
  images: [AttractionImageConfig, AttractionImageConfig, AttractionImageConfig];
}

// Backward compatibility alias
export type Attraction = AttractionScene;

export const ATTRACTIONS_DATA: AttractionScene[] = [
  {
    id: "mandovi-cruise-casinos",
    title: "Mandovi River & Casinos",
    shortTitle: "Mandovi River & Casinos",
    subtitle: "Scenic Sunset Catamarans & Luxury Offshore Gaming",
    category: "RIVERFRONT ADVENTURE",
    location: "5 Mins from Altinho",
    description: "Perched just below Casa Paradiso, the Mandovi riverfront offers iconic offshore casino ships like Deltin Royale & Big Daddy alongside tranquil sunset cruises.",
    tag: "SIGNATURE EXPERIENCE",
    accentColor: "#059669",
    background: "/WhatsApp Image 2026-08-11 at 6.56.50 PM (1).jpeg",
    images: [
      // Image 1: Upper-center / slightly left (landscape format above title)
      {
        src: "/WhatsApp Image 2026-08-11 at 6.56.49 PM.jpeg",
        alt: "Mandovi sunset catamaran cruise",
        x: -40,
        y: -210,
        width: 350,
        height: 220,
        rotation: 0,
        zIndex: 3,
        objectPosition: "center center",
      },
      // Image 2: Right-middle (larger than image 1, closer to right edge)
      {
        src: "/assets/goa-view.png",
        alt: "Mandovi riverfront panoramic view",
        x: 370,
        y: 30,
        width: 360,
        height: 360,
        rotation: 0,
        zIndex: 4,
        objectPosition: "center center",
      },
      // Image 3: Bottom-center (smaller, below title, slightly offset from center)
      {
        src: "/WhatsApp Image 2026-08-11 at 6.56.50 PM (1).jpeg",
        alt: "Goa river sunset glow",
        x: 10,
        y: 240,
        width: 230,
        height: 230,
        rotation: 0,
        zIndex: 2,
        objectPosition: "center center",
      },
    ],
  },
  {
    id: "fontainhas-latin-quarter",
    title: "Fontainhas Latin Quarter",
    shortTitle: "Fontainhas Latin Quarter",
    subtitle: "Vibrant Portuguese-Goan Heritage Enclave",
    category: "HISTORIC DISTRICT",
    location: "Panaji Cultural Heart",
    description: "Asia's only surviving Latin quarter. Stroll past pastel-painted colonial villas, charming art galleries, traditional bakeries, and historic cobblestone lanes.",
    tag: "UNESCO HERITAGE",
    accentColor: "#D97706",
    background: "/WhatsApp Image 2026-08-11 at 7.25.40 PM (1).jpeg",
    images: [
      // Image 1: Small, upper-left / upper-center
      {
        src: "/WhatsApp Image 2026-08-11 at 7.25.40 PM.jpeg",
        alt: "Vibrant pastel architecture in Fontainhas",
        x: -160,
        y: -220,
        width: 230,
        height: 180,
        rotation: -1.5,
        zIndex: 3,
        objectPosition: "center center",
      },
      // Image 2: Largest image, right-middle, dominant visual
      {
        src: "/WhatsApp Image 2026-08-11 at 7.25.40 PM (1).jpeg",
        alt: "Portuguese colonial heritage villa in Panaji",
        x: 310,
        y: -20,
        width: 420,
        height: 350,
        rotation: 0,
        zIndex: 4,
        objectPosition: "center center",
      },
      // Image 3: Lower-center, partially overlapping central visual field
      {
        src: "/assets/wa-photo-2.jpeg",
        alt: "Historic cobblestone lane in Fontainhas",
        x: -50,
        y: 210,
        width: 300,
        height: 210,
        rotation: 0,
        zIndex: 2,
        objectPosition: "center center",
      },
    ],
  },
  {
    id: "aguada-fort-lighthouse",
    title: "Fort Aguada & Lighthouse",
    shortTitle: "Fort Aguada & Lighthouse",
    subtitle: "17th Century Portuguese Coastal Bastion",
    category: "COASTAL FORTRESS",
    location: "Sinquerim Headland",
    description: "A monumental 17th-century fortress overlooking the vast Arabian Sea, featuring an iconic four-story historic lighthouse and dramatic coastal cliffs.",
    tag: "HISTORIC MONUMENT",
    accentColor: "#2563EB",
    background: "/WhatsApp Image 2026-08-11 at 6.56.52 PM (2).jpeg",
    images: [
      // Image 1: Upper-center
      {
        src: "/WhatsApp Image 2026-08-11 at 6.56.52 PM (2).jpeg",
        alt: "Fort Aguada coastal bastion and ocean cliffs",
        x: 40,
        y: -210,
        width: 300,
        height: 200,
        rotation: 0,
        zIndex: 3,
        objectPosition: "center center",
      },
      // Image 2: Large right-side composition
      {
        src: "/WhatsApp Image 2026-08-11 at 6.56.52 PM (1).jpeg",
        alt: "Historic 17th century lighthouse",
        x: 370,
        y: -10,
        width: 360,
        height: 360,
        rotation: 0,
        zIndex: 4,
        objectPosition: "center center",
      },
      // Image 3: Lower-left / lower-center
      {
        src: "/WhatsApp Image 2026-08-11 at 6.56.52 PM (3).jpeg",
        alt: "Arabian sea waves hitting ancient battlements",
        x: -170,
        y: 220,
        width: 280,
        height: 210,
        rotation: 0,
        zIndex: 2,
        objectPosition: "center center",
      },
    ],
  },
  {
    id: "miramar-beach-dona-paula",
    title: "Miramar & Dona Paula",
    shortTitle: "Miramar & Dona Paula",
    subtitle: "Golden Shorelines & Ocean Viewpoint",
    category: "COASTAL PROMENADE",
    location: "Panaji Coastline",
    description: "Where the Mandovi River meets the Arabian Sea. Enjoy breezy evening seaside walks, golden beach sunsets, and panoramic ocean vistas at Dona Paula viewpoint.",
    tag: "SUNSET VISTA",
    accentColor: "#059669",
    background: "/WhatsApp Image 2026-08-11 at 6.56.50 PM.jpeg",
    images: [
      // Image 1: Large vertical image on the left
      {
        src: "/WhatsApp Image 2026-08-11 at 6.56.50 PM.jpeg",
        alt: "Miramar beach palm coastline and ocean",
        x: -330,
        y: 30,
        width: 310,
        height: 430,
        rotation: 0,
        zIndex: 4,
        objectPosition: "center center",
      },
      // Image 2: Large horizontal image in upper-right
      {
        src: "/assets/pool.png",
        alt: "Coastal serene water views",
        x: 270,
        y: -180,
        width: 390,
        height: 260,
        rotation: 0,
        zIndex: 3,
        objectPosition: "center center",
      },
      // Image 3: Small image in lower-right
      {
        src: "/WhatsApp Image 2026-08-11 at 6.56.53 PM.jpeg",
        alt: "Dona Paula viewpoint sunset landscape",
        x: 320,
        y: 190,
        width: 210,
        height: 210,
        rotation: 1.5,
        zIndex: 2,
        objectPosition: "center center",
      },
    ],
  },
  {
    id: "panjim-baroque-church",
    title: "Panjim Baroque Church",
    shortTitle: "Panjim Baroque Church",
    subtitle: "Our Lady of the Immaculate Conception",
    category: "COLONIAL LANDMARK",
    location: "Church Square, Panaji",
    description: "Panaji's crowning architectural masterpiece, celebrated for its soaring white Baroque façade, zigzagging double staircases, and historic sanctuary bell.",
    tag: "ICONIC ARCHITECTURE",
    accentColor: "#7C3AED",
    background: "/WhatsApp Image 2026-08-11 at 6.56.52 PM.jpeg",
    images: [
      // Image 1: Upper-center (vertical)
      {
        src: "/WhatsApp Image 2026-08-11 at 6.56.52 PM.jpeg",
        alt: "Immaculate Conception Church baroque facade",
        x: 100,
        y: -220,
        width: 210,
        height: 280,
        rotation: 0,
        zIndex: 3,
        objectPosition: "center 30%",
      },
      // Image 2: Large right-side image (horizontal)
      {
        src: "/assets/exterior.png",
        alt: "Panaji Portuguese architecture and heritage grounds",
        x: 360,
        y: 10,
        width: 380,
        height: 290,
        rotation: 0,
        zIndex: 4,
        objectPosition: "center center",
      },
      // Image 3: Lower-left / lower-center (vertical)
      {
        src: "/assets/lobby.png",
        alt: "Colonial sanctuary interior ambiance",
        x: -130,
        y: 210,
        width: 260,
        height: 320,
        rotation: 0,
        zIndex: 2,
        objectPosition: "center center",
      },
    ],
  },
];
