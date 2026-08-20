// case-studies.js - CREWiiFY Case Studies Listing, Dynamic Filtering & Compact Modal Preview

import { caseStudiesData } from './case-studies-data.js';

document.addEventListener('DOMContentLoaded', () => {
  initEditorialAnimations();
  initAudioPlayer();
  initCaseStudiesSection();
  initModalSystem();
});

/* ==========================================================================
   1. VIEWPORT-TRIGGERED ANIMATED COUNTER (Section 2)
   ========================================================================== */

function initEditorialAnimations() {
  const section = document.getElementById('credibility');
  if (!section) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters(prefersReducedMotion);
        observer.unobserve(section);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -40px 0px'
  });

  observer.observe(section);
}

function animateCounters(reducedMotion) {
  const counterEl = document.querySelector('.cs-stat-hero__num');
  if (!counterEl) return;

  const target = parseInt(counterEl.getAttribute('data-target') || '400', 10);
  if (reducedMotion) {
    counterEl.textContent = target;
    return;
  }

  const duration = 1600;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.floor(easeProgress * target);

    counterEl.textContent = currentVal;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counterEl.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

/* ==========================================================================
   2. INTERACTIVE AUDIO PLAYER (Section 2)
   ========================================================================== */

function initAudioPlayer() {
  const audioBtn = document.getElementById('csCredAudioBtn');
  const waveform = document.getElementById('csCredWaveform');
  const timeDisplay = document.getElementById('csCredTime');

  if (!audioBtn || !waveform || !timeDisplay) return;

  const barHeights = [
    6, 10, 14, 8, 16, 22, 12, 18, 24, 14, 20, 22, 16, 10, 18, 22, 
    14, 24, 20, 12, 16, 20, 14, 18, 10, 14, 8, 6
  ];

  waveform.innerHTML = '';
  barHeights.forEach((h, i) => {
    const bar = document.createElement('div');
    bar.className = 'cs-waveform-bar';
    bar.style.height = `${h}px`;
    bar.style.animationDelay = `${(i * 0.04).toFixed(2)}s`;
    waveform.appendChild(bar);
  });

  const bars = waveform.querySelectorAll('.cs-waveform-bar');
  let isPlaying = false;
  let currentSeconds = 24;
  let playbackSeconds = 0;
  let playInterval = null;

  audioBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;

    if (isPlaying) {
      audioBtn.classList.add('is-playing');
      audioBtn.setAttribute('aria-label', 'Pause audio testimonial');
      audioBtn.innerHTML = `
        <svg class="cs-audio-player__icon" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      `;

      playInterval = setInterval(() => {
        playbackSeconds++;
        const remaining = Math.max(0, currentSeconds - playbackSeconds);
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        timeDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

        const progress = playbackSeconds / currentSeconds;
        bars.forEach((b, idx) => {
          if (idx / bars.length <= progress) {
            b.style.backgroundColor = '#C4B5FD';
          }
        });

        if (playbackSeconds >= currentSeconds) {
          stopAudio();
        }
      }, 1000);
    } else {
      pauseAudio();
    }
  });

  function pauseAudio() {
    isPlaying = false;
    audioBtn.classList.remove('is-playing');
    audioBtn.setAttribute('aria-label', 'Play audio testimonial');
    audioBtn.innerHTML = `
      <svg class="cs-audio-player__icon" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    `;
    if (playInterval) clearInterval(playInterval);
  }

  function stopAudio() {
    pauseAudio();
    playbackSeconds = 0;
    timeDisplay.textContent = '0:24';
    bars.forEach(b => {
      b.style.backgroundColor = '';
    });
  }
}

/* ==========================================================================
   3. CASE STUDIES SECTION (FILTERING & MASONRY GRID)
   ========================================================================== */

let currentFilter = 'all';

function initCaseStudiesSection() {
  const gridContainer = document.getElementById('csMasonryGrid');
  const countDisplay = document.getElementById('csItemCount');
  const filterBtns = document.querySelectorAll('.cs-filter-btn');

  if (!gridContainer) return;

  // Category Mapping Table
  const categoryMap = {
    'seo': 'SEO',
    'ppc': 'PPC Management & Growth',
    'ppc-management': 'PPC Management & Growth',
    'ppc management': 'PPC Management & Growth',
    'ppc-management-and-growth': 'PPC Management & Growth',
    'ppc management & growth': 'PPC Management & Growth',
    'google-ads': 'PPC Management & Growth',
    'google ads': 'PPC Management & Growth',
    'web-development': 'Web Development',
    'web development': 'Web Development',
    'web': 'Web Development',
    'whatsapp-automation': 'WhatsApp Automation',
    'whatsapp automation': 'WhatsApp Automation',
    'whatsapp': 'WhatsApp Automation',
    'wordpress': 'WordPress',
    'shopify': 'Shopify'
  };

  // Helper to resolve category from query parameter or hash
  const resolveCategoryFilter = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('category') || urlParams.get('filter');
    const hash = window.location.hash.replace(/^#/, '').toLowerCase();

    if (filterParam) {
      const cleanParam = filterParam.toLowerCase();
      if (categoryMap[cleanParam]) return categoryMap[cleanParam];
      const match = Array.from(filterBtns).find(btn => 
        btn.getAttribute('data-filter')?.toLowerCase() === cleanParam
      );
      if (match) return match.getAttribute('data-filter');
    }

    if (hash && categoryMap[hash]) {
      return categoryMap[hash];
    }

    return 'all';
  };

  const initialFilter = resolveCategoryFilter();
  if (initialFilter && initialFilter !== 'all') {
    currentFilter = initialFilter;
    const matchingBtn = Array.from(filterBtns).find(btn => 
      btn.getAttribute('data-filter')?.toLowerCase() === initialFilter.toLowerCase()
    );
    if (matchingBtn) {
      filterBtns.forEach(b => {
        const isSelected = (b === matchingBtn);
        b.classList.toggle('is-active', isSelected);
        b.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      });

      // Auto-scroll filter list rail on load so the selected filter is centered in view
      const filterList = matchingBtn.closest('.cs-filter-list');
      if (filterList) {
        setTimeout(() => {
          const listItem = matchingBtn.parentElement;
          const targetEl = (listItem && listItem.tagName === 'LI') ? listItem : matchingBtn;
          const targetScroll = targetEl.offsetLeft - (filterList.clientWidth / 2) + (targetEl.offsetWidth / 2);
          filterList.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }

  // 1. Initial Render with determined filter
  renderCaseStudiesGrid(currentFilter);

  // Helper to scroll accurately to target listing section with sticky navbar offset & breathing room
  const scrollToTarget = (targetEl) => {
    if (!targetEl) return;
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 84;
    const offsetPadding = 24; // Visual breathing room
    const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = Math.max(0, elementPosition - headerHeight - offsetPadding);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: offsetPosition,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  };

  // Check if page was loaded with a deep link (category param or listing hash)
  const urlParams = new URLSearchParams(window.location.search);
  const hasDeepLink = urlParams.has('category') || urlParams.has('filter') || window.location.hash.length > 1;

  if (hasDeepLink) {
    // Wait until masonry cards are painted into DOM
    setTimeout(() => {
      const hash = window.location.hash.replace(/^#/, '').toLowerCase();
      const targetEl = document.getElementById(hash) || 
                       document.getElementById('case-studies-grid') || 
                       document.getElementById('csGridView');
      scrollToTarget(targetEl);
    }, 120);
  }

  // Handle browser back/forward and dynamic hash updates
  window.addEventListener('hashchange', () => {
    const newCategory = resolveCategoryFilter();
    if (newCategory && newCategory !== currentFilter) {
      currentFilter = newCategory;
      const matchingBtn = Array.from(filterBtns).find(btn => 
        btn.getAttribute('data-filter')?.toLowerCase() === currentFilter.toLowerCase()
      );
      if (matchingBtn) {
        filterBtns.forEach(b => {
          const isSelected = (b === matchingBtn);
          b.classList.toggle('is-active', isSelected);
          b.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        });
      }
      renderCaseStudiesGrid(currentFilter);
    }
    const hash = window.location.hash.replace(/^#/, '').toLowerCase();
    const targetEl = document.getElementById(hash) || 
                     document.getElementById('case-studies-grid') || 
                     document.getElementById('csGridView');
    if (targetEl) {
      scrollToTarget(targetEl);
    }
  });

  // 2. Filter Navigation Clicks & Auto-Scroll into View
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter') || 'all';
      if (filter === currentFilter) return;

      filterBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      // Auto-scroll ONLY the internal filter list rail (never the page, window, or cards)
      const filterList = btn.closest('.cs-filter-list');
      if (filterList) {
        const listItem = btn.parentElement;
        const targetEl = (listItem && listItem.tagName === 'LI') ? listItem : btn;
        const targetScroll = targetEl.offsetLeft - (filterList.clientWidth / 2) + (targetEl.offsetWidth / 2);
        filterList.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      }

      currentFilter = filter;
      renderCaseStudiesGrid(filter);
    });
  });

  // 3. Scroll End Detection for Visual Cue Fade on Mobile / Tablet
  const filterNav = document.querySelector('.cs-filter-nav');
  const filterList = document.querySelector('.cs-filter-list');
  if (filterNav && filterList) {
    const updateScrollEnd = () => {
      const isEnd = (filterList.scrollLeft + filterList.clientWidth) >= (filterList.scrollWidth - 12);
      filterNav.classList.toggle('is-scrolled-end', isEnd);
    };

    filterList.addEventListener('scroll', updateScrollEnd, { passive: true });
    window.addEventListener('resize', updateScrollEnd, { passive: true });
    updateScrollEnd();
  }
}

/**
 * Filter and render case studies into the masonry grid
 */
function renderCaseStudiesGrid(filter) {
  const gridContainer = document.getElementById('csMasonryGrid');
  const countDisplay = document.getElementById('csItemCount');
  if (!gridContainer) return;

  // Filter items client-side
  const filteredData = filter === 'all'
    ? caseStudiesData
    : caseStudiesData.filter(item => item.category.toLowerCase() === filter.toLowerCase());

  // Update dynamic count indicator
  if (countDisplay) {
    const totalCount = caseStudiesData.length;
    const displayTotal = (filter === 'all') ? totalCount : filteredData.length;
    countDisplay.textContent = `Showing ${filteredData.length} of ${displayTotal} Projects`;
  }

  // Smooth Grid Repopulation
  gridContainer.innerHTML = '';

  if (filteredData.length === 0) {
    gridContainer.innerHTML = `
      <div class="cs-empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <p style="color: #A3A3A3; font-size: 1.1rem;">No case studies found in this category.</p>
      </div>
    `;
    return;
  }

  filteredData.forEach((item, index) => {
    const card = document.createElement('article');
    const spanClass = item.cardSpan ? `cs-card--${item.cardSpan}` : 'cs-card--medium';
    card.className = `cs-card ${spanClass} animate-fade-up-${(index % 3) + 1}`;
    card.setAttribute('data-id', item.id);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View ${item.title} Case Study Preview`);

    card.innerHTML = createCardHTML(item);

    // Click on entire card opens modal preview
    card.addEventListener('click', (e) => {
      openModal(item.id, card);
    });

    // Keyboard activation (Enter / Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(item.id, card);
      }
    });

    gridContainer.appendChild(card);
  });
}

/**
 * HTML generator for Case Study Cards
 */
function createCardHTML(item) {
  const primaryMetric = (item.result && item.resultLabel) 
    ? { value: item.result, label: item.resultLabel }
    : (item.metrics && item.metrics.length > 0 ? item.metrics[0] : null);

  return `
    <div class="cs-card__media">
      <img src="${item.image}" alt="${item.title} Project" class="cs-card__img" style="object-position: ${item.imagePosition || 'center center'};" loading="lazy">
      <div class="cs-card__overlay"></div>
      <div class="cs-card__tag-wrap">
        <span class="cs-tag cs-tag--category">${item.category}</span>
      </div>
    </div>

    <div class="cs-card__body">
      <h4 class="cs-card__title">${item.title}</h4>
      <p class="cs-card__desc">${item.description}</p>

      <div class="cs-card__footer">
        ${primaryMetric ? `
          <div class="cs-card__metric-badge">
            <span class="cs-card__metric-val">${primaryMetric.value}</span>
            <span class="cs-card__metric-lbl">${primaryMetric.label}</span>
          </div>
        ` : '<div></div>'}

        <span class="cs-card__affordance" aria-hidden="true">
          View Case Study →
        </span>
      </div>
    </div>
  `;
}

/* ==========================================================================
   4. COMPACT CASE STUDY MODAL PREVIEW SYSTEM
   ========================================================================== */

let lastFocusedElement = null;
let isModalOpen = false;

function initModalSystem() {
  const backdrop = document.getElementById('csModalBackdrop');
  const modal = document.getElementById('csModal');
  const closeBtn = document.getElementById('csModalCloseBtn');

  if (!backdrop || !modal) return;

  // Close via top-right close button
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  // Close when clicking on backdrop (outside modal dialog)
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  // Close via ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) {
      closeModal();
    }
  });
}

/**
 * Open Modal with Case Study Data
 */
function openModal(caseStudyId, triggerElement) {
  const item = caseStudiesData.find(cs => cs.id === caseStudyId);
  if (!item) return;

  const backdrop = document.getElementById('csModalBackdrop');
  const modal = document.getElementById('csModal');
  const modalBody = document.getElementById('csModalBody');
  const closeBtn = document.getElementById('csModalCloseBtn');

  if (!backdrop || !modal || !modalBody) return;

  // Save trigger element for accessible focus restoration
  lastFocusedElement = triggerElement || document.activeElement;

  // Populate dynamic modal content
  modalBody.innerHTML = createModalContentHTML(item);

  // Bind the bottom "Back to Case Studies" button
  const bottomCloseBtn = modalBody.querySelector('#csModalBottomCloseBtn');
  if (bottomCloseBtn) {
    bottomCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  }

  // Lock background scroll without shifting content
  lockScroll();

  // Show Modal with Animation
  backdrop.setAttribute('aria-hidden', 'false');
  backdrop.classList.add('is-active');
  modal.classList.add('is-active');
  isModalOpen = true;

  // Set focus into modal close button
  setTimeout(() => {
    if (closeBtn) {
      closeBtn.focus();
    } else {
      modal.focus();
    }
  }, 50);
}

/**
 * Close Modal & Restore Focus + Background Scroll
 */
function closeModal() {
  if (!isModalOpen) return;

  const backdrop = document.getElementById('csModalBackdrop');
  const modal = document.getElementById('csModal');

  if (backdrop && modal) {
    backdrop.classList.remove('is-active');
    modal.classList.remove('is-active');
    backdrop.setAttribute('aria-hidden', 'true');
  }

  isModalOpen = false;

  // Restore background scrolling
  unlockScroll();

  // Return focus to triggering card
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

/**
 * Generate Modal Internal Content HTML
 * Compact preview: Category -> Title -> Large Image -> Description -> Result -> Services -> CTA
 */
function createModalContentHTML(item) {
  const primaryMetric = (item.result && item.resultLabel)
    ? { value: item.result, label: item.resultLabel }
    : (item.metrics && item.metrics.length > 0 ? item.metrics[0] : null);

  // Secondary metrics if present
  const secondaryMetricsHTML = (item.metrics && item.metrics.length > 1)
    ? `
      <div class="cs-modal__submetrics">
        ${item.metrics.slice(1, 3).map(m => `
          <div class="cs-modal__submetric">
            <span class="cs-modal__submetric-val">${m.value}</span>
            <span class="cs-modal__submetric-lbl">${m.label}</span>
          </div>
        `).join('')}
      </div>
    `
    : '';

  // Services delivered list
  const servicesList = (item.services && item.services.length > 0)
    ? item.services.join(' · ')
    : (item.category || 'Digital Strategy');

  return `
    <div class="cs-modal__content-wrap">
      
      <!-- 1. Category Eyebrow Badge & Client -->
      <div class="cs-modal__eyebrow-row">
        <span class="cs-tag cs-tag--category">${item.category}</span>
        ${item.client ? `<span class="cs-modal__client">${item.client}</span>` : ''}
      </div>

      <!-- 2. Project Title & Subtitle -->
      <h2 class="cs-modal__title" id="csModalTitle">${item.title}</h2>
      ${item.subtitle ? `<p class="cs-modal__subtitle">${item.subtitle}</p>` : ''}

      <!-- 3. Wide Full-Width Horizontal Hero Image -->
      <div class="cs-modal__media">
        <img src="${item.heroImage || item.image}" alt="${item.title} Case Study Visual" class="cs-modal__img" style="object-position: ${item.imagePosition || 'center center'};" loading="lazy">
        <div class="cs-modal__media-glow" aria-hidden="true"></div>
      </div>

      <!-- 4. Project Short Description / Narrative -->
      <div class="cs-modal__section">
        <p class="cs-modal__desc" id="csModalDesc">
          ${item.overview || item.description}
        </p>
      </div>

      <!-- 5. Key Results Highlight Panel -->
      ${primaryMetric ? `
        <div class="cs-modal__result-box">
          <div class="cs-modal__result-header">
            <span class="cs-modal__result-dot" aria-hidden="true"></span>
            <span class="cs-modal__result-tag">KEY RESULT</span>
          </div>
          <div class="cs-modal__result-main">
            <div class="cs-modal__result-primary">
              <span class="cs-modal__result-val">${primaryMetric.value}</span>
              <span class="cs-modal__result-lbl">${primaryMetric.label}</span>
            </div>
            ${secondaryMetricsHTML}
          </div>
        </div>
      ` : ''}

      <!-- 6. Services Delivered -->
      ${(item.services && item.services.length > 0) ? `
        <div class="cs-modal__services-section">
          <div class="cs-modal__services-label">SERVICES DELIVERED</div>
          <div class="cs-modal__services-text">${servicesList}</div>
        </div>
      ` : ''}

      <!-- 7. Action Footer -->
      <div class="cs-modal__footer">
        <button type="button" class="btn btn--secondary cs-modal__back-btn" id="csModalBottomCloseBtn">
          ← Back to Case Studies
        </button>
        <a href="index.html#contact" class="btn btn--primary cs-modal__contact-btn">
          Book a Discovery Call <span aria-hidden="true">→</span>
        </a>
      </div>

    </div>
  `;
}

/* ==========================================================================
   5. SCROLL LOCK UTILITIES
   ========================================================================== */

function lockScroll() {
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = `${scrollBarWidth}px`;
  document.body.classList.add('modal-open');
  document.documentElement.classList.add('modal-open');
}

function unlockScroll() {
  document.body.style.paddingRight = '';
  document.body.classList.remove('modal-open');
  document.documentElement.classList.remove('modal-open');
}
