// Build-time context shared by layout, components and pages. Populated once
// by build.mjs before any page renders.

export const ctx = {
  site: null,
  services: [],
  projects: [],
  experience: [],
  reviews: [],
  careers: { positions: [], benefits: [] },
  about: { storyLead: '', story: [], mission: '', team: [] },
  images: {},
  versions: {},
  base: '/',
  noindex: false,
  dev: false,
  warn: (msg) => console.warn(`  ⚠ ${msg}`),
};

// Site-relative URL honoring basePath: url('about/') -> '/about/'
export const url = (path = '') => ctx.base + String(path).replace(/^\//, '');

// Absolute URL for canonical / Open Graph tags.
export const absUrl = (path = '') => ctx.site.url.replace(/\/$/, '') + url(path);

// Asset URL with a content hash for cache busting where one is known.
export const asset = (path) => url('assets/' + path) + (ctx.versions[path] ? `?v=${ctx.versions[path]}` : '');

export const telHref = (phone) => 'tel:+1' + String(phone).replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');

export const serviceBySlug = (slug) => ctx.services.find((s) => s.slug === slug);

// Photo library key for an image value: '/media/Tank Pour.JPG' or 'tank-pour' -> 'tank-pour'.
// Must match slug() in scripts/optimize-images.py.
export const imageKey = (value) =>
  String(value || '')
    .split(/[\\/]/)
    .pop()
    .replace(/\.[a-z0-9]+$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// Manifest entry for an image value. Falls back to a known photo (with a build
// warning) so a deleted or misspelled photo never breaks the site.
const FALLBACK_IMAGE = 'walls-redrock';
const warned = new Set();
export function imageMeta(value) {
  const key = imageKey(value);
  if (ctx.images[key]) return { key, ...ctx.images[key] };
  if (!warned.has(key)) {
    warned.add(key);
    ctx.warn(`Photo "${value}" isn't in the photo library (content/media) — using a stand-in photo.`);
  }
  const fallback = ctx.images[FALLBACK_IMAGE] ? FALLBACK_IMAGE : Object.keys(ctx.images)[0];
  if (!fallback) throw new Error('The photo library is empty — add photos to content/media.');
  return { key: fallback, ...ctx.images[fallback] };
}
