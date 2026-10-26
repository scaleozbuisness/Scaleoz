/* Scaleoz reusable animation engine. Add after the page HTML. */
const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const animationLoader = document.createElement('div');
animationLoader.className = 'page-loader';
animationLoader.setAttribute('aria-hidden', 'true');
animationLoader.innerHTML = `<div class="loader-inner"><svg class="loader-mark" viewBox="0 0 54 54"><defs><linearGradient id="loader-gradient" x1="6" y1="2" x2="48" y2="52"><stop stop-color="#78a1ff"/><stop offset=".5" stop-color="#4f61ff"/><stop offset="1" stop-color="#8258ff"/></linearGradient></defs><path fill="url(#loader-gradient)" d="M10.9 18.7 37.4 4.5c3.3-1.8 6.7.6 6.7 4.2v7.1c0 1.7-.9 3.2-2.4 4L15.1 34.1c-3.3 1.8-6.7-.6-6.7-4.2v-7.2c0-1.6.9-3.1 2.5-4ZM17.6 35.8l19.1-10.2c5.7-3.1 11.7 1 11.7 7.3v.9c0 2.9-1.6 5.5-4.1 6.9L17.7 54.8c-3.3 1.8-6.7-.6-6.7-4.2v-7.1c0-3.2 2.5-6.2 6.6-7.7Z"/></svg><span class="loader-line"></span></div>`;
document.body.prepend(animationLoader);
window.addEventListener('load', () => setTimeout(() => animationLoader.classList.add('is-done'), motionReduced ? 0 : 520));

const animationProgress = document.createElement('div');
animationProgress.className = 'scroll-progress';
document.body.prepend(animationProgress);

const revealItems = document.querySelectorAll('.reveal');
if (revealItems.length) {
  const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  }), { threshold: 0.12 });
  revealItems.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${(index % 3) * 90}ms`);
    revealObserver.observe(element);
  });
}

document.querySelectorAll('.service-card, .project, .experience-banner, .contact-card').forEach((card) => {
  card.classList.add('tilt-card');
  if (motionReduced) return;
  card.addEventListener('pointermove', (event) => {
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    card.style.transform = `perspective(1000px) rotateX(${y * -3}deg) rotateY(${x * 4}deg) translateY(-5px)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

document.querySelectorAll('.button, .nav-cta').forEach((button) => {
  if (motionReduced) return;
  button.addEventListener('pointermove', (event) => {
    const bounds = button.getBoundingClientRect();
    button.style.transform = `translate(${(event.clientX - bounds.left - bounds.width / 2) * .08}px, ${(event.clientY - bounds.top - bounds.height / 2) * .12}px)`;
  });
  button.addEventListener('pointerleave', () => { button.style.transform = ''; });
});

const trustedStrip = document.querySelector('.trusted-strip');
if (trustedStrip) {
  const animateCounters = () => document.querySelectorAll('.trusted-strip strong, .experience-proof strong').forEach((counter) => {
    if (counter.dataset.counted) return;
    const target = Number.parseInt(counter.textContent, 10);
    if (!target) return;
    counter.dataset.counted = 'true';
    const start = performance.now();
    const tick = (now) => {
      const completion = Math.min((now - start) / 900, 1);
      counter.textContent = `${Math.floor(completion * target)}${completion === 1 ? '+' : ''}`;
      if (completion < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) animateCounters();
  }), { threshold: .45 }).observe(trustedStrip);
}

let animationFramePending = false;
window.addEventListener('scroll', () => {
  if (animationFramePending) return;
  animationFramePending = true;
  requestAnimationFrame(() => {
    const maximum = document.documentElement.scrollHeight - window.innerHeight;
    animationProgress.style.transform = `scaleX(${maximum ? window.scrollY / maximum : 0})`;
    animationFramePending = false;
  });
}, { passive: true });

if (!motionReduced) {
  window.addEventListener('pointermove', (event) => {
    document.body.style.setProperty('--pointer-x', `${event.clientX}px`);
    document.body.style.setProperty('--pointer-y', `${event.clientY}px`);
  }, { passive: true });
}
