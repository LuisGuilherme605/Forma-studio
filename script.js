// Nav scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = (i % 4) * 0.1 + 's';
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => obs.observe(r));

// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
  cursor.style.left = mx - 4 + 'px';
  cursor.style.top = my - 4 + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx - 16 + 'px';
  ring.style.top = ry - 16 + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.width = '50px'; ring.style.height = '50px'; ring.style.opacity = '0.3'; });
  el.addEventListener('mouseleave', () => { ring.style.width = '32px'; ring.style.height = '32px'; ring.style.opacity = '0.5'; });
});
