import { html, cx } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { ctx, url } from '../lib/ctx.mjs';
import { img, btn, eyebrow, sectionHead, pageHero, checklist, processSection } from '../lib/components.mjs';
import { markets } from '../data/content.mjs';

const pad = (n) => String(n).padStart(2, '0');

export default function services() {
  const { site } = ctx;
  const crumbs = [{ label: 'Services', path: 'services/' }];
  return {
    path: 'services/',
    title: 'Concrete Services',
    description: `Foundations, concrete & retaining walls, flatwork, commercial concrete, excavation and decorative concrete in ${site.serviceAreaLabel}.`,
    crumbs,
    body: html`
      ${pageHero({
        image: 'commercial',
        eyebrow: 'Our Services',
        title: 'Full-service concrete, *dirt to finish.*',
        text: 'Six core services, one accountable team. We self-perform every phase — so you get one schedule, one point of contact and consistent quality.',
        crumbs,
        actions: html`${btn('Get a Free Estimate', url('contact/'))}`,
      })}

      <section class="section section--paper">
        <div class="container">
          ${sectionHead({
            eyebrow: 'What We Do',
            title: 'Concrete work for *every stage* of construction.',
            text: 'Whether you need a single driveway or the foundations, walls and site concrete for an entire development, our crews have the experience and equipment to deliver.',
          })}
          <nav class="service-index" aria-label="Jump to a service" data-reveal>
            ${ctx.services.map((s, i) => html`<a href="#${s.slug}"><span>${pad(i + 1)}</span>${s.menuName}</a>`)}
          </nav>
          <div class="service-rows">
            ${ctx.services.map((s, i) => html`<article class="${cx('service-row', i % 2 && 'service-row--flip')}" id="${s.slug}">
              <a class="service-row__media" href="${url(`services/${s.slug}/`)}" tabindex="-1" aria-hidden="true" data-reveal>
                ${img(s.image, { sizes: '(min-width: 1024px) 50vw, 100vw' })}
                <span class="service-row__num">${pad(i + 1)}</span>
              </a>
              <div class="service-row__body" data-reveal style="--d:1">
                <span class="service-row__icon">${icon(s.icon, { size: 30 })}</span>
                ${eyebrow(s.tagline)}
                <h2 class="h2 h2--sm"><a href="${url(`services/${s.slug}/`)}">${s.name}</a></h2>
                <p>${s.intro[0]}</p>
                ${checklist(s.capabilities.slice(0, 6).map((c) => c.title), 'checklist--2col')}
                ${btn(`Explore ${s.menuName}`, url(`services/${s.slug}/`), { variant: 'outline' })}
              </div>
            </article>`)}
          </div>
        </div>
      </section>

      <section class="section section--light markets">
        <div class="container">
          ${sectionHead({ eyebrow: 'Who We Serve', title: 'Built for builders, businesses *and* homeowners.', text: 'We tailor our approach to the way you work — from repeatable builder schedules to one-time residential projects.' })}
          <ul class="market-grid">${markets.map((m, i) => html`<li class="market-card" data-reveal style="--d:${i}">
            <span class="market-card__icon">${icon(m.icon, { size: 28 })}</span>
            <h3 class="market-card__title">${m.title}</h3>
            <p>${m.text}</p>
          </li>`)}</ul>
        </div>
      </section>

      ${processSection({ tone: 'steel' })}
    `,
  };
}
