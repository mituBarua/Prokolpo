import type { MetadataRoute } from 'next';
import { projects } from '@/lib/projects';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/portfolio`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    ...projects.map((p) => ({
      url: `${site.url}/projects/${p.id}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
      images: p.images.map((im) => `${site.url}${im.src}`),
    })),
  ];
}
