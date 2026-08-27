import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { ATTRACTIONS_DATA } from '@/components/attractions/attractionData';
import { ROOMS_DATA } from '@/lib/roomsData';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/rooms`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/dining`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/rentals`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/experiences`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/location`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const roomRoutes: MetadataRoute.Sitemap = ROOMS_DATA.map((room) => ({
    url: `${SITE_URL}/rooms/${room.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  const experienceRoutes: MetadataRoute.Sitemap = ATTRACTIONS_DATA.map((a) => ({
    url: `${SITE_URL}/experiences/${a.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [...staticRoutes, ...roomRoutes, ...experienceRoutes];
}
