import { html } from '../lib/html.mjs';
import { ctx, url } from '../lib/ctx.mjs';
import { img, btn } from '../lib/components.mjs';

export default function notFound() {
  return {
    path: '404.html',
    title: 'Page Not Found',
    noindex: true,
    cta: false,
    bodyClass: 'page--404',
    body: html`<section class="not-found">
      <div class="not-found__media">${img('foundation-forms', { eager: true })}</div>
      <div class="not-found__shade"></div>
      <div class="container not-found__inner">
        <p class="not-found__code" aria-hidden="true">404</p>
        <h1 class="h2 h2--xl">This page didn’t <span class="hl">set up.</span></h1>
        <p>The page you’re looking for may have moved or no longer exists. Let’s get you back on solid ground.</p>
        <div class="actions">
          ${btn('Back to Home', url(''))}
          ${btn('Our Services', url('services/'), { variant: 'ghost', iconName: 'arrowUpRight' })}
          ${btn('Contact Us', url('contact/'), { variant: 'ghost', iconName: 'arrowUpRight' })}
        </div>
        <ul class="not-found__links">${ctx.services.map((s) => html`<li><a href="${url(`services/${s.slug}/`)}">${s.name}</a></li>`)}</ul>
      </div>
    </section>`,
  };
}
