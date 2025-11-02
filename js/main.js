/* ============================================
   MAIN.JS - Shared JavaScript Functionality
   ============================================ */

// News Rail Navigation
(function() {
  const rail = document.getElementById('newsRail');
  if (!rail) return;
  
  const btns = document.querySelectorAll('.news-rail-btn');
  const shift = () => {
    const card = rail.querySelector('.news-card');
    const w = card ? card.getBoundingClientRect().width + 16 : rail.clientWidth * 0.9;
    return Math.max(240, w);
  };
  
  btns.forEach(b => {
    b.addEventListener('click', () => {
      const dir = Number(b.dataset.shift || 1);
      rail.scrollBy({ left: dir * shift(), behavior: 'smooth' });
    });
  });
})();

// Scroll Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

