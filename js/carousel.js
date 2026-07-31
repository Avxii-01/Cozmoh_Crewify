/**
 * carousel.js - High Performance Pure Vanilla JS Infinite Carousel
 * Custom-built with CSS transform transitions, infinite clone looping,
 * arrow navigation, mouse drag, and touch swipe.
 */

document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('servicesViewport');
  const track = document.getElementById('servicesTrack');
  const prevBtn = document.getElementById('servicesPrev');
  const nextBtn = document.getElementById('servicesNext');

  if (!viewport || !track || !prevBtn || !nextBtn) return;

  const originalCards = Array.from(track.children);
  const totalOriginal = originalCards.length;
  if (totalOriginal === 0) return;

  let currentIndex = 0; // Index relative to original cards
  let cardsPerView = getCardsPerView();
  let gap = getGap();
  let cardWidth = 0;
  let isTransitioning = false;

  // Touch / Drag State
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let dragThreshold = 40; // minimum drag distance in px to trigger slide

  // Clone items for infinite looping (Clone first N and last N items)
  // Cloning 3 items on left and right allows smooth infinite looping across all breakpoints (1, 2, 3 cards visible)
  const CLONE_COUNT = 3;

  function setupClones() {
    track.innerHTML = '';

    // Create prepend clones (last N cards)
    for (let i = totalOriginal - CLONE_COUNT; i < totalOriginal; i++) {
      const cloneIndex = (i + totalOriginal) % totalOriginal;
      const clone = originalCards[cloneIndex].cloneNode(true);
      clone.classList.add('is-clone');
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }

    // Append original cards
    originalCards.forEach((card) => {
      track.appendChild(card);
    });

    // Create append clones (first N cards)
    for (let i = 0; i < CLONE_COUNT; i++) {
      const clone = originalCards[i].cloneNode(true);
      clone.classList.add('is-clone');
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }
  }

  function getCardsPerView() {
    const width = window.innerWidth;
    if (width <= 640) return 1;
    if (width <= 992) return 2;
    return 3;
  }

  function getGap() {
    // Gap value matches CSS var(--space-xl) = 32px (2rem)
    return 32;
  }

  function calculateDimensions() {
    cardsPerView = getCardsPerView();
    const viewportWidth = viewport.getBoundingClientRect().width;
    gap = getGap();
    cardWidth = (viewportWidth - (gap * (cardsPerView - 1))) / cardsPerView;
    updateTrackPosition(false);
  }

  function getTranslateForIndex(index) {
    // Offset by CLONE_COUNT cards to land on index 0
    const realIndex = index + CLONE_COUNT;
    const step = cardWidth + gap;
    return -realIndex * step;
  }

  function updateTrackPosition(animate = true) {
    if (!animate) {
      track.classList.add('is-dragging');
    } else {
      track.classList.remove('is-dragging');
    }

    const targetX = getTranslateForIndex(currentIndex);
    currentTranslate = targetX;
    prevTranslate = targetX;
    track.style.transform = `translate3d(${targetX}px, 0, 0)`;

    if (!animate) {
      // Force reflow
      track.offsetHeight;
      track.classList.remove('is-dragging');
    }
  }

  function goToIndex(index, animate = true) {
    if (isTransitioning && animate) return;

    if (animate) {
      isTransitioning = true;
    }

    currentIndex = index;
    updateTrackPosition(animate);
  }

  function prevSlide() {
    if (isTransitioning) return;
    goToIndex(currentIndex - 1, true);
  }

  function nextSlide() {
    if (isTransitioning) return;
    goToIndex(currentIndex + 1, true);
  }

  // Handle transition end for seamless infinite loop reset
  track.addEventListener('transitionend', (e) => {
    if (e.target !== track) return;
    isTransitioning = false;

    // Check boundary wrap-around
    if (currentIndex >= totalOriginal) {
      currentIndex = currentIndex % totalOriginal;
      updateTrackPosition(false);
    } else if (currentIndex < 0) {
      currentIndex = (currentIndex % totalOriginal + totalOriginal) % totalOriginal;
      updateTrackPosition(false);
    }
  });

  // Pointer / Mouse / Touch Drag Events
  function startDrag(e) {
    if (isTransitioning) return;
    isDragging = true;
    startX = getPositionX(e);
    track.classList.add('is-dragging');
    viewport.style.cursor = 'grabbing';
  }

  function moveDrag(e) {
    if (!isDragging) return;
    const currentX = getPositionX(e);
    const diffX = currentX - startX;
    const targetX = prevTranslate + diffX;
    track.style.transform = `translate3d(${targetX}px, 0, 0)`;
  }

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    viewport.style.cursor = 'grab';
    track.classList.remove('is-dragging');

    const endX = e.type.includes('touch') ? (e.changedTouches[0] ? e.changedTouches[0].clientX : startX) : e.clientX;
    const diffX = endX - startX;

    if (Math.abs(diffX) > dragThreshold) {
      if (diffX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    } else {
      // Revert back if drag was too short
      updateTrackPosition(true);
    }
  }

  function getPositionX(e) {
    return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  }

  // Button Listeners
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // Mouse Drag Listeners
  viewport.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', moveDrag);
  window.addEventListener('mouseup', endDrag);

  // Touch Swipe Listeners
  viewport.addEventListener('touchstart', startDrag, { passive: true });
  viewport.addEventListener('touchmove', moveDrag, { passive: true });
  viewport.addEventListener('touchend', endDrag);

  // Keyboard Navigation (Accessibility)
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Resize Listener with Debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      calculateDimensions();
    }, 100);
  });

  // Initialization
  setupClones();
  calculateDimensions();
});
