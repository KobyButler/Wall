import { html } from '../lib/html.mjs';
import { ctx, telHref } from '../lib/ctx.mjs';
import { pageHero, addressLine } from '../lib/components.mjs';

// PLACEHOLDER: a general-purpose template — have the client review it.
export default function privacy() {
  const { site } = ctx;
  const crumbs = [{ label: 'Privacy Policy', path: 'privacy/' }];
  const updated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return {
    path: 'privacy/',
    title: 'Privacy Policy',
    description: `How ${site.legalName} collects, uses and protects information submitted through this website.`,
    crumbs,
    cta: false,
    body: html`
      ${pageHero({ image: 'architectural-wall', eyebrow: 'Legal', title: 'Privacy *Policy*', crumbs })}
      <section class="section section--paper">
        <div class="container prose">
          <p class="prose__updated">Last updated: ${updated}</p>
          <p>${site.legalName} (“we,” “us,” or “our”) respects your privacy. This policy explains what information we collect through this website and how we use it.</p>
          <h2>Information we collect</h2>
          <p>When you submit an estimate request, job application or other form, we collect the information you provide — such as your name, phone number, email address, project details, resume and any files you upload. Like most websites, our hosting provider may also automatically log basic technical information such as your IP address, browser type and the pages you visit.</p>
          <h2>How we use your information</h2>
          <ul>
            <li>To respond to your inquiry and prepare estimates or proposals</li>
            <li>To evaluate employment applications</li>
            <li>To schedule site visits and communicate about your project</li>
            <li>To operate, maintain and improve our website</li>
          </ul>
          <h2>How we share information</h2>
          <p>We do not sell your personal information. We share it only with service providers that help us operate this website and process form submissions, or when required by law.</p>
          <h2>Third-party services</h2>
          <p>This site uses Google Fonts and an embedded Google Map, which may collect information as described in Google’s privacy policy. Form submissions are processed by a third-party form service on our behalf.</p>
          <h2>Data retention &amp; security</h2>
          <p>We keep submitted information only as long as needed for the purposes above and use reasonable measures to protect it. No method of transmission over the internet is completely secure.</p>
          <h2>Your choices</h2>
          <p>You may ask us to update or delete the personal information you’ve submitted by contacting us using the details below.</p>
          <h2>Contact us</h2>
          <p>${site.legalName}<br>${addressLine()}<br><a href="${telHref(site.phone)}">${site.phone}</a> · <a href="mailto:${site.email}">${site.email}</a></p>
        </div>
      </section>
    `,
  };
}
