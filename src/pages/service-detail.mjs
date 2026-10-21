// Generates one page per service at /services/<slug>/.
import { html, cx } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { ctx, url, telHref } from '../lib/ctx.mjs';
import {
  img, btn, eyebrow, sectionHead, pageHero, projectCard, projectData, lightbox, faqList, faqJsonLd,
} from '../lib/components.mjs';
import { why } from '../data/content.mjs';

const pad = (n) => String(n).padStart(2, '0');

function servicePage(s, index) {
  const { site, services, projects } = ctx;
  const related = projects.filter((p) => p.service === s.slug);
  const others = services.filter((o) => o.slug !== s.slug);
  const crumbs = [{ label: 'Services', path: 'services/' }, { label: s.name, path: `services/${s.slug}/` }];

  return {
    path: `services/${s.slug}/`,
    title: `${s.name} in ${site.region}`,
    description: `${s.short} ${site.name} serves ${site.serviceAreaLabel}. Request a free estimate.`,
    crumbs,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: s.name,
        serviceType: s.name,
        description: s.short,
        provider: { '@type': 'GeneralContractor', name: site.legalName, telephone: site.phone },
        areaServed: site.serviceAreas,
      },
      faqJsonLd(s.faqs),
    ],
    body: html`
      ${pageHero({
        image: s.image,
        eyebrow: `Service ${pad(index + 1)}`,
        title: s.name,
        text: s.short,
        crumbs,
        actions: html`${btn('Get a Free Estimate', url('contact/'))}${btn(`Call ${site.phone}`, telHref(site.phone), { variant: 'ghost', iconName: 'phone' })}`,
      })}

      <section class="section section--paper detail-intro">
        <div class="container detail-intro__grid">
          <div class="detail-intro__copy" data-reveal>
            ${eyebrow(s.label)}
            <h2 class="h2">${s.heading}</h2>
            ${s.intro.map((p, i) => html`<p class="${cx(i === 0 && 'lead')}">${p}</p>`)}
            <ul class="highlights">${s.highlights.map((h, i) => html`<li><span class="highlights__num">${pad(i + 1)}</span>${h}</li>`)}</ul>
          </div>
          <div class="detail-intro__media" data-reveal style="--d:1">
            <figure class="frame frame--brackets">${img(s.detailImage, { sizes: '(min-width: 1024px) 44vw, 92vw' })}</figure>
            <div class="detail-intro__tag"><span class="detail-intro__tag-icon">${icon(s.icon, { size: 28 })}</span><span><strong>${s.tagline}</strong><small>${site.license}</small></span></div>
          </div>
        </div>
      </section>

      <section class="section section--light capabilities">
        <div class="container">
          ${sectionHead({ eyebrow: 'Capabilities', title: `Full *${s.menuName.toLowerCase()}* capabilities.`, text: `Everything we offer under ${s.name.toLowerCase()} — planned, built and finished by our own crews.` })}
          <ul class="cap-grid">${s.capabilities.map((c, i) => html`<li class="cap-card" data-reveal style="--d:${i % 4}">
            <span class="cap-card__num">${pad(i + 1)}</span>
            <h3 class="cap-card__title">${c.title}</h3>
            <p>${c.text}</p>
          </li>`)}</ul>
        </div>
      </section>

      <section class="why-strip">
        <div class="container why-strip__grid">
          ${why.map((w, i) => html`<div class="why-strip__item" data-reveal style="--d:${i}">
            <span class="why-strip__num">${pad(i + 1)}</span>
            <h3>${w.title}</h3>
            <p>${w.text}</p>
          </div>`)}
        </div>
      </section>

      <section class="section section--paper gallery-section">
        <div class="container">
          ${sectionHead({ eyebrow: 'Gallery', title: `${s.menuName} *in the field.*`, text: 'A look at the kind of work our crews deliver every day.', actions: btn('View All Projects', url('projects/'), { variant: 'outline' }) })}
          <div class="${cx('gallery', `gallery--${Math.min(s.gallery.length, 5)}`)}">
            ${s.gallery.slice(0, 5).map((name, i) => html`<figure class="gallery__item" data-reveal style="--d:${i}">${img(name, { sizes: i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw' })}</figure>`)}
          </div>
          ${related.length ? html`
            <h3 class="related-title" data-reveal>Related projects</h3>
            <div class="project-grid project-grid--compact">${related.map((p) => projectCard(p))}</div>
            ${projectData(related)}
            ${lightbox()}` : ''}
        </div>
      </section>

      <section class="section section--light faq-section">
        <div class="container faq-section__grid">
          <div class="faq-section__intro" data-reveal>
            ${eyebrow('FAQ')}
            <h2 class="h2">Common questions about <span class="hl">${s.menuName.toLowerCase()}.</span></h2>
            <div class="help-card">
              <span class="help-card__icon">${icon('phone', { size: 24 })}</span>
              <div>
                <strong>Have a different question?</strong>
                <p>Our team is happy to talk through your project.</p>
                <a href="${telHref(site.phone)}">${site.phone}</a>
              </div>
            </div>
          </div>
          ${faqList(s.faqs)}
        </div>
      </section>

      <section class="section section--ink other-services">
        <div class="container">
          ${sectionHead({ eyebrow: 'More Services', title: 'One contractor. *Every phase.*', light: true, actions: btn('All Services', url('services/'), { variant: 'outline-light' }) })}
          <ul class="mini-services">${others.map((o, i) => html`<li data-reveal style="--d:${i}"><a class="mini-service" href="${url(`services/${o.slug}/`)}">
            <span class="mini-service__icon">${icon(o.icon, { size: 26 })}</span>
            <span class="mini-service__name">${o.name}</span>
            ${icon('arrowUpRight', { size: 20, cls: 'mini-service__arrow' })}
          </a></li>`)}</ul>
        </div>
      </section>
    `,
  };
}

export default function serviceDetails() {
  return ctx.services.map(servicePage);
}
