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
  agencyRatesCol2,
  landingSurveyQuestions
} from './paid-traffic-data.js';

// Central Survey State
const surveyState = {
  agencyType: '',
  activeClients: '',
  servicesNeeded: [],
  outsourcingReason: '',
  startTimeline: ''
};

let currentStepIndex = 1; // 1 to 5 for survey questions, 6 for contact details
const totalSurveySteps = landingSurveyQuestions.length; // 5
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
 * Render Multi-Step Survey Steps inside Seamless Conversion Canvas
 */
function initSurveySteps() {
  const stepsContainer = document.getElementById('ptSurveyStepsContainer');
  if (!stepsContainer) return;

  const stepsHtml = landingSurveyQuestions.map((q, idx) => {
    const isFirst = idx === 0;
    return `
      <div class="pt-survey-step ${isFirst ? 'is-active' : ''}" data-step="${q.step}" id="ptSurveyStep${q.step}">
        <h3 class="pt-survey-question">${q.question}</h3>
        <p class="pt-survey-subtext">${q.description}</p>
        <div class="pt-survey-options ${q.isMulti ? 'pt-survey-options--multi' : ''}">
          ${q.options.map(opt => `
            <div class="pt-survey-option ${q.isMulti ? 'pt-survey-option--multi' : ''}" data-question-id="${q.id}" data-value="${opt.value}" role="button" tabindex="0">
              <span class="pt-survey-option__radio" aria-hidden="true"></span>
              <span class="pt-survey-option__label">${opt.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  stepsContainer.innerHTML = stepsHtml;

  // Bind option selection listeners
  stepsContainer.querySelectorAll('.pt-survey-option').forEach(optionEl => {
    optionEl.addEventListener('click', () => {
      handleOptionSelect(optionEl);
    });
    optionEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOptionSelect(optionEl);
      }
    });
  });

  updateSurveyUI();
}

/**
 * Handle Option Selection
 */
function handleOptionSelect(optionEl) {
  const questionId = optionEl.getAttribute('data-question-id');
  const value = optionEl.getAttribute('data-value');
  const currentQ = landingSurveyQuestions.find(q => q.id === questionId);

  if (!currentQ) return;

  if (currentQ.isMulti) {
    optionEl.classList.toggle('is-selected');
    if (surveyState[questionId].includes(value)) {
      surveyState[questionId] = surveyState[questionId].filter(item => item !== value);
    } else {
      surveyState[questionId].push(value);
    }
  } else {
    const siblings = optionEl.parentElement.querySelectorAll('.pt-survey-option');
    siblings.forEach(sib => sib.classList.remove('is-selected'));
    optionEl.classList.add('is-selected');
    surveyState[questionId] = value;
  }

  const errorEl = document.getElementById('ptSurveyError');
  if (errorEl) errorEl.style.display = 'none';
}

/**
 * Update Survey UI State
 */
function updateSurveyUI() {
  const stepIndicator = document.getElementById('ptSurveyStepIndicator');
  const progressFill = document.getElementById('ptSurveyProgressFill');
  const backBtn = document.getElementById('ptSurveyBackBtn');
  const nextBtn = document.getElementById('ptSurveyNextBtn');
  const contactStep = document.getElementById('ptContactStep');

  if (currentStepIndex <= totalSurveySteps) {
    // Questions 1 to 5
    if (stepIndicator) stepIndicator.textContent = `Step 0${currentStepIndex} / 05`;
    if (progressFill) progressFill.style.width = `${(currentStepIndex / 5) * 100}%`;

    for (let i = 1; i <= totalSurveySteps; i++) {
      const stepEl = document.getElementById(`ptSurveyStep${i}`);
      if (stepEl) {
        stepEl.classList.toggle('is-active', i === currentStepIndex);
      }
    }

    if (contactStep) contactStep.classList.remove('is-active');

    if (backBtn) backBtn.disabled = currentStepIndex === 1;
    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.innerHTML = currentStepIndex === totalSurveySteps
        ? 'Continue to Contact Details →'
        : 'Continue →';
    }
  } else {
    // Step 6: Contact details step
    if (stepIndicator) stepIndicator.textContent = 'Step 05 / 05 • Complete';
    if (progressFill) progressFill.style.width = '100%';

    for (let i = 1; i <= totalSurveySteps; i++) {
      const stepEl = document.getElementById(`ptSurveyStep${i}`);
      if (stepEl) stepEl.classList.remove('is-active');
    }

    if (contactStep) contactStep.classList.add('is-active');
    if (backBtn) backBtn.disabled = false;
    if (nextBtn) nextBtn.style.display = 'none';
  }
}

/**
 * Validate Current Step Before Continuing
 */
function validateCurrentStep() {
  if (currentStepIndex > totalSurveySteps) return true;

  const currentQ = landingSurveyQuestions[currentStepIndex - 1];
  const answer = surveyState[currentQ.id];

  const isValid = currentQ.isMulti
    ? Array.isArray(answer) && answer.length > 0
    : Boolean(answer && answer.trim().length > 0);

  const errorEl = document.getElementById('ptSurveyError');
  if (!isValid) {
    if (errorEl) {
      errorEl.textContent = 'Please make a selection to continue.';
      errorEl.style.display = 'block';
    }
    return false;
  }

  if (errorEl) errorEl.style.display = 'none';
  return true;
}

/**
 * Setup Survey Navigation
 */
function initSurveyNav() {
  const nextBtn = document.getElementById('ptSurveyNextBtn');
  const backBtn = document.getElementById('ptSurveyBackBtn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (!validateCurrentStep()) return;

      dispatchTrackingEvent('survey_step_complete', {
        step: currentStepIndex,
        answer: surveyState[landingSurveyQuestions[currentStepIndex - 1].id]
      });

      currentStepIndex++;
      updateSurveyUI();

      if (currentStepIndex === totalSurveySteps + 1) {
        dispatchTrackingEvent('survey_complete', surveyState);
      }
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (currentStepIndex > 1) {
        currentStepIndex--;
        updateSurveyUI();
      }
    });
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
 * Contact Details Form Submission Handler
 */
function initContactSubmission() {
  const form = document.getElementById('ptContactForm');
  if (!form) return;

  const submitBtn = document.getElementById('ptSubmitBtn');
  const statusEl = document.getElementById('ptFormStatus');
  const confirmCard = document.getElementById('ptConfirmationCard');
  const surveyCard = document.getElementById('ptSurveyCard');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    form.querySelectorAll('.pt-form-group').forEach(fg => fg.classList.remove('has-error'));
    form.querySelectorAll('.pt-input, .pt-textarea').forEach(inp => inp.classList.remove('is-invalid'));
    if (statusEl) {
      statusEl.className = 'pt-form-status';
      statusEl.textContent = '';
    }

    const fullName = form.fullName?.value.trim() || '';
    const agencyName = form.agencyName?.value.trim() || '';
    const email = form.email?.value.trim() || '';
    const website = form.website?.value.trim() || '';
    const phone = form.phone?.value.trim() || '';
    const message = form.message?.value.trim() || '';
    const websiteHp = form.website_hp?.value.trim() || '';

    let hasError = false;

    if (fullName.length < 2) {
      markFieldError('fullName', 'Please enter your full name.');
      hasError = true;
    }

    if (agencyName.length < 2) {
      markFieldError('agencyName', 'Please enter your agency name.');
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      markFieldError('email', 'Please enter a valid work email address.');
      hasError = true;
    }

    if (hasError) {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const attribution = getAttributionData();
    const payload = {
      leadSource: 'Paid Traffic Landing Page',
      fullName,
      agencyName,
      email,
      website,
      phone,
      message,
      website_hp: websiteHp,
      agencyType: surveyState.agencyType,
      activeClients: surveyState.activeClients,
      servicesNeeded: surveyState.servicesNeeded,
      outsourcingReason: surveyState.outsourcingReason,
      startTimeline: surveyState.startTimeline,
      ...attribution
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span style="display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 8px;"></span>
        Submitting...
      `;
    }

    try {
      const response = await fetch('api/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result && result.success) {
        dispatchTrackingEvent('contact_submit', {
          agencyName,
          services: surveyState.servicesNeeded
        });

        // Hide survey/contact form and reveal clean final confirmation
        if (surveyCard) surveyCard.style.display = 'none';
        if (confirmCard) confirmCard.classList.add('is-visible');
      } else {
        const errorMsg = (result && result.message)
          ? result.message
          : 'Something went wrong while submitting. Please check your entries and try again.';
        if (statusEl) {
          statusEl.textContent = errorMsg;
          statusEl.classList.add('is-visible', 'pt-form-status--error');
        }
      }
    } catch (err) {
      console.error('Lead submission fetch error:', err);
      if (statusEl) {
        statusEl.textContent = 'Network error while submitting. Please check your connection and retry.';
        statusEl.classList.add('is-visible', 'pt-form-status--error');
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit &rarr;';
      }
    }
  });

  function markFieldError(fieldName, message) {
    const input = form[fieldName];
    if (input) {
      input.classList.add('is-invalid');
      const parent = input.closest('.pt-form-group');
      if (parent) {
        parent.classList.add('has-error');
        const errSpan = parent.querySelector('.pt-error-text');
        if (errSpan) errSpan.textContent = message;
      }
    }
  }

  form.querySelectorAll('.pt-input, .pt-textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
      const parent = input.closest('.pt-form-group');
      if (parent) parent.classList.remove('has-error');
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
  initSurveySteps();
  initSurveyNav();
  initContactSubmission();
  initSmoothScroll();
});
