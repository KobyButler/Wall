#!/usr/bin/env node
// Static site build — no dependencies.
//
//   node build.mjs           build the site into ./dist
//   node build.mjs --serve   build, serve on http://localhost:4321, rebuild + live-reload on change
//
// Pages live in src/pages/*.mjs. Each default-exports a function returning a
// page object ({ path, title, description, body, ... }) or an array of them.

import fs from 'node:fs/promises';
import { existsSync, watch, createReadStream, statSync } from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const PUBLIC = path.join(ROOT, 'public');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 4321;
const args = process.argv.slice(2);

const load = async (rel) => (await import(pathToFileURL(path.join(SRC, rel)).href)).default;

const hashFile = async (file) => crypto.createHash('md5').update(await fs.readFile(file)).digest('hex').slice(0, 8);

// '/', 'wall', '/wall' and '/wall/' all become a path with leading and trailing slashes.
const normalizeBase = (base) => `/${String(base ?? '').replace(/^\/+|\/+$/g, '')}/`.replace(/\/+/g, '/');

async function build({ dev = false } = {}) {
  const started = Date.now();
  const { ctx } = await import(pathToFileURL(path.join(SRC, 'lib/ctx.mjs')).href);
  const { documentHtml } = await import(pathToFileURL(path.join(SRC, 'lib/layout.mjs')).href);
  const projectsModule = await import(pathToFileURL(path.join(SRC, 'data/projects.mjs')).href);

  ctx.site = await load('data/site.mjs');
  ctx.services = await load('data/services.mjs');
  ctx.projects = projectsModule.default;
  ctx.images = JSON.parse(await fs.readFile(path.join(SRC, 'data/images.json'), 'utf8'));
  // Deploy-time overrides, set by the GitHub Pages workflow (.github/workflows/deploy.yml).
  if (process.env.SITE_URL) ctx.site.url = process.env.SITE_URL;
  ctx.base = normalizeBase(process.env.BASE_PATH ?? ctx.site.basePath);
  ctx.noindex = process.env.NOINDEX === '1';
  ctx.dev = dev;

  await fs.rm(DIST, { recursive: true, force: true });
  await fs.cp(PUBLIC, DIST, { recursive: true });

  for (const file of ['css/main.css', 'js/main.js']) {
    ctx.versions[file] = await hashFile(path.join(PUBLIC, 'assets', file));
  }

  const pageFiles = (await fs.readdir(path.join(SRC, 'pages'))).filter((f) => f.endsWith('.mjs')).sort();
  const pages = [];
  for (const file of pageFiles) {
    const render = await load(`pages/${file}`);
    const result = render();
    pages.push(...(Array.isArray(result) ? result : [result]));
  }

  for (const page of pages) {
    const out = page.path.endsWith('.html') ? path.join(DIST, page.path) : path.join(DIST, page.path, 'index.html');
    await fs.mkdir(path.dirname(out), { recursive: true });
    await fs.writeFile(out, documentHtml(page));
  }

  const siteUrl = ctx.site.url.replace(/\/$/, '') + ctx.base;
  const today = new Date().toISOString().slice(0, 10);
  const indexable = pages.filter((p) => !p.noindex && !p.path.endsWith('.html'));
  await fs.writeFile(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable
      .map((p) => `  <url><loc>${siteUrl}${p.path}</loc><lastmod>${today}</lastmod></url>`)
      .join('\n')}\n</urlset>\n`
  );
  await fs.writeFile(
    path.join(DIST, 'robots.txt'),
    ctx.noindex ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`
  );

  console.log(`✔ Built ${pages.length} pages into dist/ in ${Date.now() - started}ms (base ${ctx.base}${ctx.noindex ? ', noindex' : ''})`);
  if (!dev) warnPlaceholders(ctx, projectsModule);
}

async function warnPlaceholders(ctx, projectsModule) {
  const { testimonials } = await import(pathToFileURL(path.join(SRC, 'data/content.mjs')).href);
  const { site } = ctx;
  const warnings = [];
  if (/555-01\d\d/.test(site.phone)) warnings.push(`phone is a placeholder (${site.phone})`);
  if (/example\.(com|org)/.test(site.email)) warnings.push(`email is a placeholder (${site.email})`);
  if (/example\.com/.test(site.url)) warnings.push(`site url is a placeholder (${site.url})`);
  if (!site.forms.estimate || !site.forms.careers) warnings.push('form endpoints are not set (site.forms) — forms will ask visitors to call or email');
  if (testimonials.placeholder) warnings.push('testimonials are placeholders (src/data/content.mjs)');
  if (projectsModule.placeholder) warnings.push('projects are sample entries (src/data/projects.mjs)');
  if (warnings.length) {
    console.warn(`\n⚠ ${warnings.length} placeholder item(s) to replace before launch:`);
    for (const w of warnings) console.warn(`  • ${w}`);
    console.warn('  (search the src/ folder for "PLACEHOLDER" for the full list)\n');
  }
}

// ---------------------------------------------------------------------------
// Dev server
// ---------------------------------------------------------------------------
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.mp4': 'video/mp4',
  '.webm': 'video/webm', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
};

function serve() {
  const clients = new Set();
  const server = http.createServer((req, res) => {
    const reqPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (reqPath === '/__livereload') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
      res.write('retry: 500\n\n');
      clients.add(res);
      req.on('close', () => clients.delete(res));
      return;
    }
    let file = path.join(DIST, reqPath);
    if (!file.startsWith(DIST)) return res.writeHead(403).end();
    if (existsSync(file) && statSync(file).isDirectory()) {
      if (!reqPath.endsWith('/')) return res.writeHead(301, { Location: reqPath + '/' }).end();
      file = path.join(file, 'index.html');
    }
    let status = 200;
    if (!existsSync(file)) {
      file = path.join(DIST, '404.html');
      status = 404;
    }
    const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const { size } = statSync(file);
    const range = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
    if (range && status === 200) {
      const start = range[1] ? Number(range[1]) : 0;
      const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
      res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 });
      return createReadStream(file, { start, end }).pipe(res);
    }
    res.writeHead(status, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' });
    createReadStream(file).pipe(res);
  });

  // Each rebuild runs in a fresh process so edited modules are re-imported.
  let timer, running = false, queued = false;
  const rebuild = () => {
    if (running) return void (queued = true);
    running = true;
    const child = spawn(process.execPath, [fileURLToPath(import.meta.url), '--child-dev'], { stdio: 'inherit' });
    child.on('exit', (code) => {
      running = false;
      if (code === 0) for (const c of clients) c.write('data: reload\n\n');
      if (queued) {
        queued = false;
        rebuild();
      }
    });
  };
  for (const dir of [SRC, PUBLIC]) {
    watch(dir, { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(rebuild, 120);
    });
  }
  server.listen(PORT, () => console.log(`\n  Dev server running at http://localhost:${PORT}\n  Watching src/ and public/ for changes…\n`));
}

if (args.includes('--child-dev')) {
  await build({ dev: true }).catch((e) => {
    console.error(e);
    process.exit(1);
  });
} else if (args.includes('--serve')) {
  await build({ dev: true });
  serve();
} else {
  await build().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
