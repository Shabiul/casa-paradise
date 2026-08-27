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
  mapsUrl: 'https://maps.app.goo.gl/iKyFhnt8Q5JwUMD46',
  // TODO(manual verification): confirm exact GPS coordinates against the Google
  // Business Profile before publishing GeoCoordinates in schema. The values
  // below are approximate, taken from the existing Google Maps embed in
  // Footer.tsx, and are NOT yet confirmed accurate to the property entrance.
  geo: {
    latitude: 15.497,
    longitude: 73.83,
  },
} as const;

export const SOCIAL_PROFILES: string[] = [
  // TODO(manual verification): add verified official social profile URLs
  // (Instagram/Facebook/etc.) here once confirmed by the hotel owner, then
  // reference SOCIAL_PROFILES in the Organization schema's `sameAs`. Left
  // empty deliberately — no profiles were found in the codebase, and
  // inventing them would violate the "no fabricated schema" rule.
];

export function absoluteUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${clean === '/' ? '' : clean}`;
}
