/**
 * One-shot seed: uploads every image to Strapi's Media Library and syncs
 * the Category + Product entries in Strapi to match cms/seed/data.json.
 *
 *   cp .env.example .env   (then paste your token)
 *   npm run seed
 *
 * Safe to re-run: entries are matched by slug. Missing ones are created,
 * existing ones are updated in place, and any Category or Product that is
 * in Strapi but no longer in data.json is deleted — so removing an entry
 * from data.json and re-running the seed removes it from Strapi too.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

// --- tiny .env reader so there are no dependencies to install -------------
for (const line of fs.existsSync(path.join(here, '.env'))
  ? fs.readFileSync(path.join(here, '.env'), 'utf8').split('\n')
  : []) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] ??= m[2];
}

const URL_BASE = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const TOKEN = process.env.STRAPI_TOKEN;
const IMAGE_DIR = path.resolve(here, process.env.IMAGE_DIR || '../../images');

if (!TOKEN) {
  console.error('Missing STRAPI_TOKEN. Copy .env.example to .env and paste a full-access API token.');
  process.exit(1);
}

const auth = { Authorization: 'Bearer ' + TOKEN };

/** The free Render tier occasionally cuts a response short under load; retry transient failures. */
async function api(pathname, options = {}, attempt = 1) {
  try {
    const res = await fetch(URL_BASE + pathname, {
      ...options,
      // Force a fresh connection: after ~100+ requests on one keep-alive
      // socket the free Render tier starts returning truncated bodies.
      headers: { ...auth, Connection: 'close', ...(options.headers || {}) }
    });
    if (!res.ok) {
      throw new Error(res.status + ' ' + res.statusText + ' on ' + pathname + ' — ' + (await res.text()).slice(0, 300));
    }
    return await res.json();
  } catch (err) {
    if (attempt >= 3) throw err;
    console.warn('  ! ' + err.message + ' — retrying (' + attempt + '/2)');
    await new Promise((r) => setTimeout(r, 1500 * attempt));
    return api(pathname, options, attempt + 1);
  }
}

/** Upload one file to the Media Library, return its id. Reuses an existing upload of the same name. */
const uploadCache = new Map();
async function uploadImage(filename) {
  if (uploadCache.has(filename)) return uploadCache.get(filename);

  const existing = await api('/api/upload/files?filters[name][$eq]=' + encodeURIComponent(filename));
  if (Array.isArray(existing) && existing.length) {
    uploadCache.set(filename, existing[0].id);
    return existing[0].id;
  }

  const filepath = path.join(IMAGE_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.warn('  ! missing file, skipping: ' + filename);
    return null;
  }

  const form = new FormData();
  const buf = fs.readFileSync(filepath);
  form.append('files', new Blob([buf], { type: 'image/jpeg' }), filename);

  const res = await fetch(URL_BASE + '/api/upload', { method: 'POST', headers: auth, body: form });
  if (!res.ok) throw new Error('upload failed for ' + filename + ': ' + (await res.text()).slice(0, 200));
  const [file] = await res.json();
  uploadCache.set(filename, file.id);
  return file.id;
}

async function findBySlug(collection, slug) {
  const json = await api('/api/' + collection + '?filters[slug][$eq]=' + encodeURIComponent(slug));
  return json.data?.[0] || null;
}

/** Page through a collection instead of asking for it all in one response — the
 *  free Render tier occasionally truncates large single-page responses. */
async function listAll(collection) {
  const all = [];
  let page = 1;
  for (;;) {
    const json = await api(
      '/api/' + collection + '?pagination[page]=' + page + '&pagination[pageSize]=25&fields[0]=slug'
    );
    all.push(...(json.data || []));
    const { page: p, pageCount } = json.meta.pagination;
    if (p >= pageCount) break;
    page++;
  }
  return all;
}

async function create(collection, data) {
  return api('/api/' + collection, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data })
  });
}

async function update(collection, id, data) {
  return api('/api/' + collection + '/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data })
  });
}

async function remove(collection, id) {
  return api('/api/' + collection + '/' + id, { method: 'DELETE' });
}

const seed = JSON.parse(fs.readFileSync(path.join(here, 'data.json'), 'utf8'));

console.log('Seeding ' + seed.categories.length + ' categories and ' + seed.products.length + ' products into ' + URL_BASE);

const categoryIds = {};
for (const cat of seed.categories) {
  const found = await findBySlug('categories', cat.slug);
  if (found) {
    categoryIds[cat.slug] = found.documentId;
    await update('categories', found.documentId, { name_en: cat.name_en, name_te: cat.name_te, order: cat.order });
    console.log('= category updated: ' + cat.name_en);
    continue;
  }
  const made = await create('categories', cat);
  categoryIds[cat.slug] = made.data.documentId;
  console.log('+ category: ' + cat.name_en);
}

let added = 0;
for (const p of seed.products) {
  const imageId = await uploadImage(p.image);
  if (!imageId) continue;
  const fields = {
    name_en: p.name_en, name_te: p.name_te,
    description_en: p.description_en, description_te: p.description_te,
    order: p.order,
    image: imageId,
    category: categoryIds[p.category]
  };
  const found = await findBySlug('products', p.slug);
  if (found) {
    await update('products', found.documentId, fields);
    console.log('= product updated: ' + p.name_en);
    continue;
  }
  await create('products', { slug: p.slug, ...fields });
  added++;
  console.log('+ product: ' + p.name_en);
}

// Remove anything left in Strapi that is no longer in data.json.
const seedProductSlugs = new Set(seed.products.map((p) => p.slug));
let removedProducts = 0;
for (const entry of await listAll('products')) {
  const slug = entry.slug ?? entry.attributes?.slug;
  if (seedProductSlugs.has(slug)) continue;
  await remove('products', entry.documentId);
  removedProducts++;
  console.log('- product removed: ' + slug);
}

const seedCategorySlugs = new Set(seed.categories.map((c) => c.slug));
let removedCategories = 0;
for (const entry of await listAll('categories')) {
  const slug = entry.slug ?? entry.attributes?.slug;
  if (seedCategorySlugs.has(slug)) continue;
  await remove('categories', entry.documentId);
  removedCategories++;
  console.log('- category removed: ' + slug);
}

// Hero slideshow images on the Site Settings single type.
const heroFiles = [
  'IMG_20240423_104714.jpg', 'IMG_20240502_114219.jpg', 'IMG_20240507_110457.jpg',
  'IMG_20251018_172220.jpg', 'IMG_20240423_104802.jpg', 'IMG_20260315_112718.jpg',
  'IMG_20240423_125855.jpg'
];
const heroIds = [];
for (const f of heroFiles) {
  const id = await uploadImage(f);
  if (id) heroIds.push(id);
}
await api('/api/site-setting', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data: { heroImages: heroIds } })
});
console.log('+ hero slideshow: ' + heroIds.length + ' images');

console.log(
  '\nDone. ' + added + ' new products, ' + removedProducts + ' products removed, ' +
  removedCategories + ' categories removed. Open ' + URL_BASE + '/admin to see them.'
);
