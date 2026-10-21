// Wall Concrete & Construction — site interactions. No dependencies.
const root = document.documentElement;
root.classList.add('js-ready');

const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = Boolean(navigator.connection && navigator.connection.saveData);
const isSmall = () => matchMedia('(max-width: 767px)').matches;
const pad = (n) => String(n).padStart(2, '0');
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Calls back with -1 / +1 for horizontal swipes on touch screens.
function onSwipe(el, callback) {
  let x = 0;
  let y = 0;
  el.addEventListener('touchstart', (e) => { x = e.touches[0].clientX; y = e.touches[0].clientY; }, { passive: true });
  el.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - x;
    const dy = e.changedTouches[0].clientY - y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) callback(dx < 0 ? 1 : -1);
  }, { passive: true });
}

/* Header: solid on scroll, hides on scroll down, mega menu ----------------- */
function initHeader() {
  const mast = $('[data-masthead]');
  if (!mast) return;
  const bar = $('[data-mobile-bar]');
  let lastY = scrollY;
  let ticking = false;

  const update = () => {
    const y = scrollY;
    const busy = root.classList.contains('menu-open') || $('.has-mega.is-open', mast);
    mast.classList.toggle('is-scrolled', y > 24);
    if (y > 480 && y > lastY + 6 && !busy) mast.classList.add('is-hidden');
    else if (y < lastY - 6 || y <= 480) mast.classList.remove('is-hidden');
    if (bar) bar.classList.toggle('is-visible', y > 160);
    lastY = y;
    ticking = false;
  };
  addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  mast.addEventListener('focusin', () => mast.classList.remove('is-hidden'));
  update();

  $$('[data-mega]', mast).forEach((item) => {
    const toggle = $('.mega-toggle', item);
    const set = (open) => {
      item.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      set(!item.classList.contains('is-open'));
    });
    document.addEventListener('click', (e) => { if (!item.contains(e.target)) set(false); });
    item.addEventListener('mouseleave', () => set(false));
    item.addEventListener('focusout', (e) => { if (!item.contains(e.relatedTarget)) set(false); });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && item.classList.contains('is-open')) {
        set(false);
        toggle.focus();
      }
    });
  });
}

/* Mobile menu (native <dialog>) -------------------------------------------- */
function initMobileMenu() {
  const dialog = $('#mobile-menu');
  const opener = $('[data-menu-open]');
  if (!dialog || !opener || !dialog.showModal) return;

  const finish = () => {
    dialog.classList.remove('is-closing');
    if (dialog.open) dialog.close();
  };
  const close = () => {
    if (!dialog.open) return;
    if (reduceMotion) return finish();
    dialog.classList.add('is-closing');
    dialog.addEventListener('animationend', finish, { once: true });
  };
  opener.addEventListener('click', () => {
    dialog.showModal();
    root.classList.add('menu-open');
    opener.setAttribute('aria-expanded', 'true');
  });
  dialog.addEventListener('close', () => {
    root.classList.remove('menu-open');
    opener.setAttribute('aria-expanded', 'false');
  });
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
  $$('[data-menu-close], a', dialog).forEach((el) => el.addEventListener('click', close));
  matchMedia('(min-width: 1100px)').addEventListener('change', (e) => { if (e.matches) finish(); });
}

/* Hero: video slideshow ----------------------------------------------------- */
function initHero() {
  const hero = $('[data-hero]');
  if (!hero) return;
  const slides = $$('[data-slide]', hero);
  const tabs = $$('[data-goto]', hero);
  const pauseBtn = $('[data-hero-pause]', hero);
  const interval = (Number(hero.dataset.interval) || 7) * 1000;
  hero.style.setProperty('--interval', `${interval / 1000}s`);

  let index = 0;
  let timer = null;
  let preloadTimer = null;
  let startedAt = 0;
  let remaining = interval;
  let userPaused = reduceMotion;
  let inView = true;
  let pageVisible = !document.hidden;

  const videoOf = (i) => $('video', slides[i]);
  const running = () => !userPaused && inView && pageVisible;

  const prepare = (i) => {
    const video = videoOf(i);
    if (!video || video.dataset.loaded || saveData) return video;
    video.dataset.loaded = '1';
    video.src = isSmall() ? video.dataset.srcSm : video.dataset.src;
    video.preload = 'auto';
    video.addEventListener('playing', () => slides[i].classList.add('is-playing'));
    return video;
  };

  const hold = () => {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
    remaining = Math.max(0, remaining - (performance.now() - startedAt));
  };
  const schedule = () => {
    clearTimeout(timer);
    timer = null;
    if (!running()) return;
    startedAt = performance.now();
    timer = setTimeout(() => go(index + 1), remaining);
  };
  const sync = () => {
    const video = running() ? prepare(index) : videoOf(index);
    if (video && video.dataset.loaded) running() ? video.play().catch(() => {}) : video.pause();
    hero.classList.toggle('is-paused', !running());
    if (pauseBtn) {
      pauseBtn.setAttribute('aria-pressed', String(userPaused));
      pauseBtn.setAttribute('aria-label', userPaused ? 'Play background video' : 'Pause background video');
    }
  };

  function go(next) {
    const prev = index;
    index = (next + slides.length) % slides.length;
    if (prev !== index) {
      const old = slides[prev];
      old.classList.remove('is-active');
      old.classList.add('is-leaving');
      setTimeout(() => {
        old.classList.remove('is-leaving');
        if (!old.classList.contains('is-active')) videoOf(prev)?.pause();
      }, 1400);
      const slide = slides[index];
      slide.classList.remove('is-leaving');
      slide.style.animation = 'none';
      void slide.offsetWidth; // restart the Ken Burns zoom
      slide.style.animation = '';
      slide.classList.add('is-active');
      const video = videoOf(index);
      if (video && video.dataset.loaded) video.currentTime = 0;
      tabs[prev].classList.remove('is-active');
      tabs[prev].removeAttribute('aria-current');
      tabs[index].classList.add('is-active');
      tabs[index].setAttribute('aria-current', 'true');
    }
    remaining = interval;
    sync();
    schedule();
    clearTimeout(preloadTimer);
    preloadTimer = setTimeout(() => { if (running()) prepare((index + 1) % slides.length); }, 2500);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => go(i));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[n].focus();
      go(n);
    });
  });
  $('[data-hero-prev]', hero)?.addEventListener('click', () => go(index - 1));
  $('[data-hero-next]', hero)?.addEventListener('click', () => go(index + 1));
  pauseBtn?.addEventListener('click', () => {
    userPaused = !userPaused;
    userPaused ? hold() : schedule();
    sync();
  });
  onSwipe($('.hero__media', hero).parentElement, (dir) => go(index + dir));

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    inView ? schedule() : hold();
    sync();
  }, { threshold: 0.15 }).observe(hero);
  document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
    pageVisible ? schedule() : hold();
    sync();
  });

  go(0);
}

/* Background videos that load when scrolled into view ---------------------- */
function initLazyVideos() {
  const videos = $$('video[data-lazy-video]');
  if (!videos.length || saveData || reduceMotion) return;
  const io = new IntersectionObserver((entries) => {
    for (const { target: video, isIntersecting } of entries) {
      if (isIntersecting) {
        if (!video.src) {
          video.src = isSmall() ? video.dataset.srcSm : video.dataset.src;
          video.addEventListener('playing', () => video.classList.add('is-playing'), { once: true });
        }
        video.play().catch(() => {});
      } else if (video.src) {
        video.pause();
      }
    }
  }, { rootMargin: '200px 0px' });
  videos.forEach((v) => io.observe(v));
}

/* Scroll reveal + counters --------------------------------------------------- */
function initReveal() {
  const els = $$('[data-reveal]');
  if (!('IntersectionObserver' in window)) return els.forEach((el) => el.classList.add('is-revealed'));
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-revealed');
      io.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  els.forEach((el) => io.observe(el));
}

function initCounters() {
  const els = $$('[data-count]');
  if (!els.length || reduceMotion) return;
  els.forEach((el) => { el.textContent = '0'; });
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      io.unobserve(entry.target);
      const el = entry.target;
      const target = Number(el.dataset.count);
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / 1800);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4))).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, { threshold: 0.6 });
  els.forEach((el) => io.observe(el));
}

/* Horizontal carousel (scroll-snap + drag + buttons) ------------------------ */
function initCarousels() {
  $$('[data-carousel]').forEach((wrap) => {
    const track = $('[data-carousel-track]', wrap);
    if (!track) return;
    const prev = $('[data-carousel-prev]', wrap);
    const next = $('[data-carousel-next]', wrap);
    const progress = $('[data-carousel-progress]', wrap);
    const step = () => {
      const card = track.firstElementChild;
      return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || '0') : track.clientWidth * 0.8;
    };
    const sync = () => {
      const max = track.scrollWidth - track.clientWidth;
      const visible = track.clientWidth / track.scrollWidth;
      const p = max > 0 ? track.scrollLeft / max : 1;
      if (progress) progress.style.transform = `scaleX(${Math.min(1, visible + p * (1 - visible))})`;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
    };
    prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    addEventListener('resize', sync);
    sync();

    // Mouse drag-to-scroll; touch devices already scroll natively.
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    track.addEventListener('dragstart', (e) => e.preventDefault());
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = track.scrollLeft;
    });
    addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        track.classList.add('is-dragging');
      }
      if (moved) track.scrollLeft = startLeft - dx;
    });
    addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('is-dragging');
    });
    track.addEventListener('click', (e) => {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    }, true);
  });
}

/* Testimonial slider --------------------------------------------------------- */
function initSliders() {
  $$('[data-slider]').forEach((wrap) => {
    const slides = $$('.t-slide', wrap);
    const dots = $$('[data-slider-dot]', wrap);
    if (slides.length < 2) return;
    let current = 0;
    let timer = null;
    const show = (n) => {
      current = (n + slides.length) % slides.length;
      slides.forEach((s, i) => {
        s.classList.toggle('is-active', i === current);
        i === current ? s.removeAttribute('aria-hidden') : s.setAttribute('aria-hidden', 'true');
      });
      dots.forEach((d, i) => {
        d.classList.toggle('is-active', i === current);
        i === current ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current');
      });
    };
    const auto = () => {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(() => show(current + 1), 8000);
    };
    $('[data-slider-prev]', wrap)?.addEventListener('click', () => { show(current - 1); auto(); });
    $('[data-slider-next]', wrap)?.addEventListener('click', () => { show(current + 1); auto(); });
    dots.forEach((d) => d.addEventListener('click', () => { show(Number(d.dataset.sliderDot)); auto(); }));
    wrap.addEventListener('mouseenter', () => clearInterval(timer));
    wrap.addEventListener('mouseleave', auto);
    wrap.addEventListener('focusin', () => clearInterval(timer));
    onSwipe(wrap, (dir) => { show(current + dir); auto(); });
    auto();
  });
}

/* Project lightbox ----------------------------------------------------------- */
function initLightbox() {
  const dialog = $('#lightbox');
  const dataEl = $('#project-data');
  if (!dialog || !dataEl || !dialog.showModal) return;
  const projects = new Map(JSON.parse(dataEl.textContent).map((p) => [p.slug, p]));
  const img = $('.lightbox__img', dialog);
  const field = (key) => $(`[data-lb="${key}"]`, dialog);
  let list = [];
  let pos = 0;
  let opener = null;

  const visibleSlugs = () => [...new Set($$('[data-project]').filter((b) => !b.closest('[hidden]')).map((b) => b.dataset.project))];
  const render = () => {
    const p = projects.get(list[pos]);
    if (!p) return;
    img.classList.add('is-loading');
    img.onload = () => img.classList.remove('is-loading');
    img.width = p.w;
    img.height = p.h;
    img.srcset = p.srcset;
    img.src = p.src;
    img.alt = p.title;
    field('title').textContent = p.title;
    field('service').textContent = p.service;
    field('service').href = p.serviceUrl;
    field('location').textContent = p.location;
    field('sector').textContent = p.sector;
    field('text').textContent = p.text;
    field('scope').replaceChildren(...p.scope.map((s) => Object.assign(document.createElement('li'), { textContent: s })));
    field('count').textContent = `${pad(pos + 1)} / ${pad(list.length)}`;
    history.replaceState(null, '', `#${p.slug}`);
  };
  const open = (slug, trigger) => {
    list = visibleSlugs();
    if (!list.includes(slug)) list.unshift(slug);
    pos = list.indexOf(slug);
    opener = trigger;
    render();
    dialog.showModal();
    root.classList.add('lightbox-open');
  };
  const move = (dir) => {
    pos = (pos + dir + list.length) % list.length;
    render();
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-project]');
    if (!trigger) return;
    e.preventDefault();
    open(trigger.dataset.project, trigger);
  });
  $('[data-lb-prev]', dialog).addEventListener('click', () => move(-1));
  $('[data-lb-next]', dialog).addEventListener('click', () => move(1));
  $('[data-lb-close]', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') move(-1);
    if (e.key === 'ArrowRight') move(1);
  });
  dialog.addEventListener('close', () => {
    root.classList.remove('lightbox-open');
    history.replaceState(null, '', location.pathname + location.search);
    opener?.focus({ preventScroll: true });
  });
  onSwipe($('.lightbox__figure', dialog), move);

  const hash = decodeURIComponent(location.hash.slice(1));
  if (projects.has(hash)) open(hash, $(`[data-project="${CSS.escape(hash)}"]`));
}

/* Project filters ------------------------------------------------------------ */
function initFilters() {
  const group = $('[data-filters]');
  const grid = $('[data-filter-grid]');
  if (!group || !grid) return;
  const items = $$('[data-cat]', grid);
  const count = $('[data-filter-count]');
  const empty = $('[data-filter-empty]');

  const apply = (cat, animate = true) => {
    const run = () => {
      let shown = 0;
      for (const el of items) {
        const show = cat === 'all' || el.dataset.cat === cat;
        el.hidden = !show;
        if (show) {
          shown++;
          el.classList.add('is-revealed');
        }
      }
      $$('[data-filter]', group).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === cat)));
      if (count) count.textContent = `Showing ${shown} project${shown === 1 ? '' : 's'}`;
      if (empty) empty.hidden = shown > 0;
    };
    if (animate && document.startViewTransition && !reduceMotion) {
      items.forEach((el, i) => { el.style.viewTransitionName = `project-${i}`; });
      document.startViewTransition(run).finished.finally(() => items.forEach((el) => { el.style.viewTransitionName = ''; }));
    } else {
      run();
    }
    const url = new URL(location.href);
    cat === 'all' ? url.searchParams.delete('service') : url.searchParams.set('service', cat);
    history.replaceState(null, '', url);
  };

  group.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (btn) apply(btn.dataset.filter);
  });
  const initial = new URLSearchParams(location.search).get('service');
  if (initial && $(`[data-filter="${CSS.escape(initial)}"]`, group)) apply(initial, false);
}

/* Forms: validation, uploads, AJAX submit ----------------------------------- */
const MAX_FILE = 10 * 1024 * 1024;
const CHECK_SVG = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>';

function initForms() {
  $$('[data-form]').forEach((form) => {
    const status = $('.form__status', form);
    const contactLine = `call us at <a href="${form.dataset.tel}">${escapeHtml(form.dataset.phone)}</a> or email <a href="mailto:${escapeHtml(form.dataset.email)}">${escapeHtml(form.dataset.email)}</a>`;

    $$('[data-dropzone]', form).forEach((zone) => {
      const input = $('input[type="file"]', zone);
      const list = $('[data-files]', zone);
      input.addEventListener('change', () => {
        list.replaceChildren(...[...input.files].map((f) => Object.assign(document.createElement('span'), { textContent: f.name })));
        check(input);
      });
      ['dragenter', 'dragover'].forEach((t) => zone.addEventListener(t, () => zone.classList.add('is-over')));
      ['dragleave', 'drop'].forEach((t) => zone.addEventListener(t, () => zone.classList.remove('is-over')));
    });

    const controls = () => $$('input, select, textarea', form).filter((el) => el.name && el.type !== 'hidden' && !el.closest('.form__hp'));

    const messageFor = (el) => {
      const v = el.validity;
      if (v.valueMissing) {
        if (el.type === 'checkbox') return 'Please confirm to continue.';
        if (el.type === 'radio') return 'Please choose an option.';
        if (el.tagName === 'SELECT') return 'Please make a selection.';
        return 'This field is required.';
      }
      if (v.typeMismatch && el.type === 'email') return 'Please enter a valid email address.';
      if (el.type === 'tel' && el.value && el.value.replace(/\D/g, '').length < 10) return 'Please enter a valid phone number, including area code.';
      if (el.type === 'file') {
        const big = [...el.files].find((f) => f.size > MAX_FILE);
        if (big) return `${big.name} is larger than 10 MB.`;
      }
      return el.checkValidity() ? '' : el.validationMessage;
    };

    function check(el) {
      const msg = messageFor(el);
      const wrap = el.closest('.field');
      const err = wrap && $('.field__error', wrap);
      if (el.type === 'radio') {
        $$(`[name="${el.name}"]`, form).forEach((r) => r.setAttribute('aria-invalid', String(Boolean(msg))));
        wrap?.classList.toggle('is-invalid', Boolean(msg));
      } else {
        el.setAttribute('aria-invalid', String(Boolean(msg)));
      }
      if (err) err.textContent = msg;
      return !msg;
    }

    form.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') check(e.target); });
    form.addEventListener('change', (e) => { if (e.target.matches('input[type="radio"], select') && e.target.getAttribute('aria-invalid')) check(e.target); });
    form.addEventListener('focusout', (e) => {
      const el = e.target;
      if (el.matches('input:not([type="radio"], [type="checkbox"], [type="file"]), textarea') && el.value) check(el);
    });

    const success = () => {
      const first = (form.elements.name?.value || form.elements.first_name?.value || '').trim().split(' ')[0];
      const panel = document.createElement('div');
      panel.className = 'form-success';
      panel.tabIndex = -1;
      panel.setAttribute('role', 'status');
      panel.innerHTML = `<span class="form-success__icon">${CHECK_SVG}</span><h3>Thank you${first ? `, ${escapeHtml(first)}` : ''}!</h3><p>${escapeHtml(form.dataset.success)}</p>`;
      form.replaceWith(panel);
      panel.focus();
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      const radios = new Set();
      let firstInvalid = null;
      for (const el of controls()) {
        if (el.type === 'radio') {
          if (radios.has(el.name)) continue;
          radios.add(el.name);
        }
        if (!check(el) && !firstInvalid) firstInvalid = el;
      }
      if (firstInvalid) {
        firstInvalid.focus();
        status.textContent = 'Please fix the highlighted fields and try again.';
        return;
      }
      if ($('[name="_gotcha"]', form)?.value) return success(); // likely a bot

      const endpoint = form.getAttribute('action');
      if (!endpoint) {
        status.innerHTML = `Online submissions aren’t connected yet. Please ${contactLine} — we’d love to hear from you.`;
        console.warn('Form endpoint not configured: set site.forms in src/data/site.mjs');
        return;
      }
      form.classList.add('is-sending');
      try {
        const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        success();
      } catch {
        status.innerHTML = `Sorry — your message didn’t go through. Please try again, or ${contactLine}.`;
      } finally {
        form.classList.remove('is-sending');
      }
    });
  });

  // "Apply for …" buttons pre-select the position on the application form.
  $$('[data-apply]').forEach((btn) => btn.addEventListener('click', () => {
    const select = $('#app-position');
    if (select) select.value = btn.dataset.apply;
    setTimeout(() => $('#app-first')?.focus({ preventScroll: true }), 700);
  }));
}

/* Small things --------------------------------------------------------------- */
function initMisc() {
  $$('[data-to-top]').forEach((b) => b.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })));
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
}

for (const init of [initHeader, initMobileMenu, initHero, initLazyVideos, initReveal, initCounters, initCarousels, initSliders, initLightbox, initFilters, initForms, initMisc]) {
  try {
    init();
  } catch (err) {
    console.error(err);
  }
}
