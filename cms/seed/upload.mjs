/**
 * One-shot seed: uploads every image to Strapi's Media Library and creates
 * the Category + Product entries that reference them.
 *
 *   cp .env.example .env   (then paste your token)
 *   npm run seed
 *
 * Safe to re-run: it skips anything already there, matched by slug.
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

async function api(pathname, options = {}) {
  const res = await fetch(URL_BASE + pathname, {
    ...options,
    headers: { ...auth, ...(options.headers || {}) }
  });
  if (!res.ok) {
    throw new Error(res.status + ' ' + res.statusText + ' on ' + pathname + ' — ' + (await res.text()).slice(0, 300));
  }
  return res.json();
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

async function create(collection, data) {
  return api('/api/' + collection, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data })
  });
}

const seed = JSON.parse(fs.readFileSync(path.join(here, 'data.json'), 'utf8'));

console.log('Seeding ' + seed.categories.length + ' categories and ' + seed.products.length + ' products into ' + URL_BASE);

const categoryIds = {};
for (const cat of seed.categories) {
  const found = await findBySlug('categories', cat.slug);
  if (found) {
    categoryIds[cat.slug] = found.id;
    console.log('= category exists: ' + cat.name_en);
    continue;
  }
  const made = await create('categories', cat);
  categoryIds[cat.slug] = made.data.id;
  console.log('+ category: ' + cat.name_en);
}

let added = 0;
for (const p of seed.products) {
  if (await findBySlug('products', p.slug)) {
    console.log('= product exists: ' + p.name_en);
    continue;
  }
  const imageId = await uploadImage(p.image);
  if (!imageId) continue;
  await create('products', {
    slug: p.slug,
    name_en: p.name_en, name_te: p.name_te,
    description_en: p.description_en, description_te: p.description_te,
    order: p.order,
    image: imageId,
    category: categoryIds[p.category]
  });
  added++;
  console.log('+ product: ' + p.name_en);
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

console.log('\nDone. ' + added + ' new products. Open ' + URL_BASE + '/admin to see them.');
