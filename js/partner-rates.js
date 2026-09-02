/**
 * partner-rates.js - Editorial Agency Rate Sheet Dynamic Renderer & Scrollspy
 */

import { partnerRatesData } from './partner-rates-data.js';

document.addEventListener('DOMContentLoaded', () => {
  initPartnerRates();
});

function initPartnerRates() {
  const container = document.getElementById('ratesCategoriesContainer');
  const navContainer = document.getElementById('ratesCategoryNav');

  if (!container || !partnerRatesData) return;

  // 1. Render Category Anchor Jump Navigation
  if (navContainer) {
    const allLink = `<a href="#rates-sheet" class="rates-nav__link is-active" data-cat="all">ALL</a>`;
    const catLinks = partnerRatesData.map(cat => `
      <a href="#cat-${cat.id}" class="rates-nav__link" data-cat="${cat.id}">${cat.navLabel}</a>
    `).join('');
    navContainer.innerHTML = allLink + catLinks;
  }

  // 2. Render All 8 Categories & 22 Service Rows
  // Column order: SERVICE | TYPICAL CLIENT BILL | OUR RATE | YOU KEEP
  container.innerHTML = partnerRatesData.map(cat => `
    <article class="rates-category-block" id="cat-${cat.id}" data-category="${cat.id}">
      <div class="rates-category-block__header">
        <h3 class="rates-category-block__title">${cat.categoryLabel}</h3>
        <span class="rates-category-block__billing">${cat.billingLabel}</span>
      </div>

      <div class="rates-table">
        <!-- Desktop Table Header (Order: SERVICE | TYPICAL CLIENT BILL | OUR RATE | YOU KEEP) -->
        <div class="rates-table__head" aria-hidden="true">
          <div class="rates-table__head-col rates-table__head-col--service">SERVICE</div>
          <div class="rates-table__head-col rates-table__head-col--right rates-table__head-col--client">TYPICAL CLIENT BILL</div>
          <div class="rates-table__head-col rates-table__head-col--right rates-table__head-col--our">OUR RATE</div>
          <div class="rates-table__head-col rates-table__head-col--right rates-table__head-col--keep">YOU KEEP</div>
        </div>

        <!-- Service Rows -->
        <div class="rates-table__body">
          ${cat.services.map(srv => `
            <div class="rates-table__row">
              <!-- Service Info -->
              <div class="rates-table__col-service">
                <h4 class="rates-table__service-name">${srv.name}</h4>
                <p class="rates-table__service-desc">${srv.description}</p>
                ${srv.note ? `<span class="rates-table__service-note">${srv.note}</span>` : ''}
              </div>

              <!-- Desktop Price Columns (Order: CLIENT BILL | OUR RATE | YOU KEEP) -->
              <div class="rates-table__col-price rates-table__col-price--client rates-table__col-price--desktop">
                <span class="rates-table__price-value rates-table__price-value--client">${srv.clientBill}</span>
              </div>
              <div class="rates-table__col-price rates-table__col-price--our rates-table__col-price--desktop">
                <span class="rates-table__price-value rates-table__price-value--our">${srv.ourRate}</span>
              </div>
              <div class="rates-table__col-price rates-table__col-price--keep rates-table__col-price--desktop">
                <span class="rates-table__price-value rates-table__price-value--keep">${srv.youKeep}</span>
              </div>

              <!-- Mobile Stacked Metrics Bar (Order: CLIENT BILL | OUR RATE | YOU KEEP) -->
              <div class="rates-table__mobile-metrics">
                <div class="rates-table__metric-item rates-table__metric-item--client">
                  <span class="rates-table__metric-label rates-table__metric-label--client">CLIENT BILL</span>
                  <span class="rates-table__price-value rates-table__price-value--client">${srv.clientBill}</span>
                </div>
                <div class="rates-table__metric-item rates-table__metric-item--our">
                  <span class="rates-table__metric-label rates-table__metric-label--our">OUR RATE</span>
                  <span class="rates-table__price-value rates-table__price-value--our">${srv.ourRate}</span>
                </div>
                <div class="rates-table__metric-item rates-table__metric-item--keep">
                  <span class="rates-table__metric-label rates-table__metric-label--keep">YOU KEEP</span>
                  <span class="rates-table__price-value rates-table__price-value--keep">${srv.youKeep}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </article>
  `).join('');

  // 3. Helper: Auto-scroll horizontal filter bar to center the active link
  function centerActiveNavLink(link) {
    if (!navContainer || !link) return;
    if (navContainer.scrollWidth > navContainer.clientWidth) {
      const containerRect = navContainer.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      const currentScroll = navContainer.scrollLeft;
      const targetScroll = currentScroll + (linkRect.left - containerRect.left) - (navContainer.clientWidth / 2) + (link.offsetWidth / 2);

      navContainer.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth'
      });
    }
  }

  // 4. Smooth Scroll to Target with Sticky Navbar Offset
  const navLinks = document.querySelectorAll('.rates-nav__link');
  let isClickScrolling = false;
  let clickTimeout = null;

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').replace('#', '');
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        isClickScrolling = true;
        clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => {
          isClickScrolling = false;
        }, 800);

        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 84;
        const navWrapper = document.querySelector('.rates-nav-wrapper');
        const navHeight = navWrapper ? navWrapper.offsetHeight : 54;
        const totalOffset = headerHeight + navHeight + 16;

        const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = Math.max(0, elementPosition - totalOffset);

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update active state immediately
        navLinks.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');

        // Auto-center the selected filter item in the horizontal scroll bar
        centerActiveNavLink(link);
      }
    });
  });

  // 5. Scrollspy with IntersectionObserver to highlight & auto-center active category on scroll
  const categoryBlocks = document.querySelectorAll('.rates-category-block');
  if ('IntersectionObserver' in window && categoryBlocks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      if (isClickScrolling) return;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const categoryId = entry.target.getAttribute('data-category');
          navLinks.forEach(link => {
            const isMatch = link.getAttribute('data-cat') === categoryId;
            link.classList.toggle('is-active', isMatch);
            if (isMatch) {
              centerActiveNavLink(link);
            }
          });
        }
      });
    }, observerOptions);

    categoryBlocks.forEach(block => observer.observe(block));
  }
}
