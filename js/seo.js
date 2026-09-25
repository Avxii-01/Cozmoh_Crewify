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
// CALENDLY EMBED & INLINE WIDGET CONTROLLER
// ============================================================================
export function initSeoCalendly() {
  const calendlyUrl = calendlyConfig.url;
  const modal = document.getElementById('seoCalendlyModal');
  const modalBackdrop = document.getElementById('seoCalendlyModalBackdrop');
  const modalClose = document.getElementById('seoCalendlyModalClose');
  const openModalBtn = document.getElementById('seoOpenCalendlyBtn');
  const container = document.getElementById(calendlyConfig.embedContainerId || 'seoCalendlyInlineWidget');
  const headerCta = document.getElementById('seoHeaderCta');
  const directBtns = document.querySelectorAll('.js-seo-calendly-btn');

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

  const openModal = () => {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('seo-modal-open');

    // Mount Calendly widget on first open if not yet mounted
    if (!calendlyMounted) {
      // Load Calendly external widget script asynchronously once
      let script = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        script.onload = mountCalendly;
        script.onerror = mountCalendly; // Fallback to iframe if external script fails
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
      source: 'final_cta_btn'
    });
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('seo-modal-open');

    if (openModalBtn) {
      openModalBtn.focus();
    }

    dispatchSeoTrackingEvent('calendly_modal_close', {
      source: 'modal_close'
    });
  };

  if (openModalBtn) {
    openModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);
  }

  window.addEventListener('keydown', (e) => {
    if (modal && modal.classList.contains('is-open') && e.key === 'Escape') {
      closeModal();
    }
  });

  // Attach smooth scrolling and analytics to internal anchor CTAs
  directBtns.forEach((btn) => {
    const href = btn.getAttribute('href');
    // If the CTA points to the final section anchor #seo-final-cta, preserve it and scroll smoothly
    if (href && href.startsWith('#')) {
      btn.addEventListener('click', (e) => {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        dispatchSeoTrackingEvent('calendly_cta_click', {
          ctaId: btn.id || 'anchor_cta',
          destination: href
        });
      });
    } else {
      // For any non-anchor fallback, preserve link tracking
      btn.addEventListener('click', () => {
        dispatchSeoTrackingEvent('calendly_cta_click', {
          ctaId: btn.id || 'direct_cta',
          destination: finalUrl
        });
      });
    }
  });

  if (headerCta) {
    headerCta.addEventListener('click', () => {
      dispatchSeoTrackingEvent('header_cta_click', { destination: '#seo-final-cta' });
    });
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

    let currentSlideIndex = 1;
    let modalSlideIndex = 1;
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

    // Thumbnail click interactions: clicking a preview sets it as dominant and opens larger view modal
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const idx = parseInt(thumb.getAttribute('data-slide-index'), 10);
        setDominantSlide(idx);
        openLightbox(idx, thumb);
        dispatchSeoTrackingEvent('audit_showcase_slide_select', {
          slideIndex: idx,
          title: slides[idx]?.title || 'Unknown'
        });
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
