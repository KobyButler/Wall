import { html, raw, cx } from '../lib/html.mjs';
import { icon, logoMark } from '../lib/icons.mjs';
import { ctx, url, telHref } from '../lib/ctx.mjs';
import {
  img, btn, eyebrow, sectionHead, serviceCard, projectCard, projectData, lightbox, statsBand, whySection,
  processSection, testimonialsSection, checklist, contactList, utahMap, estimateForm, ticker, posterSrc,
} from '../lib/components.mjs';

const pad = (n) => String(n).padStart(2, '0');

function hero() {
  const { hero } = ctx.site;
  return html`<section class="hero" data-hero data-interval="${hero.interval}" aria-label="Welcome">
    <div class="hero__media" aria-hidden="true">
      ${hero.slides.map((s, i) => {
        const poster = posterSrc(s.video);
        return html`<div class="${cx('hero__slide', i === 0 && 'is-active')}" data-slide>
          <img class="hero__poster" src="${poster.src}" srcset="${poster.srcset}" sizes="100vw" alt="" width="1920" height="1080"${raw(i === 0 ? ' fetchpriority="high"' : ' loading="lazy"')} decoding="async">
          <video class="hero__video" muted playsinline loop preload="none" data-src="${url(`assets/video/${s.video}.mp4`)}" data-src-sm="${url(`assets/video/${s.video}-sm.mp4`)}"></video>
        </div>`;
      })}
      <div class="hero__shade"></div>
    </div>
    <div class="container hero__content">
      ${eyebrow(hero.eyebrow, true)}
      <h1 class="hero__title">${hero.title.map((line, i) => html`<span class="hero__line"><span class="${cx('hero__line-inner', i === hero.title.length - 1 && 'hl')}" style="--i:${i}">${line}</span></span>`)}</h1>
      <p class="hero__text">${hero.text}</p>
      <div class="hero__actions">
        ${btn('Get a Free Estimate', url('contact/'), { size: 'lg' })}
        ${btn('View Our Work', url('projects/'), { variant: 'ghost', size: 'lg', iconName: 'arrowUpRight' })}
      </div>
    </div>
    <div class="container hero__bar">
      <ol class="hero__tabs">${hero.slides.map((s, i) => html`<li>
        <button type="button" class="${cx('hero__tab', i === 0 && 'is-active')}" data-goto="${i}" aria-label="Background ${i + 1}: ${s.label}"${raw(i === 0 ? ' aria-current="true"' : '')}>
          <span class="hero__tab-num">${pad(i + 1)}</span>
          <span class="hero__tab-label">${s.label}</span>
          <span class="hero__tab-bar" aria-hidden="true"><span></span></span>
        </button>
      </li>`)}</ol>
      <div class="hero__controls">
        <button type="button" class="hero__ctrl" data-hero-prev aria-label="Previous background">${icon('chevronLeft', { size: 20 })}</button>
        <button type="button" class="hero__ctrl" data-hero-pause aria-pressed="false" aria-label="Pause background video">${icon('pause', { size: 18, cls: 'i-pause' })}${icon('play', { size: 18, cls: 'i-play' })}</button>
        <button type="button" class="hero__ctrl" data-hero-next aria-label="Next background">${icon('chevronRight', { size: 20 })}</button>
      </div>
    </div>
    <a class="hero__scroll" href="#intro" aria-label="Scroll to content"><span>Scroll</span><i aria-hidden="true"></i></a>
  </section>`;
}

function seal() {
  return html`<div class="seal" aria-hidden="true">
    <svg class="seal__ring" viewBox="0 0 120 120"><defs><path id="seal-path" d="M60 60m-47 0a47 47 0 1 1 94 0a47 47 0 1 1-94 0"/></defs>
      <text><textPath href="#seal-path" textLength="293" lengthAdjust="spacing">Quality • Safety • Integrity • Reliability •</textPath></text>
    </svg>
    <span class="seal__core">${logoMark('seal__mark')}</span>
  </div>`;
}

function intro() {
  const { site } = ctx;
  const first = site.stats[0];
  return html`<section class="section section--paper intro" id="intro">
    <div class="container intro__grid">
      <div class="intro__media" data-reveal>
        <figure class="intro__main frame frame--brackets">${img('walls', { sizes: '(min-width: 1024px) 40vw, 92vw', alt: 'Freshly stripped cast-in-place concrete wall with rebar extending above it' })}</figure>
        <figure class="intro__inset">${img('power-screed', { sizes: '(min-width: 1024px) 20vw, 45vw', alt: 'Crew leveling fresh concrete with a power screed' })}</figure>
        <div class="intro__badge"><strong>${first.value.toLocaleString('en-US')}${first.suffix}</strong><span>${first.label}</span></div>
        ${seal()}
      </div>
      <div class="intro__copy" data-reveal style="--d:1">
        ${eyebrow('Who We Are')}
        <h2 class="h2">Concrete &amp; construction, <span class="hl">done right</span> the first time.</h2>
        <p class="lead">${site.name} is a local, full-service concrete contractor serving builders, businesses and homeowners across ${site.region}.</p>
        <p>We self-perform every phase of the job — excavation, forming, rebar, placement and finishing — so quality never gets handed off. Whether it’s a single driveway or a multi-building commercial site, you get the same careful planning, clean jobsite and craftsmanship on every pour.</p>
        ${checklist(['Residential & commercial', 'Licensed & insured', 'Self-performing crews', 'Free, detailed estimates'], 'checklist--2col')}
        <div class="actions">
          ${btn('More About Us', url('about/'))}
          <a class="phone-link phone-link--dark" href="${telHref(site.phone)}"><span class="phone-link__icon">${icon('phone', { size: 20 })}</span><span><small>Talk to our team</small><strong>${site.phone}</strong></span></a>
        </div>
      </div>
    </div>
  </section>`;
}

function services() {
  return html`<section class="section section--light services-section" id="services">
    <div class="container">
      ${sectionHead({
        eyebrow: 'What We Do',
        title: 'Covering *all* your concrete needs.',
        text: 'From the first scoop of dirt to the final broom finish, our crews self-perform every phase of concrete construction for residential, commercial and municipal projects.',
        actions: btn('View All Services', url('services/'), { variant: 'outline' }),
      })}
      <div class="service-grid">${ctx.services.map(serviceCard)}</div>
    </div>
  </section>`;
}

function featuredProjects(featured) {
  return html`<section class="section section--paper projects-feature" data-carousel>
    <div class="container">
      ${sectionHead({
        eyebrow: 'Recent Work',
        title: 'Concrete for *any* application.',
        text: 'Foundations, walls, flatwork and commercial concrete across the Wasatch Front. Select any project to see the details.',
        actions: html`<div class="carousel-nav">
          <button type="button" class="icon-btn icon-btn--outline" data-carousel-prev aria-label="Scroll projects left">${icon('chevronLeft')}</button>
          <button type="button" class="icon-btn icon-btn--outline" data-carousel-next aria-label="Scroll projects right">${icon('chevronRight')}</button>
        </div>`,
      })}
    </div>
    <div class="carousel">
      <div class="carousel__track" data-carousel-track tabindex="0" role="region" aria-label="Featured projects, scrollable">
        ${featured.map((p) => projectCard(p, { sizes: '(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 82vw', reveal: false }))}
      </div>
    </div>
    <div class="container carousel__foot">
      <div class="carousel__progress" aria-hidden="true"><span data-carousel-progress></span></div>
      <span class="carousel__hint">Drag or swipe to see more ${icon('arrowRight', { size: 18 })}</span>
      ${btn('View All Projects', url('projects/'), { variant: 'dark' })}
    </div>
  </section>`;
}

function splitCards() {
  return html`<section class="split-cards" aria-label="Safety and careers">
    <a class="split-card" href="${url('about/#safety')}">
      ${img('hardhat', { sizes: '(min-width: 768px) 50vw, 100vw', cls: 'split-card__img' })}
      <span class="split-card__body">
        <span class="eyebrow eyebrow--light">Safety</span>
        <span class="split-card__title">Safety is our <span class="hl">foundation.</span></span>
        <span class="split-card__text">Every person on our crew goes home safe, every day. Safety is planned into every pour — from daily briefings to well-maintained equipment.</span>
        <span class="link-arrow">Our safety commitment ${icon('arrowRight', { size: 18 })}</span>
      </span>
    </a>
    <a class="split-card" href="${url('careers/')}">
      ${img('crew', { sizes: '(min-width: 768px) 50vw, 100vw', cls: 'split-card__img' })}
      <span class="split-card__body">
        <span class="eyebrow eyebrow--light">Careers</span>
        <span class="split-card__title">Build a career <span class="hl">that lasts.</span></span>
        <span class="split-card__text">Competitive pay, real benefits and room to grow. We’re always looking for hard-working people to join our crews.</span>
        <span class="link-arrow">View open positions ${icon('arrowRight', { size: 18 })}</span>
      </span>
    </a>
  </section>`;
}

function contact() {
  const { site } = ctx;
  return html`<section class="section section--ink contact-block" id="estimate">
    <div class="container contact-block__grid">
      <div class="contact-block__info" data-reveal>
        ${eyebrow('Get In Touch', true)}
        <h2 class="h2">Let’s talk about <span class="hl">your project.</span></h2>
        <p class="contact-block__lead">Call, email or send us a few details. We’ll follow up to schedule a site visit and put together a free, no-obligation estimate.</p>
        ${contactList({ hours: false })}
        <div class="contact-block__map">
          ${utahMap()}
          <div>
            <h3 class="contact-block__map-title">Our service area</h3>
            <ul class="area-list">${site.serviceAreas.map((a) => html`<li>${a}</li>`)}</ul>
          </div>
        </div>
      </div>
      <div class="form-card" data-reveal style="--d:1">
        <div class="form-card__head">
          <h3 class="form-card__title">Request a free estimate</h3>
          <p>Fields marked <span class="req">*</span> are required.</p>
        </div>
        ${estimateForm({ compact: true, prefix: 'quick' })}
      </div>
    </div>
  </section>`;
}

export default function home() {
  const { site, services: list, projects } = ctx;
  const featured = projects.filter((p) => p.featured);
  const poster = posterSrc(site.hero.slides[0].video);
  return {
    path: '',
    bodyClass: 'page--home',
    cta: false,
    head: html`<link rel="preload" as="image" href="${poster.src}" imagesrcset="${poster.srcset}" imagesizes="100vw" fetchpriority="high">`,
    body: html`
      ${hero()}
      ${ticker([...list.map((s) => s.menuName), 'Free Estimates'])}
      ${intro()}
      ${statsBand()}
      ${services()}
      ${whySection()}
      ${featuredProjects(featured)}
      ${processSection()}
      ${testimonialsSection()}
      ${splitCards()}
      ${contact()}
      ${projectData(featured)}
      ${lightbox()}
    `,
  };
}
