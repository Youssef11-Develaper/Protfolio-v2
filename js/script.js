/* ============================================================
   PORTFOLIO SCRIPT — YOUSSEF HANI
============================================================ */

/* ---- LOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader')?.classList.add('hidden');
  }, 800);
});

/* ---- THEME TOGGLE ---- */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');

const saved = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', saved);
updateThemeIcon(saved);

function updateThemeIcon(theme) {
  if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  });
}

/* ---- CUSTOM CURSOR ---- */
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (dot) { dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px'; }
});

function animateRing() {
  if (ring) {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
  }
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, [role="button"]').forEach(el => {
  el.addEventListener('mouseenter', () => ring?.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring?.classList.remove('hover'));
});

/* ---- NAVIGATION ---- */
const nav = document.querySelector('nav');
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 50);
  scrollTopBtn?.classList.toggle('show', window.scrollY > 400);
  updateActiveNav();
  animateCounters();
});

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav?.classList.toggle('open');
  });
}

document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    mobileNav?.classList.remove('open');
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
  });
}

/* ---- TYPED TEXT ---- */
const typedEl = document.getElementById('typed');
const phrases = [
  'Full Stack .NET Developer',
  'ASP.NET MVC Enthusiast',
  'Problem Solver',
  'Lifelong Learner'
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function typeLoop() {
  if (!typedEl) return;
  const current = phrases[phraseIdx];

  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typedEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIdx === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(typeLoop, delay);
}

typeLoop();

/* ---- SCROLL REVEAL ---- */
const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate skill bars when visible
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.getAttribute('data-width') + '%';
      });
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

reveals.forEach(el => observer.observe(el));

// Also observe skill sections specifically
document.querySelectorAll('.skill-category').forEach(el => observer.observe(el));

/* ---- ANIMATED COUNTERS ---- */
let countersAnimated = false;

function animateCounters() {
  if (countersAnimated) return;
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;
  const rect = statsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    countersAnimated = true;
    document.querySelectorAll('.stat-num[data-target]').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = prefix + Math.floor(current) + suffix;
      }, 25);
    });
  }
}

/* ---- SKILL BARS ---- */
// Initialise bars at 0
document.querySelectorAll('.skill-bar-fill').forEach(bar => {
  bar.setAttribute('data-width', bar.getAttribute('data-width') || '0');
  bar.style.width = '0';
});

// Animate when skill cards become visible
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        setTimeout(() => {
          bar.style.width = bar.getAttribute('data-width') + '%';
        }, 200);
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(card => skillObserver.observe(card));

/* ---- CONTACT FORM ---- */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;

    // Name
    const name = document.getElementById('fname');
    const nameErr = document.getElementById('nameErr');
    if (!name.value.trim()) {
      name.classList.add('error');
      nameErr?.classList.add('show');
      valid = false;
    } else {
      name.classList.remove('error');
      nameErr?.classList.remove('show');
    }

    // Email
    const email = document.getElementById('femail');
    const emailErr = document.getElementById('emailErr');
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRx.test(email.value)) {
      email.classList.add('error');
      emailErr?.classList.add('show');
      valid = false;
    } else {
      email.classList.remove('error');
      emailErr?.classList.remove('show');
    }

    // Message
    const msg = document.getElementById('fmessage');
    const msgErr = document.getElementById('msgErr');
    if (!msg.value.trim() || msg.value.trim().length < 10) {
      msg.classList.add('error');
      msgErr?.classList.add('show');
      valid = false;
    } else {
      msg.classList.remove('error');
      msgErr?.classList.remove('show');
    }

    if (valid) {
      const btn = form.querySelector('.form-submit-btn');
      btn.textContent = '⏳ Sending...';
      btn.disabled = true;
      setTimeout(() => {
        form.reset();
        btn.textContent = '📨 Send Message';
        btn.disabled = false;
        const success = document.getElementById('formSuccess');
        if (success) { success.classList.add('show'); setTimeout(() => success.classList.remove('show'), 4000); }
      }, 1400);
    }
  });
}

/* ---- SCROLL TO TOP ---- */
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- PROJECT LINKS ---- */
document.querySelectorAll('.project-link-btn[data-href]').forEach(btn => {
  btn.addEventListener('click', () => {
    window.open(btn.getAttribute('data-href'), '_blank');
  });
});

/* ---- SMOOTH SCROLL for anchors ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- YEAR in footer ---- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
