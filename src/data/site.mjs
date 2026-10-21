// ---------------------------------------------------------------------------
// Global business info. Everything the site says about the company lives here.
//
// Values marked PLACEHOLDER were not supplied by the client and must be
// replaced before launch. `npm run build` prints a warning for each one that
// is still present.
// ---------------------------------------------------------------------------

export default {
  name: 'Wall Concrete & Construction',
  legalName: 'Wall Concrete & Construction, LLC',
  shortName: 'Wall Concrete',
  tagline: 'Built solid. Built to last.',
  description:
    'Wall Concrete & Construction is a full-service concrete contractor based in Price, Utah — foundations, concrete walls, flatwork, commercial concrete, excavation and decorative concrete for builders, businesses and homeowners.',

  // Production URL, no trailing slash. Used for canonical links, sitemap and social cards.
  url: 'https://www.example.com', // PLACEHOLDER — the client's real domain
  // Set to '/sub-folder/' if the site is hosted somewhere other than the domain root.
  basePath: '/',

  phone: '(435) 613-9255',
  email: 'info@example.com', // PLACEHOLDER
  address: {
    street: '125 S 100 W',
    city: 'Price',
    region: 'UT',
    zip: '84501',
  },
  // Used for the map embed and the "Visit us" link. Usually the full street address.
  mapQuery: '125 S 100 W, Price, UT 84501',
  hours: [
    { days: 'Mon – Fri', time: '7:00 AM – 5:00 PM' }, // PLACEHOLDER
    { days: 'Saturday', time: 'By appointment' },
    { days: 'Sunday', time: 'Closed' },
  ],
  region: 'Utah',
  serviceAreaLabel: 'Utah & the Intermountain West',
  serviceAreas: [
    // PLACEHOLDER — confirm the counties/cities the client actually serves.
    'Carbon County',
    'Emery County',
    'Utah County',
    'Sanpete County',
    'Duchesne County',
    'Uintah County',
    'Grand County',
    'Wasatch County',
  ],
  license: 'Licensed & insured in the State of Utah', // PLACEHOLDER — add license # if desired

  social: {
    // Leave a value empty ('') to hide that icon.
    facebook: 'https://www.facebook.com/', // PLACEHOLDER
    instagram: 'https://www.instagram.com/', // PLACEHOLDER
    linkedin: 'https://www.linkedin.com/', // PLACEHOLDER
    youtube: '',
  },

  // Online bill-pay link (Western Paving style "Payments" nav item). Empty hides it.
  paymentsUrl: '',

  // Where form submissions are POSTed. Works with Formspree (https://formspree.io/f/xxxx),
  // Web3Forms, Basin, Getform, etc. Leave empty and forms show a "call or email us" notice.
  forms: {
    estimate: '', // PLACEHOLDER
    careers: '', // PLACEHOLDER
  },

  // Headline numbers. PLACEHOLDER — replace with the client's real figures.
  stats: [
    { value: 20, suffix: '+', label: 'Years of experience' },
    { value: 1500, suffix: '+', label: 'Projects completed' },
    { value: 45000, suffix: '+', label: 'Cubic yards placed' },
    { value: 100, suffix: '%', label: 'Licensed & insured' },
  ],

  // Hero slideshow on the home page. Each slide is a looping background video
  // (desktop + mobile versions) with a poster image shown while it loads.
  hero: {
    eyebrow: 'Concrete & Construction — Price, Utah',
    title: ['Built solid.', 'Built to last.'],
    text: 'From footings and foundation walls to driveways, retaining walls and commercial slabs, our crews deliver durable concrete work — on schedule and done right the first time.',
    slides: [
      { label: 'Flatwork & Slabs', video: 'hero-flatwork', href: 'services/flatwork/' },
      { label: 'Concrete Walls', video: 'hero-walls', href: 'services/concrete-walls/' },
      { label: 'Foundations', video: 'hero-foundations', href: 'services/foundations/' },
      { label: 'Excavation & Site Work', video: 'hero-sitework', href: 'services/excavation-site-work/' },
    ],
    // Seconds each slide stays on screen.
    interval: 7,
  },

  nav: [
    { label: 'Home', href: '' },
    { label: 'About', href: 'about/' },
    { label: 'Services', href: 'services/', mega: true },
    { label: 'Projects', href: 'projects/' },
    { label: 'Careers', href: 'careers/' },
    { label: 'Contact', href: 'contact/' },
  ],
};
