import { html } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { ctx, url, telHref } from '../lib/ctx.mjs';
import { img, btn, eyebrow, sectionHead, pageHero, statsBand, checklist, utahMap, fmt } from '../lib/components.mjs';
import { values, markets, safety } from '../data/content.mjs';

// "K. Geoffrey Madsen" -> "KM"
const initials = (name) => {
  const words = name.split(/\s+/).filter((w) => /[a-z]/i.test(w));
  return (words[0][0] + (words.length > 1 ? words.at(-1)[0] : '')).toUpperCase();
};

function team() {
  const members = ctx.about.team;
  if (!members.length) return '';
  return html`<section class="section section--paper team" id="team">
    <div class="container">
      ${sectionHead({ eyebrow: 'Our Team', title: 'The people *behind the work.*', text: 'A family-run company led by people who have spent their careers in concrete construction.' })}
      <ul class="team-grid">${members.map((m, i) => html`<li class="team-card" data-reveal style="--d:${i}">
        ${m.photo
          ? html`<figure class="team-card__photo">${img(m.photo, { sizes: '112px', alt: `Portrait of ${m.name}` })}</figure>`
          : html`<span class="team-card__initials" aria-hidden="true">${initials(m.name)}</span>`}
        <h3 class="team-card__name">${m.name}</h3>
        ${m.title ? html`<span class="team-card__title">${m.title}</span>` : ''}
        ${m.phone ? html`<a class="team-card__phone" href="${telHref(m.phone)}">${icon('phone', { size: 16 })}${m.phone}</a>` : ''}
      </li>`)}</ul>
    </div>
  </section>`;
}

export default function about() {
  const { site } = ctx;
  const crumbs = [{ label: 'About', path: 'about/' }];
  const areaArticle = /^the /i.test(site.serviceAreaLabel) ? 'the ' : '';
  const areaName = site.serviceAreaLabel.replace(/^the /i, '');
  return {
    path: 'about/',
    title: 'About Us',
    description: `Learn about ${site.name}, a family-owned concrete contractor with more than 50 years in the industry, serving ${site.serviceAreaLabel}.`,
    crumbs,
    body: html`
      ${pageHero({
        image: 'foundation-forms-redrock',
        eyebrow: 'About Us',
        title: 'Building on a *solid foundation.*',
        text: 'A family-owned concrete and construction company with more than 50 years in the industry.',
        crumbs,
      })}

      <section class="section section--paper story">
        <div class="container story__grid">
          <div class="story__copy" data-reveal>
            ${eyebrow('Our Story')}
            <h2 class="h2">Family owned. <span class="hl">Family run.</span></h2>
            ${ctx.about.storyLead ? html`<p class="lead">${ctx.about.storyLead}</p>` : ''}
            ${ctx.about.story.map((p) => html`<p>${p}</p>`)}
            <div class="actions">${btn('Explore Our Services', url('services/'))}${btn('See Our Work', url('projects/'), { variant: 'outline', iconName: 'arrowUpRight' })}</div>
          </div>
          <div class="story__media" data-reveal style="--d:1">
            <figure class="story__img story__img--a frame frame--brackets">${img('crew-pour', { sizes: '(min-width: 1024px) 34vw, 90vw', alt: 'Wall crew members placing concrete on a slab pour' })}</figure>
            <figure class="story__img story__img--b">${img('walls-forms-crew', { sizes: '(min-width: 1024px) 24vw, 60vw', alt: 'Crew member working among cast-in-place walls and forms' })}</figure>
          </div>
        </div>
      </section>

      <section class="mission">
        <div class="container mission__inner" data-reveal>
          <span class="mission__label">Our Mission</span>
          <p class="mission__text">${fmt(ctx.about.mission)}</p>
        </div>
      </section>

      ${team()}

      <section class="section section--light values-section">
        <div class="container">
          ${sectionHead({ eyebrow: 'Our Values', title: 'What we *stand on.*', text: 'Four commitments guide every bid we write, every crew we send and every yard of concrete we place.' })}
          <ul class="value-grid">${values.map((v, i) => html`<li class="value-card" data-reveal style="--d:${i}">
            <span class="value-card__icon">${icon(v.icon, { size: 30 })}</span>
            <h3 class="value-card__title">${v.title}</h3>
            <p>${v.text}</p>
          </li>`)}</ul>
        </div>
      </section>

      ${statsBand()}

      <section class="section section--paper safety" id="safety">
        <div class="container safety__grid">
          <div class="safety__media" data-reveal>
            <figure class="frame frame--brackets">${img('night-pour-rebar', { sizes: '(min-width: 1024px) 46vw, 92vw', alt: 'Night pour on a heavily reinforced slab under light towers' })}</figure>
            <figure class="safety__inset">${img('power-screed-worker', { sizes: '(min-width: 1024px) 18vw, 40vw', alt: 'Crew member in a hard hat leveling a slab with a power screed' })}</figure>
          </div>
          <div class="safety__copy" data-reveal style="--d:1">
            ${eyebrow('Committed to Safety')}
            <h2 class="h2">Safety isn’t a slogan. <span class="hl">It’s the plan.</span></h2>
            <p class="lead">Concrete work is heavy, fast-moving and unforgiving. We take that seriously.</p>
            <p>Every pour starts with a plan for doing it safely — the right people, the right equipment and a crew that knows the hazards before the first truck arrives. It protects our people, our clients and the quality of the work.</p>
            <p>We’ve worked under every kind of safety program, from owners and general contractors to coal mines, power plants and active industrial sites.</p>
            ${checklist(safety, 'checklist--2col')}
          </div>
        </div>
      </section>

      <section class="section section--ink markets">
        <div class="container">
          ${sectionHead({ eyebrow: 'Who We Serve', title: 'From parks and highways *to heavy industry.*', light: true, text: 'We’ve worked in virtually every type of concrete construction, for owners, engineers, general contractors and public agencies.' })}
          <ul class="market-grid">${markets.map((m, i) => html`<li class="market-card" data-reveal style="--d:${i}">
            <span class="market-card__icon">${icon(m.icon, { size: 28 })}</span>
            <h3 class="market-card__title">${m.title}</h3>
            <p>${m.text}</p>
          </li>`)}</ul>
        </div>
      </section>

      <section class="section section--light area">
        <div class="container area__grid">
          <div data-reveal>
            ${eyebrow('Service Area')}
            <h2 class="h2">Proudly serving ${areaArticle}<span class="hl">${areaName}.</span></h2>
            <p class="lead">From our home base in ${site.address.city}, ${site.address.region}, our crews take on projects across ${site.serviceAreaLabel}.</p>
            ${site.serviceAreas.length > 1 ? html`<ul class="area-list area-list--dark">${site.serviceAreas.map((a) => html`<li>${a}</li>`)}</ul>` : ''}
            <p class="area__note">Not sure if we cover your area? <a href="${url('contact/')}">Ask us</a> — we travel for the right project.</p>
          </div>
          <div class="area__map" data-reveal style="--d:1">${utahMap()}</div>
        </div>
      </section>

    `,
  };
}
