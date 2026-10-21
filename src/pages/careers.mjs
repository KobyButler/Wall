import { html } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { ctx, url, telHref } from '../lib/ctx.mjs';
import { img, btn, eyebrow, sectionHead, pageHero, checklist, applicationForm } from '../lib/components.mjs';
import { benefits, positions } from '../data/content.mjs';

export default function careers() {
  const { site } = ctx;
  const crumbs = [{ label: 'Careers', path: 'careers/' }];
  return {
    path: 'careers/',
    title: 'Careers',
    description: `Join the ${site.name} team. We’re hiring concrete finishers, form setters, equipment operators, laborers and CDL drivers in ${site.region}.`,
    crumbs,
    jsonLd: positions.map((p) => ({
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: p.title,
      description: `<p>${p.text}</p>`,
      employmentType: 'FULL_TIME',
      hiringOrganization: { '@type': 'Organization', name: site.legalName, sameAs: site.url },
      jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: site.address.city, addressRegion: site.address.region, addressCountry: 'US' } },
      datePosted: new Date().toISOString().slice(0, 10),
    })),
    body: html`
      ${pageHero({
        image: 'crew-tools',
        eyebrow: 'Careers',
        title: 'Build a career that’s *built to last.*',
        text: 'Steady, year-round work with a team that invests in its people. No experience? We’ll train the right attitude.',
        crumbs,
        actions: html`${btn('View Open Positions', '#positions')}${btn('Apply Now', '#apply', { variant: 'ghost', iconName: 'arrowUpRight' })}`,
      })}

      <section class="section section--paper careers-intro">
        <div class="container careers-intro__grid">
          <div class="careers-intro__media" data-reveal>
            <figure class="frame frame--brackets">${img('crew', { sizes: '(min-width: 1024px) 44vw, 92vw', alt: 'Three crew members in high-visibility vests on a job site' })}</figure>
          </div>
          <div class="careers-intro__copy" data-reveal style="--d:1">
            ${eyebrow('Life at Wall Concrete')}
            <h2 class="h2">Investing in our people, <span class="hl">always.</span></h2>
            <p class="lead">Our crews are the reason our work stands out — so we treat them that way.</p>
            <p>We offer competitive pay, real benefits, consistent hours and a clear path to grow. Whether you’re a seasoned finisher or looking for your first job in construction, you’ll learn from experienced foremen and work on projects you can point to for years.</p>
            ${checklist(['Promote-from-within culture', 'Safety-first job sites', 'Modern, well-kept equipment', 'Paid training & certifications'], 'checklist--2col')}
          </div>
        </div>
      </section>

      <section class="section section--ink benefits">
        <div class="container">
          ${sectionHead({ eyebrow: 'Benefits', title: 'More than *a paycheck.*', light: true, text: 'Full-time team members are eligible for a benefits package designed to support you and your family.' })}
          <ul class="benefit-grid">${benefits.map((b, i) => html`<li class="benefit-card" data-reveal style="--d:${i % 3}">
            <span class="benefit-card__icon">${icon(b.icon, { size: 28 })}</span>
            <h3 class="benefit-card__title">${b.title}</h3>
            <p>${b.text}</p>
          </li>`)}</ul>
        </div>
      </section>

      <section class="section section--light positions" id="positions">
        <div class="container positions__grid">
          <div class="positions__intro" data-reveal>
            ${eyebrow('Open Positions')}
            <h2 class="h2">Find your <span class="hl">spot</span> on the crew.</h2>
            <p>Don’t see your role listed? Submit a general application — we’re always looking for great people.</p>
            ${btn('General Application', '#apply', { variant: 'outline' })}
          </div>
          <div class="jobs">${positions.map((p) => html`<details class="job" data-reveal>
            <summary>
              <span class="job__head"><span class="job__title">${p.title}</span><span class="job__meta">${icon('briefcase', { size: 16 })}${p.type}<span class="dot" aria-hidden="true"></span>${icon('pin', { size: 16 })}${site.address.city} area</span></span>
              <span class="job__toggle" aria-hidden="true">${icon('plus', { size: 20 })}</span>
            </summary>
            <div class="job__body">
              <p>${p.text}</p>
              <div class="job__cols">
                <div><h4>What you’ll do</h4>${checklist(p.duties)}</div>
                <div><h4>What we’re looking for</h4>${checklist(p.reqs)}</div>
              </div>
              ${btn(`Apply for ${p.title}`, '#apply', { attrs: `data-apply="${p.title.replace(/"/g, '&quot;')}"` })}
            </div>
          </details>`)}</div>
        </div>
      </section>

      <section class="section section--paper apply" id="apply">
        <div class="container apply__grid">
          <div class="apply__intro" data-reveal>
            ${eyebrow('Apply Today')}
            <h2 class="h2">Ready to <span class="hl">join the team?</span></h2>
            <p>Fill out the short application and attach a resume if you have one. Here’s what happens next:</p>
            <ol class="steps">
              <li><span>01</span><div><strong>We review your application</strong><p>Every application is read by a real person on our team.</p></div></li>
              <li><span>02</span><div><strong>We give you a call</strong><p>If it’s a fit, we’ll reach out to set up a conversation.</p></div></li>
              <li><span>03</span><div><strong>Meet the crew</strong><p>A quick interview — and often a visit to a job site.</p></div></li>
              <li><span>04</span><div><strong>Start building</strong><p>Paperwork, safety orientation and your first day on the crew.</p></div></li>
            </ol>
            <p class="apply__call">Prefer to talk? Call <a href="${telHref(site.phone)}">${site.phone}</a>.</p>
          </div>
          <div class="form-card form-card--light" data-reveal style="--d:1">
            <div class="form-card__head">
              <h3 class="form-card__title">Employment application</h3>
              <p>Fields marked <span class="req">*</span> are required.</p>
            </div>
            ${applicationForm({ positions })}
          </div>
        </div>
      </section>
    `,
    cta: { title: 'Questions about *working here?*', text: 'Give our office a call or stop by — we’re happy to tell you more about the team and current openings.', image: 'sunset-scaffold' },
  };
}
