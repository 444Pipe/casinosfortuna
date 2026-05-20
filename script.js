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
