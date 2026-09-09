/**
 * paid-traffic.js - Dedicated Conversion Logic for CREWiiFY Paid-Traffic Landing Page
 * 
 * Features:
 * 1. Single Source of Truth Case Studies Carousel with manual editorial controls & dynamic typography metrics
 * 2. Substantial Auto-Scrolling Work Showcase Reel with intelligent pause controls
 * 3. Seamless Unified Conversion Flow: First Project On Us + 5-Step Agency Survey + Contact Form
 * 4. Open Editorial Agency Economics Rate Table
 * 5. URL Attribution Tracking (UTM parameters)
 * 6. Contact Submission to api/contact.php with confirmation
 * 7. Header scroll state & smooth navigation
 */

import {
  proofConfig,
  landingCaseStudies,
  workShowcaseItems,
  agencyRatesCol1,
  agencyRatesCol2
} from './paid-traffic-data.js';

// ============================================================================
// CALENDLY CONFIGURATION
// The client will provide the real Calendly URL later.
// When provided, insert the actual Calendly URL here (e.g., 'https://calendly.com/your-org/discovery-call')
// ============================================================================
const CALENDLY_URL = '';

// Store collected lead data for future Calendly prefill integration
let currentBookingLead = null;
let activeCaseStudyIndex = 0;

/**
 * Event Tracking Dispatcher
 */
function dispatchTrackingEvent(eventName, detail = {}) {
  try {
    const event = new CustomEvent(`crewiify_${eventName}`, { detail });
    window.dispatchEvent(event);

    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: `crewiify_${eventName}`, ...detail });
    }
  } catch (err) {
    console.debug('Tracking event dispatch error:', err);
  }
}

/**
 * Initialize Proof Metrics from proofConfig
 */
function initProofMetrics() {
  const countEl = document.getElementById('ptProofProjects');
  const whiteLabelEl = document.getElementById('ptProofWhiteLabel');
  const ratingEl = document.getElementById('ptProofRating');

  if (countEl) countEl.textContent = proofConfig.projectsDelivered;
  if (whiteLabelEl) whiteLabelEl.textContent = proofConfig.whiteLabelRate;
  if (ratingEl) ratingEl.textContent = proofConfig.averageRating;
}

/**
 * Render Two-Column Full Agency Rate Sheet (All 22 Services Across 8 Categories)
 */
function renderRateTableColumn(containerId, categoryList) {
  const container = document.getElementById(containerId);
  if (!container || !categoryList) return;

  const html = `
    <div class="pt-rates-table__head">
      <div class="pt-rates-th">Service</div>
      <div class="pt-rates-th pt-rates-th--client">Typical Client Bill</div>
      <div class="pt-rates-th pt-rates-th--our">Our Rate</div>
      <div class="pt-rates-th pt-rates-th--keep">You Keep</div>
    </div>
    <div class="pt-rates-table__content">
      ${categoryList.map(cat => `
        <div class="pt-rates-category-group">
          <div class="pt-rates-category-header">
            <span class="pt-rates-category-label">${cat.categoryLabel}</span>
            <span class="pt-rates-billing-label">${cat.billingLabel}</span>
          </div>
          ${cat.services.map(s => `
            <div class="pt-rates-row">
              <div class="pt-rates-col-service">
                <div class="pt-rates-service-title">${s.name}</div>
                <div class="pt-rates-service-scope">${s.description}</div>
              </div>
              <div class="pt-rates-val pt-rates-val--client pt-rates-col--desktop">${s.clientBill}</div>
              <div class="pt-rates-val pt-rates-val--our pt-rates-col--desktop">${s.ourRate}</div>
              <div class="pt-rates-val pt-rates-val--keep pt-rates-col--desktop">${s.youKeep}</div>
              
              <!-- Mobile Stacked Metric Cards View -->
              <div class="pt-rates-mobile-metrics">
                <div class="pt-rates-m-item pt-rates-m-item--client">
                  <span class="pt-rates-m-lbl pt-rates-m-lbl--client">Client Bill</span>
                  <span class="pt-rates-val pt-rates-val--client">${s.clientBill}</span>
                </div>
                <div class="pt-rates-m-item pt-rates-m-item--our">
                  <span class="pt-rates-m-lbl pt-rates-m-lbl--our">Our Rate</span>
                  <span class="pt-rates-val pt-rates-val--our">${s.ourRate}</span>
                </div>
                <div class="pt-rates-m-item pt-rates-m-item--keep">
                  <span class="pt-rates-m-lbl pt-rates-m-lbl--keep">You Keep</span>
                  <span class="pt-rates-val pt-rates-val--keep">${s.youKeep}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;

  container.innerHTML = html;
}

function initRatesPreview() {
  renderRateTableColumn('ptRatesTableCol1', agencyRatesCol1);
  renderRateTableColumn('ptRatesTableCol2', agencyRatesCol2);
}

/**
 * Hero Watermark Dual Metallic Light Sweep & 20% Local Interaction Radius
 * Reusing exact homepage animation and physics.
 */
function initHeroLightSweep() {
  const heroSection = document.getElementById('hero');
  const ghostWrapper = document.getElementById('heroGhostWrapper');

  if (!heroSection || !ghostWrapper) return;

  let scanProgress = 0;
  const scanSpeed = 0.0015; // ~9s base cycle duration
  let isHoveringWatermark = false;
  let rafScanId = null;
  let isHeroVisible = true;

  function cursorPercentToScanProgress(cursorXPercent) {
    const clampedX = Math.max(-15, Math.min(115, cursorXPercent));
    const easeProgress = (clampedX + 15) / 130;
    const cosValue = Math.max(-1, Math.min(1, 1 - 2 * easeProgress));
    return Math.acos(cosValue) / Math.PI;
  }

  function updateScanCssVariables(ease) {
    const primaryX = -15 + ease * 130;
    const primaryY = 115 - ease * 130;

    const trailProgress = Math.max(0, ease - 0.14);
    const trailX = -15 + trailProgress * 130;
    const trailY = 115 - trailProgress * 130;

    ghostWrapper.style.setProperty('--scan-x', `${primaryX.toFixed(1)}%`);
    ghostWrapper.style.setProperty('--scan-y', `${primaryY.toFixed(1)}%`);
    ghostWrapper.style.setProperty('--trail-x', `${trailX.toFixed(1)}%`);
    ghostWrapper.style.setProperty('--trail-y', `${trailY.toFixed(1)}%`);
  }

  function animateTravellingLight() {
    if (!isHeroVisible) return;
    if (window.innerWidth <= 768) {
      rafScanId = requestAnimationFrame(animateTravellingLight);
      return;
    }

    if (!isHoveringWatermark) {
      let currentStep = scanSpeed;
      if (scanProgress > 0.35 && scanProgress < 0.65) {
        currentStep *= 0.75;
      }

      scanProgress += currentStep;
      if (scanProgress > 1) {
        scanProgress = 0;
      }

      const easeProgress = 0.5 - Math.cos(scanProgress * Math.PI) / 2;
      updateScanCssVariables(easeProgress);
    }

    rafScanId = requestAnimationFrame(animateTravellingLight);
  }

  rafScanId = requestAnimationFrame(animateTravellingLight);

  const heroVisibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!isHeroVisible) {
          isHeroVisible = true;
          rafScanId = requestAnimationFrame(animateTravellingLight);
        }
      } else {
        isHeroVisible = false;
        if (rafScanId) {
          cancelAnimationFrame(rafScanId);
          rafScanId = null;
        }
      }
    });
  }, { rootMargin: '100px' });

  heroVisibilityObserver.observe(heroSection);

  document.addEventListener('mousemove', (e) => {
    if (!isHeroVisible || window.innerWidth <= 768) return;

    const rect = ghostWrapper.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const wrapperCenterX = rect.left + rect.width / 2;
    const wrapperCenterY = rect.top + rect.height / 2;
    const paddingX = rect.width * 0.70;
    const paddingY = rect.height * 0.75;

    const isInsideLocalZone =
      Math.abs(e.clientX - wrapperCenterX) < paddingX &&
      Math.abs(e.clientY - wrapperCenterY) < paddingY;

    if (isInsideLocalZone) {
      if (!isHoveringWatermark) {
        isHoveringWatermark = true;
        ghostWrapper.classList.add('is-cursor-active');
      }

      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      ghostWrapper.style.setProperty('--mouse-x', `${relX.toFixed(1)}px`);
      ghostWrapper.style.setProperty('--mouse-y', `${relY.toFixed(1)}px`);

      const cursorPercentX = (relX / rect.width) * 100;
      scanProgress = cursorPercentToScanProgress(cursorPercentX);
      const easeProgress = 0.5 - Math.cos(scanProgress * Math.PI) / 2;
      updateScanCssVariables(easeProgress);

    } else if (isHoveringWatermark) {
      isHoveringWatermark = false;
      ghostWrapper.classList.remove('is-cursor-active');
    }
  }, { passive: true });
}

/**
 * Render & Manage Case Studies Carousel
 * Combined editorial cards: authentic image + project info + internal divider + verified results.
 * Restrained side-by-side editorial navigation controls.
 */
function initCaseStudiesCarousel() {
  const track = document.getElementById('ptCsTrack');
  const prevBtn = document.getElementById('ptCsPrevBtn');
  const nextBtn = document.getElementById('ptCsNextBtn');

  if (!track || !landingCaseStudies.length) return;

  // Render combined cards with ~40-45% image, ~25-30% content, divider, and ~25-30% verified results
  track.innerHTML = landingCaseStudies.map((cs, idx) => `
    <article class="pt-cs-card ${idx === 0 ? 'is-active' : ''}" data-index="${idx}" id="${cs.id}" tabindex="0" role="group" aria-label="${cs.title}">
      <div class="pt-cs-card__media">
        <img src="${cs.image}" alt="${cs.title}" class="pt-cs-card__img" loading="lazy">
        <span class="pt-cs-card__category">${cs.category}</span>
      </div>
      <div class="pt-cs-card__content">
        <h3 class="pt-cs-card__title">${cs.title}</h3>
        <p class="pt-cs-card__desc">${cs.description}</p>
      </div>
      <div class="pt-cs-card__divider"></div>
      <div class="pt-cs-card__results">
        <div class="pt-cs-card__primary-result">
          <span class="pt-cs-card__result-val">${cs.primaryValue}</span>
          <span class="pt-cs-card__result-lbl">${cs.primaryLabel}</span>
        </div>
        ${cs.metrics && cs.metrics.length > 0 ? `
          <div class="pt-cs-card__secondary-metrics">
            ${cs.metrics.slice(0, 2).map(m => `
              <div class="pt-cs-card__sec-metric">
                <span class="pt-cs-card__sec-val">${m.value}</span>
                <span class="pt-cs-card__sec-lbl">${m.label}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </article>
  `).join('');

  // Update prev / next button states based on track scroll position
  function updateNavButtons() {
    if (!prevBtn || !nextBtn) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    prevBtn.disabled = track.scrollLeft <= 5;
    nextBtn.disabled = track.scrollLeft >= maxScroll - 5;
  }

  // Navigation: scroll left / right by one card step
  function scrollCard(direction) {
    const card = track.querySelector('.pt-cs-card');
    if (!card) return;
    const cardRect = card.getBoundingClientRect();
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap) || 24;
    const step = cardRect.width + gap;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => scrollCard(-1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => scrollCard(1));
  }

  // Update button states on scroll and resize
  track.addEventListener('scroll', () => {
    updateNavButtons();
  }, { passive: true });

  window.addEventListener('resize', () => {
    updateNavButtons();
  }, { passive: true });

  // Initial update
  updateNavButtons();
}

/**
 * Render & Manage Continuous Auto-Scrolling Work Showcase Reel
 * Large visual media tiles in subtle browser frame with comfortable description below.
 */
function initWorkShowcaseReel() {
  const reelTrack = document.getElementById('ptWorkReelTrack');
  const showcaseSection = document.getElementById('work');
  if (!reelTrack || !workShowcaseItems.length) return;

  const renderPanels = (items) => items.map(work => `
    <article class="pt-work-tile" id="${work.id}">
      <div class="pt-work-tile__frame">
        <div class="pt-work-tile__frame-bar" aria-hidden="true">
          <span class="pt-work-tile__dot"></span>
          <span class="pt-work-tile__dot"></span>
          <span class="pt-work-tile__dot"></span>
        </div>
        <div class="pt-work-tile__media">
          <img src="${work.image}" alt="${work.title}" class="pt-work-tile__img" loading="lazy">
        </div>
      </div>
      <div class="pt-work-tile__info">
        <span class="pt-work-tile__category">${work.type}</span>
        <h3 class="pt-work-tile__title">${work.title}</h3>
        <p class="pt-work-tile__client">${work.client}</p>
      </div>
    </article>
  `).join('');

  // Render original + duplicate for continuous seamless marquee
  reelTrack.innerHTML = `
    <div class="pt-work-reel__set">${renderPanels(workShowcaseItems)}</div>
    <div class="pt-work-reel__set" aria-hidden="true">${renderPanels(workShowcaseItems)}</div>
  `;

  // Pause when not visible in viewport
  if ('IntersectionObserver' in window && showcaseSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reelTrack.classList.remove('is-paused');
        } else {
          reelTrack.classList.add('is-paused');
        }
      });
    }, { threshold: 0.1 });

    observer.observe(showcaseSection);
  }

  // Pause on pointer / touch interaction
  reelTrack.addEventListener('mouseenter', () => reelTrack.classList.add('is-paused'));
  reelTrack.addEventListener('mouseleave', () => reelTrack.classList.remove('is-paused'));
  reelTrack.addEventListener('touchstart', () => reelTrack.classList.add('is-paused'), { passive: true });
  reelTrack.addEventListener('touchend', () => {
    setTimeout(() => reelTrack.classList.remove('is-paused'), 1500);
  }, { passive: true });
}



/**
 * Extract UTM Attribution Parameters from URL
 */
function getAttributionData() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    utm_term: params.get('utm_term') || ''
  };
}

/**
 * Initialize Calendly Embed or Fallback Placeholder
 * @param {Object} bookingData - Collected lead data { fullName, agencyName, email, website, phone, outsourceNeeds }
 */
function initCalendlyEmbed(bookingData = {}) {
  const container = document.getElementById('ptCalendlyEmbedContainer');
  if (!container) return;

  if (CALENDLY_URL && CALENDLY_URL.trim().length > 0) {
    // Real Calendly URL configured: render official Calendly inline widget
    const params = new URLSearchParams();
    if (bookingData.fullName) params.set('name', bookingData.fullName);
    if (bookingData.email) params.set('email', bookingData.email);

    // UTM Attribution
    const attribution = getAttributionData();
    if (attribution.utm_source) params.set('utm_source', attribution.utm_source);
    if (attribution.utm_medium) params.set('utm_medium', attribution.utm_medium);
    if (attribution.utm_campaign) params.set('utm_campaign', attribution.utm_campaign);
    if (attribution.utm_content) params.set('utm_content', attribution.utm_content);
    if (attribution.utm_term) params.set('utm_term', attribution.utm_term);

    const queryStr = params.toString();
    const finalCalendlyUrl = queryStr ? `${CALENDLY_URL}?${queryStr}` : CALENDLY_URL;

    container.innerHTML = `
      <div class="calendly-inline-widget" data-url="${finalCalendlyUrl}" style="min-width:320px;height:700px;"></div>
    `;

    // Ensure Calendly widget script is loaded
    if (!document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.head.appendChild(script);
    }
  } else {
    // No real URL configured yet: show polished temporary placeholder
    const placeholder = document.getElementById('ptCalendlyPlaceholder');
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  }
}

/**
 * Basic Details Form Submission & Direct Booking Flow Handler
 */
function initBookingFlow() {
  const form = document.getElementById('ptBookingForm');
  const formCard = document.getElementById('ptBookingFormCard');
  const calendlyArea = document.getElementById('ptCalendlyArea');

  if (!form) return;

  function markFieldError(fieldName, message) {
    const input = form[fieldName];
    if (input) {
      input.classList.add('is-invalid');
      const fieldWrap = input.closest('.pt-conversion-field');
      if (fieldWrap) {
        fieldWrap.classList.add('has-error');
        const errSpan = fieldWrap.querySelector('.pt-conversion-error');
        if (errSpan) errSpan.textContent = message;
      }
    }
  }

  function clearFieldError(input) {
    input.classList.remove('is-invalid');
    const fieldWrap = input.closest('.pt-conversion-field');
    if (fieldWrap) fieldWrap.classList.remove('has-error');
  }

  // Clear errors on input correction
  form.querySelectorAll('.pt-conversion-input, .pt-conversion-textarea').forEach(input => {
    input.addEventListener('input', () => clearFieldError(input));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset error states
    form.querySelectorAll('.pt-conversion-field').forEach(f => f.classList.remove('has-error'));
    form.querySelectorAll('.pt-conversion-input, .pt-conversion-textarea').forEach(i => i.classList.remove('is-invalid'));

    const fullName = form.fullName?.value.trim() || '';
    const agencyName = form.agencyName?.value.trim() || '';
    const email = form.email?.value.trim() || '';
    const website = form.website?.value.trim() || '';
    const phone = form.phone?.value.trim() || '';
    const outsourceNeeds = form.outsourceNeeds?.value.trim() || '';
    const websiteHp = form.website_hp?.value.trim() || '';

    // Anti-spam check
    if (websiteHp.length > 0) return;

    let hasError = false;

    // 1. Full Name: min 2 characters
    if (fullName.length < 2) {
      markFieldError('fullName', 'Please enter your full name (minimum 2 characters).');
      hasError = true;
    }

    // 2. Agency Name: min 2 characters
    if (agencyName.length < 2) {
      markFieldError('agencyName', 'Please enter your agency name (minimum 2 characters).');
      hasError = true;
    }

    // 3. Work Email: valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      markFieldError('email', 'Please enter a valid work email address.');
      hasError = true;
    }

    // 4. Website: optional, validate if provided
    if (website.length > 0) {
      try {
        const urlObj = new URL(website.startsWith('http://') || website.startsWith('https://') ? website : `https://${website}`);
        if (!urlObj.hostname || !urlObj.hostname.includes('.')) {
          markFieldError('website', 'Please enter a valid website URL.');
          hasError = true;
        }
      } catch (_) {
        markFieldError('website', 'Please enter a valid website URL.');
        hasError = true;
      }
    }

    // 5. Phone / WhatsApp: min 6 characters / digits
    const phoneDigits = phone.replace(/\D/g, '');
    if (phone.length < 6 || phoneDigits.length < 6) {
      markFieldError('phone', 'Please enter a valid phone or WhatsApp number (minimum 6 digits).');
      hasError = true;
    }

    if (hasError) {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Validation succeeded: preserve collected values in a clean object
    currentBookingLead = {
      fullName,
      agencyName,
      email,
      website,
      phone,
      outsourceNeeds,
      timestamp: new Date().toISOString()
    };

    // Transition from form to Calendly stage
    if (formCard) {
      formCard.style.display = 'none';
    }

    if (calendlyArea) {
      calendlyArea.style.display = 'block';
      initCalendlyEmbed(currentBookingLead);
      calendlyArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Dispatch tracking event
    dispatchTrackingEvent('booking_step_complete', {
      agencyName: currentBookingLead.agencyName,
      leadSource: 'Paid Traffic Landing Page'
    });
  });
}

/**
 * Header Scroll State (Matching homepage behavior)
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }, { passive: true });
}

/**
 * Smooth Scroll Anchor Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;

      const targetElem = document.getElementById(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * Main Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  initHeroLightSweep();
  initHeaderScroll();
  initProofMetrics();
  initRatesPreview();
  initCaseStudiesCarousel();
  initWorkShowcaseReel();
  initBookingFlow();
  initSmoothScroll();
});
