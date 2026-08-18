/**
 * services.js - Interactive Service Cards & Dynamic Package Switcher for CREWiiFY
 */

import { servicesData } from './services-data.js';

document.addEventListener('DOMContentLoaded', () => {
  initServicesInteraction();
});

function initServicesInteraction() {
  const serviceCards = document.querySelectorAll('.srv-overview-card');
  const pricingSection = document.getElementById('services-packages');
  const pricingHighlight = document.getElementById('srvPricingHighlight');
  const pricingSubheading = document.getElementById('srvPricingSubheading');
  const pricingGrid = document.getElementById('srvPricingGrid');

  if (!serviceCards.length || !pricingGrid) return;

  // Retrieve service from URL param or default to 'seo'
  const urlParams = new URLSearchParams(window.location.search);
  const initialService = urlParams.get('service') && servicesData[urlParams.get('service')] 
    ? urlParams.get('service') 
    : 'seo';

  let currentService = initialService;

  // Render initial packages immediately without scroll
  updateActiveCardState(currentService);
  renderPackages(currentService, false);

  // Handle service selection helper
  const handleSelectService = (selectedService) => {
    if (!selectedService || !servicesData[selectedService]) return;

    if (selectedService === currentService) {
      smoothScrollToPackages();
      return;
    }

    currentService = selectedService;
    updateActiveCardState(currentService);
    renderPackages(currentService, true);
    smoothScrollToPackages();
  };

  // Add click and keyboard events to overview cards
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const selectedService = card.getAttribute('data-service');
      handleSelectService(selectedService);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const selectedService = card.getAttribute('data-service');
        handleSelectService(selectedService);
      }
    });
  });

  /**
   * Update active class and accessibility attributes on service overview cards
   */
  function updateActiveCardState(serviceKey) {
    serviceCards.forEach(card => {
      const isCurrent = card.getAttribute('data-service') === serviceKey;
      card.classList.toggle('is-selected', isCurrent);
      card.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      
      const badge = card.querySelector('.srv-overview-card__status');
      if (badge) {
        badge.textContent = isCurrent ? 'Selected ✓' : 'Explore →';
      }
    });
  }

  /**
   * Smoothly scroll toward package section if needed
   */
  function smoothScrollToPackages() {
    if (!pricingSection) return;
    const rect = pricingSection.getBoundingClientRect();
    const isAboveOrBelow = rect.top > (window.innerHeight - 150) || rect.top < 0;
    
    if (isAboveOrBelow) {
      const headerOffset = 90;
      const elementPosition = rect.top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Render dynamic package cards with smooth transition
   */
  function renderPackages(serviceKey, animate = true) {
    const data = servicesData[serviceKey];
    if (!data) return;

    if (animate) {
      pricingGrid.classList.add('is-transitioning');
      if (pricingHighlight) pricingHighlight.classList.add('is-transitioning');
      if (pricingSubheading) pricingSubheading.classList.add('is-transitioning');

      setTimeout(() => {
        applyPackageDOM(data);
        pricingGrid.classList.remove('is-transitioning');
        if (pricingHighlight) pricingHighlight.classList.remove('is-transitioning');
        if (pricingSubheading) pricingSubheading.classList.remove('is-transitioning');
      }, 200);
    } else {
      applyPackageDOM(data);
    }
  }

  /**
   * Inject DOM contents for the selected service packages
   */
  function applyPackageDOM(data) {
    // 1. Dynamic Heading & Subtitle
    if (pricingHighlight) {
      pricingHighlight.textContent = data.title;
    }
    if (pricingSubheading) {
      pricingSubheading.textContent = data.packageSubheading;
    }

    // 2. Package Cards Markup
    pricingGrid.innerHTML = data.packages.map(pkg => `
      <article class="srv-pkg ${pkg.isPopular ? 'srv-pkg--popular' : ''}" data-package-id="${pkg.id}">
        ${pkg.isPopular ? `
          <div class="srv-pkg__badge-wrap">
            <span class="srv-pkg__badge">
              <span class="srv-pkg__badge-dot"></span>
              ${pkg.badge}
            </span>
          </div>
        ` : `
          <div class="srv-pkg__tier-label">${pkg.tier}</div>
        `}

        <div class="srv-pkg__header">
          <h3 class="srv-pkg__name">${pkg.name}</h3>
          <p class="srv-pkg__tagline">${pkg.tagline}</p>
        </div>

        <div class="srv-pkg__price-area">
          <div class="srv-pkg__price-wrap">
            <span class="srv-pkg__currency">${pkg.price}</span>
            <span class="srv-pkg__period">${pkg.period}</span>
          </div>
          <p class="srv-pkg__billing-note">Transparent scope • Dedicated delivery</p>
        </div>

        <div class="srv-pkg__cta-wrap">
          <a href="${pkg.ctaLink}" class="btn ${pkg.isPopular ? 'btn--primary' : 'btn--secondary'} srv-pkg__btn">
            ${pkg.ctaText}
          </a>
        </div>

        <div class="srv-pkg__divider" aria-hidden="true"></div>

        <div class="srv-pkg__features-block">
          <div class="srv-pkg__features-title">What's Included:</div>
          <ul class="srv-pkg__features-list">
            ${pkg.features.map(feat => `
              <li class="srv-pkg__feature-item">
                <span class="srv-pkg__check-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span class="srv-pkg__feature-text">${feat}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </article>
    `).join('');
  }
}
