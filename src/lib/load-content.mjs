// Reads the CMS-editable content in /content and normalizes it for the build.
// Everything here is defensive: the files are edited by people through Pages
// CMS, so blank fields, missing lists or stray whitespace must never break the
// site — bad entries are skipped with a warning instead.
import fs from 'node:fs/promises';
import path from 'node:path';

const str = (v) => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v).trim());
const list = (v) => (Array.isArray(v) ? v : []);
const strings = (v) => list(v).map(str).filter(Boolean);
const slugify = (s) => str(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function readJson(dir, file) {
  try {
    return JSON.parse(await fs.readFile(path.join(dir, file), 'utf8'));
  } catch (err) {
    throw new Error(`Could not read content/${file}: ${err.message}`);
  }
}

export async function loadContent(root, defaults, warn) {
  const dir = path.join(root, 'content');
  const [settings, home, services, projects, reviews, careers, about] = await Promise.all(
    ['settings.json', 'home.json', 'services.json', 'projects.json', 'reviews.json', 'careers.json', 'about.json'].map((f) => readJson(dir, f))
  );

  // --- Company info + home page ---------------------------------------------
  const address = { ...defaults.address, ...(settings.address || {}) };
  const site = {
    ...defaults,
    ...Object.fromEntries(Object.entries(settings).filter(([, v]) => v !== '' && v != null)),
    address,
    mapQuery: [address.street, `${address.city}, ${address.region} ${address.zip}`].filter((s) => str(s)).join(', '),
    hours: list(settings.hours).filter((h) => str(h.days)),
    serviceAreas: strings(settings.serviceAreas),
    stats: list(settings.stats)
      .filter((s) => str(s.label) && s.value !== '' && !Number.isNaN(Number(s.value)))
      .map((s) => ({ value: Number(s.value), suffix: str(s.suffix), label: str(s.label) })),
    social: Object.fromEntries(['facebook', 'instagram', 'linkedin', 'youtube'].map((k) => [k, str(settings.social?.[k])])),
    forms: { estimate: str(settings.forms?.estimate), careers: str(settings.forms?.careers) },
    reviewsUrl: str(settings.reviewsUrl),
    paymentsUrl: str(settings.paymentsUrl),
    hero: {
      ...defaults.hero,
      eyebrow: str(home.hero?.eyebrow) || defaults.hero.eyebrow,
      title: strings(home.hero?.title).length ? strings(home.hero.title) : defaults.hero.title,
      text: str(home.hero?.text) || defaults.hero.text,
      slides: list(home.hero?.slides)
        .filter((s) => str(s.image) || str(s.video))
        .map((s) => ({ label: str(s.label), image: str(s.image) || undefined, video: str(s.video) || undefined })),
    },
  };
  if (!site.hours.length) site.hours = defaults.hours;
  if (!site.hero.slides.length) throw new Error('content/home.json: the home page slideshow needs at least one slide with a photo.');

  // --- Services ---------------------------------------------------------------
  const seenSlugs = new Set();
  const serviceList = list(services.services).flatMap((s, i) => {
    const slug = slugify(s.slug || s.name);
    if (!str(s.name) || !slug) return warn(`Service #${i + 1} has no name — skipped.`), [];
    if (seenSlugs.has(slug)) return warn(`Service "${s.name}" reuses the address "${slug}" — skipped.`), [];
    if (!str(s.image)) return warn(`Service "${s.name}" has no main photo — skipped.`), [];
    seenSlugs.add(slug);
    return [{
      slug,
      name: str(s.name),
      menuName: str(s.menuName) || str(s.name),
      icon: str(s.icon) || 'foundation',
      short: str(s.short),
      tagline: str(s.tagline),
      label: str(s.label),
      heading: str(s.heading) || str(s.name),
      intro: strings(s.intro),
      highlights: strings(s.highlights),
      image: str(s.image),
      detailImage: str(s.detailImage) || str(s.image),
      gallery: strings(s.gallery),
      capabilities: list(s.capabilities).filter((c) => str(c.title)).map((c) => ({ title: str(c.title), text: str(c.text) })),
      faqs: list(s.faqs).filter((f) => str(f.q) && str(f.a)).map((f) => ({ q: str(f.q), a: str(f.a) })),
      video: str(s.video) || undefined,
    }];
  });
  if (!serviceList.length) throw new Error('content/services.json: at least one service is required.');

  // --- Projects -----------------------------------------------------------------
  const projectSlugs = new Set();
  const projectList = list(projects.projects).flatMap((p, i) => {
    if (!str(p.title) || !str(p.image)) return warn(`Project #${i + 1} needs a title and a photo — skipped.`), [];
    const service = slugify(p.service);
    if (!seenSlugs.has(service)) return warn(`Project "${p.title}" uses an unknown service "${p.service}" — skipped.`), [];
    let slug = slugify(p.title);
    for (let n = 2; projectSlugs.has(slug); n++) slug = `${slugify(p.title)}-${n}`;
    projectSlugs.add(slug);
    return [{
      slug,
      title: str(p.title),
      service,
      image: str(p.image),
      text: str(p.text),
      location: str(p.location),
      sector: str(p.sector) || serviceList.find((s) => s.slug === service).menuName,
      scope: strings(p.scope),
      featured: p.featured === true || p.featured === 'true',
    }];
  });

  // Named jobs for the "Track Record" list (text only, no photos).
  const experienceList = list(projects.experience)
    .filter((e) => str(e.name))
    .map((e) => ({ name: str(e.name), detail: str(e.detail), category: str(e.category) || 'Other Projects', current: e.current === true || e.current === 'true' }));

  // --- Reviews ------------------------------------------------------------------
  const reviewList = list(reviews.reviews)
    .filter((r) => str(r.quote) && str(r.name))
    .map((r) => {
      const rating = Math.round(Number(r.rating));
      return { quote: str(r.quote), name: str(r.name), role: str(r.role), rating: rating >= 1 && rating <= 5 ? rating : undefined };
    });

  // --- Careers ------------------------------------------------------------------
  const careerData = {
    positions: list(careers.positions)
      .filter((p) => str(p.title) && !(p.closed === true || p.closed === 'true'))
      .map((p) => ({ title: str(p.title), type: str(p.type) || 'Full-time', text: str(p.text), duties: strings(p.duties), reqs: strings(p.reqs) })),
    benefits: list(careers.benefits).filter((b) => str(b.title)).map((b) => ({ icon: str(b.icon) || 'check', title: str(b.title), text: str(b.text) })),
  };

  // --- About --------------------------------------------------------------------
  const aboutData = {
    storyLead: str(about.storyLead),
    story: strings(about.story),
    mission: str(about.mission),
    team: list(about.team)
      .filter((m) => str(m.name))
      .map((m) => ({ name: str(m.name), title: str(m.title), phone: str(m.phone), photo: str(m.photo) })),
  };

  return { site, services: serviceList, projects: projectList, experience: experienceList, reviews: reviewList, careers: careerData, about: aboutData };
}
