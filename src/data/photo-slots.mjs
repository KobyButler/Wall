// ---------------------------------------------------------------------------
// Fixed photo spots ("Site Photos" in Pages CMS, saved in content/photos.json).
//
// Covers every photo that isn't part of a service, project, team member or the
// home slideshow — those have their own CMS sections. `photo` is the original
// photo, used whenever a spot is left blank. Spots with `alt` show meaningful
// photos and get a description field; the rest are background photos.
//
// Keep each `label` identical to the matching field label in .pages.yml: the
// photo-label mode on the live site shows these so the owner can find the field.
// ---------------------------------------------------------------------------

export const photoSlots = {
  home: {
    label: 'Home page',
    slots: {
      intro: { label: '“Who We Are” — large photo', photo: '/media/foundation-walls-redrock.jpg', alt: 'Finished cast-in-place foundation walls on a red-rock hillside' },
      introInset: { label: '“Who We Are” — small photo', photo: '/media/laser-screed-machine.jpg', alt: 'Laser screed leveling a fresh concrete slab' },
      why: { label: '“Why Wall Concrete” — photo', photo: '/media/walls-forms-crew.jpg' },
      safetyPanel: { label: 'Safety panel — background', photo: '/media/night-pour-steam.jpg' },
      careersPanel: { label: 'Careers panel — background', photo: '/media/crew-pour.jpg' },
    },
  },
  about: {
    label: 'About page',
    slots: {
      banner: { label: 'Top banner', photo: '/media/foundation-forms-redrock.jpg' },
      story: { label: '“Our Story” — large photo', photo: '/media/crew-pour.jpg', alt: 'Wall crew members placing concrete on a slab pour' },
      storyInset: { label: '“Our Story” — small photo', photo: '/media/walls-forms-crew.jpg', alt: 'Crew member working among cast-in-place walls and forms' },
      safety: { label: '“Committed to Safety” — large photo', photo: '/media/night-pour-rebar.jpg', alt: 'Night pour on a heavily reinforced slab under light towers' },
      safetyInset: { label: '“Committed to Safety” — small photo', photo: '/media/power-screed-worker.jpg', alt: 'Crew member in a hard hat leveling a slab with a power screed' },
    },
  },
  services: {
    label: 'Services page',
    slots: {
      banner: { label: 'Top banner', photo: '/media/foundation-mountains.jpg' },
    },
  },
  projects: {
    label: 'Projects page',
    slots: {
      banner: { label: 'Top banner', photo: '/media/tank-forms-pump.jpg' },
    },
  },
  careers: {
    label: 'Careers page',
    slots: {
      banner: { label: 'Top banner', photo: '/media/crew-wall-forms.jpg' },
      intro: { label: '“Life at Wall Concrete” — photo', photo: '/media/crew-pour.jpg', alt: 'Wall crew members in high-visibility vests placing concrete' },
      bottomBanner: { label: 'Bottom banner — background', photo: '/media/crew-pour-hose.jpg' },
    },
  },
  contact: {
    label: 'Contact page',
    slots: {
      banner: { label: 'Top banner', photo: '/media/wall-forms-mountains.jpg' },
    },
  },
  shared: {
    label: 'Used on several pages',
    slots: {
      statsBand: { label: 'Big numbers band — background (Home & About)', photo: '/media/night-pour-pumps.jpg' },
      bottomBanner: { label: '“Ready to break ground?” banner — background', photo: '/media/deck-rebar-walls.jpg' },
      servicesMenu: { label: 'Services drop-down menu — photo', photo: '/media/laser-screed-machine.jpg' },
      privacyBanner: { label: 'Privacy Policy — top banner', photo: '/media/foundation-walls-complete.jpg' },
      notFound: { label: '“Page not found” — background', photo: '/media/form-tower-rock.jpg' },
    },
  },
};
