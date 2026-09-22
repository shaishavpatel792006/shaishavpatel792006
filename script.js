// ---------------------------------------------------------------------------
// Footer year
// ---------------------------------------------------------------------------
document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------------------
// Mobile nav toggle
// ---------------------------------------------------------------------------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------------------------------------------------------------------------
// Boot sequence text on hero load
// ---------------------------------------------------------------------------
const bootText = document.getElementById('bootText');
const bootMessages = ['TELEMETRY LINK ONLINE', 'PROFILE LOADED', 'TELEMETRY LINK ONLINE'];
let bootIndex = 0;

if (bootText && !prefersReducedMotion) {
  setInterval(() => {
    bootIndex = (bootIndex + 1) % bootMessages.length;
    bootText.textContent = bootMessages[bootIndex];
  }, 3200);
}

// ---------------------------------------------------------------------------
// Scroll reveal (sections flip into place as they enter view)
// ---------------------------------------------------------------------------
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ---------------------------------------------------------------------------
// 3D tilt + light-glare on hover (project cards, stat cards, contact panel)
// ---------------------------------------------------------------------------
function attachTilt(elements, { maxTilt = 10, perspective = 700 } = {}) {
  elements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -maxTilt;
      const rotateY = ((x / rect.width) - 0.5) * maxTilt;
      card.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--my', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
  });
}

if (!prefersReducedMotion) {
  attachTilt(document.querySelectorAll('.project-card'), { maxTilt: 12, perspective: 700 });
  attachTilt(document.querySelectorAll('.stat-card'), { maxTilt: 8, perspective: 600 });
  attachTilt(document.querySelectorAll('.contact-panel'), { maxTilt: 4, perspective: 1200 });
}

// ---------------------------------------------------------------------------
// Hero dial tracks the mouse; hero text gets a subtle parallax shift
// ---------------------------------------------------------------------------
const heroEl = document.getElementById('hero');
const dial = document.getElementById('dial');
const heroInner = document.getElementById('heroInner');

if (heroEl && dial && heroInner && !prefersReducedMotion) {
  heroEl.addEventListener('mousemove', (e) => {
    const rect = heroEl.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    dial.style.animationPlayState = 'paused';
    dial.style.transform = `rotateX(${-14 - py * 25}deg) rotateY(${px * 50}deg)`;
    heroInner.style.transform = `translate3d(${px * -12}px, ${py * -8}px, 0)`;
  });

  heroEl.addEventListener('mouseleave', () => {
    dial.style.animationPlayState = 'running';
    dial.style.transform = '';
    heroInner.style.transform = '';
  });
}

// ---------------------------------------------------------------------------
// Background texture drifts at a different rate than scroll (depth-of-field)
// ---------------------------------------------------------------------------
const textureBackdrop = document.getElementById('textureBackdrop');
let ticking = false;

if (textureBackdrop && !prefersReducedMotion) {
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        textureBackdrop.style.transform = `translateY(${window.scrollY * 0.06}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ---------------------------------------------------------------------------
// Sticky nav background intensifies on scroll
// ---------------------------------------------------------------------------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.borderBottomColor = window.scrollY > 40 ? 'var(--border)' : 'var(--border-soft)';
});

// ---------------------------------------------------------------------------
// Scroll progress gauge (rev-counter style readout of page position)
// ---------------------------------------------------------------------------
const scrollGauge = document.getElementById('scrollGauge');
const gaugeFill = document.getElementById('gaugeFill');
const gaugeLabel = document.getElementById('gaugeLabel');
const GAUGE_CIRCUMFERENCE = 163.36;

function updateScrollGauge() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

  gaugeFill.style.strokeDashoffset = GAUGE_CIRCUMFERENCE * (1 - pct);
  gaugeLabel.textContent = `${Math.round(pct * 100)}%`;
  scrollGauge.classList.toggle('is-visible', scrollTop > 80);
}

if (scrollGauge && gaugeFill && gaugeLabel) {
  window.addEventListener('scroll', updateScrollGauge, { passive: true });
  updateScrollGauge();
}

// ---------------------------------------------------------------------------
// Copy email button
// ---------------------------------------------------------------------------
const copyEmailBtn = document.getElementById('copyEmailBtn');
const emailLink = document.getElementById('emailLink');

if (copyEmailBtn && emailLink) {
  copyEmailBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(emailLink.textContent.trim());
      const original = copyEmailBtn.textContent;
      copyEmailBtn.textContent = 'Copied';
      setTimeout(() => { copyEmailBtn.textContent = original; }, 1800);
    } catch (err) {
      // Clipboard API unavailable — fail silently, mailto link still works
    }
  });
}
