// Reusable page sections and UI pieces.
import { html, raw, esc, cx } from './html.mjs';
import { icon } from './icons.mjs';
import { ctx, url, asset, telHref, serviceBySlug } from './ctx.mjs';
import { testimonials, process, why } from '../data/content.mjs';

// Marks *words* for accent highlighting: fmt('Built *to last*')
export const fmt = (text) => raw(esc(text).replace(/\*(.+?)\*/g, '<span class="hl">$1</span>'));

const pad = (n) => String(n).padStart(2, '0');

// Responsive <img> from the optimized photo manifest.
export function img(name, { alt = '', sizes = '100vw', cls = '', eager = false, priority = false } = {}) {
  const meta = ctx.images[name];
  if (!meta) throw new Error(`Image "${name}" is missing from src/data/images.json`);
  const src = (w) => url(`assets/img/photos/${name}-${w}.webp`);
  const fallback = meta.widths.find((w) => w >= 1024) ?? meta.widths.at(-1);
  return html`<img${raw(cls ? ` class="${esc(cls)}"` : '')} src="${src(fallback)}" srcset="${meta.widths.map((w) => `${src(w)} ${w}w`).join(', ')}" sizes="${sizes}" width="${meta.w}" height="${meta.h}" alt="${alt}"${raw(eager ? '' : ' loading="lazy"')} decoding="async"${raw(priority ? ' fetchpriority="high"' : '')} style="background-color:${meta.color}">`;
}

export function btn(label, href, { variant = 'primary', size = '', iconName = 'arrowRight', cls = '', attrs = '' } = {}) {
  return html`<a class="${cx('btn', `btn--${variant}`, size && `btn--${size}`, cls)}" href="${href}"${raw(attrs ? ' ' + attrs : '')}><span>${label}</span>${iconName ? icon(iconName, { size: 18 }) : ''}</a>`;
}

export const eyebrow = (text, light = false) => html`<p class="${cx('eyebrow', light && 'eyebrow--light')}">${text}</p>`;

export function sectionHead({ eyebrow: eb, title, text, align = 'split', light = false, actions = '' }) {
  return html`<div class="${cx('section-head', `section-head--${align}`)}" data-reveal>
    <div class="section-head__main">${eb ? eyebrow(eb, light) : ''}<h2 class="h2">${fmt(title)}</h2></div>
    ${text || actions ? html`<div class="section-head__aside">${text ? html`<p>${text}</p>` : ''}${actions}</div>` : ''}
  </div>`;
}

export function breadcrumbs(crumbs = []) {
  // crumbs: [{ label, path }] — the same shape the page passes for JSON-LD
  const all = [{ label: 'Home', path: '' }, ...crumbs];
  return html`<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${all.map((c, i) =>
    i === all.length - 1 ? html`<li><span aria-current="page">${c.label}</span></li>` : html`<li><a href="${url(c.path)}">${c.label}</a></li>`
  )}</ol></nav>`;
}

export function pageHero({ image, eyebrow: eb, title, text, crumbs = [], actions = '' }) {
  return html`<section class="page-hero">
    <div class="page-hero__media">${img(image, { eager: true, priority: true })}</div>
    <div class="page-hero__shade"></div>
    <div class="container page-hero__content">
      ${breadcrumbs(crumbs)}
      ${eb ? eyebrow(eb, true) : ''}
      <h1 class="page-hero__title">${fmt(title)}</h1>
      ${text ? html`<p class="page-hero__text">${text}</p>` : ''}
      ${actions ? html`<div class="actions">${actions}</div>` : ''}
    </div>
  </section>`;
}

export function checklist(items, cls = '') {
  return html`<ul class="${cx('checklist', cls)}">${items.map((t) => html`<li>${icon('check', { size: 18 })}<span>${t}</span></li>`)}</ul>`;
}

export function serviceCard(s, i) {
  return html`<a class="service-card" href="${url(`services/${s.slug}/`)}" data-reveal style="--d:${i % 3}">
    <span class="service-card__media">${img(s.image, { sizes: '(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw' })}<span class="service-card__icon">${icon(s.icon, { size: 26 })}</span></span>
    <span class="service-card__body">
      <span class="service-card__num">${pad(i + 1)}</span>
      <span class="service-card__title">${s.name}</span>
      <span class="service-card__text">${s.short}</span>
      <span class="link-arrow">Learn more ${icon('arrowRight', { size: 18 })}</span>
    </span>
  </a>`;
}

export function projectCard(p, { sizes = '(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw', reveal = true } = {}) {
  const s = serviceBySlug(p.service);
  return html`<article class="project-card" data-cat="${p.service}"${raw(reveal ? ' data-reveal' : '')}>
    <button type="button" class="project-card__btn" data-project="${p.slug}" aria-haspopup="dialog">
      <span class="project-card__media">${img(p.image, { sizes })}</span>
      <span class="project-card__body">
        <span class="tag">${s?.menuName}</span>
        <span class="project-card__title">${p.title}</span>
        <span class="project-card__loc">${icon('pin', { size: 16 })}${p.location}</span>
      </span>
      <span class="project-card__plus">${icon('plus', { size: 22 })}</span>
    </button>
  </article>`;
}

// Project details for the lightbox, embedded as JSON (escaped for <script>).
export function projectData(projects) {
  const data = projects.map((p) => {
    const m = ctx.images[p.image];
    return {
      slug: p.slug,
      title: p.title,
      location: p.location,
      sector: p.sector,
      service: serviceBySlug(p.service)?.name,
      serviceUrl: url(`services/${p.service}/`),
      scope: p.scope,
      text: p.text,
      src: url(`assets/img/photos/${p.image}-${m.widths.at(-1) >= 1600 ? 1600 : m.widths.at(-1)}.webp`),
      srcset: m.widths.map((w) => `${url(`assets/img/photos/${p.image}-${w}.webp`)} ${w}w`).join(', '),
      w: m.w,
      h: m.h,
    };
  });
  return raw(`<script type="application/json" id="project-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
}

export function lightbox() {
  return html`<dialog class="lightbox" id="lightbox" aria-labelledby="lightbox-title">
    <div class="lightbox__inner">
      <figure class="lightbox__figure"><img class="lightbox__img" alt="" sizes="(min-width: 1024px) 66vw, 100vw"></figure>
      <div class="lightbox__info">
        <a class="tag tag--link" data-lb="service" href="#"></a>
        <h2 class="lightbox__title" id="lightbox-title" data-lb="title"></h2>
        <p class="lightbox__meta">${icon('pin', { size: 16 })}<span data-lb="location"></span><span class="dot" aria-hidden="true"></span><span data-lb="sector"></span></p>
        <p class="lightbox__text" data-lb="text"></p>
        <ul class="lightbox__scope" data-lb="scope"></ul>
        ${btn('Start a Similar Project', url('contact/'))}
        <div class="lightbox__nav">
          <button type="button" class="icon-btn" data-lb-prev aria-label="Previous project">${icon('chevronLeft')}</button>
          <span class="lightbox__count" data-lb="count"></span>
          <button type="button" class="icon-btn" data-lb-next aria-label="Next project">${icon('chevronRight')}</button>
        </div>
      </div>
      <button type="button" class="lightbox__close icon-btn" data-lb-close aria-label="Close project details">${icon('close')}</button>
    </div>
  </dialog>`;
}

export function statsBand() {
  return html`<section class="stats-band" aria-label="Company highlights">
    <div class="stats-band__media" aria-hidden="true">
      <img src="${url('assets/img/posters/band-crew.webp')}" alt="" loading="lazy" decoding="async" width="1920" height="1080">
      <video muted loop playsinline preload="none" data-lazy-video data-src="${url('assets/video/band-crew.mp4')}" data-src-sm="${url('assets/video/band-crew-sm.mp4')}"></video>
    </div>
    <div class="container">
      <dl class="stats">${ctx.site.stats.map((s, i) => html`<div class="stat" data-reveal style="--d:${i}">
        <dt class="stat__label">${s.label}</dt>
        <dd class="stat__value"><span data-count="${s.value}">${s.value.toLocaleString('en-US')}</span><span class="stat__suffix">${s.suffix}</span></dd>
      </div>`)}</dl>
    </div>
  </section>`;
}

export function whySection() {
  return html`<section class="section section--ink why">
    <div class="container why__grid">
      <div class="why__intro" data-reveal>
        ${eyebrow('Why Wall Concrete', true)}
        <h2 class="h2">Built on experience. <span class="hl">Backed by our name.</span></h2>
        <p class="why__lead">Our name is on every slab, wall and foundation we pour. That’s why we plan carefully, communicate clearly and never cut corners on the details that make concrete last.</p>
        ${btn('About Our Company', url('about/'), { variant: 'outline-light' })}
        <figure class="why__figure frame frame--brackets">${img('crew-tools', { sizes: '(min-width: 1024px) 40vw, 100vw' })}</figure>
      </div>
      <ol class="why__list">${why.map((w, i) => html`<li class="why-card" data-reveal style="--d:${i}">
        <span class="why-card__num">${pad(i + 1)}</span>
        <div><h3 class="why-card__title">${w.title}</h3><p>${w.text}</p></div>
      </li>`)}</ol>
    </div>
  </section>`;
}

export function processSection({ tone = 'steel' } = {}) {
  return html`<section class="${cx('section', `section--${tone}`, 'process-section')}">
    <div class="container">
      ${sectionHead({ eyebrow: 'How It Works', title: 'A simple process from *first call* to final pour.', align: 'center', light: true })}
      <ol class="process">${process.map((s, i) => html`<li class="process__step" data-reveal style="--d:${i}">
        <span class="process__top"><span class="process__icon">${icon(s.icon, { size: 28 })}</span><span class="process__num">${pad(i + 1)}</span></span>
        <h3 class="process__title">${s.title}</h3>
        <p>${s.text}</p>
      </li>`)}</ol>
    </div>
  </section>`;
}

export function testimonialsSection() {
  const items = testimonials.items;
  return html`<section class="section section--paper testimonials" aria-labelledby="testimonials-title">
    <div class="container testimonials__grid">
      <div class="testimonials__intro" data-reveal>
        ${eyebrow('Client Feedback')}
        <h2 class="h2" id="testimonials-title">What our <span class="hl">clients</span> say.</h2>
        <p>Builders, contractors and homeowners keep calling us back for one reason: we do what we say we’ll do, and the work holds up.</p>
      </div>
      <div class="t-slider" data-slider aria-roledescription="carousel" aria-label="Client testimonials" data-reveal>
        <span class="t-slider__mark" aria-hidden="true">${icon('quote', { size: 96 })}</span>
        <div class="t-slider__track">
          ${items.map((t, i) => html`<figure class="${cx('t-slide', i === 0 && 'is-active')}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${items.length}"${raw(i ? ' aria-hidden="true"' : '')}>
            <div class="t-slide__stars" role="img" aria-label="Rated 5 out of 5">${[0, 1, 2, 3, 4].map(() => icon('star', { size: 20 }))}</div>
            <blockquote><p>${t.quote}</p></blockquote>
            <figcaption><span class="t-slide__avatar" aria-hidden="true">${t.name[0]}</span><span><strong>${t.name}</strong><small>${t.role}</small></span></figcaption>
          </figure>`)}
        </div>
        <div class="t-slider__controls">
          <button type="button" class="icon-btn icon-btn--outline" data-slider-prev aria-label="Previous testimonial">${icon('chevronLeft')}</button>
          <div class="t-slider__dots">${items.map((_, i) => html`<button type="button" class="${cx('t-slider__dot', i === 0 && 'is-active')}" data-slider-dot="${i}" aria-label="Show testimonial ${i + 1}"${raw(i === 0 ? ' aria-current="true"' : '')}></button>`)}</div>
          <button type="button" class="icon-btn icon-btn--outline" data-slider-next aria-label="Next testimonial">${icon('chevronRight')}</button>
        </div>
      </div>
    </div>
  </section>`;
}

export function ctaBand({
  title = 'Ready to *break ground?*',
  text = 'Tell us about your project and we’ll get back to you with a free, detailed estimate. No pressure, no vague numbers.',
  image = 'sunset-worker',
} = {}) {
  const { phone } = ctx.site;
  return html`<section class="cta-band">
    <div class="cta-band__media">${img(image)}</div>
    <div class="cta-band__shade"></div>
    <div class="container cta-band__inner" data-reveal>
      <div class="cta-band__copy">
        ${eyebrow('Let’s build something solid', true)}
        <h2 class="h2 h2--xl">${fmt(title)}</h2>
        <p class="cta-band__text">${text}</p>
      </div>
      <div class="cta-band__actions">
        ${btn('Get a Free Estimate', url('contact/'), { size: 'lg' })}
        <a class="phone-link" href="${telHref(phone)}"><span class="phone-link__icon">${icon('phone', { size: 20 })}</span><span><small>Or call us</small><strong>${phone}</strong></span></a>
      </div>
    </div>
  </section>`;
}

export function socialLinks(cls = '') {
  const labels = { facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn', youtube: 'YouTube' };
  const links = Object.entries(ctx.site.social).filter(([, href]) => href);
  return html`<ul class="${cx('social', cls)}">${links.map(([key, href]) => html`<li><a href="${href}" target="_blank" rel="noopener" aria-label="${ctx.site.name} on ${labels[key]}">${icon(key, { size: 18 })}</a></li>`)}</ul>`;
}

export const addressLine = () => {
  const a = ctx.site.address;
  return `${a.street}, ${a.city}, ${a.region} ${a.zip}`;
};

export const mapsHref = () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ctx.site.mapQuery)}`;

export function contactList({ hours = true } = {}) {
  const { site } = ctx;
  return html`<ul class="contact-list">
    <li><span class="contact-list__icon">${icon('phone')}</span><span><small>Call us</small><a href="${telHref(site.phone)}">${site.phone}</a></span></li>
    <li><span class="contact-list__icon">${icon('mail')}</span><span><small>Email us</small><a href="mailto:${site.email}">${site.email}</a></span></li>
    <li><span class="contact-list__icon">${icon('pin')}</span><span><small>Visit our office</small><a href="${mapsHref()}" target="_blank" rel="noopener">${addressLine()}</a></span></li>
    ${hours ? html`<li><span class="contact-list__icon">${icon('clock')}</span><span><small>Office hours</small>${site.hours.map((h) => html`<span class="contact-list__hours"><span>${h.days}</span><span>${h.time}</span></span>`)}</span></li>` : ''}
  </ul>`;
}

// Stylized Utah outline with the service radius around the Price office.
// Positions are projected from lat/long: x = 8 + (lon + 114.05) * 77.2, y = 8 + (42 - lat) * 100.
export function utahMap() {
  const hq = { name: 'Price', x: 258, y: 248 };
  // [label, x, y, label side]
  const cities = [
    ['Salt Lake City', 174, 132, 'l'],
    ['', 168, 86],
    ['Provo', 192, 185, 'l'],
    ['Vernal', 357, 162, 'l'],
    ['Green River', 308, 308, 'l'],
    ['Moab', 355, 351, 'l'],
    ['St. George', 44, 490, 'r'],
  ];
  const outline = '8,8 239,8 239,108 394,108 394,508 8,508';
  return html`<figure class="utah-map">
    <svg viewBox="0 0 402 516" role="img" aria-label="Map of Utah highlighting our service area around ${hq.name}">
      <defs>
        <pattern id="utah-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0v24" fill="none" stroke="currentColor" stroke-opacity=".08"/></pattern>
        <clipPath id="utah-clip"><polygon points="${outline}"/></clipPath>
      </defs>
      <polygon points="${outline}" fill="url(#utah-grid)" stroke="currentColor" stroke-opacity=".5" stroke-width="2"/>
      <circle class="utah-map__radius" cx="${hq.x}" cy="${hq.y}" r="108" clip-path="url(#utah-clip)"/>
      <circle class="utah-map__pulse" cx="${hq.x}" cy="${hq.y}" r="10"/>
      ${cities.map(([name, x, y, side]) => html`<g class="utah-map__city"><circle cx="${x}" cy="${y}" r="5"/>${name ? html`<text x="${side === 'r' ? x + 13 : x - 13}" y="${y + 8}" text-anchor="${side === 'r' ? 'start' : 'end'}">${name}</text>` : ''}</g>`)}
      <g class="utah-map__hq"><circle cx="${hq.x}" cy="${hq.y}" r="9"/><text x="${hq.x + 18}" y="${hq.y + 10}">${hq.name}</text></g>
    </svg>
  </figure>`;
}

const field = ({ id, name, label, type = 'text', required = false, autocomplete = '', full = false, placeholder = '' }) => html`<div class="${cx('field', full && 'field--full')}">
  <label for="${id}">${label}${required ? html` <span class="req" aria-hidden="true">*</span>` : html` <small>(optional)</small>`}</label>
  <input id="${id}" name="${name}" type="${type}"${raw(required ? ' required' : '')}${raw(autocomplete ? ` autocomplete="${autocomplete}"` : '')}${raw(placeholder ? ` placeholder="${esc(placeholder)}"` : '')} aria-describedby="${id}-err">
  <p class="field__error" id="${id}-err"></p>
</div>`;

const selectField = ({ id, name, label, options, required = false, full = false }) => html`<div class="${cx('field', full && 'field--full')}">
  <label for="${id}">${label}${required ? html` <span class="req" aria-hidden="true">*</span>` : html` <small>(optional)</small>`}</label>
  <span class="select"><select id="${id}" name="${name}"${raw(required ? ' required' : '')} aria-describedby="${id}-err">
    <option value="">Select…</option>${options.map((o) => html`<option>${o}</option>`)}
  </select>${icon('chevronDown', { size: 18 })}</span>
  <p class="field__error" id="${id}-err"></p>
</div>`;

const chipsField = ({ id, name, legend, options, type = 'radio', required = false }) => html`<fieldset class="field field--full"${raw(required ? ' data-required' : '')} aria-describedby="${id}-err">
  <legend>${legend}${required ? html` <span class="req" aria-hidden="true">*</span>` : html` <small>(select all that apply)</small>`}</legend>
  <div class="chips">${options.map((o) => html`<label class="chip"><input type="${type}" name="${name}" value="${o}"${raw(required && type === 'radio' ? ' required' : '')}><span>${o}</span></label>`)}</div>
  <p class="field__error" id="${id}-err"></p>
</fieldset>`;

const textareaField = ({ id, name, label, required = false, placeholder = '' }) => html`<div class="field field--full">
  <label for="${id}">${label}${required ? html` <span class="req" aria-hidden="true">*</span>` : html` <small>(optional)</small>`}</label>
  <textarea id="${id}" name="${name}" rows="5"${raw(required ? ' required' : '')} placeholder="${placeholder}" aria-describedby="${id}-err"></textarea>
  <p class="field__error" id="${id}-err"></p>
</div>`;

const fileField = ({ id, name, label, accept, hint, multiple = true }) => html`<div class="field field--full">
  <span class="field__label" id="${id}-label">${label} <small>(optional)</small></span>
  <label class="dropzone" data-dropzone>
    <input class="dropzone__input" id="${id}" type="file" name="${name}" accept="${accept}"${raw(multiple ? ' multiple' : '')} aria-labelledby="${id}-label">
    <span class="dropzone__icon">${icon('upload', { size: 26 })}</span>
    <span class="dropzone__text"><strong>Click to upload</strong> or drag files here</span>
    <span class="dropzone__hint">${hint}</span>
    <span class="dropzone__files" data-files></span>
  </label>
</div>`;

const formShell = ({ endpoint, subject, formName, submit, success, body }) => html`<form class="form" data-form action="${endpoint}" method="POST" enctype="multipart/form-data" novalidate data-success="${success}" data-phone="${ctx.site.phone}" data-tel="${telHref(ctx.site.phone)}" data-email="${ctx.site.email}">
  <input type="hidden" name="_subject" value="${subject}">
  <input type="hidden" name="form" value="${formName}">
  <div class="form__hp" aria-hidden="true"><label>Leave this field empty<input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
  <div class="form__grid">${body}</div>
  <div class="form__footer">
    <button class="btn btn--primary btn--lg" type="submit"><span>${submit}</span>${icon('arrowRight', { size: 18 })}</button>
    <p class="form__note">We respect your privacy. See our <a href="${url('privacy/')}">privacy policy</a>.</p>
  </div>
  <div class="form__status" role="status" aria-live="polite"></div>
</form>`;

export function estimateForm({ compact = false, prefix = 'est' } = {}) {
  const { site, services } = ctx;
  const id = (n) => `${prefix}-${n}`;
  const serviceNames = [...services.map((s) => s.menuName), 'Other'];
  return formShell({
    endpoint: site.forms.estimate,
    subject: `New estimate request — ${site.name}`,
    formName: 'Estimate request',
    submit: compact ? 'Request My Estimate' : 'Request My Free Estimate',
    success: 'We’ve received your request. A member of our team will reach out soon to talk about your project.',
    body: html`
      ${field({ id: id('name'), name: 'name', label: 'Full name', required: true, autocomplete: 'name' })}
      ${field({ id: id('phone'), name: 'phone', label: 'Phone', type: 'tel', required: true, autocomplete: 'tel' })}
      ${field({ id: id('email'), name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email' })}
      ${field({ id: id('location'), name: 'project_location', label: 'Project city', autocomplete: 'address-level2' })}
      ${chipsField({ id: id('type'), name: 'project_type', legend: 'Project type', options: ['Residential', 'Commercial', 'Builder / GC', 'Municipal'], required: true })}
      ${compact
        ? selectField({ id: id('service'), name: 'service', label: 'Service needed', options: serviceNames, full: true })
        : chipsField({ id: id('services'), name: 'services', legend: 'Services needed', options: serviceNames, type: 'checkbox' })}
      ${compact ? '' : selectField({ id: id('timeline'), name: 'timeline', label: 'Ideal timeline', options: ['As soon as possible', 'Within 1–3 months', '3–6 months out', '6+ months out', 'Just budgeting / planning'] })}
      ${compact ? '' : selectField({ id: id('referral'), name: 'referral', label: 'How did you hear about us?', options: ['Google search', 'Referral / word of mouth', 'Saw a job site or truck', 'Social media', 'Repeat customer', 'Other'] })}
      ${textareaField({ id: id('details'), name: 'details', label: 'Project details', required: !compact, placeholder: 'Approximate size, scope, timeline or anything else we should know…' })}
      ${compact ? '' : fileField({ id: id('files'), name: 'attachments', label: 'Plans or photos', accept: 'image/*,.pdf', hint: 'PDF, JPG or PNG — up to 10 MB each' })}
    `,
  });
}

export function applicationForm({ positions }) {
  const { site } = ctx;
  const id = (n) => `app-${n}`;
  return formShell({
    endpoint: site.forms.careers,
    subject: `New job application — ${site.name}`,
    formName: 'Job application',
    submit: 'Submit Application',
    success: 'Your application has been received. We’ll review it and reach out if it’s a good fit.',
    body: html`
      ${field({ id: id('first'), name: 'first_name', label: 'First name', required: true, autocomplete: 'given-name' })}
      ${field({ id: id('last'), name: 'last_name', label: 'Last name', required: true, autocomplete: 'family-name' })}
      ${field({ id: id('phone'), name: 'phone', label: 'Phone', type: 'tel', required: true, autocomplete: 'tel' })}
      ${field({ id: id('email'), name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email' })}
      ${field({ id: id('city'), name: 'city', label: 'City', required: true, autocomplete: 'address-level2' })}
      ${selectField({ id: id('position'), name: 'position', label: 'Position', required: true, options: [...positions.map((p) => p.title), 'Other / General application'] })}
      ${selectField({ id: id('experience'), name: 'experience', label: 'Years of construction experience', required: true, options: ['None — ready to learn', 'Less than 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years'] })}
      ${selectField({ id: id('license'), name: 'license', label: 'Driver’s license', required: true, options: ['Standard license', 'CDL Class B', 'CDL Class A', 'No license'] })}
      ${field({ id: id('start'), name: 'available_start', label: 'Available start date', type: 'date' })}
      ${selectField({ id: id('work'), name: 'work_type', label: 'Looking for', options: ['Full-time', 'Seasonal', 'Either'] })}
      ${textareaField({ id: id('about'), name: 'about', label: 'Tell us about your experience', placeholder: 'Past employers, equipment you can run, certifications…' })}
      ${fileField({ id: id('resume'), name: 'resume', label: 'Resume', accept: '.pdf,.doc,.docx', hint: 'PDF or Word — up to 10 MB', multiple: false })}
      <div class="field field--full">
        <label class="check"><input type="checkbox" name="eligibility" value="Yes" required aria-describedby="${id('elig')}-err"><span>I am at least 18 years old and legally authorized to work in the United States. <span class="req" aria-hidden="true">*</span></span></label>
        <p class="field__error" id="${id('elig')}-err"></p>
      </div>
    `,
  });
}

export function faqList(faqs) {
  return html`<div class="faq">${faqs.map((f) => html`<details class="faq__item" data-reveal>
    <summary><span class="faq__q">${f.q}</span><span class="faq__icon" aria-hidden="true">${icon('plus', { size: 20 })}</span></summary>
    <div class="faq__a"><p>${f.a}</p></div>
  </details>`)}</div>`;
}

export const faqJsonLd = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export function ticker(items) {
  const row = html`${items.map((t) => html`<span class="ticker__item">${t}</span><span class="ticker__sep" aria-hidden="true"></span>`)}`;
  return html`<div class="ticker" aria-hidden="true"><div class="ticker__track"><div class="ticker__group">${row}</div><div class="ticker__group">${row}</div></div></div>`;
}

export const posterSrc = (name) => ({
  src: url(`assets/img/posters/${name}.webp`),
  srcset: `${url(`assets/img/posters/${name}-sm.webp`)} 960w, ${url(`assets/img/posters/${name}.webp`)} 1920w`,
});

export { asset };
