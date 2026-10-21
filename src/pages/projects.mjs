import { html } from '../lib/html.mjs';
import { ctx } from '../lib/ctx.mjs';
import { pageHero, projectCard, projectData, lightbox, testimonialsSection } from '../lib/components.mjs';

export default function projects() {
  const { site, services, projects: list } = ctx;
  const crumbs = [{ label: 'Projects', path: 'projects/' }];
  const used = services.filter((s) => list.some((p) => p.service === s.slug));
  return {
    path: 'projects/',
    title: 'Projects',
    description: `Browse foundations, concrete walls, flatwork, commercial concrete and site work completed by ${site.name} across ${site.serviceAreaLabel}.`,
    crumbs,
    body: html`
      ${pageHero({
        image: 'foundation-site',
        eyebrow: 'Our Work',
        title: 'Projects built to *stand the test of time.*',
        text: 'From custom-home foundations to commercial slabs and public plazas — a look at the work our crews deliver.',
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

      ${testimonialsSection()}
      ${projectData(list)}
      ${lightbox()}
    `,
    cta: { title: 'Have a project *in mind?*', text: 'Whether it’s a single slab or an entire site, we’d love to hear about it. Get a free, detailed estimate from our team.' },
  };
}

