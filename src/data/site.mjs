// ---------------------------------------------------------------------------
// Developer-level site settings.
//
// Business details (phone, email, address, hours, stats, jobs,
// projects, services…) live in /content/*.json so the client can edit them
// in Pages CMS — see README "Editing content". Values here are fallbacks used
// only when a content field is left blank.
// ---------------------------------------------------------------------------

export default {
  name: 'Wall Concrete & Construction',
  legalName: 'Wall Concrete & Construction, LLC',
  shortName: 'Wall Concrete',
  description: 'Concrete specialists based in Price, Utah.',

  // Production URL, no trailing slash. Used for canonical links, sitemap and social cards.
  url: 'https://www.example.com', // PLACEHOLDER — the client's real domain
  // Set to '/sub-folder/' if the site is hosted somewhere other than the domain root.
  basePath: '/',

  region: 'Utah',
  address: { street: '', city: 'Price', region: 'UT', zip: '' },
  hours: [{ days: 'Mon – Fri', time: '7:00 AM – 5:00 PM' }],

  hero: {
    eyebrow: 'Concrete Specialists — Price, Utah',
    title: ['Built solid.', 'Built to last.'],
    text: '',
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
