(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ */
  /* Footer year                                                        */
  /* ------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* Navbar: compact on scroll + active link highlighting               */
  /* ------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function onScroll() {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    let currentId = sections[0] && sections[0].id;
    const scrollPos = window.scrollY + 140;
    for (const sec of sections) {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    }
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + currentId);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------ */
  /* Mobile menu                                                        */
  /* ------------------------------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const mobilePanel = document.getElementById('mobile-panel');
  if (hamburger && mobilePanel) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobilePanel.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    mobilePanel.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobilePanel.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Theme toggle (Light / Dark) — persists for the session             */
  /* ------------------------------------------------------------------ */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const SUN_PATH = 'M12 3v2m0 14v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M3 12h2m14 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z';
  const MOON_PATH = 'M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z';

  function applyTheme(light) {
    document.body.classList.toggle('light', light);
    if (themeIcon) themeIcon.querySelector('path').setAttribute('d', light ? SUN_PATH : MOON_PATH);
  }
  let storedTheme = null;
  try { storedTheme = sessionStorage.getItem('hj-theme'); } catch (e) { /* storage unavailable */ }
  applyTheme(storedTheme === 'light');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const light = !document.body.classList.contains('light');
      applyTheme(light);
      try { sessionStorage.setItem('hj-theme', light ? 'light' : 'dark'); } catch (e) { /* ignore */ }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Scroll reveal                                                      */
  /* ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ------------------------------------------------------------------ */
  /* Animated stat counters                                             */
  /* ------------------------------------------------------------------ */
  const counters = document.querySelectorAll('[data-count]');
  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (prefersReducedMotion) {
      el.firstChild.textContent = target;
      return;
    }
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.firstChild.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => cio.observe(c));
  }

  /* ------------------------------------------------------------------ */
  /* Language bars fill on scroll                                       */
  /* ------------------------------------------------------------------ */
  const langBars = document.querySelectorAll('.lang-bar-fill');
  if (langBars.length) {
    const lio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute('data-level') + '%';
          lio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    langBars.forEach(b => lio.observe(b));
  }

  /* ------------------------------------------------------------------ */
  /* Hero role — light typing effect (respects reduced motion)          */
  /* ------------------------------------------------------------------ */
  const roleEl = document.getElementById('typing-role');
  if (roleEl && !prefersReducedMotion) {
    const full = 'Développeur Full-Stack & IoT Junior';
    const cursor = roleEl.querySelector('.cursor');
    let i = 0;
    roleEl.childNodes[0].nodeValue = '';
    function typeStep() {
      if (i <= full.length) {
        roleEl.childNodes[0].nodeValue = full.slice(0, i);
        i++;
        setTimeout(typeStep, 32);
      }
    }
    setTimeout(typeStep, 500);
  }

  /* ------------------------------------------------------------------ */
  /* Collapsible panels (Architecture technique / Timeline des sprints) */
  /* ------------------------------------------------------------------ */
  function wireCollapsible(btnId, panelId) {
    const btn = document.getElementById(btnId);
    const panel = document.getElementById(panelId);
    if (!btn || !panel) return;
    btn.addEventListener('click', () => {
      const open = panel.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  }
  wireCollapsible('arch-toggle', 'arch-panel');
  wireCollapsible('sprint-toggle', 'sprint-panel');

  /* ------------------------------------------------------------------ */
  /* Contact form — client-side validation, opens mail client           */
  /* ------------------------------------------------------------------ */
  const form = document.getElementById('contact-form');
  if (form) {
    const successBox = document.getElementById('form-success');
    const fields = {
      name: { el: document.getElementById('f-name'), err: document.getElementById('err-name') },
      email: { el: document.getElementById('f-email'), err: document.getElementById('err-email') },
      subject: { el: document.getElementById('f-subject'), err: document.getElementById('err-subject') },
      message: { el: document.getElementById('f-message'), err: document.getElementById('err-message') },
    };

    function validate() {
      let ok = true;
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!fields.name.el.value.trim()) {
        fields.name.err.textContent = 'Merci de renseigner votre nom.';
        fields.name.el.classList.add('invalid');
        ok = false;
      } else {
        fields.name.err.textContent = '';
        fields.name.el.classList.remove('invalid');
      }

      if (!emailRe.test(fields.email.el.value.trim())) {
        fields.email.err.textContent = 'Adresse email invalide.';
        fields.email.el.classList.add('invalid');
        ok = false;
      } else {
        fields.email.err.textContent = '';
        fields.email.el.classList.remove('invalid');
      }

      if (!fields.subject.el.value.trim()) {
        fields.subject.err.textContent = 'Merci de préciser un sujet.';
        fields.subject.el.classList.add('invalid');
        ok = false;
      } else {
        fields.subject.err.textContent = '';
        fields.subject.el.classList.remove('invalid');
      }

      if (fields.message.el.value.trim().length < 10) {
        fields.message.err.textContent = 'Votre message doit contenir au moins 10 caractères.';
        fields.message.el.classList.add('invalid');
        ok = false;
      } else {
        fields.message.err.textContent = '';
        fields.message.el.classList.remove('invalid');
      }

      return ok;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate()) {
        successBox.classList.remove('show');
        return;
      }
      const name = fields.name.el.value.trim();
      const email = fields.email.el.value.trim();
      const subject = fields.subject.el.value.trim();
      const message = fields.message.el.value.trim();

      const body = `Nom: ${name}\nEmail: ${email}\n\n${message}`;
      const mailto = `mailto:houssem.jemai.tech@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      successBox.classList.add('show');
      window.location.href = mailto;
    });

    Object.values(fields).forEach(f => {
      f.el.addEventListener('input', () => {
        if (f.el.classList.contains('invalid')) validate();
      });
    });
  }
})();
