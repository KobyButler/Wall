// Inline SVG icons (24×24, stroke-based). Several are adapted from Tabler
// Icons (MIT). Usage: icon('phone') or icon('phone', { size: 18, cls: 'x' }).
import { raw } from './html.mjs';

const PATHS = {
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
  arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 5-5"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>',
  pause: '<rect x="6.5" y="5" width="3.6" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="13.9" y="5" width="3.6" height="14" rx="1" fill="currentColor" stroke="none"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  quote: '<path d="M10 6.5C6.8 7.6 4.8 10.2 4.8 13.8V18H10v-5.3H7.6c.1-2.2 1.2-3.7 3.2-4.6zM19.2 6.5c-3.2 1.1-5.2 3.7-5.2 7.3V18h5.2v-5.3h-2.4c.1-2.2 1.2-3.7 3.2-4.6z" fill="currentColor" stroke="none"/>',
  star: '<path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" fill="currentColor" stroke="none"/>',
  upload: '<path d="M12 15V4M7 9l5-5 5 5M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  // values / features
  shield: '<path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="M9 14.5 7.5 21l4.5-2.5 4.5 2.5-1.5-6.5"/>',
  scale: '<path d="M12 4v16M8 20h8M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/>',
  calendar: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M16 3v4M8 3v4M4 11h16M9 16l2 2 4-4"/>',
  hardhat: '<path d="M4.5 16a7.5 7.5 0 0 1 15 0"/><path d="M2.5 16h19v3h-19z"/><path d="M10 9V6.5h4V9"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
  truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  dollar: '<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6.5V8M12 16v1.5"/>',
  heart: '<path d="M12 20s-8-4.8-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.2 12 20 12 20z"/><path d="M7 12h2.5l1.2-2 2 4 1.3-2H17"/>',
  trending: '<path d="m3 17 6-6 4 4 8-8M15 7h6v6"/>',
  graduation: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6"/>',
  snowflake: '<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M9.5 4.5 12 6.5l2.5-2M9.5 19.5l2.5-2 2.5 2"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  home: '<path d="m3 11 9-7 9 7M5 9.5V20h14V9.5M10 20v-6h4v6"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  building: '<path d="M4 21V4h10v17M14 9h6v12M2 21h20M7.5 8h3M7.5 12h3M7.5 16h3M16.5 13h1M16.5 17h1"/>',
  landmark: '<path d="M3 21h18M5 21V10M19 21V10M9.5 21V10M14.5 21V10M2 10h20L12 3z"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l2 2M15 8l2 2"/>',
  // services
  foundation: '<path d="M3 20h18M5 20v-3.5h14V20M9.5 16.5V5h5v11.5"/>',
  wall: '<rect x="3" y="4.5" width="18" height="15" rx="1"/><path d="M3 9.5h18M3 14.5h18M9 4.5v5M15 4.5v5M6 9.5v5M12 9.5v5M18 9.5v5M9 14.5v5M15 14.5v5"/>',
  slab: '<path d="M7.5 4h9L21 20H3z"/><path d="M12 4v16M5.3 12h13.4"/>',
  excavator: '<rect x="2.5" y="16" width="11" height="4" rx="2"/><path d="M4 16v-4h3.2L8.5 9H11v7M11 11.5 15.5 5l4.5 4"/><path d="M20 9v3.8l-3.2 1.6"/>',
  pattern: '<path d="m12 3.5 3.5 3.5-3.5 3.5L8.5 7zM12 13.5l3.5 3.5-3.5 3.5L8.5 17zM7 8.5l3.5 3.5L7 15.5 3.5 12zM17 8.5l3.5 3.5-3.5 3.5-3.5-3.5z"/>',
  // social (filled)
  facebook: '<path d="M14 8.5V7c0-.8.5-1 1-1h2V2.5h-3c-2.9 0-4 1.8-4 4.4v1.6H7.5V12H10v9.5h4V12h2.7l.4-3.5z" fill="currentColor" stroke="none"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none"/>',
  linkedin: '<path d="M3.5 9h4v12h-4zM5.5 3a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2zM10 9h3.8v1.7c.6-1 1.9-2 3.9-2 3.3 0 4.3 2.1 4.3 5.2V21h-4v-6.2c0-1.5-.3-2.8-2-2.8s-2.1 1.3-2.1 2.8V21H10z" fill="currentColor" stroke="none"/>',
  youtube: '<path fill-rule="evenodd" d="M21.6 7.6a2.7 2.7 0 0 0-1.9-1.9C18 5.2 12 5.2 12 5.2s-6 0-7.7.5a2.7 2.7 0 0 0-1.9 1.9A28 28 0 0 0 2 12a28 28 0 0 0 .4 4.4 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.4zM10 15.2l5.2-3.2L10 8.8z" fill="currentColor" stroke="none"/>',
};

export function icon(name, { size = 24, cls = '' } = {}) {
  const body = PATHS[name];
  if (!body) throw new Error(`Unknown icon "${name}"`);
  return raw(
    `<svg class="icon${cls ? ' ' + cls : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`
  );
}

// Brand mark: a bold "W" set on a footing bar inside an accent block.
export const logoMark = (cls = 'logo__mark') =>
  raw(
    `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><rect width="48" height="48" rx="3" fill="var(--accent)"/><path d="M8.5 11.5 15.8 33 24 17.5 32.2 33l7.3-21.5" fill="none" stroke="var(--ink)" stroke-width="5.4" stroke-linejoin="miter" stroke-miterlimit="10"/><rect x="7" y="37" width="34" height="3.4" fill="var(--ink)"/></svg>`
  );
