/**
 * seo.js - Isolated Logic Controller for CREWiiFY Dedicated SEO Landing Page
 * 
 * Strict Isolation:
 * - Operates solely within the #seo-* and .seo-* namespace.
 * - Does not alter any global or paid-traffic scripts.
 * - Mobile-first touch handlers & responsive listeners.
 * - Inline Calendly integration preparation.
 */

import {
  calendlyConfig,
  seoHeroData,
  seoTrustData,
  seoResultsData,
  seoWorkData,
  seoAuditCtaData,
  seoPricingData,
  seoEconomicsData,
  seoProcessData,
  seoOnboardingData,
  seoAuditShowcaseData,
  seoFaqData,
  seoFinalCtaData
} from './seo-data.js';

// ============================================================================
// ANALYTICS & EVENT TRACKING DISPATCHER
// ============================================================================
export function dispatchSeoTrackingEvent(eventName, detail = {}) {
  try {
    const event = new CustomEvent(`crewiify_seo_${eventName}`, { detail });
    window.dispatchEvent(event);

    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: `crewiify_seo_${eventName}`, ...detail });
    }
    
    // Meta Pixel integration if available
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', `SEO_${eventName}`, detail);
    }
  } catch (err) {
    console.debug('SEO tracking event error:', err);
  }
}

// ============================================================================
// HEADER SCROLL & MOBILE TOUCH CONTROLLER
// ============================================================================
function initHeaderScroll() {
  const header = document.getElementById('seoHeader');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add('seo-header--scrolled');
    } else {
      header.classList.remove('seo-header--scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ============================================================================
// SMOOTH ANCHOR NAVIGATION FOR MOBILE & DESKTOP
// ============================================================================
function initAnchorNavigation() {
  document.querySelectorAll('a[href^="#seo-"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      // Ignore booking triggers that open the Calendly modal
      if (
        anchor.classList.contains('js-seo-open-calendly') ||
        anchor.classList.contains('js-seo-calendly-btn') ||
        anchor.id === 'seoHeaderCta' ||
        anchor.hasAttribute('data-open-calendly')
      ) {
        return;
      }

      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId) ||
                       (targetId === '#seo-audit' ? document.querySelector('#seo-audit-cta') : null);
      if (targetEl) {
        e.preventDefault();
        const headerEl = document.getElementById('seoHeader');
        const headerOffset = headerEl ? headerEl.offsetHeight + 16 : 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        dispatchSeoTrackingEvent('anchor_navigate', {
          target: targetId,
          sourceText: anchor.textContent.trim()
        });
      }
    });
  });
}

// ============================================================================
// ROBUST MODAL SCROLL LOCK CONTROLLER
// ============================================================================
const SeoScrollLock = {
  lockCount: 0,
  savedScrollY: 0,
  scrollbarWidth: 0,

  lock(scrollY = null) {
    if (this.lockCount === 0) {
      this.savedScrollY = scrollY !== null ? scrollY : (window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0);
      this.scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.documentElement.classList.add('seo-scroll-locked');
      document.body.classList.add('seo-modal-open');

      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.savedScrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';

      if (this.scrollbarWidth > 0) {
        document.body.style.paddingRight = `${this.scrollbarWidth}px`;
        const header = document.getElementById('seoHeader');
        if (header) header.style.paddingRight = `${this.scrollbarWidth}px`;
      }

      window.addEventListener('touchmove', this._preventBackgroundScroll, { passive: false });
      window.addEventListener('wheel', this._preventBackgroundWheel, { passive: false });
    }
    this.lockCount++;
  },

  unlock() {
    this.lockCount = Math.max(0, this.lockCount - 1);
    if (this.lockCount === 0) {
      window.removeEventListener('touchmove', this._preventBackgroundScroll);
      window.removeEventListener('wheel', this._preventBackgroundWheel);

      const restoreScrollY = this.savedScrollY;

      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';

      const header = document.getElementById('seoHeader');
      if (header) header.style.paddingRight = '';

      document.documentElement.classList.remove('seo-scroll-locked');
      document.body.classList.remove('seo-modal-open');

      const prevBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, restoreScrollY);
      requestAnimationFrame(() => {
        window.scrollTo(0, restoreScrollY);
        document.documentElement.style.scrollBehavior = prevBehavior;
      });

      return restoreScrollY;
    }
    return this.savedScrollY;
  },

  _preventBackgroundScroll(e) {
    const isInsideScrollable = e.target.closest(
      '.seo-calendly-modal__body, .seo-calendly-modal__widget, .seo-audit-showcase-modal__body, .seo-audit-showcase-modal__dialog'
    );
    if (!isInsideScrollable && e.cancelable) {
      e.preventDefault();
    }
  },

  _preventBackgroundWheel(e) {
    const isInsideScrollable = e.target.closest(
      '.seo-calendly-modal__body, .seo-calendly-modal__widget, .seo-audit-showcase-modal__body, .seo-audit-showcase-modal__dialog'
    );
    if (!isInsideScrollable && e.cancelable) {
      e.preventDefault();
    }
  }
};

// ============================================================================
// CALENDLY EMBED & INLINE WIDGET CONTROLLER
// ============================================================================
export function initSeoCalendly() {
  const calendlyUrl = calendlyConfig.url;
  const modal = document.getElementById('seoCalendlyModal');
  const modalBackdrop = document.getElementById('seoCalendlyModalBackdrop');
  const modalClose = document.getElementById('seoCalendlyModalClose');
  const modalDialog = modal ? modal.querySelector('.seo-calendly-modal__dialog') : null;
  const container = document.getElementById(calendlyConfig.embedContainerId || 'seoCalendlyInlineWidget');

  // Build target URL with preserved UTM parameters and dark-mode aesthetics
  const buildTrackingUrl = () => {
    try {
      const currentUrl = new URL(window.location.href);
      const target = new URL(calendlyUrl);

      calendlyConfig.utmParams.forEach((param) => {
        if (currentUrl.searchParams.has(param)) {
          target.searchParams.set(param, currentUrl.searchParams.get(param));
        }
      });

      // Integrated styling parameters matching dark editorial palette
      target.searchParams.set('hide_landing_page_details', '1');
      target.searchParams.set('hide_gdpr_banner', '1');
      target.searchParams.set('background_color', '0a0a0d');
      target.searchParams.set('text_color', 'f5f5f5');
      target.searchParams.set('primary_color', '8b5cf6');

      return target.toString();
    } catch {
      return `${calendlyUrl}?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=0a0a0d&text_color=f5f5f5&primary_color=8b5cf6`;
    }
  };

  const finalUrl = buildTrackingUrl();
  let calendlyMounted = false;
  let lastActiveTrigger = null;
  let previousScrollY = 0;

  const mountCalendly = () => {
    if (calendlyMounted || !container) return;
    calendlyMounted = true;
    container.setAttribute('data-url', finalUrl);

    if (window.Calendly && typeof window.Calendly.initInlineWidget === 'function') {
      container.innerHTML = '';
      window.Calendly.initInlineWidget({
        url: finalUrl,
        parentElement: container
      });
    } else {
      // High-reliability responsive iframe fallback
      container.innerHTML = `<iframe src="${finalUrl}" width="100%" height="100%" frameborder="0" title="Schedule a White-Label SEO Discovery Call" style="border:none;min-height:100%;width:100%;border-radius:14px;background:transparent;"></iframe>`;
    }
  };

  const openModal = (triggerEl = null) => {
    if (!modal) return;
    lastActiveTrigger = triggerEl || document.activeElement;
    previousScrollY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    if (window.__seoAuditAutoScrollCtrl) {
      window.__seoAuditAutoScrollCtrl.pause();
    }
    SeoScrollLock.lock(previousScrollY);

    // Mount Calendly widget on first open if not yet mounted
    if (!calendlyMounted) {
      let script = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        script.onload = mountCalendly;
        script.onerror = mountCalendly;
        document.head.appendChild(script);
      } else if (window.Calendly) {
        mountCalendly();
      } else {
        script.addEventListener('load', mountCalendly);
        script.addEventListener('error', mountCalendly);
      }
    }

    if (modalClose) {
      modalClose.focus();
    }

    dispatchSeoTrackingEvent('calendly_modal_open', {
      source: triggerEl?.id || 'booking_cta'
    });
  };

  const closeModal = () => {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    
    SeoScrollLock.unlock();

    if (window.__seoAuditAutoScrollCtrl) {
      window.__seoAuditAutoScrollCtrl.resume();
    }

    // Safely restore focus without triggering browser scroll jumps
    if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
      try {
        lastActiveTrigger.focus({ preventScroll: true });
      } catch {
        // Fallback for older browsers
      }
    }

    // Explicitly guarantee window stays at exact previousScrollY without modifying window.location.hash
    window.scrollTo({ top: previousScrollY, left: 0, behavior: 'instant' });
    requestAnimationFrame(() => {
      window.scrollTo({ top: previousScrollY, left: 0, behavior: 'instant' });
    });

    dispatchSeoTrackingEvent('calendly_modal_close', {
      source: 'modal_close'
    });
  };

  // Wire all booking CTAs on the SEO page to open the internal modal
  const bookingTriggers = document.querySelectorAll(
    '#seoHeroSecondaryCta, #seoOpenCalendlyBtn, #seoHeaderCta, .js-seo-open-calendly, [data-open-calendly]'
  );

  bookingTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openModal(btn);
    });
  });

  // Explicit close handlers with preventDefault & stopPropagation
  if (modalClose) {
    modalClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      }
    });
  }

  // Backdrop click handling outside modal dialog
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === modalBackdrop) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    }
  });

  // Clicks inside the modal content must NOT close the modal and stop backdrop propagation
  if (modalDialog) {
    modalDialog.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Escape key closes modal cleanly without navigating or scrolling
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    }
  });
}

// ============================================================================
// MOBILE-FIRST TOUCH & RESIZE STABILITY
// ============================================================================
function initViewportStability() {
  // Prevent any horizontal jitter on mobile address bar collapse/expand
  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setVh();
  window.addEventListener('resize', setVh, { passive: true });
}

// ============================================================================
// SECTION HOOKS FOR INDIVIDUAL IMPLEMENTATION
// ============================================================================
export const sectionControllers = {
  hero: () => {
    const primaryCta = document.getElementById('seoHeroPrimaryCta');
    const secondaryCta = document.getElementById('seoHeroSecondaryCta');

    if (primaryCta) {
      primaryCta.addEventListener('click', () => {
        dispatchSeoTrackingEvent('hero_primary_cta_click', {
          ctaText: primaryCta.textContent.trim(),
          destination: '#seo-audit-cta'
        });
      });
    }

    if (secondaryCta) {
      secondaryCta.addEventListener('click', () => {
        dispatchSeoTrackingEvent('hero_secondary_cta_click', {
          ctaText: secondaryCta.textContent.trim(),
          action: 'open_calendly_modal'
        });
      });
    }
  },
  trust: () => {
    const projectsEl = document.getElementById('seoProofProjects');
    const whiteLabelEl = document.getElementById('seoProofWhiteLabel');
    const ratingEl = document.getElementById('seoProofRating');

    if (projectsEl && seoTrustData.proof?.projectsDelivered) {
      projectsEl.textContent = seoTrustData.proof.projectsDelivered;
    }
    if (whiteLabelEl && seoTrustData.proof?.whiteLabelRate) {
      whiteLabelEl.textContent = seoTrustData.proof.whiteLabelRate;
    }
    if (ratingEl && seoTrustData.proof?.averageRating) {
      ratingEl.textContent = seoTrustData.proof.averageRating;
    }
  },
  results: () => {
    const track = document.getElementById('seoCsTrack');
    const prevBtn = document.getElementById('seoCsPrevBtn');
    const nextBtn = document.getElementById('seoCsNextBtn');

    if (!track) return;

    function updateNavButtons() {
      if (!prevBtn || !nextBtn) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      prevBtn.disabled = track.scrollLeft <= 5;
      nextBtn.disabled = track.scrollLeft >= maxScroll - 5;
    }

    function scrollCard(direction) {
      const card = track.querySelector('.seo-cs-card');
      if (!card) return;
      const cardRect = card.getBoundingClientRect();
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap) || 24;
      const step = cardRect.width + gap;
      track.scrollBy({ left: direction * step, behavior: 'smooth' });

      dispatchSeoTrackingEvent('results_carousel_nav', {
        direction: direction > 0 ? 'next' : 'prev'
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => scrollCard(-1));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => scrollCard(1));
    }

    track.addEventListener('scroll', updateNavButtons, { passive: true });
    window.addEventListener('resize', updateNavButtons, { passive: true });

    updateNavButtons();
  },
  work: () => {
    const track = document.getElementById('seoWorkTrack');
    const prevBtn = document.getElementById('seoWorkPrevBtn');
    const nextBtn = document.getElementById('seoWorkNextBtn');

    if (!track) return;

    // Attach genuine detectable error listeners to iframes for clean fallback
    const iframes = track.querySelectorAll('.seo-work-preview iframe');
    iframes.forEach((iframe) => {
      iframe.addEventListener('error', () => {
        iframe.classList.add('seo-work-iframe--hidden');
        const fallback = iframe.parentElement ? iframe.parentElement.querySelector('.seo-work-fallback') : null;
        if (fallback) fallback.classList.remove('seo-work-fallback--hidden');
      });
    });

    function updateNavButtons() {
      if (!prevBtn || !nextBtn) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      prevBtn.disabled = track.scrollLeft <= 5;
      nextBtn.disabled = track.scrollLeft >= maxScroll - 5;
    }

    function scrollWork(direction) {
      const card = track.querySelector('.seo-work-card');
      if (!card) return;
      const cardRect = card.getBoundingClientRect();
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap) || 24;
      const step = cardRect.width + gap;
      track.scrollBy({ left: direction * step, behavior: 'smooth' });

      dispatchSeoTrackingEvent('work_carousel_nav', {
        direction: direction > 0 ? 'next' : 'prev'
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => scrollWork(-1));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => scrollWork(1));
    }

    track.addEventListener('scroll', updateNavButtons, { passive: true });
    window.addEventListener('resize', updateNavButtons, { passive: true });

    updateNavButtons();
  },
  auditCta: () => {
    const auditBtn = document.getElementById('seoAuditPrimaryBtn');
    if (auditBtn) {
      auditBtn.addEventListener('click', () => {
        dispatchSeoTrackingEvent('audit_cta_click', {
          destination: '#seo-final-cta',
          section: '05_free_seo_audit_cta'
        });
      });
    }
  },
  pricing: () => {
    const pricingBtns = document.querySelectorAll('.js-seo-pricing-cta');
    pricingBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        dispatchSeoTrackingEvent('pricing_cta_click', {
          package: btn.getAttribute('data-package') || 'unknown',
          destination: '#seo-final-cta'
        });
      });
    });
  },
  economics: () => {
    const econCards = document.querySelectorAll('.seo-economics-card');
    econCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const id = card.getAttribute('id') || 'unknown';
        dispatchSeoTrackingEvent('economics_card_hover', { cardId: id });
      }, { once: true });
    });
  },
  process: () => {
    const processSteps = document.querySelectorAll('.seo-process-step');
    processSteps.forEach((step) => {
      step.addEventListener('mouseenter', () => {
        const id = step.getAttribute('id') || 'unknown';
        dispatchSeoTrackingEvent('process_step_hover', { stepId: id });
      }, { once: true });
    });
  },
  onboarding: () => {
    const items = document.querySelectorAll('.seo-onboarding-item');
    items.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        const num = item.querySelector('.seo-onboarding-item__num')?.textContent.trim() || 'unknown';
        dispatchSeoTrackingEvent('onboarding_item_hover', { itemNum: num });
      }, { once: true });
    });
  },
  auditShowcase: () => {
    const slides = seoAuditShowcaseData.slides || [];
    if (!slides.length) return;

    const viewerBody = document.getElementById('seoAuditViewerBody');
    const pageCountEl = document.getElementById('seoAuditPageCount');

    if (pageCountEl) {
      pageCountEl.textContent = `${slides.length} pages`;
    }

    // Modal elements
    const modal = document.getElementById('seoAuditShowcaseModal');
    const modalBackdrop = document.getElementById('seoAuditModalBackdrop');
    const modalClose = document.getElementById('seoAuditModalClose');
    const modalTag = document.getElementById('seoAuditModalTag');
    const modalTitle = document.getElementById('seoAuditModalTitle');
    const modalWebp = document.getElementById('seoAuditModalWebp');
    const modalImg = document.getElementById('seoAuditModalImg');
    const modalDesc = document.getElementById('seoAuditModalDesc');
    const modalPrev = document.getElementById('seoAuditModalPrev');
    const modalNext = document.getElementById('seoAuditModalNext');
    const modalCounter = document.getElementById('seoAuditModalCounter');
    const showcaseCta = document.getElementById('seoAuditShowcaseCta');

    let modalSlideIndex = 0;
    let lastActiveTrigger = null;

    // Populate the vertical document viewer with all pages
    if (viewerBody) {
      viewerBody.innerHTML = slides.map((slide, idx) => `
        <div class="seo-audit-viewer__page" data-page-index="${idx}" tabindex="0" role="button" aria-label="View page ${idx + 1}: ${slide.title}">
          <picture>
            <source srcset="${slide.imageWebp}" type="image/webp">
            <img src="${slide.imagePng}" alt="${slide.alt}" class="seo-audit-viewer__page-img" loading="${idx < 2 ? 'eager' : 'lazy'}" width="1920" height="1080">
          </picture>
        </div>
      `).join('');

      // Add click & keyboard handler to open modal for high-res inspection
      viewerBody.querySelectorAll('.seo-audit-viewer__page').forEach((pageEl) => {
        const handleOpen = () => {
          const idx = parseInt(pageEl.getAttribute('data-page-index'), 10);
          openLightbox(idx, pageEl);
        };

        pageEl.addEventListener('click', handleOpen);
        pageEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
          }
        });
      });

      // Initialize Auto-Scroll engine
      initAuditViewerAutoScroll(viewerBody);
    }

    function initAuditViewerAutoScroll(element) {
      if (!element) return;

      // Respect prefers-reduced-motion: reduce
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
      if (prefersReduced && prefersReduced.matches) {
        return;
      }

      // Cancel any existing loop to prevent duplicates
      if (element.__autoScrollRafId) {
        cancelAnimationFrame(element.__autoScrollRafId);
        element.__autoScrollRafId = null;
      }
      if (element.__stateTimer) {
        clearTimeout(element.__stateTimer);
        element.__stateTimer = null;
      }
      if (element.__inactivityTimer) {
        clearTimeout(element.__inactivityTimer);
        element.__inactivityTimer = null;
      }

      let isPausedByUser = false;
      let isTouching = false;
      let isExternalPaused = false;
      let lastTimestamp = null;
      let state = 'scrolling_down'; // 'scrolling_down' | 'paused_at_bottom' | 'returning_to_top' | 'paused_at_top'

      // Responsive speeds matching target specifications:
      // Desktop: approximately 20–30 pixels/second (24px/s)
      // Tablet: approximately 15–25 pixels/second (18px/s)
      // Mobile: approximately 8–15 pixels/second (10px/s)
      const getVelocity = () => {
        const w = window.innerWidth;
        if (w >= 1024) return 24;
        if (w >= 768) return 18;
        return 10;
      };

      const resetInactivityTimer = () => {
        if (element.__inactivityTimer) {
          clearTimeout(element.__inactivityTimer);
        }
        element.__inactivityTimer = setTimeout(() => {
          isPausedByUser = false;
          lastTimestamp = null;
        }, 3000);
      };

      const pauseForInteraction = () => {
        isPausedByUser = true;
        if (state === 'returning_to_top' || state === 'paused_at_bottom' || state === 'paused_at_top') {
          if (element.__stateTimer) clearTimeout(element.__stateTimer);
          state = 'scrolling_down';
        }
        resetInactivityTimer();
      };

      // User interaction handlers
      const onWheel = () => {
        pauseForInteraction();
      };

      const onTouchStart = () => {
        isTouching = true;
        isPausedByUser = true;
        if (state === 'returning_to_top' || state === 'paused_at_bottom' || state === 'paused_at_top') {
          if (element.__stateTimer) clearTimeout(element.__stateTimer);
          state = 'scrolling_down';
        }
        if (element.__inactivityTimer) clearTimeout(element.__inactivityTimer);
      };

      const onTouchMove = () => {
        isTouching = true;
        isPausedByUser = true;
        if (element.__inactivityTimer) clearTimeout(element.__inactivityTimer);
      };

      const onTouchEnd = () => {
        isTouching = false;
        resetInactivityTimer();
      };

      const onMouseDown = () => {
        pauseForInteraction();
      };

      const onScroll = () => {
        // If user is actively touching or scrolling manually
        if (isTouching || isPausedByUser) {
          resetInactivityTimer();
        }
      };

      element.addEventListener('wheel', onWheel, { passive: true });
      element.addEventListener('touchstart', onTouchStart, { passive: true });
      element.addEventListener('touchmove', onTouchMove, { passive: true });
      element.addEventListener('touchend', onTouchEnd, { passive: true });
      element.addEventListener('touchcancel', onTouchEnd, { passive: true });
      element.addEventListener('mousedown', onMouseDown, { passive: true });
      element.addEventListener('scroll', onScroll, { passive: true });

      // Listen to prefers-reduced-motion changes
      if (prefersReduced && typeof prefersReduced.addEventListener === 'function') {
        prefersReduced.addEventListener('change', (e) => {
          if (e.matches) {
            if (element.__autoScrollRafId) {
              cancelAnimationFrame(element.__autoScrollRafId);
              element.__autoScrollRafId = null;
            }
          } else {
            lastTimestamp = null;
            element.__autoScrollRafId = requestAnimationFrame(step);
          }
        });
      }

      function step(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
        lastTimestamp = timestamp;

        if (!isPausedByUser && !isTouching && !isExternalPaused) {
          const maxScroll = element.scrollHeight - element.clientHeight;
          if (maxScroll > 15) {
            if (state === 'scrolling_down') {
              const move = getVelocity() * dt;
              element.scrollTop += move;

              if (element.scrollTop >= maxScroll - 2) {
                element.scrollTop = maxScroll;
                state = 'paused_at_bottom';
                if (element.__stateTimer) clearTimeout(element.__stateTimer);

                // Pause approximately 1.5–2 seconds at bottom (1.8s)
                element.__stateTimer = setTimeout(() => {
                  if (!isPausedByUser && !isTouching && !isExternalPaused) {
                    state = 'returning_to_top';
                    element.scrollTo({ top: 0, behavior: 'smooth' });

                    // Wait for smooth return to top to reach top
                    waitForTop();
                  } else {
                    state = 'scrolling_down';
                    lastTimestamp = null;
                  }
                }, 1800);
              }
            }
          }
        }

        element.__autoScrollRafId = requestAnimationFrame(step);
      }

      function waitForTop() {
        let attempts = 0;
        const checkInterval = setInterval(() => {
          attempts++;
          if (element.scrollTop <= 3 || isPausedByUser || isTouching || attempts > 25) {
            clearInterval(checkInterval);
            if (!isPausedByUser && !isTouching && !isExternalPaused && state === 'returning_to_top') {
              element.scrollTop = 0;
              state = 'paused_at_top';
              if (element.__stateTimer) clearTimeout(element.__stateTimer);

              // Pause approximately 1 second at top
              element.__stateTimer = setTimeout(() => {
                state = 'scrolling_down';
                lastTimestamp = null;
              }, 1000);
            } else {
              state = 'scrolling_down';
              lastTimestamp = null;
            }
          }
        }, 100);
      }

      // Start animation loop
      element.__autoScrollRafId = requestAnimationFrame(step);

      window.__seoAuditAutoScrollCtrl = {
        pause: () => {
          isExternalPaused = true;
        },
        resume: () => {
          isExternalPaused = false;
          lastTimestamp = null;
        }
      };
    }

    function updateModalContent(index) {
      if (index < 0 || index >= slides.length) return;
      modalSlideIndex = index;
      const slide = slides[index];

      if (modalTag && slide.tag) modalTag.textContent = slide.tag;
      if (modalTitle && slide.title) modalTitle.textContent = slide.title;
      if (modalWebp && slide.imageWebp) modalWebp.srcset = slide.imageWebp;
      if (modalImg) {
        if (slide.imagePng) modalImg.src = slide.imagePng;
        if (slide.alt) modalImg.alt = slide.alt;
      }
      if (modalDesc && slide.desc) modalDesc.textContent = slide.desc;
      if (modalCounter) modalCounter.textContent = `${index + 1} / ${slides.length}`;
    }

    function openLightbox(index, triggerEl) {
      lastActiveTrigger = triggerEl || document.activeElement;
      updateModalContent(index);

      if (modal) {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
      }

      if (window.__seoAuditAutoScrollCtrl) {
        window.__seoAuditAutoScrollCtrl.pause();
      }
      SeoScrollLock.lock();

      if (modalClose) {
        modalClose.focus();
      }

      dispatchSeoTrackingEvent('audit_showcase_modal_open', {
        slideIndex: index,
        title: slides[index]?.title || 'Unknown'
      });
    }

    function closeLightbox() {
      if (modal) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
      }
      SeoScrollLock.unlock();

      if (window.__seoAuditAutoScrollCtrl) {
        window.__seoAuditAutoScrollCtrl.resume();
      }

      if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
        try {
          lastActiveTrigger.focus({ preventScroll: true });
        } catch {}
      }

      dispatchSeoTrackingEvent('audit_showcase_modal_close', {
        slideIndex: modalSlideIndex
      });
    }

    if (modalClose) {
      modalClose.addEventListener('click', closeLightbox);
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', closeLightbox);
    }

    if (modalPrev) {
      modalPrev.addEventListener('click', () => {
        const newIdx = (modalSlideIndex - 1 + slides.length) % slides.length;
        updateModalContent(newIdx);
      });
    }

    if (modalNext) {
      modalNext.addEventListener('click', () => {
        const newIdx = (modalSlideIndex + 1) % slides.length;
        updateModalContent(newIdx);
      });
    }

    window.addEventListener('keydown', (e) => {
      if (!modal || !modal.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        const newIdx = (modalSlideIndex - 1 + slides.length) % slides.length;
        updateModalContent(newIdx);
      } else if (e.key === 'ArrowRight') {
        const newIdx = (modalSlideIndex + 1) % slides.length;
        updateModalContent(newIdx);
      }
    });

    if (showcaseCta) {
      showcaseCta.addEventListener('click', () => {
        dispatchSeoTrackingEvent('audit_showcase_cta_click', {
          destination: '#seo-final-cta',
          section: '10_free_seo_audit_showcase'
        });
      });
    }
  },
  faq: () => {
    const triggers = document.querySelectorAll('.seo-faq-trigger');
    if (!triggers.length) return;

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const isCurrentlyExpanded = trigger.getAttribute('aria-expanded') === 'true';

        // Close all other triggers so only one is open at a time
        triggers.forEach((otherTrigger) => {
          otherTrigger.setAttribute('aria-expanded', 'false');
        });

        // Toggle current trigger
        if (!isCurrentlyExpanded) {
          trigger.setAttribute('aria-expanded', 'true');
        }

        const questionText = trigger.querySelector('.seo-faq-question')?.textContent.trim() || '';
        dispatchSeoTrackingEvent('faq_toggle', {
          faqId: trigger.id,
          question: questionText,
          expanded: !isCurrentlyExpanded
        });
      });
    });
  },
  finalCta: () => {
    // Section 12 controller hook: Inline Calendly embed initialized via initSeoCalendly
    console.debug('Section 12: Final CTA & Inline Calendly active');
  }
};

// ============================================================================
// INITIALIZATION ENTRY POINT
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initViewportStability();
  initHeaderScroll();
  initAnchorNavigation();
  initSeoCalendly();

  // Initialize active sections
  sectionControllers.hero();
  sectionControllers.trust();
  sectionControllers.results();
  sectionControllers.work();
  sectionControllers.auditCta();
  sectionControllers.pricing();
  sectionControllers.economics();
  sectionControllers.process();
  sectionControllers.onboarding();
  sectionControllers.auditShowcase();
  sectionControllers.faq();
  sectionControllers.finalCta();

  dispatchSeoTrackingEvent('page_view', {
    page: 'seo_landing_page',
    timestamp: new Date().toISOString()
  });
});
