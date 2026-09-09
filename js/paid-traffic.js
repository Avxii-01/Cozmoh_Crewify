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
const CALENDLY_URL = 'https://calendly.com/sociiofy/30min';

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
 * Helper to get clean hostname without www for browser bar
 */
function getCleanDomain(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch (e) {
    return url;
  }
}

/**
 * Render & Manage Continuous Auto-Scrolling Work Showcase Reel
 * Live website preview cards in restrained dark browser windows with interactive pausing & security fallbacks.
 */
function initWorkShowcaseReel() {
  const reelTrack = document.getElementById('ptWorkReelTrack');
  const showcaseSection = document.getElementById('work');
  if (!reelTrack || !workShowcaseItems.length) return;

  const renderCard = (work) => {
    const domain = getCleanDomain(work.url);
    const hasBlockedEmbed = Boolean(work.embedBlocked);

    return `
      <div class="pt-work-card" id="${work.id}">
        <div class="pt-work-browser">
          <div class="pt-work-browser-bar">
            <div class="pt-work-browser-dots" aria-hidden="true">
              <span class="pt-work-browser-dot"></span>
              <span class="pt-work-browser-dot"></span>
              <span class="pt-work-browser-dot"></span>
            </div>
            <a href="${work.url}" target="_blank" rel="noopener noreferrer" class="pt-work-browser-address" title="Open ${work.name} in new tab">
              <span class="pt-work-browser-domain">${domain}</span>
              <svg class="pt-work-browser-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>

          <div class="pt-work-preview">
            ${hasBlockedEmbed ? `
              <a href="${work.url}" target="_blank" rel="noopener noreferrer" class="pt-work-fallback" aria-label="Open ${work.name} in new tab">
                <div class="pt-work-fallback-content">
                  <span class="pt-work-fallback-domain">${domain}</span>
                  <span class="pt-work-fallback-btn">View live website →</span>
                </div>
              </a>
            ` : `
              <iframe
                src="${work.url}"
                title="${work.name}"
                loading="lazy"
                referrerpolicy="strict-origin-when-cross-origin">
              </iframe>
              <a href="${work.url}" target="_blank" rel="noopener noreferrer" class="pt-work-fallback pt-work-fallback--hidden" aria-label="Open ${work.name} in new tab">
                <div class="pt-work-fallback-content">
                  <span class="pt-work-fallback-domain">${domain}</span>
                  <span class="pt-work-fallback-btn">View live website →</span>
                </div>
              </a>
            `}
          </div>
        </div>

        <div class="pt-work-meta">
          <div class="pt-work-meta-header">
            <span class="pt-work-category">${work.category}</span>
            ${work.status ? `<span class="pt-work-status">${work.status}</span>` : ''}
          </div>
          <h3 class="pt-work-title">
            <a href="${work.url}" target="_blank" rel="noopener noreferrer" class="pt-work-title-link">
              ${work.name} <span class="pt-work-arrow" aria-hidden="true">↗</span>
            </a>
          </h3>
        </div>
      </div>
    `;
  };

  const renderPanels = (items) => items.map(renderCard).join('');

  // Render original + duplicate for continuous seamless marquee
  reelTrack.innerHTML = `
    <div class="pt-work-reel__set">${renderPanels(workShowcaseItems)}</div>
    <div class="pt-work-reel__set" aria-hidden="true">${renderPanels(workShowcaseItems)}</div>
  `;

  // Attach error listeners to iframes for genuine detectable failures only (no timers)
  const iframes = reelTrack.querySelectorAll('.pt-work-preview iframe');
  iframes.forEach(iframe => {
    iframe.addEventListener('error', () => {
      iframe.classList.add('pt-work-iframe--hidden');
      const fallback = iframe.parentElement ? iframe.parentElement.querySelector('.pt-work-fallback') : null;
      if (fallback) fallback.classList.remove('pt-work-fallback--hidden');
    });
  });

  // State flags for pausing movement
  let isHovered = false;
  let isTouching = false;
  let isIframeFocused = false;
  let isVisible = true;

  const updatePauseState = () => {
    if (!isVisible || isHovered || isTouching || isIframeFocused) {
      reelTrack.classList.add('is-paused');
    } else {
      reelTrack.classList.remove('is-paused');
    }
  };

  // Hover handling (cursor entering/leaving reelTrack)
  reelTrack.addEventListener('mouseenter', () => {
    isHovered = true;
    updatePauseState();
  });

  reelTrack.addEventListener('mouseleave', (e) => {
    // If pointer crossed into an iframe within reelTrack, preserve paused state
    const rect = reelTrack.getBoundingClientRect();
    const isInside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (isInside) {
      return;
    }
    isHovered = false;
    updatePauseState();
  });

  // Global mousemove check to resume if cursor moves out of the showcase area
  document.addEventListener('mousemove', (e) => {
    if (isHovered) {
      const rect = reelTrack.getBoundingClientRect();
      const isInside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!isInside) {
        isHovered = false;
        updatePauseState();
      }
    }
  }, { passive: true });

  // Touch handling
  reelTrack.addEventListener('touchstart', () => {
    isTouching = true;
    updatePauseState();
  }, { passive: true });

  reelTrack.addEventListener('touchend', () => {
    isTouching = false;
    setTimeout(updatePauseState, 1200);
  }, { passive: true });

  // Pause when an iframe inside the showcase receives focus (e.g. click/scroll inside preview)
  window.addEventListener('blur', () => {
    if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
      const parentPreview = document.activeElement.closest('.pt-work-preview');
      if (parentPreview) {
        isIframeFocused = true;
        updatePauseState();
      }
    }
  });

  // Resume when user returns to page or clicks outside iframe
  window.addEventListener('focus', () => {
    isIframeFocused = false;
    updatePauseState();
  });

  document.addEventListener('click', () => {
    if (isIframeFocused) {
      isIframeFocused = false;
      updatePauseState();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      isIframeFocused = false;
      updatePauseState();
    }
  });

  // Pause when not visible in viewport
  if ('IntersectionObserver' in window && showcaseSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        updatePauseState();
      });
    }, { threshold: 0.05 });

    observer.observe(showcaseSection);
  }
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
 * Load Calendly official popup widget script and stylesheet (ensures single load)
 * @param {Function} callback - Executed when Calendly widget is ready
 */
function loadCalendlyAssets(callback) {
  // Ensure Calendly widget stylesheet is loaded
  if (!document.querySelector('link[href*="calendly.com/assets/external/widget.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(link);
  }

  // If Calendly is already loaded and ready, execute callback
  if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
    if (typeof callback === 'function') callback();
    return;
  }

  // Ensure Calendly widget script is loaded only once
  let script = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');
  if (!script) {
    script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => {
      if (typeof callback === 'function') callback();
    };
    document.head.appendChild(script);
  } else {
    script.addEventListener('load', () => {
      if (typeof callback === 'function') callback();
    }, { once: true });
  }
}

/**
 * Open Calendly Official Popup Widget with Prefill Data
 * @param {Object} leadData - { fullName, email, agencyName, phone, outsourceNeeds }
 */
function openCalendlyPopup(leadData = {}) {
  if (!CALENDLY_URL || CALENDLY_URL.trim().length === 0) return;

  const attribution = getAttributionData();

  loadCalendlyAssets(() => {
    if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
      window.Calendly.initPopupWidget({
        url: CALENDLY_URL,
        prefill: {
          name: leadData.fullName || '',
          email: leadData.email || ''
        },
        utm: {
          utmSource: attribution.utm_source || undefined,
          utmMedium: attribution.utm_medium || undefined,
          utmCampaign: attribution.utm_campaign || undefined,
          utmContent: attribution.utm_content || undefined,
          utmTerm: attribution.utm_term || undefined
        }
      });
    }
  });
}

/**
 * Listen for Calendly Events from Popup
 */
function initCalendlyListener() {
  window.addEventListener('message', (e) => {
    if (e.origin && e.origin.includes('calendly.com') && e.data && e.data.event === 'calendly.event_scheduled') {
      dispatchTrackingEvent('booking_confirmed', {
        ...(currentBookingLead || {}),
        calendlyEventUri: e.data?.payload?.event?.uri || ''
      });
    }
  });
}

/**
 * Basic Details Form Submission & Direct Booking Flow Handler
 */
function initBookingFlow() {
  const form = document.getElementById('ptBookingForm');
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

    // Open Calendly official popup widget
    openCalendlyPopup(currentBookingLead);

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
  initCalendlyListener();
  loadCalendlyAssets();
  initSmoothScroll();
});
