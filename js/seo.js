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

    // Dominant preview elements
    const dominantFrameTitle = document.getElementById('seoAuditDominantFrameTitle');
    const dominantExpandBtn = document.getElementById('seoAuditDominantExpandBtn');
    const dominantMedia = document.getElementById('seoAuditDominantMedia');
    const dominantWebp = document.getElementById('seoAuditDominantWebp');
    const dominantImg = document.getElementById('seoAuditDominantImg');
    const dominantTag = document.getElementById('seoAuditDominantTag');
    const dominantTitle = document.getElementById('seoAuditDominantTitle');
    const dominantDesc = document.getElementById('seoAuditDominantDesc');

    // Supporting thumbnails
    const thumbs = document.querySelectorAll('.seo-audit-showcase__thumb');

    // Lightbox modal elements
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

    // Section CTA
    const showcaseCta = document.getElementById('seoAuditShowcaseCta');

    let currentSlideIndex = 0;
    let modalSlideIndex = 0;
    let lastActiveTrigger = null;

    // Update the dominant featured slide
    function setDominantSlide(index) {
      if (index < 0 || index >= slides.length) return;
      currentSlideIndex = index;
      const slide = slides[index];

      if (dominantFrameTitle && slide.frameTitle) dominantFrameTitle.textContent = slide.frameTitle;
      if (dominantWebp && slide.imageWebp) dominantWebp.srcset = slide.imageWebp;
      if (dominantImg) {
        if (slide.imagePng) dominantImg.src = slide.imagePng;
        if (slide.alt) dominantImg.alt = slide.alt;
      }
      if (dominantTag && slide.tag) dominantTag.textContent = slide.tag;
      if (dominantTitle && slide.title) dominantTitle.textContent = slide.title;
      if (dominantDesc && slide.desc) dominantDesc.textContent = slide.desc;

      // Update thumbnail active states
      thumbs.forEach((thumb) => {
        const thumbIdx = parseInt(thumb.getAttribute('data-slide-index'), 10);
        if (thumbIdx === index) {
          thumb.classList.add('is-active');
        } else {
          thumb.classList.remove('is-active');
        }
      });
    }

    // Update modal content
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

    // Open lightbox modal
    function openLightbox(index, triggerEl) {
      lastActiveTrigger = triggerEl || document.activeElement;
      updateModalContent(index);

      if (modal) {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
      }
      document.body.classList.add('seo-modal-open');

      if (modalClose) {
        modalClose.focus();
      }

      dispatchSeoTrackingEvent('audit_showcase_modal_open', {
        slideIndex: index,
        title: slides[index]?.title || 'Unknown'
      });
    }

    // Close lightbox modal
    function closeLightbox() {
      if (modal) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
      }
      document.body.classList.remove('seo-modal-open');

      if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
        lastActiveTrigger.focus();
      }

      dispatchSeoTrackingEvent('audit_showcase_modal_close', {
        slideIndex: modalSlideIndex
      });
    }

    // Thumbnail click interactions
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', (e) => {
        const idx = parseInt(thumb.getAttribute('data-slide-index'), 10);
        // If user specifically clicked zoom icon, open modal directly
        if (e.target.closest('.seo-audit-showcase__thumb-zoom-icon')) {
          openLightbox(idx, thumb);
        } else {
          setDominantSlide(idx);
          dispatchSeoTrackingEvent('audit_showcase_slide_select', {
            slideIndex: idx,
            title: slides[idx]?.title || 'Unknown'
          });
        }
      });
    });

    // Dominant preview click triggers modal
    if (dominantMedia) {
      dominantMedia.addEventListener('click', () => {
        openLightbox(currentSlideIndex, dominantMedia);
      });
      dominantMedia.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(currentSlideIndex, dominantMedia);
        }
      });
    }

    if (dominantExpandBtn) {
      dominantExpandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(currentSlideIndex, dominantExpandBtn);
      });
    }

    // Lightbox modal controls
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

    // Global keyboard listener for modal
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

    // Section CTA Click Tracking
    if (showcaseCta) {
      showcaseCta.addEventListener('click', () => {
        dispatchSeoTrackingEvent('audit_showcase_cta_click', {
          destination: '#seo-final-cta',
          section: '10_free_seo_audit_showcase'
        });
      });
    }
  },
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
  sectionControllers.auditCta();
  sectionControllers.pricing();
  sectionControllers.economics();
  sectionControllers.process();
  sectionControllers.onboarding();
  sectionControllers.auditShowcase();

  dispatchSeoTrackingEvent('page_view', {
    page: 'seo_landing_page',
    timestamp: new Date().toISOString()
  });
});
