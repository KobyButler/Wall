import { html } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { ctx } from '../lib/ctx.mjs';
import { sectionHead, pageHero, projectCard, projectData, lightbox } from '../lib/components.mjs';

const groupIcons = { 'Highways & Transportation': 'road', 'National Parks': 'mountain', 'Industrial & Commercial': 'building', 'Water & Utilities': 'tank', Energy: 'energy' };

// Named jobs from the company resume, grouped by category, with current work called out.
function trackRecord() {
  const { experience, site } = ctx;
  if (!experience.length) return '';
  const done = experience.filter((e) => !e.current);
  const current = experience.filter((e) => e.current);
  const groups = [...new Set(done.map((e) => e.category))].map((name) => ({ name, items: done.filter((e) => e.category === name) }));
  const item = (e) => html`<li><strong>${e.name}</strong>${e.detail ? html`<span>${e.detail}</span>` : ''}</li>`;
  return html`<section class="section section--light experience" id="track-record">
    <div class="container">
      ${sectionHead({ eyebrow: 'Track Record', title: 'A few of the *larger projects* we’ve completed.', text: `Highways, national parks, industrial buildings and more, built by our crews across ${site.serviceAreaLabel}.` })}
      ${groups.length ? html`<div class="experience__grid">${groups.map((g, i) => html`<div class="exp-group" data-reveal style="--d:${i}">
        <div class="exp-group__head"><span class="exp-group__icon">${icon(groupIcons[g.name] || 'check', { size: 24 })}</span><h3 class="exp-group__title">${g.name}</h3></div>
        <ul class="exp-list">${g.items.map(item)}</ul>
      </div>`)}</div>` : ''}
      ${current.length ? html`<div class="exp-current" data-reveal>
        <h3 class="exp-current__label"><span class="exp-current__pulse" aria-hidden="true"></span>Currently under construction</h3>
        <ul class="exp-current__list">${current.map(item)}</ul>
      </div>` : ''}
    </div>
  </section>`;
}

export default function projects() {
  const { site, services, projects: list } = ctx;
  const crumbs = [{ label: 'Projects', path: 'projects/' }];
  const used = services.filter((s) => list.some((p) => p.service === s.slug));
  return {
    path: 'projects/',
    title: 'Projects',
    description: `Browse water tanks, structural foundations, bridge decks, laser-screeded slabs, curb and more built by ${site.name} across ${site.serviceAreaLabel}.`,
    crumbs,
    body: html`
      ${pageHero({
        image: 'tank-forms-pump',
        eyebrow: 'Our Work',
        title: 'Projects built to *stand the test of time.*',
        text: 'From water tanks and bridge decks to warehouse floors and slip-formed curb — a look at the work our crews deliver.',
        crumbs,
      })}

      <section class="section section--paper projects-page">
        <div class="container">
          <div class="filter-bar" data-reveal>
            <div class="filters" role="group" aria-label="Filter projects by service" data-filters>
              <button type="button" class="filter" data-filter="all" aria-pressed="true">All <span>${list.length}</span></button>
              ${used.map((s) => html`<button type="button" class="filter" data-filter="${s.slug}" aria-pressed="false">${s.menuName} <span>${list.filter((p) => p.service === s.slug).length}</span></button>`)}
            </div>
            <p class="filter-count" aria-live="polite" data-filter-count>Showing ${list.length} projects</p>
          </div>
          <div class="project-grid" data-filter-grid>
            ${list.map((p) => projectCard(p))}
          </div>
          <p class="projects-page__empty" data-filter-empty hidden>No projects in this category yet — check back soon.</p>
        </div>
      </section>

      ${trackRecord()}

      ${projectData(list)}
      ${lightbox()}
    `,
    cta: { title: 'Have a project *in mind?*', text: 'Whether it’s a single slab or an entire site, we’d love to hear about it. Get a free, detailed estimate from our team.' },
  };
}

