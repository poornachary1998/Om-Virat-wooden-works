import { getCategories } from '@/lib/strapi';

export default async function sitemap() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://omsrivirat-teakworks.netlify.app').replace(/\/$/, '');

  const staticUrls = [
    { url: base + '/', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: base + '/catalog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 }
  ];

  // One URL per category so Google can index and rank "main doors", "beds", etc.
  // separately, instead of only ever seeing one big catalog page.
  const categories = await getCategories();
  const categoryUrls = categories.map((cat) => ({
    url: base + '/catalog?category=' + cat.slug,
    lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7
  }));

  return [...staticUrls, ...categoryUrls];
}
