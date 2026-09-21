/**
 * Central source of truth for SEO / structured-data facts.
 *
 * Every value here must be verifiable from the codebase (Footer.tsx, FAQ.tsx,
 * terms/page.tsx, crmStore.ts default settings, etc). Do NOT add a fact here
 * that isn't already established elsewhere in the app — this file is a single
 * place to keep those facts consistent across metadata, JSON-LD, and pages.
 */

export const SITE_URL = 'https://www.panjimhotelcasaparadiso.in';

export const BUSINESS = {
  name: 'Casa Paradiso',
  legalName: 'Casa Paradiso Hotel',
  tagline: 'Boutique Heritage Hotel in Panaji, Goa',
  description:
    "An intimate 18-room boutique hotel perched on Altinho hill in Panaji, Goa, steps from the Mandovi River, offshore casinos, and Fontainhas — Panaji's Latin Quarter.",
  telephone: '+91 98812 47847',
  telephoneDial: '+919881247847',
  email: 'Paradisepanjim@gmail.com',
  streetAddress: 'Ghanekar Building, Rua José Falcão, Altinho',
  addressLocality: 'Panaji',
  addressRegion: 'Goa',
  postalCode: '403001',
  addressCountry: 'IN',
  numberOfRooms: 18,
  checkInTime: '1:00 PM',
  checkOutTime: '11:00 AM',
  mapsUrl: 'https://maps.app.goo.gl/RNMMzQhL3Lrz7tkaA',
  mapsPlaceUrl:
    'https://www.google.com/maps/place/panjim+hotel+casa+enterprises/@15.4997708,73.8295675,17z/data=!3m1!4b1!4m6!3m5!1s0x3bbfc10d64d3e767:0x1375ffd0eeec9bf9!8m2!3d15.4997708!4d73.8295675',
  mapsCidUrl: 'https://maps.google.com/?cid=1402288079685655545',
  googleCid: '1402288079685655545',
  googlePlaceId: 'ChIJZ-fTZAzRvzsR-Zvs7tD_dRM',
  googleKnowledgeGraphId: 'kg:/g/11nw2gn81d',
  // Verified exact GPS coordinates matching the Google Business Profile
  geo: {
    latitude: 15.4997708,
    longitude: 73.8295675,
  },
} as const;

export const SOCIAL_PROFILES: string[] = [
  BUSINESS.mapsCidUrl,
  BUSINESS.mapsUrl,
  BUSINESS.mapsPlaceUrl,
];

export function absoluteUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${clean === '/' ? '' : clean}`;
}
