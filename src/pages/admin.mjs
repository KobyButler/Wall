import { html } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { ctx, url } from '../lib/ctx.mjs';
import { btn, eyebrow, pageHero } from '../lib/components.mjs';

// Owner's admin page: opens the site editor (Pages CMS) and the photo-label mode.
// Not linked from the site and kept out of search engines.
export default function admin() {
  const { site } = ctx;
  const crumbs = [{ label: 'Site Admin', path: 'admin/' }];
  const steps = [
    { icon: 'pin', title: 'Find the photo', text: 'Turn on photo labels, then browse the website. Every photo shows a yellow label naming the editor section and field that controls it.' },
    { icon: 'clipboard', title: 'Click its label', text: 'The label opens that section of the site editor in a new tab (Site Photos, Services, Projects, Home Page or About Page). Find the field the label names.' },
    { icon: 'upload', title: 'Pick a different photo', text: 'Choose a photo from the photo library or upload a new one, then press Save. The website updates about two minutes later.' },
    { icon: 'layers', title: 'Add or delete photos', text: 'Use Media in the editor to upload new photos or delete ones you no longer want. Wide (landscape) photos work best for banners and backgrounds.' },
  ];
  return {
    path: 'admin/',
    title: 'Site Admin',
    description: `Manage the ${site.name} website.`,
    crumbs,
    noindex: true,
    cta: false,
    body: html`
      ${pageHero({ image: ctx.photos.contact.banner, eyebrow: 'Site Admin', title: 'Manage your *website.*', text: 'Change photos, projects, services, job openings, team members and company info.', crumbs })}

      <section class="section section--paper admin">
        <div class="container admin__grid">
          <div class="admin__intro" data-reveal>
            ${eyebrow('Start here')}
            <h2 class="h2">Two tools, <span class="hl">one website.</span></h2>
            <p class="lead">The site editor is where every change is made. Photo labels show you which part of the editor controls each photo on the site.</p>
            <div class="admin__actions">
              ${btn('Open the Site Editor', `${site.cmsUrl.replace(/\/$/, '')}/file/photos`, { iconName: 'arrowUpRight', attrs: 'target="_blank" rel="noopener"' })}
              ${btn('Turn On Photo Labels', url('?photo-labels=on'), { variant: 'outline', iconName: 'arrowRight' })}
            </div>
            <p class="admin__note">${icon('mail', { size: 18 })}<span>Sign in to the editor with the email address your invitation was sent to. Labels stay on while you browse; use “Turn off” at the bottom of the screen when you’re done.</span></p>
          </div>
          <ol class="admin__steps">${steps.map((s, i) => html`<li class="admin-step" data-reveal style="--d:${i}">
            <span class="admin-step__icon">${icon(s.icon, { size: 24 })}</span>
            <div><h3 class="admin-step__title"><span>${String(i + 1).padStart(2, '0')}</span>${s.title}</h3><p>${s.text}</p></div>
          </li>`)}</ol>
        </div>
      </section>
    `,
  };
}
