/**
 * process.js - Pure Vanilla JS Scroll & Entrance Animation for Process Timeline
 * Uses IntersectionObserver for progressive reveal and smooth timeline progress filling.
 */

document.addEventListener('DOMContentLoaded', () => {
  const processSection = document.getElementById('workflow');
  const progressLine = document.getElementById('processLineProgress');
  const stepItems = document.querySelectorAll('.process__step-item');

  if (!processSection || !progressLine || stepItems.length === 0) return;

  // Reveal step items sequentially as they scroll into view
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -15% 0px',
    threshold: 0.2
  };

  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        updateLineProgress();
      }
    });
  }, observerOptions);

  stepItems.forEach((item) => {
    stepObserver.observe(item);
  });

  // Calculate & Update vertical glowing line height based on visible steps
  function updateLineProgress() {
    let visibleCount = 0;
    stepItems.forEach((item) => {
      if (item.classList.contains('is-visible')) {
        visibleCount++;
      }
    });

    if (visibleCount === 0) {
      progressLine.style.height = '0%';
    } else {
      const percentage = (visibleCount / stepItems.length) * 100;
      progressLine.style.height = `${percentage}%`;
    }
  }

  // Smooth updates on scroll
  window.addEventListener('scroll', () => {
    const rect = processSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      const totalDistance = rect.height;
      const scrolled = windowHeight - rect.top;
      const progress = Math.min(Math.max((scrolled / (totalDistance + windowHeight * 0.3)), 0), 1);
      
      const currentHeightPct = parseFloat(progressLine.style.height) || 0;
      const scrollPct = progress * 100;
      
      if (scrollPct > currentHeightPct) {
        progressLine.style.height = `${Math.min(scrollPct, 100)}%`;
      }
    }
  }, { passive: true });
});
