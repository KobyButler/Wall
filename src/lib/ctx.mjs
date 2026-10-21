// Build-time context shared by layout, components and pages. Populated once
// by build.mjs before any page renders.

export const ctx = {
  site: null,
  services: [],
  projects: [],
  images: {},
  versions: {},
  base: '/',
  noindex: false,
  dev: false,
};

// Site-relative URL honoring basePath: url('about/') -> '/about/'
export const url = (path = '') => ctx.base + String(path).replace(/^\//, '');

// Absolute URL for canonical / Open Graph tags.
export const absUrl = (path = '') => ctx.site.url.replace(/\/$/, '') + url(path);

// Asset URL with a content hash for cache busting where one is known.
export const asset = (path) => url('assets/' + path) + (ctx.versions[path] ? `?v=${ctx.versions[path]}` : '');

export const telHref = (phone) => 'tel:+1' + String(phone).replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');

export const serviceBySlug = (slug) => ctx.services.find((s) => s.slug === slug);
