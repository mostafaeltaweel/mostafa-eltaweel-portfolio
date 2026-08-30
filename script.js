/* ===================== CUSTOM CURSOR ===================== */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (finePointer && !reduceMotion) {
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animate() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    if (dot)  { dot.style.left  = mx + 'px'; dot.style.top  = my + 'px'; }
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(animate);
  })();
}

/* ===================== MOBILE HAMBURGER ===================== */
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMobileMenu(forceClose) {
  const isOpen = mobileNav.classList.contains('open');
  if (forceClose || isOpen) {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.children[0].style.transform = '';
    hamburger.children[1].style.opacity   = '';
    hamburger.children[2].style.transform = '';
  } else {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    hamburger.children[1].style.opacity   = '0';
    hamburger.children[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  }
}
if (hamburger) hamburger.addEventListener('click', () => toggleMobileMenu());
mobileLinks.forEach(link => link.addEventListener('click', () => toggleMobileMenu(true)));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileNav?.classList.contains('open')) {
    toggleMobileMenu(true);
    hamburger.focus();
  }
});

/* ===================== CAPABILITY ACCORDION ===================== */
document.querySelectorAll('.capability-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.capability-item');
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    const willOpen = trigger.getAttribute('aria-expanded') !== 'true';

    document.querySelectorAll('.capability-trigger').forEach(otherTrigger => {
      const otherItem = otherTrigger.closest('.capability-item');
      const otherPanel = document.getElementById(otherTrigger.getAttribute('aria-controls'));
      otherTrigger.setAttribute('aria-expanded', 'false');
      otherItem.classList.remove('is-open');
      otherTrigger.querySelector('.capability-toggle').textContent = '+';
      otherPanel.hidden = true;
    });

    if (willOpen) {
      trigger.setAttribute('aria-expanded', 'true');
      item.classList.add('is-open');
      trigger.querySelector('.capability-toggle').textContent = '−';
      panel.hidden = false;
    }
  });
});

/* ===================== SCROLL REVEAL ===================== */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

/* ===================== STAT COUNTERS ===================== */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const start  = performance.now();
  const dur    = 2000;
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.floor(ease * target);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}
const statGroups = document.querySelectorAll('.intro-stats');
if (reduceMotion || !('IntersectionObserver' in window)) {
  statGroups.forEach(group => group.querySelectorAll('[data-target]').forEach(el => {
    el.textContent = el.getAttribute('data-target');
  }));
} else {
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-target]').forEach(animateCounter);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  statGroups.forEach(el => counterObs.observe(el));
}

/* ===================== SMOOTH ANCHOR SCROLL ===================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const selector = a.getAttribute('href');
    e.preventDefault();
    if (selector === '#') {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      toggleMobileMenu(true);
      return;
    }
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      toggleMobileMenu(true);
    }
  });
});

/* ===================== CONTACT FORM (Formspree) ===================== */
const form = document.getElementById('contact-form');
if (form) {
  const btn = document.getElementById('contact-submit-btn');
  const btnLabel = btn.querySelector('.btn-label');
  const status = document.getElementById('contact-form-status');
  const CONTACT_EMAIL = 'mostafa.eltaweel000@gmail.com';

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Static-site fallback: open a pre-filled email without pretending it was sent.
    if (form.dataset.emailFallback === 'true') {
      const data = new FormData(form);
      const subject = encodeURIComponent(data.get('subject') || 'Portfolio enquiry');
      const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      status.textContent = 'Your email app has been opened with the message ready to send.';
      status.className = 'contact-form-status success';
      return;
    }

    const origLabel = btnLabel.textContent;
    btn.disabled = true;
    btnLabel.textContent = 'Sending…';
    status.textContent = '';
    status.className = 'contact-form-status';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        btnLabel.textContent = 'Message Sent ✓';
        status.textContent = 'Thanks — your message is on its way. I\'ll reply soon.';
        status.className = 'contact-form-status success';
        form.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      status.textContent = `Something went wrong — please email me directly at ${CONTACT_EMAIL}.`;
      status.className = 'contact-form-status error';
    } finally {
      setTimeout(() => {
        btn.disabled = false;
        btnLabel.textContent = origLabel;
      }, 3000);
    }
  });
}

/* ===================== HERO SLIDE-UP (fallback) ===================== */
document.querySelectorAll('.hero-name span').forEach((span, i) => {
  span.style.animationDelay = (0.3 + i * 0.15) + 's';
});

/* ===================== PROJECT CARD TILT ===================== */
if (finePointer && !reduceMotion) document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ===================== SECTION HEADER PARALLAX ===================== */
if (!reduceMotion) window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  if (hero) {
    const img = hero.querySelector('.hero-photo img');
    if (img) img.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }
});

/* ===================== CERTIFICATIONS FILTER ===================== */
const certFilters = document.querySelectorAll('.cert-filter');
const certCards = document.querySelectorAll('.cert-card');

certFilters.forEach(btn => btn.setAttribute('aria-pressed', String(btn.classList.contains('active'))));

certFilters.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active tab
    certFilters.forEach(b => b.classList.remove('active'));
    certFilters.forEach(b => b.setAttribute('aria-pressed', 'false'));
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    const filter = btn.getAttribute('data-filter');

    certCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-issuer') === filter) {
        card.classList.remove('hidden');
        card.removeAttribute('hidden');
        card.style.animation = 'certFadeIn 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
        card.setAttribute('hidden', '');
        card.style.animation = '';
      }
    });
  });
});

// Add fadeIn animation
const certStyle = document.createElement('style');
certStyle.textContent = `
  @keyframes certFadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(certStyle);

/* ===================== ACTIVE NAV SECTION ===================== */
const pageSections = document.querySelectorAll('section[id]');
const desktopNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      desktopNavLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  pageSections.forEach(section => sectionObserver.observe(section));
}
