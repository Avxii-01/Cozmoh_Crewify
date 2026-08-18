// case-studies.js - Case Studies Editorial Counters, Interactive Audio, Dynamic Filtering & In-Page Detail View

import { caseStudiesData } from './case-studies-data.js';

document.addEventListener('DOMContentLoaded', () => {
  initEditorialAnimations();
  initAudioPlayer();
  initCaseStudiesSection();
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
   3. CASE STUDIES SECTION (FILTERS, FEATURED, MASONRY GRID & IN-PAGE DETAIL)
   ========================================================================== */

let currentFilter = 'all';
let currentDetailId = null;

function initCaseStudiesSection() {
  const gridContainer = document.getElementById('csMasonryGrid');
  const featuredContainer = document.getElementById('csFeaturedArea');
  const countDisplay = document.getElementById('csItemCount');
  const filterBtns = document.querySelectorAll('.cs-filter-btn');

  if (!gridContainer || !featuredContainer) return;

  // 1. Initial Render
  renderPortfolio(currentFilter);

  // 2. Filter Navigation Clicks
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      if (filter === currentFilter) return;

      filterBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      currentFilter = filter;
      renderPortfolio(filter);
    });
  });

  // 3. Check Initial URL Hash for deep link
  handleInitialHash();

  // 4. Handle Browser Back/Forward buttons
  window.addEventListener('hashchange', () => {
    handleInitialHash();
  });
}

function handleInitialHash() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#case-study/')) {
    const id = hash.replace('#case-study/', '').trim();
    if (id) {
      showDetailView(id, false);
    }
  } else if (currentDetailId) {
    showGridView(false);
  }
}

/* ==========================================================================
   PORTFOLIO RENDERING (Featured + Masonry Grid)
   ========================================================================== */

function renderPortfolio(filter) {
  const gridContainer = document.getElementById('csMasonryGrid');
  const featuredContainer = document.getElementById('csFeaturedArea');
  const countDisplay = document.getElementById('csItemCount');

  // Filter items
  const filteredData = filter === 'all' 
    ? caseStudiesData 
    : caseStudiesData.filter(item => item.category.toLowerCase() === filter.toLowerCase());

  // Update counter
  if (countDisplay) {
    const totalCount = caseStudiesData.length;
    countDisplay.textContent = `Showing ${filteredData.length} of ${totalCount} Projects`;
  }

  // 1. Render Featured Case Study (First featured or first item)
  const featuredItem = filteredData.find(item => item.featured) || filteredData[0];
  const gridItems = filteredData.filter(item => item.id !== (featuredItem ? featuredItem.id : null));

  if (featuredItem) {
    featuredContainer.innerHTML = createFeaturedCardHTML(featuredItem);
    featuredContainer.style.display = 'block';

    const featCard = featuredContainer.querySelector('.cs-featured-card');
    if (featCard) {
      featCard.addEventListener('click', () => {
        showDetailView(featuredItem.id);
      });
    }
  } else {
    featuredContainer.innerHTML = '';
    featuredContainer.style.display = 'none';
  }

  // 2. Render Masonry Grid Cards
  gridContainer.innerHTML = '';
  gridItems.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = `cs-card cs-card--${item.cardSpan || 'medium'} animate-fade-up-${(index % 3) + 1}`;
    card.setAttribute('data-id', item.id);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View ${item.title} Case Study`);

    card.innerHTML = createCardHTML(item);

    card.addEventListener('click', () => {
      showDetailView(item.id);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showDetailView(item.id);
      }
    });

    gridContainer.appendChild(card);
  });
}

// HTML generator for Featured Case Study
function createFeaturedCardHTML(item) {
  const metricPills = item.metrics.slice(0, 3).map(m => `
    <div class="cs-featured-metric">
      <span class="cs-featured-metric__val">${m.value}</span>
      <span class="cs-featured-metric__lbl">${m.label}</span>
    </div>
  `).join('');

  return `
    <article class="cs-featured-card" data-id="${item.id}" tabindex="0" role="button" aria-label="Featured: ${item.title}">
      <!-- Left Content -->
      <div class="cs-featured-card__content">
        <div class="cs-featured-card__eyebrow-row">
          <span class="cs-tag cs-tag--featured">FEATURED CASE STUDY</span>
          <span class="cs-tag cs-tag--category">${item.category}</span>
        </div>

        <h3 class="cs-featured-card__title">${item.title}</h3>
        <p class="cs-featured-card__subtitle">${item.subtitle || item.description}</p>

        <!-- Metric Badges -->
        <div class="cs-featured-card__metrics">
          ${metricPills}
        </div>

        <!-- CTA Action -->
        <div class="cs-featured-card__action">
          <span class="cs-cta-link">
            View Case Study <span class="cs-cta-arrow" aria-hidden="true">→</span>
          </span>
        </div>
      </div>

      <!-- Right Dominant Visual -->
      <div class="cs-featured-card__visual">
        <img src="${item.heroImage || item.image}" alt="${item.title} Platform Showcase" class="cs-featured-card__img" loading="lazy">
        <div class="cs-featured-card__overlay"></div>
      </div>
    </article>
  `;
}

// HTML generator for Masonry Grid Cards
function createCardHTML(item) {
  const primaryMetric = item.metrics && item.metrics.length > 0 ? item.metrics[0] : null;

  return `
    <div class="cs-card__media">
      <img src="${item.image}" alt="${item.title} Project" class="cs-card__img" loading="lazy">
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
   4. IN-PAGE DETAILED CASE STUDY VIEW
   ========================================================================== */

function showDetailView(caseStudyId, updateHistory = true) {
  const item = caseStudiesData.find(cs => cs.id === caseStudyId);
  if (!item) return;

  currentDetailId = item.id;

  const gridView = document.getElementById('csGridView');
  const detailView = document.getElementById('csDetailView');
  const section = document.getElementById('case-studies-grid');

  if (!gridView || !detailView) return;

  // Find Previous and Next case studies
  const currentIndex = caseStudiesData.findIndex(cs => cs.id === item.id);
  const prevIndex = (currentIndex - 1 + caseStudiesData.length) % caseStudiesData.length;
  const nextIndex = (currentIndex + 1) % caseStudiesData.length;
  const prevItem = caseStudiesData[prevIndex];
  const nextItem = caseStudiesData[nextIndex];

  // Render Detail Content
  detailView.innerHTML = createDetailViewHTML(item, prevItem, nextItem);

  // Smooth View Transition
  gridView.style.opacity = '0';
  gridView.style.transform = 'translateY(10px)';
  
  setTimeout(() => {
    gridView.style.display = 'none';
    detailView.style.display = 'block';
    detailView.style.opacity = '0';
    detailView.style.transform = 'translateY(16px)';

    // Trigger reflow
    void detailView.offsetWidth;

    detailView.style.transition = 'opacity 300ms ease, transform 300ms ease';
    detailView.style.opacity = '1';
    detailView.style.transform = 'translateY(0)';

    // Scroll to section header
    if (section) {
      const topOffset = section.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }

    // Attach Event Listeners inside Detail View
    attachDetailEventListeners(prevItem.id, nextItem.id);
  }, 200);

  // Update URL Hash
  if (updateHistory) {
    history.pushState(null, '', `#case-study/${item.id}`);
  }
}

function showGridView(updateHistory = true) {
  currentDetailId = null;

  const gridView = document.getElementById('csGridView');
  const detailView = document.getElementById('csDetailView');
  const section = document.getElementById('case-studies-grid');

  if (!gridView || !detailView) return;

  detailView.style.opacity = '0';
  detailView.style.transform = 'translateY(10px)';

  setTimeout(() => {
    detailView.style.display = 'none';
    gridView.style.display = 'block';
    gridView.style.opacity = '0';
    gridView.style.transform = 'translateY(16px)';

    void gridView.offsetWidth;

    gridView.style.transition = 'opacity 300ms ease, transform 300ms ease';
    gridView.style.opacity = '1';
    gridView.style.transform = 'translateY(0)';

    if (section) {
      const topOffset = section.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  }, 200);

  if (updateHistory) {
    history.pushState(null, '', window.location.pathname + window.location.search);
  }
}

function attachDetailEventListeners(prevId, nextId) {
  const backBtn = document.getElementById('csDetailBackBtn');
  const prevBtn = document.getElementById('csDetailPrevBtn');
  const nextBtn = document.getElementById('csDetailNextBtn');

  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showGridView(true);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showDetailView(prevId, true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showDetailView(nextId, true);
    });
  }
}

// Full-Page Detail HTML Generator
function createDetailViewHTML(item, prevItem, nextItem) {
  const metricsHTML = item.metrics.map(m => `
    <div class="cs-detail-stat-card">
      <div class="cs-detail-stat-card__val">${m.value}</div>
      <div class="cs-detail-stat-card__lbl">${m.label}</div>
    </div>
  `).join('');

  const servicesHTML = item.services.map(s => `
    <span class="cs-detail-service-tag">${s}</span>
  `).join('');

  const galleryHTML = item.gallery.map(img => `
    <div class="cs-detail-gallery__item">
      <img src="${img}" alt="${item.title} Detailed Visual" class="cs-detail-gallery__img" loading="lazy">
    </div>
  `).join('');

  return `
    <div class="cs-detail">
      
      <!-- Top Navigation Bar -->
      <div class="cs-detail__top-bar">
        <button class="cs-detail__back-btn" id="csDetailBackBtn">
          <span class="cs-detail__back-arrow">←</span> Back to All Case Studies
        </button>

        <div class="cs-detail__category-pill">
          ${item.category}
        </div>
      </div>

      <!-- Header Title & Subtitle -->
      <header class="cs-detail__header">
        <div class="cs-detail__client-badge">${item.client || 'Agency Client'}</div>
        <h2 class="cs-detail__title">${item.title}</h2>
        <p class="cs-detail__subtitle">${item.subtitle || item.description}</p>
      </header>

      <!-- Key Results Bar (3 High-Impact Metrics) -->
      <section class="cs-detail__metrics-bar" aria-label="Key Project Metrics">
        ${metricsHTML}
      </section>

      <!-- Dominant Hero Visual / Mockup -->
      <div class="cs-detail__hero-visual">
        <img src="${item.heroImage || item.image}" alt="${item.title} Platform Mockup" class="cs-detail__hero-img" loading="lazy">
        <div class="cs-detail__hero-glow"></div>
      </div>

      <!-- Main 2-Column Content Layout -->
      <div class="cs-detail__content-grid">
        
        <!-- Left: Project Overview & Challenge -->
        <div class="cs-detail__main-column">
          
          <div class="cs-detail__section">
            <h3 class="cs-detail__section-title">Project Overview</h3>
            <p class="cs-detail__section-text">${item.overview}</p>
          </div>

          <div class="cs-detail__section">
            <h3 class="cs-detail__section-title">The Challenge</h3>
            <p class="cs-detail__section-text">${item.challenge}</p>
          </div>

          <div class="cs-detail__section">
            <h3 class="cs-detail__section-title">Our Solution &amp; Approach</h3>
            <p class="cs-detail__section-text">${item.solution}</p>
          </div>

          <div class="cs-detail__section">
            <h3 class="cs-detail__section-title">Measurable Results &amp; Impact</h3>
            <p class="cs-detail__section-text">${item.results}</p>
            <div class="cs-detail__outcome-box">
              <strong>Final Outcome:</strong> ${item.outcome}
            </div>
          </div>

        </div>

        <!-- Right: Sidebar Metadata & Services -->
        <aside class="cs-detail__sidebar">
          
          <div class="cs-detail__meta-card">
            <h4 class="cs-detail__meta-title">Services Delivered</h4>
            <div class="cs-detail__services-list">
              ${servicesHTML}
            </div>

            <div class="cs-detail__meta-divider"></div>

            <h4 class="cs-detail__meta-title">Delivery Model</h4>
            <div class="cs-detail__meta-item">
              <span class="cs-detail__meta-lbl">Model:</span>
              <span class="cs-detail__meta-val">100% White-Label Delivery</span>
            </div>
            <div class="cs-detail__meta-item">
              <span class="cs-detail__meta-lbl">NDA:</span>
              <span class="cs-detail__meta-val">Protected &amp; Confidential</span>
            </div>
            <div class="cs-detail__meta-item">
              <span class="cs-detail__meta-lbl">Industry:</span>
              <span class="cs-detail__meta-val">${item.category}</span>
            </div>

            <!-- In-Detail CTA -->
            <div class="cs-detail__meta-cta">
              <a href="contact.html" class="btn btn--primary" style="width: 100%; text-align: center;">
                Book a Discovery Call
              </a>
            </div>
          </div>

        </aside>

      </div>

      <!-- Project Gallery Visuals -->
      <section class="cs-detail__gallery" aria-label="Project Visual Gallery">
        <h3 class="cs-detail__section-title" style="margin-bottom: 24px;">Project Showcase</h3>
        <div class="cs-detail-gallery__grid">
          ${galleryHTML}
        </div>
      </section>

      <!-- Bottom Next / Previous Navigation -->
      <nav class="cs-detail__nav-bar" aria-label="Case Study Pagination">
        <button class="cs-detail__nav-btn" id="csDetailPrevBtn">
          <span class="cs-detail__nav-arrow">←</span>
          <div class="cs-detail__nav-info">
            <span class="cs-detail__nav-label">Previous Project</span>
            <span class="cs-detail__nav-title">${prevItem.title}</span>
          </div>
        </button>

        <button class="cs-detail__nav-btn cs-detail__nav-btn--next" id="csDetailNextBtn">
          <div class="cs-detail__nav-info" style="text-align: right;">
            <span class="cs-detail__nav-label">Next Project</span>
            <span class="cs-detail__nav-title">${nextItem.title}</span>
          </div>
          <span class="cs-detail__nav-arrow">→</span>
        </button>
      </nav>

    </div>
  `;
}
