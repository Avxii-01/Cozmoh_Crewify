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
// CALENDLY EMBED / REDIRECT CONTROLLER
// ============================================================================
export function initSeoCalendly() {
  const calendlyUrl = calendlyConfig.url;
  const container = document.getElementById(calendlyConfig.embedContainerId);
  const headerCta = document.getElementById('seoHeaderCta');
  const directBtns = document.querySelectorAll('.js-seo-calendly-btn');

  // Build target URL with UTM parameters preserved from page load
  const buildTrackingUrl = () => {
    try {
      const currentUrl = new URL(window.location.href);
      const target = new URL(calendlyUrl);

      calendlyConfig.utmParams.forEach((param) => {
        if (currentUrl.searchParams.has(param)) {
          target.searchParams.set(param, currentUrl.searchParams.get(param));
        }
      });
      return target.toString();
    } catch {
      return calendlyUrl;
    }
  };

  const finalUrl = buildTrackingUrl();

  // Attach click tracking to all Calendly CTAs
  directBtns.forEach((btn) => {
    if (btn.tagName.toLowerCase() === 'a') {
      btn.href = finalUrl;
    }
    btn.addEventListener('click', () => {
      dispatchSeoTrackingEvent('calendly_cta_click', {
        ctaId: btn.id || 'direct_cta',
        destination: finalUrl
      });
    });
  });

  if (headerCta) {
    headerCta.addEventListener('click', () => {
      dispatchSeoTrackingEvent('header_cta_click', { destination: '#seo-final-cta' });
    });
  }

  // Prepared for inline Calendly iframe when final CTA section is activated
  if (container) {
    // Container ready for script-based or inline iframe injection
    console.debug('SEO Calendly container ready:', container.id);
  }
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
          destination: '#seo-results'
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
  auditCta: () => console.debug('Section 05: Audit CTA ready for implementation'),
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
  economics: () => console.debug('Section 07: Agency Economics ready for implementation'),
  process: () => console.debug('Section 08: How It Works ready for implementation'),
  onboarding: () => console.debug('Section 09: Onboarding ready for implementation'),
  auditShowcase: () => console.debug('Section 10: Audit Showcase ready for implementation'),
  faq: () => console.debug('Section 11: FAQ ready for implementation'),
  finalCta: () => console.debug('Section 12: Final CTA ready for implementation')
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
  sectionControllers.pricing();

  dispatchSeoTrackingEvent('page_view', {
    page: 'seo_landing_page',
    timestamp: new Date().toISOString()
  });
});
