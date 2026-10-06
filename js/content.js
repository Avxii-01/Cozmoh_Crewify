/**
 * content.js - Isolated Logic Controller for CREWiiFY Dedicated Content Landing Page
 * 
 * Strict Isolation:
 * - Operates solely within the #content-* and .content-* namespace.
 * - Does not alter any global, SEO, or paid-traffic scripts.
 * - Mobile-first touch handlers & responsive listeners.
 * - Inline Calendly integration controller.
 * - Carousel navigation & transformation showcase interactivity.
 */

import {
  calendlyConfig,
  contentHeroData,
  contentTrustData,
  contentResultsData,
  contentTestimonialsData,
  contentWorkData,
  contentSampleCtaData,
  contentPackagesData,
  contentEconomicsData,
  contentProcessData,
  contentOnboardingData,
  contentTransformationData,
  contentFaqData,
  contentFinalCtaData
} from './content-data.js';

// ============================================================================
// ANALYTICS & EVENT TRACKING DISPATCHER
// ============================================================================
export function dispatchContentTrackingEvent(eventName, detail = {}) {
  try {
    const event = new CustomEvent(`crewiify_content_${eventName}`, { detail });
    window.dispatchEvent(event);

    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: `crewiify_content_${eventName}`, ...detail });
    }

    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', `CONTENT_${eventName}`, detail);
    }
  } catch (err) {
    console.debug('Content tracking event error:', err);
  }
}

// ============================================================================
// HEADER SCROLL CONTROLLER
// ============================================================================
function initHeaderScroll() {
  const header = document.getElementById('contentHeader');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add('content-header--scrolled');
    } else {
      header.classList.remove('content-header--scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ============================================================================
// SMOOTH ANCHOR NAVIGATION FOR MOBILE & DESKTOP
// ============================================================================
function initAnchorNavigation() {
  document.querySelectorAll('a[href^="#content-"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      // Ignore booking triggers that open Calendly modal
      if (
        anchor.classList.contains('js-content-open-calendly') ||
        anchor.hasAttribute('data-open-calendly') ||
        anchor.getAttribute('href') === '#contentCalendlyModal'
      ) {
        return;
      }

      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerEl = document.getElementById('contentHeader');
        const headerOffset = headerEl ? headerEl.offsetHeight + 16 : 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        dispatchContentTrackingEvent('anchor_navigate', {
          target: targetId,
          sourceText: anchor.textContent.trim()
        });
      }
    });
  });
}

// ============================================================================
// MODAL SCROLL LOCK CONTROLLER
// ============================================================================
const ContentScrollLock = {
  lockCount: 0,
  savedScrollY: 0,
  scrollbarWidth: 0,

  lock(scrollY = null) {
    if (this.lockCount === 0) {
      this.savedScrollY = scrollY !== null ? scrollY : (window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0);
      this.scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.documentElement.classList.add('content-scroll-locked');
      document.body.classList.add('content-modal-open');

      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.savedScrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';

      if (this.scrollbarWidth > 0) {
        document.body.style.paddingRight = `${this.scrollbarWidth}px`;
        const header = document.getElementById('contentHeader');
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

      const header = document.getElementById('contentHeader');
      if (header) header.style.paddingRight = '';

      document.documentElement.classList.remove('content-scroll-locked');
      document.body.classList.remove('content-modal-open');

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
      '.content-calendly-modal__body, .content-calendly-modal__widget'
    );
    if (!isInsideScrollable && e.cancelable) {
      e.preventDefault();
    }
  },

  _preventBackgroundWheel(e) {
    const isInsideScrollable = e.target.closest(
      '.content-calendly-modal__body, .content-calendly-modal__widget'
    );
    if (!isInsideScrollable && e.cancelable) {
      e.preventDefault();
    }
  }
};

// ============================================================================
// CALENDLY MODAL CONTROLLER
// ============================================================================
export function initContentCalendly() {
  const calendlyUrl = calendlyConfig.url;
  const modal = document.getElementById('contentCalendlyModal');
  const modalBackdrop = document.getElementById('contentCalendlyModalBackdrop');
  const modalClose = document.getElementById('contentCalendlyModalClose');
  const modalDialog = modal ? modal.querySelector('.content-calendly-modal__dialog') : null;
  const container = document.getElementById(calendlyConfig.embedContainerId || 'contentCalendlyInlineWidget');

  // Build target URL with preserved UTM params and dark aesthetics
  const buildTrackingUrl = () => {
    try {
      const currentUrl = new URL(window.location.href);
      const target = new URL(calendlyUrl);

      calendlyConfig.utmParams.forEach((param) => {
        if (currentUrl.searchParams.has(param)) {
          target.searchParams.set(param, currentUrl.searchParams.get(param));
        }
      });

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
      container.innerHTML = `<iframe src="${finalUrl}" width="100%" height="100%" frameborder="0" title="Schedule a White-Label Content Discovery Call" style="border:none;min-height:100%;width:100%;border-radius:14px;background:transparent;"></iframe>`;
    }
  };

  const openModal = (triggerEl = null) => {
    if (!modal) return;
    lastActiveTrigger = triggerEl || document.activeElement;
    previousScrollY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    ContentScrollLock.lock(previousScrollY);

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

    dispatchContentTrackingEvent('calendly_modal_open', {
      source: triggerEl?.id || 'booking_cta'
    });
  };

  const closeModal = () => {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');

    ContentScrollLock.unlock();

    if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
      try {
        lastActiveTrigger.focus({ preventScroll: true });
      } catch {
        // Fallback
      }
    }

    window.scrollTo({ top: previousScrollY, left: 0, behavior: 'instant' });
    requestAnimationFrame(() => {
      window.scrollTo({ top: previousScrollY, left: 0, behavior: 'instant' });
    });

    dispatchContentTrackingEvent('calendly_modal_close', {
      source: 'modal_close'
    });
  };

  // Wire all booking CTAs on the Content page
  const bookingTriggers = document.querySelectorAll(
    '#contentHeaderCta, #contentHeroSecondaryCta, #contentSamplePrimaryBtn, #contentFinalCtaBtn, .js-content-open-calendly, [data-open-calendly]'
  );

  bookingTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openModal(btn);
    });
  });

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

  if (modalDialog) {
    modalDialog.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    }
  });
}

// ============================================================================
// 03. CONTENT RESULTS CAROUSEL CONTROLLER
// ============================================================================
function initContentResultsCarousel() {
  const wrap = document.getElementById('contentResultsCarouselWrap');
  const prevBtn = document.getElementById('contentResultsPrevBtn');
  const nextBtn = document.getElementById('contentResultsNextBtn');

  if (!wrap || !prevBtn || !nextBtn) return;

  const getScrollStep = () => {
    const card = wrap.querySelector('.content-result-card');
    if (!card) return wrap.clientWidth;
    return card.offsetWidth + 24; // width + gap
  };

  const updateButtons = () => {
    const maxScroll = wrap.scrollWidth - wrap.clientWidth - 10;
    prevBtn.disabled = wrap.scrollLeft <= 10;
    nextBtn.disabled = wrap.scrollLeft >= maxScroll;
  };

  prevBtn.addEventListener('click', () => {
    wrap.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    wrap.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
  });

  wrap.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons, { passive: true });
  updateButtons();
}

// ============================================================================
// 05. SELECTED WORK CATEGORY FILTER
// ============================================================================
function initContentWorkFilter() {
  const filterBtns = document.querySelectorAll('.content-work-filter-btn');
  const cards = document.querySelectorAll('.content-work-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      cards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });

      dispatchContentTrackingEvent('work_filter_change', { category });
    });
  });
}

// ============================================================================
// 11. CONTENT TRANSFORMATION SHOWCASE CONTROLLER
// ============================================================================
function initContentTransformationShowcase() {
  const tabBtns = document.querySelectorAll('.content-showcase-tab');
  const tabsData = contentTransformationData.tabs;

  if (!tabBtns.length || !tabsData) return;

  const rawTitle = document.getElementById('showcaseRawTitle');
  const rawList = document.getElementById('showcaseRawList');
  const rawBadge = document.getElementById('showcaseRawBadge');

  const editTitle = document.getElementById('showcaseEditTitle');
  const editList = document.getElementById('showcaseEditList');
  const editBadge = document.getElementById('showcaseEditBadge');

  const finalTitle = document.getElementById('showcaseFinalTitle');
  const finalList = document.getElementById('showcaseFinalList');
  const finalBadge = document.getElementById('showcaseFinalBadge');

  const updateStage = (tabId) => {
    const activeTab = tabsData.find((t) => t.id === tabId) || tabsData[0];
    if (!activeTab) return;

    if (rawTitle) rawTitle.textContent = activeTab.stageRaw.title;
    if (rawBadge) rawBadge.textContent = activeTab.stageRaw.badge;
    if (rawList) {
      rawList.innerHTML = activeTab.stageRaw.points
        .map((p) => `<li class="content-showcase-stage__item"><span class="content-showcase-stage__bullet">&bull;</span><span>${p}</span></li>`)
        .join('');
    }

    if (editTitle) editTitle.textContent = activeTab.stageEdit.title;
    if (editBadge) editBadge.textContent = activeTab.stageEdit.badge;
    if (editList) {
      editList.innerHTML = activeTab.stageEdit.points
        .map((p) => `<li class="content-showcase-stage__item"><span class="content-showcase-stage__bullet">&bull;</span><span>${p}</span></li>`)
        .join('');
    }

    if (finalTitle) finalTitle.textContent = activeTab.stageFinal.title;
    if (finalBadge) finalBadge.textContent = activeTab.stageFinal.badge;
    if (finalList) {
      finalList.innerHTML = activeTab.stageFinal.points
        .map((p) => `<li class="content-showcase-stage__item"><span class="content-showcase-stage__bullet">&bull;</span><span>${p}</span></li>`)
        .join('');
    }
  };

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const tabId = btn.getAttribute('data-tab');
      updateStage(tabId);

      dispatchContentTrackingEvent('transformation_tab_change', { tab: tabId });
    });
  });

  // Init first tab
  if (tabBtns[0]) {
    updateStage(tabBtns[0].getAttribute('data-tab'));
  }
}

// ============================================================================
// 12. FAQ ACCORDION CONTROLLER
// ============================================================================
function initContentFaq() {
  const faqItems = document.querySelectorAll('.content-faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.content-faq-trigger');
    const content = item.querySelector('.content-faq-content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close other open items
      faqItems.forEach((other) => {
        if (other !== item && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          const otherTrigger = other.querySelector('.content-faq-trigger');
          const otherContent = other.querySelector('.content-faq-content');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.style.maxHeight = '0px';
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = `${content.scrollHeight + 20}px`;

        dispatchContentTrackingEvent('faq_expand', {
          question: trigger.querySelector('.content-faq-question')?.textContent.trim()
        });
      }
    });
  });
}

// ============================================================================
// INITIALIZATION ON DOM READY
// ============================================================================
function init() {
  initHeaderScroll();
  initAnchorNavigation();
  initContentCalendly();
  initContentResultsCarousel();
  initContentWorkFilter();
  initContentTransformationShowcase();
  initContentFaq();

  dispatchContentTrackingEvent('page_view', {
    url: window.location.href,
    title: document.title
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
