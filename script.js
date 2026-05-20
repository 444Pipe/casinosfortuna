// Scroll progress bar
(() => {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);
  let ticking = false;
  function update() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + '%';
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();

// Navbar shrink on scroll + hide scroll-hint after user scrolls
(() => {
  const navbar = document.querySelector('.navbar');
  let ticking = false;
  function update() {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 60);
    document.body.classList.toggle('scrolled-past', y > 120);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();

// Reveal on scroll — auto-applies classes to common selectors
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  // Auto-apply reveal classes
  const reveals = [
    ['.section-head, .section-title, .section-sub', 'reveal'],
    ['.about-grid > div:first-child', 'reveal-left'],
    ['.about-card', 'reveal-right'],
    ['.feature-bento', 'reveal-stagger'],
    ['.sede-grid', 'reveal-stagger'],
    ['.wplay-visual', 'reveal-left'],
    ['.wplay-grid > div:last-child', 'reveal-right'],
    ['.news-head', 'reveal'],
    ['.news-grid', 'reveal-stagger'],
    ['.info-grid', 'reveal-stagger'],
    ['.fin-grid > div:first-child', 'reveal-left'],
    ['.fin-files', 'reveal-right'],
    ['.map-wrap', 'reveal-scale'],
    ['.contact-grid > div:first-child', 'reveal-left'],
    ['.contact-form', 'reveal-right'],
    ['.video-grid > .video-wrap', 'reveal-left'],
    ['.video-grid > div:not(.video-wrap)', 'reveal-right'],
    ['.gallery-bento', 'reveal-stagger'],
    ['.feature-grid', 'reveal-stagger'],
    ['.notice', 'reveal-scale'],
    ['.about-stats > div', 'reveal'],
  ];
  reveals.forEach(([sel, cls]) => {
    document.querySelectorAll(sel).forEach(el => el.classList.add(cls));
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger')
    .forEach(el => observer.observe(el));
})();

// Counter animation for stats
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('[data-count]');
  if (!items.length) return;
  function animate(el) {
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = prefix + target + suffix; return; }
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.floor(target * eased);
      el.textContent = prefix + value + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  items.forEach(el => {
    el.textContent = (el.dataset.prefix || '') + '0' + (el.dataset.suffix || '');
    obs.observe(el);
  });
})();

// Hero parallax (subtle)
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  const heroBg = document.querySelector('.hero .hero-bg');
  const heroRays = document.querySelector('.hero .hero-rays');
  const heroContent = document.querySelector('.hero .hero-content');
  if (!heroBg && !heroContent) return;
  let ticking = false;
  function update() {
    const y = window.scrollY;
    if (y < 800) {
      if (heroBg) heroBg.style.transform = `translateY(${y * 0.35}px)`;
      if (heroRays) heroRays.style.transform = `translateY(${y * 0.5}px)`;
      if (heroContent) heroContent.style.transform = `translateY(${y * 0.15}px)`;
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();

// Mobile menu toggle
(() => {
  const burger = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (!burger || !links) return;
  burger.addEventListener('click', () => {
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

// Video sound toggle
(() => {
  const btn = document.getElementById('videoSound');
  if (!btn) return;
  const video = btn.previousElementSibling;
  btn.addEventListener('click', () => {
    video.muted = !video.muted;
    btn.classList.toggle('unmuted', !video.muted);
    if (!video.muted) video.play();
  });
})();

// Hero slides carousel (sede page)
(() => {
  const wrap = document.getElementById('heroSlides');
  if (!wrap) return;
  const slides = wrap.querySelectorAll('.sede-hero-slide');
  if (slides.length < 2) return;
  let idx = 0;
  setInterval(() => {
    slides[idx].classList.remove('active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('active');
  }, 4500);
})();

// Lightbox gallery
(() => {
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  if (!gallery || !lightbox) return;

  const items = Array.from(gallery.querySelectorAll('.gallery-item'));
  const imgEl = document.getElementById('lightboxImg');
  const captionEl = document.getElementById('lightboxCaption');
  const counterEl = document.getElementById('lightboxCounter');
  const thumbsEl = document.getElementById('lightboxThumbs');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  const data = items.map(b => {
    const img = b.querySelector('img');
    const cap = b.querySelector('.gallery-caption');
    return {
      src: img.src,
      alt: img.alt,
      caption: cap ? cap.innerText.replace(/\n/g, ' · ') : img.alt
    };
  });

  // Build thumbs
  data.forEach((d, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.index = i;
    btn.innerHTML = `<img src="${d.src}" alt="" />`;
    btn.addEventListener('click', () => show(i));
    thumbsEl.appendChild(btn);
  });
  const thumbs = thumbsEl.querySelectorAll('button');

  let current = 0;
  function show(i) {
    current = (i + data.length) % data.length;
    const d = data[current];
    imgEl.src = d.src;
    imgEl.alt = d.alt;
    captionEl.textContent = d.caption;
    counterEl.textContent = `${current + 1} / ${data.length}`;
    thumbs.forEach((t, j) => t.classList.toggle('active', j === current));
  }
  function open(i) {
    show(i);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  items.forEach((b, i) => b.addEventListener('click', () => open(i)));
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(current - 1));
  nextBtn.addEventListener('click', () => show(current + 1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();

// Active nav link on scroll
(() => {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  if (!sections.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observer.observe(s));
})();
