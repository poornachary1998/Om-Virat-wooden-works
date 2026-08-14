const BASE = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const TOKEN = process.env.STRAPI_API_TOKEN;

/** Turn a Strapi media object into a full URL. */
export function mediaUrl(media) {
  const url = media?.url || media?.data?.attributes?.url;
  if (!url) return null;
  return url.startsWith('http') ? url : BASE + url;
}

async function get(path) {
  const headers = TOKEN ? { Authorization: 'Bearer ' + TOKEN } : {};
  try {
    const res = await fetch(BASE + '/api' + path, {
      headers,
      // ISR: pages rebuild at most once a minute after a CMS change.
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error('Strapi ' + res.status + ' on ' + path);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('[strapi] ' + err.message + ' — rendering with empty data.');
    return [];
  }
}

/** Flatten Strapi v4/v5 shapes into plain objects. */
function flatten(entry) {
  const a = entry.attributes || entry;
  return { id: entry.id, ...a };
}

export async function getCategories() {
  const data = await get('/categories?populate=cover&sort=order:asc&pagination[pageSize]=100');
  return data.map(flatten);
}

export async function getProducts() {
  const data = await get('/products?populate[image]=true&populate[category]=true&sort=order:asc&pagination[pageSize]=200');
  return data.map(flatten);
}

export async function getSiteSettings() {
  const data = await get('/site-setting?populate[heroImages]=true');
  return data && !Array.isArray(data) ? flatten(data) : null;
}
