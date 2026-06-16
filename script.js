/* =============================================
   BALA KRISHNAN PORTFOLIO — script.js
   ============================================= */

'use strict';

// ============================================
// 1. CUSTOM CURSOR
// ============================================
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

const hoverTargets = document.querySelectorAll('a, button, .skill-card, .contact-card, .pillar-item, .highlight-item');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    cursorFollower.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    cursorFollower.classList.remove('hover');
  });
});

// ============================================
// 2. NAVBAR — scroll effect + active link + mobile toggle
// ============================================
const navbar   = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const navToggle = document.getElementById('navToggle');
const allNavLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled state
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link highlighting
  let current = '';
  sections.forEach(sec => {
    const sectionTop = sec.offsetTop - 100;
    if (window.scrollY >= sectionTop) current = sec.getAttribute('id');
  });
  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ============================================
// 3. HERO — TYPEWRITER EFFECT
// ============================================
const roles = [
  'Frontend Developer',
  'Flutter Developer',
  'UI Enthusiast',
  'Problem Solver',
  'BIT Student 2025–28',
];

const roleDynamic = document.getElementById('roleDynamic');
let roleIndex = 0;
let charIndex  = 0;
let isDeleting = false;
let typeTimeout;

function typeRole() {
  const currentRole = roles[roleIndex];
  if (isDeleting) {
    roleDynamic.textContent = currentRole.slice(0, charIndex--);
  } else {
    roleDynamic.textContent = currentRole.slice(0, charIndex++);
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex > currentRole.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex < 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    charIndex = 0;
    delay = 400;
  }

  typeTimeout = setTimeout(typeRole, delay);
}
typeRole();

// ============================================
// 4. PARTICLE CANVAS
// ============================================
const canvas = document.getElementById('particlesCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x    = Math.random() * canvas.width;
    this.y    = Math.random() * canvas.height;
    this.vx   = (Math.random() - 0.5) * 0.4;
    this.vy   = (Math.random() - 0.5) * 0.4;
    this.size = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    const colors = ['99,102,241', '139,92,246', '6,182,212', '16,185,129'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    ctx.fill();
  }
}

// Create particles
for (let i = 0; i < 80; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - dist / 120)})`;
        ctx.lineWidth   = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ============================================
// 5. STATS COUNTER ANIMATION
// ============================================
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  function update() {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start < target) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function checkStats() {
  if (statsAnimated) return;
  const firstStat = statNumbers[0];
  const rect = firstStat.getBoundingClientRect();
  if (rect.top < window.innerHeight - 80) {
    statsAnimated = true;
    statNumbers.forEach(el => {
      animateCounter(el, parseInt(el.dataset.target));
    });
  }
}
window.addEventListener('scroll', checkStats);
checkStats();

// ============================================
// 6. INTERSECTION OBSERVER — REVEAL ON SCROLL
// ============================================
const revealEls = document.querySelectorAll(
  '.reveal, .reveal-left, .reveal-right, .skill-card, .highlight-item, .pillar-item, .timeline-item, .contact-card'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
        // Animate skill bars when they become visible
        const fill = entry.target.querySelector('.skill-level-fill');
        if (fill) {
          fill.style.width = fill.dataset.level + '%';
        }
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => {
  observer.observe(el);
});

// Add reveal classes dynamically
document.querySelectorAll('.about-visual').forEach(el => el.classList.add('reveal-left'));
document.querySelectorAll('.about-content').forEach(el => el.classList.add('reveal-right'));
document.querySelectorAll('.objective-card').forEach(el => el.classList.add('reveal-left'));
document.querySelectorAll('.journey-timeline').forEach(el => el.classList.add('reveal-right'));
document.querySelectorAll('.contact-info').forEach(el => el.classList.add('reveal-left'));
document.querySelectorAll('.contact-form').forEach(el => el.classList.add('reveal-right'));
document.querySelectorAll('.section-header').forEach(el => el.classList.add('reveal'));

// Re-observe after adding classes
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  observer.observe(el);
});

// ============================================
// 7. SKILL CARDS — MOUSE GLOW EFFECT
// ============================================
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', x + 'px');
    card.style.setProperty('--mouse-y', y + 'px');
  });
});

// ============================================
// 8. CONTACT FORM — SUBMIT HANDLER
// ============================================
const contactForm   = document.getElementById('contactForm');
const formSuccess   = document.getElementById('formSuccess');
const btnSubmit     = document.getElementById('btn-submit');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name    = document.getElementById('formName').value.trim();
    const email   = document.getElementById('formEmail').value.trim();
    const subject = document.getElementById('formSubject').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !email || !subject || !message) return;

    // Simulate send
    const btnText = btnSubmit.querySelector('.btn-text');
    const btnIcon = btnSubmit.querySelector('.btn-icon');
    btnText.textContent = 'Sending...';
    btnSubmit.disabled  = true;

    setTimeout(() => {
      btnText.textContent = 'Message Sent!';
      btnIcon.innerHTML   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
      formSuccess.classList.add('show');
      contactForm.reset();

      setTimeout(() => {
        btnText.textContent = 'Send Message';
        btnIcon.innerHTML   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
        btnSubmit.disabled  = false;
        formSuccess.classList.remove('show');
      }, 4000);
    }, 1500);
  });
}

// ============================================
// 9. SMOOTH SCROLL FOR NAV LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.offsetTop - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============================================
// 10. SCROLL INDICATOR — HIDE ON SCROLL
// ============================================
const scrollIndicator = document.getElementById('scrollIndicator');
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    scrollIndicator.style.opacity = '0';
    scrollIndicator.style.pointerEvents = 'none';
  } else {
    scrollIndicator.style.opacity = '1';
    scrollIndicator.style.pointerEvents = 'auto';
  }
});

// ============================================
// 11. TILT EFFECT ON ABOUT CARD
// ============================================
const aboutGlowCard = document.querySelector('.about-glow-card');
if (aboutGlowCard) {
  aboutGlowCard.addEventListener('mousemove', (e) => {
    const rect   = aboutGlowCard.getBoundingClientRect();
    const x      = e.clientX - rect.left - rect.width / 2;
    const y      = e.clientY - rect.top  - rect.height / 2;
    const tiltX  = -(y / rect.height) * 8;
    const tiltY  =  (x / rect.width)  * 8;
    aboutGlowCard.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
  });
  aboutGlowCard.addEventListener('mouseleave', () => {
    aboutGlowCard.style.transform = '';
    aboutGlowCard.style.transition = 'transform 0.5s ease';
  });
  aboutGlowCard.addEventListener('mouseenter', () => {
    aboutGlowCard.style.transition = 'transform 0.1s ease';
  });
}

// ============================================
// 12. PAGE LOAD ANIMATION
// ============================================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity    = '1';
  });
  // Trigger initial stat check after page load
  setTimeout(checkStats, 600);
});
