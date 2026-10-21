// Page shell: <head>, header, mobile menu, footer.
import { html, raw, cx } from './html.mjs';
import { icon, logoMark } from './icons.mjs';
import { ctx, url, absUrl, asset, telHref } from './ctx.mjs';
import { img, btn, socialLinks, addressLine, mapsHref, ctaBand } from './components.mjs';

const logo = (cls = '') => html`<a class="${cx('logo', cls)}" href="${url('')}" aria-label="${ctx.site.name} — home">
  ${logoMark()}
  <span class="logo__text"><span class="logo__name">Wall</span><span class="logo__sub">Concrete &amp; Construction</span></span>
</a>`;

const isCurrent = (page, href) => (href === '' ? page.path === '' : page.path.startsWith(href));

function topbar() {
  const { site } = ctx;
  return html`<div class="topbar">
    <div class="container topbar__inner">
      <ul class="topbar__info">
        <li><a href="${telHref(site.phone)}">${icon('phone', { size: 16 })}${site.phone}</a></li>
        <li><a href="mailto:${site.email}">${icon('mail', { size: 16 })}${site.email}</a></li>
        <li class="topbar__area">${icon('pin', { size: 16 })}Serving ${site.serviceAreaLabel}</li>
      </ul>
      <div class="topbar__links">
        <a href="${url('careers/')}">Join Our Team</a>
        ${site.paymentsUrl ? html`<a href="${site.paymentsUrl}" target="_blank" rel="noopener">Make a Payment</a>` : ''}
        ${socialLinks('social--sm')}
      </div>
    </div>
  </div>`;
}

function megaMenu() {
  return html`<div class="mega" id="mega-services">
    <div class="mega__inner">
      <ul class="mega__grid">${ctx.services.map((s) => html`<li><a class="mega__item" href="${url(`services/${s.slug}/`)}">
        <span class="mega__icon">${icon(s.icon, { size: 24 })}</span>
        <span><strong>${s.name}</strong><small>${s.short}</small></span>
      </a></li>`)}</ul>
      <a class="mega__feature" href="${url('contact/')}">
        ${img('power-screed', { sizes: '320px' })}
        <span class="mega__feature-body"><small>Free estimates</small><strong>Tell us about your project</strong><span class="link-arrow">Get started ${icon('arrowRight', { size: 18 })}</span></span>
      </a>
    </div>
  </div>`;
}

function header(page) {
  const { site } = ctx;
  return html`<div class="masthead" data-masthead>
    ${topbar()}
    <header class="site-header">
      <div class="container site-header__inner">
        ${logo()}
        <nav class="main-nav" aria-label="Main">
          <ul class="main-nav__list">${site.nav.map((item) => item.mega
            ? html`<li class="main-nav__item has-mega" data-mega>
                <a class="main-nav__link" href="${url(item.href)}"${raw(isCurrent(page, item.href) ? ' aria-current="page"' : '')}>${item.label}</a>
                <button type="button" class="mega-toggle" aria-expanded="false" aria-controls="mega-services" aria-label="Show ${item.label.toLowerCase()} menu">${icon('chevronDown', { size: 16 })}</button>
                ${megaMenu()}
              </li>`
            : html`<li class="main-nav__item"><a class="main-nav__link" href="${url(item.href)}"${raw(isCurrent(page, item.href) ? ' aria-current="page"' : '')}>${item.label}</a></li>`)}
          </ul>
        </nav>
        <div class="site-header__actions">
          <a class="header-phone" href="${telHref(site.phone)}"><span class="header-phone__icon">${icon('phone', { size: 18 })}</span><span><small>Call us</small>${site.phone}</span></a>
          ${btn('Get an Estimate', url('contact/'), { size: 'sm', iconName: 'arrowUpRight', cls: 'site-header__cta' })}
          <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="mobile-menu" data-menu-open>
            <span class="menu-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>
            <span class="sr-only">Open menu</span>
          </button>
        </div>
      </div>
    </header>
  </div>`;
}

function mobileMenu(page) {
  const { site, services } = ctx;
  return html`<dialog class="mobile-menu" id="mobile-menu" aria-label="Menu">
    <div class="mobile-menu__head">
      ${logo('logo--sm')}
      <button type="button" class="icon-btn mobile-menu__close" data-menu-close aria-label="Close menu">${icon('close')}</button>
    </div>
    <nav class="mobile-menu__nav" aria-label="Mobile">
      <ul>${site.nav.map((item, i) => item.mega
        ? html`<li style="--i:${i}"><details class="mobile-menu__group">
            <summary><span>${item.label}</span>${icon('chevronDown', { size: 22 })}</summary>
            <ul class="mobile-menu__sub">
              <li><a href="${url(item.href)}">All services</a></li>
              ${services.map((s) => html`<li><a href="${url(`services/${s.slug}/`)}">${s.name}</a></li>`)}
            </ul>
          </details></li>`
        : html`<li style="--i:${i}"><a href="${url(item.href)}"${raw(isCurrent(page, item.href) ? ' aria-current="page"' : '')}>${item.label}</a></li>`)}
      </ul>
    </nav>
    <div class="mobile-menu__foot">
      ${btn('Get a Free Estimate', url('contact/'), { cls: 'btn--block' })}
      <a class="mobile-menu__contact" href="${telHref(site.phone)}">${icon('phone', { size: 18 })}${site.phone}</a>
      <a class="mobile-menu__contact" href="mailto:${site.email}">${icon('mail', { size: 18 })}${site.email}</a>
      ${socialLinks()}
    </div>
  </dialog>`;
}

function footer(page) {
  const { site, services } = ctx;
  const year = new Date().getFullYear();
  return html`<footer class="site-footer">
    <div class="container footer__top">
      <div class="footer__brand">
        ${logo('logo--lg')}
        <p>${site.description}</p>
        ${socialLinks()}
      </div>
      <nav class="footer__col" aria-label="Services">
        <h2 class="footer__title">Services</h2>
        <ul>${services.map((s) => html`<li><a href="${url(`services/${s.slug}/`)}">${s.name}</a></li>`)}</ul>
      </nav>
      <nav class="footer__col" aria-label="Company">
        <h2 class="footer__title">Company</h2>
        <ul>
          <li><a href="${url('about/')}">About Us</a></li>
          <li><a href="${url('projects/')}">Projects</a></li>
          <li><a href="${url('careers/')}">Careers</a></li>
          <li><a href="${url('contact/')}">Contact</a></li>
          ${site.paymentsUrl ? html`<li><a href="${site.paymentsUrl}" target="_blank" rel="noopener">Make a Payment</a></li>` : ''}
          <li><a href="${url('privacy/')}">Privacy Policy</a></li>
        </ul>
      </nav>
      <div class="footer__col">
        <h2 class="footer__title">Get in Touch</h2>
        <ul class="footer__contact">
          <li>${icon('phone', { size: 18 })}<a href="${telHref(site.phone)}">${site.phone}</a></li>
          <li>${icon('mail', { size: 18 })}<a href="mailto:${site.email}">${site.email}</a></li>
          <li>${icon('pin', { size: 18 })}<a href="${mapsHref()}" target="_blank" rel="noopener">${addressLine()}</a></li>
          <li>${icon('clock', { size: 18 })}<span>${site.hours[0].days}: ${site.hours[0].time}</span></li>
        </ul>
        ${btn('Request an Estimate', url('contact/'), { variant: 'primary', size: 'sm' })}
      </div>
    </div>
    <div class="container footer__areas">
      <span class="footer__areas-label">Proudly serving</span>
      <ul>${site.serviceAreas.map((a) => html`<li>${a}</li>`)}</ul>
    </div>
    <div class="footer__wordmark" aria-hidden="true">Wall Concrete</div>
    <div class="container footer__bottom">
      <p>&copy; <span data-year>${year}</span> ${site.legalName}. All rights reserved.</p>
      <p>${site.license}</p>
      <button type="button" class="to-top" data-to-top aria-label="Back to top">${icon('arrowUp', { size: 18 })}</button>
    </div>
  </footer>`;
}

function mobileBar() {
  const { site } = ctx;
  return html`<div class="mobile-bar" data-mobile-bar>
    <a class="mobile-bar__btn" href="${telHref(site.phone)}">${icon('phone', { size: 18 })}Call Now</a>
    <a class="mobile-bar__btn mobile-bar__btn--accent" href="${url('contact/')}">${icon('clipboard', { size: 18 })}Free Estimate</a>
  </div>`;
}

function localBusinessJsonLd() {
  const { site, services } = ctx;
  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: site.legalName,
    url: absUrl(''),
    telephone: site.phone,
    email: site.email,
    image: absUrl('assets/img/og-image.jpg'),
    logo: absUrl('assets/img/logo.png'),
    description: site.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.zip,
      addressCountry: 'US',
    },
    areaServed: site.serviceAreas.map((name) => ({ '@type': 'AdministrativeArea', name })),
    sameAs: Object.values(site.social).filter(Boolean),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Concrete & construction services',
      itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: absUrl(`services/${s.slug}/`) } })),
    },
  };
}

function breadcrumbJsonLd(crumbs) {
  const all = [{ label: 'Home', path: '' }, ...crumbs];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: absUrl(c.path ?? '') })),
  };
}

const jsonLdTag = (data) => raw(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);

export function documentHtml(page) {
  const { site } = ctx;
  const title = page.title ? `${page.title} | ${site.name}` : `${site.name} | Concrete Contractor in ${site.address.city}, ${site.region}`;
  const description = page.description || site.description;
  const canonical = absUrl(page.path);
  const ogImage = absUrl('assets/img/og-image.jpg');
  const jsonLd = [...(page.path === '' ? [localBusinessJsonLd()] : []), ...(page.crumbs ? [breadcrumbJsonLd(page.crumbs)] : []), ...(page.jsonLd || [])];

  return `<!doctype html>
${html`<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
${page.noindex || ctx.noindex ? raw('<meta name="robots" content="noindex, nofollow">') : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0c0e10">
<link rel="icon" href="${url('favicon.svg')}" type="image/svg+xml">
<link rel="icon" href="${url('favicon-32.png')}" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${url('apple-touch-icon.png')}">
<link rel="manifest" href="${url('site.webmanifest')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap">
<link rel="stylesheet" href="${asset('css/main.css')}">
${page.head || ''}
<script>(function(d){d.classList.add('js');setTimeout(function(){if(!d.classList.contains('js-ready'))d.classList.remove('js')},3500)})(document.documentElement)</script>
<script type="module" src="${asset('js/main.js')}"></script>
${jsonLd.map(jsonLdTag)}
</head>
<body class="${cx('page', page.bodyClass)}">
<a class="skip-link" href="#main">Skip to main content</a>
${header(page)}
${mobileMenu(page)}
<main id="main">
${page.body}
${page.cta === false ? '' : ctaBand(page.cta || {})}
</main>
${footer(page)}
${mobileBar()}
${ctx.dev ? raw('<script>new EventSource("/__livereload").onmessage = () => location.reload();</script>') : ''}
</body>
</html>`}
`;
}
