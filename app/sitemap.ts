import type { MetadataRoute } from 'next';
import { getAllShops } from '@/lib/api/shops';
import { getAllGirls } from '@/lib/api/girls';

const BASE = 'https://playmark0227-svg.github.io/nakashibetsu-deli-user-site';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [shops, girls] = await Promise.all([getAllShops(), getAllGirls()]);

  const now = new Date();

  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/girls/`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/shops/`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/ranking/`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/new/`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/search/`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE}/reviews/`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ];

  const shopPaths: MetadataRoute.Sitemap = shops.map((s) => ({
    url: `${BASE}/shops/${s.id}/`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  const girlPaths: MetadataRoute.Sitemap = girls.map((g) => ({
    url: `${BASE}/girls/${g.id}/`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [...staticPaths, ...shopPaths, ...girlPaths];
}
