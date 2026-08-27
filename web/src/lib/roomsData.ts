export interface RoomDetail {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  badge?: string;
  category: 'ac' | 'nonac';
  climateControl: string;
  bedType: string;
  bathroom: string;
  view: string;
  image: string;
  alt: string;
  description: string;
  longDescription: string;
  startingPrice: {
    single: number;
    double: number;
    triple: number;
  };
  amenities: string[];
  features: {
    title: string;
    description: string;
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
}

export const ROOMS_DATA: RoomDetail[] = [
  {
    id: 'paradise-ac-suite',
    name: 'Paradise AC Suite',
    shortName: 'AC Suite',
    tagline: 'Climate-Controlled Luxury Suite with Marble Bath & Workstation',
    badge: 'Air Conditioned',
    category: 'ac',
    climateControl: 'Individual High-Efficiency Air Conditioning',
    bedType: 'King-Size Premium Bed',
    bathroom: 'Private En-Suite Marble Bath with Hot/Cold Shower & Toiletries',
    view: 'Tranquil Altinho Hill & Panaji Cityscape Views',
    image: '/assets/wa-photo-8.jpeg',
    alt: 'Paradise AC Suite at Casa Paradiso Panaji Goa',
    description:
      'Spacious climate-controlled suite with king-size bed, dedicated workstation, smart TV, and private marble bath on Altinho hill.',
    longDescription:
      'The Paradise AC Suite at Casa Paradiso is designed for travelers seeking contemporary comfort in the heart of historic Panaji. Perched on Altinho hill, each AC Suite features high-efficiency air conditioning, a plush king-size bed, high-speed fiber Wi-Fi, a dedicated ergonomic workstation for workcations, a smart LED TV, and an en-suite private marble bathroom with 24/7 hot and cold water. Guests enjoy daily housekeeping, complimentary morning tea/coffee facilities, and access to all hotel amenities including in-room dining and on-site scooter/car rentals.',
    startingPrice: {
      single: 1200,
      double: 1800,
      triple: 2000,
    },
    amenities: [
      'High-Efficiency Air Conditioning',
      'King-Size Plush Bedding',
      'Dedicated Workstation & Desk',
      'Smart LED TV',
      'Private Marble Bathroom',
      'Complimentary High-Speed Wi-Fi',
      'Daily Housekeeping',
      'In-Room Dining Service (7 AM - 11 PM)',
      'Electric Kettle & Tea Setup',
      '24/7 Front Desk Assistance',
    ],
    features: [
      {
        title: 'Climate-Controlled Comfort',
        description: 'Stay refreshed with powerful, whisper-quiet air conditioning tailored for Goa’s tropical climate.',
      },
      {
        title: 'Workstation for Workcations',
        description: 'Equipped with a sturdy writing desk, ergonomic chair, ample power sockets, and fast optical fiber Wi-Fi.',
      },
      {
        title: 'Private Marble En-Suite Bath',
        description: 'Contemporary marble bathroom fitted with modern fixtures, hot/cold shower, and daily fresh towels.',
      },
    ],
    faqs: [
      {
        q: 'Does the Paradise AC Suite have air conditioning and hot water?',
        a: 'Yes. Every Paradise AC Suite is equipped with individual air conditioning and 24/7 hot/cold running water in the private en-suite bathroom.',
      },
      {
        q: 'What is the bed configuration in the AC Suite?',
        a: 'The suite features a comfortable king-size bed, suitable for single, double, or triple occupancy.',
      },
      {
        q: 'What are the check-in and check-out times for the AC Suite?',
        a: 'Standard check-in is at 1:00 PM and check-out is at 11:00 AM. Early check-in or late check-out is subject to availability.',
      },
    ],
  },
  {
    id: 'heritage-non-ac-room',
    name: 'Heritage Non-AC Room',
    shortName: 'Heritage Room',
    tagline: 'Authentic Portuguese-Goan Architectural Stay with High Ceilings',
    badge: 'Heritage Non-AC',
    category: 'nonac',
    climateControl: 'High Ceilings, Ceiling Fans & Natural Cross-Ventilation',
    bedType: 'Queen/King Heritage Bed',
    bathroom: 'Private En-Suite Bathroom with Hot/Cold Water',
    view: 'Historic Altinho Hill Street & Garden Views',
    image: '/assets/ChatGPT Image Aug 7, 2026, 06_03_51 PM.png',
    alt: 'Heritage Non-AC Room at Casa Paradiso Panaji Goa',
    description:
      'Classic Goan architecture with lofty high ceilings, large breezy windows, ceiling fans, and vintage colonial aesthetic.',
    longDescription:
      'The Heritage Non-AC Room preserves the timeless charm of Portuguese-Goan residential architecture. Featuring lofty ceilings, expansive heritage windows that catch the natural hilltop breezes of Altinho, quiet ceiling fans, and vintage aesthetic touches, this room is ideal for travelers who appreciate authentic heritage character and eco-conscious natural ventilation. Includes a private en-suite bathroom, high-speed fiber Wi-Fi, daily housekeeping, and full access to Casa Paradiso’s dining and rental services.',
    startingPrice: {
      single: 1200,
      double: 1500,
      triple: 800,
    },
    amenities: [
      'Authentic High Ceilings',
      'Quiet Multi-Speed Ceiling Fans',
      'Large Breezy Heritage Windows',
      'Queen/King Heritage Bed',
      'Private En-Suite Bathroom',
      'Complimentary High-Speed Wi-Fi',
      'Daily Housekeeping',
      'In-Room Dining Service (7 AM - 11 PM)',
      '24/7 Front Desk Assistance',
    ],
    features: [
      {
        title: 'Colonial Goan Character',
        description: 'High ceilings and vintage architectural detailing providing a spacious, airy, and nostalgic ambience.',
      },
      {
        title: 'Natural Cross-Ventilation',
        description: 'Large hilltop windows and ceiling fans provide pleasant, natural airflow throughout the day and evening.',
      },
      {
        title: 'Authentic Heritage Stay',
        description: 'An affordable, culturally rich accommodation option right in central Panaji on historic Altinho hill.',
      },
    ],
    faqs: [
      {
        q: 'Does the Heritage Non-AC Room have a private bathroom?',
        a: 'Yes. Each Heritage Non-AC Room includes its own private en-suite bathroom with hot and cold running water.',
      },
      {
        q: 'Is Wi-Fi available in the Heritage Non-AC Room?',
        a: 'Yes. Complimentary high-speed fiber Wi-Fi is available across all rooms and common areas.',
      },
      {
        q: 'What is the difference between the AC Suite and Heritage Room?',
        a: 'The Paradise AC Suite features modern air conditioning, a smart TV, and a workstation, while the Heritage Non-AC Room emphasizes classic Portuguese-Goan high ceilings, natural ventilation, and vintage charm.',
      },
    ],
  },
];
