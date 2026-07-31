/**
 * animations.js - Scroll-triggered & Entrance Animation Controllers
 */

document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll animations (prepared for future sections)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatableElements = document.querySelectorAll('.observe-anim');
  animatableElements.forEach(el => observer.observe(el));
});
