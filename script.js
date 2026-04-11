// ======================================
//   CHARSAC TECHNOLOGY — JAVASCRIPT v2
// ======================================

/* ---- Navbar scroll effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---- Offcanvas mobile menu ---- */
const hamburger       = document.getElementById('hamburger');
const navLinks        = document.getElementById('navLinks');
const navClose        = document.getElementById('navClose');
const overlay         = document.getElementById('offcanvasOverlay');

function openNav() {
  navLinks.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  navLinks.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openNav);
navClose.addEventListener('click', closeNav);
overlay.addEventListener('click', closeNav);

// Close on any link click inside the offcanvas panel
document.querySelectorAll('#navLinks a').forEach(link => {
  link.addEventListener('click', closeNav);
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeNav();
});

/* =============================================
   TYPEWRITER EFFECT
   ============================================= */
const phrases = [
  'Web Applications.',
  'Mobile Apps.',
  'AI Solutions.',
  'Digital Reality.',
  'Your Vision.',
  'Scalable Products.',
  'the Future.',
];

const typewriterEl = document.getElementById('typewriter');
let phraseIndex   = 0;
let charIndex     = 0;
let isDeleting    = false;
let typeTimeout;

function typeWrite() {
  const current = phrases[phraseIndex];

  if (!isDeleting) {
    typewriterEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      typeTimeout = setTimeout(typeWrite, 1800); // pause at end
      return;
    }
  } else {
    typewriterEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeTimeout = setTimeout(typeWrite, 400); // pause before next
      return;
    }
  }

  const speed = isDeleting ? 50 : 80;
  typeTimeout = setTimeout(typeWrite, speed);
}

typeWrite();

/* =============================================
   HERO CANVAS — STAR PARTICLES
   ============================================= */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  const COUNT = 120;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createStar() {
    return {
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      r:    Math.random() * 1.5 + 0.3,
      a:    Math.random(),
      da:   (Math.random() * 0.003 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
      vx:   (Math.random() - 0.5) * 0.15,
      vy:   (Math.random() - 0.5) * 0.15,
      hue:  Math.random() < 0.4 ? 260 : 200,
    };
  }

  function init() {
    resize();
    stars = Array.from({ length: COUNT }, createStar);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(s => {
      s.a += s.da;
      if (s.a <= 0 || s.a >= 1) s.da *= -1;
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 0) s.x = canvas.width;
      if (s.x > canvas.width)  s.x = 0;
      if (s.y < 0) s.y = canvas.height;
      if (s.y > canvas.height) s.y = 0;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, 80%, 70%, ${s.a * 0.7})`;
      ctx.fill();
    });

    // Draw faint connection lines between close stars
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${(1 - dist / 90) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  draw();
})();

/* =============================================
   TESTIMONIALS SLIDER
   ============================================= */
(function initSlider() {
  const track   = document.getElementById('testimonialsTrack');
  const dots    = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!track) return;

  const slides     = track.querySelectorAll('.testimonial-slide');
  const total      = slides.length;
  let current      = 0;
  let autoInterval;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    autoInterval = setInterval(next, 5000);
  }

  function resetAuto() {
    clearInterval(autoInterval);
    startAuto();
  }

  nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index));
      resetAuto();
    });
  });

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); resetAuto(); }
  });

  goTo(0);
  startAuto();
})();

/* =============================================
   CONTACT FORM — SEND VIA WHATSAPP
   ============================================= */
const form       = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn  = document.getElementById('submitBtn');
const btnText    = document.getElementById('btnText');

const WA_NUMBER = '2348122656972';

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const fname   = document.getElementById('fname').value.trim();
  const lname   = document.getElementById('lname').value.trim();
  const email   = document.getElementById('email').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!fname || !email || !message) {
    alert('Please fill in all required fields.');
    return;
  }

  // Build the WhatsApp message
  const waMessage =
`🚀 *New Project Inquiry — Charsac Technology*

👤 *Name:* ${fname} ${lname}
📧 *Email:* ${email}
${phone ? `📱 *Phone:* ${phone}\n` : ''}🛠 *Service Needed:* ${service || 'Not specified'}
📝 *Project Description:*
${message}

---
_Sent from: charsactech.com_`;

  const waURL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  // Show loading state
  btnText.textContent = 'Opening WhatsApp...';
  submitBtn.disabled  = true;

  setTimeout(() => {
    window.open(waURL, '_blank');
    formSuccess.style.display = 'block';
    form.reset();
    btnText.textContent     = '💬 Send via WhatsApp & Get a Response';
    submitBtn.disabled      = false;

    setTimeout(() => { formSuccess.style.display = 'none'; }, 8000);
  }, 800);
});

/* =============================================
   INTERSECTION OBSERVER — SCROLL ANIMATIONS
   ============================================= */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

const animTargets = document.querySelectorAll(
  '.service-card, .portfolio-card, .process-step, .tech-category, .about-card, .stat, .collab-card, .pillar, .ceo-spotlight, .testimonial-card'
);

animTargets.forEach((el, i) => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(28px)';
  el.style.transition = `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s`;
  observer.observe(el);
});

/* =============================================
   COUNTER ANIMATION FOR STATS
   ============================================= */
function animateCounter(el, target, suffix, duration = 1600) {
  const start    = 0;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value    = Math.floor(eased * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statEls = entry.target.querySelectorAll('.stat span');
      const data    = [
        { target: 50,  suffix: '+' },
        { target: 30,  suffix: '+' },
        { target: 5,   suffix: '+' },
        { target: 100, suffix: '%' },
      ];
      statEls.forEach((el, i) => {
        if (data[i]) animateCounter(el, data[i].target, data[i].suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);
