export default function sitemap() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://omsri.example').replace(/\/$/, '');
  return [
    { url: base + '/', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: base + '/catalog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 }
  ];
}
