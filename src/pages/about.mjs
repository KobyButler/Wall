import { html } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { ctx, url } from '../lib/ctx.mjs';
import { img, btn, eyebrow, sectionHead, pageHero, statsBand, checklist, utahMap, testimonialsSection } from '../lib/components.mjs';
import { values, markets, safety } from '../data/content.mjs';

export default function about() {
  const { site } = ctx;
  const crumbs = [{ label: 'About', path: 'about/' }];
  return {
    path: 'about/',
    title: 'About Us',
    description: `Learn about ${site.name} — a local, full-service concrete contractor built on safety, quality and integrity, serving ${site.serviceAreaLabel}.`,
    crumbs,
    body: html`
      ${pageHero({
        image: 'rebar-columns',
        eyebrow: 'About Us',
        title: 'Building on a *solid foundation.*',
        text: 'A local concrete and construction company built on hard work, honest communication and craftsmanship that lasts.',
        crumbs,
      })}

      <section class="section section--paper story">
        <div class="container story__grid">
          <div class="story__copy" data-reveal>
            ${eyebrow('Our Story')}
            <h2 class="h2">Local roots. <span class="hl">Solid</span> reputation.</h2>
            <!-- PLACEHOLDER: replace with the client's real history (founding year, founders, milestones). -->
            <p class="lead">${site.name} was built on a simple idea: do the work right, treat people well and stand behind every pour.</p>
            <p>Today our crews serve homeowners, home builders, general contractors and public agencies across ${site.serviceAreaLabel}, self-performing everything from excavation and forming to placement and finishing. Keeping the work in-house means we control the quality, the schedule and the safety of every job we take on.</p>
            <p>We know concrete is a long-term investment. That’s why we plan carefully, choose the right mix and methods for Utah’s climate, and never cut corners on the details nobody sees once the job is done.</p>
            <div class="actions">${btn('Explore Our Services', url('services/'))}${btn('See Our Work', url('projects/'), { variant: 'outline', iconName: 'arrowUpRight' })}</div>
          </div>
          <div class="story__media" data-reveal style="--d:1">
            <figure class="story__img story__img--a frame frame--brackets">${img('crew', { sizes: '(min-width: 1024px) 34vw, 90vw', alt: 'Crew members in high-visibility vests reviewing a job site' })}</figure>
            <figure class="story__img story__img--b">${img('planning', { sizes: '(min-width: 1024px) 24vw, 60vw', alt: 'Project team reviewing construction plans on site' })}</figure>
          </div>
        </div>
      </section>

      <section class="mission">
        <div class="container mission__inner" data-reveal>
          <span class="mission__label">Our Mission</span>
          <p class="mission__text">To deliver concrete and construction work that’s <span class="hl">built to last</span> — safely, on schedule and with honest communication from the first call to the final walkthrough.</p>
        </div>
      </section>

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
            <figure class="frame frame--brackets">${img('night-crew', { sizes: '(min-width: 1024px) 46vw, 92vw', alt: 'Crew in high-visibility safety gear working a night shift' })}</figure>
            <figure class="safety__inset">${img('hardhat', { sizes: '(min-width: 1024px) 18vw, 40vw', alt: 'Hard hat and work gloves resting on a job site' })}</figure>
          </div>
          <div class="safety__copy" data-reveal style="--d:1">
            ${eyebrow('Committed to Safety')}
            <h2 class="h2">Safety isn’t a slogan. <span class="hl">It’s the plan.</span></h2>
            <p class="lead">Concrete work is heavy, fast-moving and unforgiving. We take that seriously.</p>
            <p>Every pour starts with a plan for doing it safely — the right people, the right equipment and a crew that knows the hazards before the first truck arrives. It protects our people, our clients and the quality of the work.</p>
            ${checklist(safety, 'checklist--2col')}
          </div>
        </div>
      </section>

      <section class="section section--ink markets">
        <div class="container">
          ${sectionHead({ eyebrow: 'Who We Serve', title: 'Trusted by builders, businesses *and* homeowners.', light: true, text: 'Big or small, residential or commercial — every project gets the same level of care.' })}
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
            <h2 class="h2">Proudly serving <span class="hl">${site.region}.</span></h2>
            <p class="lead">Our crews work throughout the Wasatch Front and surrounding communities.</p>
            <ul class="area-list area-list--dark">${site.serviceAreas.map((a) => html`<li>${a}</li>`)}</ul>
            <p class="area__note">Not sure if we cover your area? <a href="${url('contact/')}">Ask us</a> — we travel for the right project.</p>
          </div>
          <div class="area__map" data-reveal style="--d:1">${utahMap()}</div>
        </div>
      </section>

      ${testimonialsSection()}
    `,
  };
}
