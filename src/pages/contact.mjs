import { html } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { ctx, url, telHref } from '../lib/ctx.mjs';
import { eyebrow, pageHero, estimateForm, faqList, faqJsonLd, addressLine, mapsHref, utahMap } from '../lib/components.mjs';
import { generalFaqs } from '../data/content.mjs';

export default function contact() {
  const { site } = ctx;
  const crumbs = [{ label: 'Contact', path: 'contact/' }];
  const cards = [
    { icon: 'phone', label: 'Call us', value: site.phone, href: telHref(site.phone), note: 'Talk to our office directly' },
    { icon: 'mail', label: 'Email us', value: site.email, href: `mailto:${site.email}`, note: 'Send plans, photos or questions' },
    { icon: 'pin', label: 'Visit our office', value: addressLine(), href: mapsHref(), note: 'Get directions', external: true },
    { icon: 'clock', label: 'Office hours', value: `${site.hours[0].days}: ${site.hours[0].time}`, note: site.hours.slice(1).map((h) => `${h.days}: ${h.time}`).join(' · ') },
  ];
  return {
    path: 'contact/',
    title: 'Contact & Free Estimates',
    description: `Request a free concrete estimate from ${site.name}. Call ${site.phone} or send us your project details online.`,
    crumbs,
    jsonLd: [faqJsonLd(generalFaqs)],
    bodyClass: 'page--contact',
    cta: false,
    body: html`
      ${pageHero({
        image: 'power-trowel',
        eyebrow: 'Contact Us',
        title: 'Let’s build something *solid together.*',
        text: 'Tell us about your project and we’ll get back to you with a free, detailed estimate.',
        crumbs,
      })}

      <section class="contact-cards-wrap">
        <div class="container">
          <ul class="contact-cards">${cards.map((c, i) => html`<li class="contact-card" data-reveal style="--d:${i}">
            <span class="contact-card__icon">${icon(c.icon, { size: 24 })}</span>
            <span class="contact-card__label">${c.label}</span>
            ${c.href ? html`<a class="contact-card__value" href="${c.href}"${c.external ? html` target="_blank" rel="noopener"` : ''}>${c.value}</a>` : html`<span class="contact-card__value">${c.value}</span>`}
            <span class="contact-card__note">${c.note}</span>
          </li>`)}</ul>
        </div>
      </section>

      <section class="section section--paper contact-main" id="estimate">
        <div class="container contact-main__grid">
          <div class="form-card form-card--light" data-reveal>
            <div class="form-card__head">
              ${eyebrow('Free Estimate')}
              <h2 class="h2 h2--sm">Request your <span class="hl">free estimate</span></h2>
              <p>Share as much as you can — plans, photos and measurements help us give you an accurate number. Fields marked <span class="req">*</span> are required.</p>
            </div>
            ${estimateForm()}
          </div>
          <aside class="contact-aside" data-reveal style="--d:1">
            <div class="aside-card aside-card--dark">
              <h3 class="aside-card__title">What happens next?</h3>
              <ol class="steps steps--light">
                <li><span>01</span><div><strong>We review your request</strong><p>A member of our team looks over the details you send.</p></div></li>
                <li><span>02</span><div><strong>We schedule a site visit</strong><p>We’ll call to set up a time to see the site and answer questions.</p></div></li>
                <li><span>03</span><div><strong>You get a detailed estimate</strong><p>Clear, itemized pricing and a realistic schedule.</p></div></li>
              </ol>
            </div>
            <div class="aside-card">
              <h3 class="aside-card__title">Service area</h3>
              ${utahMap()}
              <ul class="area-list area-list--dark">${site.serviceAreas.map((a) => html`<li>${a}</li>`)}</ul>
            </div>
            <a class="aside-card aside-card--link" href="${url('careers/')}">
              <span class="aside-card__icon">${icon('hardhat', { size: 26 })}</span>
              <span><strong>Looking for a job?</strong><small>See open positions and apply online</small></span>
              ${icon('arrowRight', { size: 20 })}
            </a>
          </aside>
        </div>
      </section>

      <section class="map-section" aria-label="Map">
        <iframe title="Map showing ${site.name}" src="https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </section>

      <section class="section section--light faq-section">
        <div class="container faq-section__grid">
          <div class="faq-section__intro" data-reveal>
            ${eyebrow('FAQ')}
            <h2 class="h2">Frequently asked <span class="hl">questions.</span></h2>
            <p>Can’t find what you’re looking for? Call us at <a href="${telHref(site.phone)}">${site.phone}</a>.</p>
          </div>
          ${faqList(generalFaqs)}
        </div>
      </section>
    `,
  };
}
