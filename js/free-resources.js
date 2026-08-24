/**
 * free-resources.js - CREWiiFY Free Resources Dynamic Filtering & Grid Controller
 * 
 * Features:
 * - Dynamic Category Discovery (only non-empty categories are displayed)
 * - Accessible Tab Navigation & Rail Scrolling
 * - URL Query / Hash Filter Synchronization
 * - Smooth Staggered Card Entrance Animations
 * - Direct PDF Open / Download Handlers
 */

import { resourcesData } from './resources-data.js';

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initResourcesHub();
});

/**
 * Main Hub Initializer
 */
function initResourcesHub() {
  const filterList = document.getElementById('frFilterList');
  const gridContainer = document.getElementById('frResourceGrid');
  const countDisplay = document.getElementById('frItemCount');

  if (!gridContainer) return;

  // 1. Generate Dynamic Filter Tabs based on available data
  renderFilterTabs();

  // 2. Resolve initial filter from URL params or hash
  const initialFilter = resolveCategoryFilter();
  currentFilter = initialFilter;
  updateActiveFilterUI(currentFilter);

  // 3. Render the grid
  renderResourceGrid(currentFilter);

  // 4. Handle browser hash changes
  window.addEventListener('hashchange', () => {
    const newFilter = resolveCategoryFilter();
    if (newFilter !== currentFilter) {
      currentFilter = newFilter;
      updateActiveFilterUI(currentFilter);
      renderResourceGrid(currentFilter);
    }
  });

  // 5. Filter rail horizontal scroll shadow detection (Mobile/Tablet)
  initFilterScrollIndicators();
}

/**
 * Resolves active filter from URL parameters (?category=seo) or hash (#seo)
 */
function resolveCategoryFilter() {
  const urlParams = new URLSearchParams(window.location.search);
  const param = urlParams.get('category') || urlParams.get('filter');
  const hash = window.location.hash.replace(/^#/, '').toLowerCase();

  const availableCategories = ['all', ...new Set(resourcesData.map(r => r.category.toLowerCase()))];

  if (param && availableCategories.includes(param.toLowerCase())) {
    return param.toLowerCase();
  }

  if (hash && availableCategories.includes(hash)) {
    return hash;
  }

  return 'all';
}

/**
 * Dynamically renders filter buttons for non-empty categories
 */
function renderFilterTabs() {
  const filterList = document.getElementById('frFilterList');
  if (!filterList) return;

  // Extract unique categories that actually have resources
  const categories = Array.from(new Set(resourcesData.map(r => r.category))).filter(Boolean);

  let tabsHTML = `
    <li class="fr-filter-item" role="presentation">
      <button type="button" role="tab" class="fr-filter-btn is-active" data-filter="all" aria-selected="true">
        All Resources
      </button>
    </li>
  `;

  categories.forEach(cat => {
    tabsHTML += `
      <li class="fr-filter-item" role="presentation">
        <button type="button" role="tab" class="fr-filter-btn" data-filter="${cat.toLowerCase()}" aria-selected="false">
          ${cat}
        </button>
      </li>
    `;
  });

  filterList.innerHTML = tabsHTML;

  // Bind click handlers to newly created filter buttons
  const buttons = filterList.querySelectorAll('.fr-filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter') || 'all';
      if (filter === currentFilter) return;

      currentFilter = filter;
      updateActiveFilterUI(filter);
      renderResourceGrid(filter);

      // Auto-scroll filter item into view horizontally
      const listItem = btn.parentElement;
      if (listItem && filterList) {
        const targetScroll = listItem.offsetLeft - (filterList.clientWidth / 2) + (listItem.offsetWidth / 2);
        filterList.scrollTo({ left: targetScroll, behavior: 'smooth' });
      }
    });
  });
}

/**
 * Updates UI state for active filter button
 */
function updateActiveFilterUI(filter) {
  const buttons = document.querySelectorAll('.fr-filter-btn');
  buttons.forEach(btn => {
    const isMatch = (btn.getAttribute('data-filter')?.toLowerCase() === filter.toLowerCase());
    btn.classList.toggle('is-active', isMatch);
    btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
  });
}

/**
 * Renders resource cards into the grid based on selected filter
 */
function renderResourceGrid(filter) {
  const gridContainer = document.getElementById('frResourceGrid');
  const countDisplay = document.getElementById('frItemCount');
  if (!gridContainer) return;

  // Filter items client-side
  const filteredData = filter === 'all'
    ? resourcesData
    : resourcesData.filter(item => item.category.toLowerCase() === filter.toLowerCase());

  // Update counter
  if (countDisplay) {
    const totalCount = resourcesData.length;
    const showingCount = filteredData.length;
    countDisplay.textContent = filter === 'all'
      ? `Showing all ${totalCount} resources`
      : `Showing ${showingCount} of ${totalCount} resources`;
  }

  // Smooth Grid Repopulation
  gridContainer.innerHTML = '';

  if (filteredData.length === 0) {
    gridContainer.innerHTML = `
      <div class="fr-empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <div class="fr-empty-state__icon" aria-hidden="true" style="margin-bottom: 16px; color: var(--color-primary);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        </div>
        <h4 style="color: #F5F5F5; font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">No resources in this category yet</h4>
        <p style="color: var(--color-text-muted); font-size: 0.95rem; max-width: 420px; margin: 0 auto 20px;">We regularly publish practical frameworks, playbooks, and checklists. Check back soon or browse all resources.</p>
        <button type="button" class="btn btn--secondary" onclick="window.frResetFilter()" style="font-size: var(--font-size-xs);">View All Resources</button>
      </div>
    `;
    return;
  }

  filteredData.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = `fr-card animate-fade-up-${(index % 3) + 1}`;
    card.setAttribute('aria-label', item.title);

    card.innerHTML = `
      <div class="fr-card__inner">
        <div class="fr-card__header">
          <div class="fr-card__badge-row">
            <span class="fr-card__badge ${item.isFeatured ? 'fr-card__badge--featured' : ''}">${item.type}</span>
            <span class="fr-card__category">${item.category}</span>
          </div>
          <h3 class="fr-card__title">${item.title}</h3>
        </div>

        <p class="fr-card__description">${item.description}</p>

        <div class="fr-card__footer">
          <div class="fr-card__meta">
            <svg class="fr-card__meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span>${item.meta || 'PDF Document'}</span>
          </div>

          <a href="${item.file}" class="fr-card__btn" target="_blank" rel="noopener noreferrer" download>
            <span>${item.ctaText || 'Download Resource'}</span>
            <svg class="fr-card__btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    `;

    gridContainer.appendChild(card);
  });
}

// Global helper for empty state reset
window.frResetFilter = () => {
  currentFilter = 'all';
  updateActiveFilterUI('all');
  renderResourceGrid('all');
};

/**
 * Filter Rail Scroll Indicators for mobile/tablet horizontal overflow
 */
function initFilterScrollIndicators() {
  const filterNav = document.querySelector('.fr-filter-nav');
  const filterList = document.querySelector('.fr-filter-list');
  if (!filterNav || !filterList) return;

  const updateScrollEnd = () => {
    const isEnd = (filterList.scrollLeft + filterList.clientWidth) >= (filterList.scrollWidth - 10);
    filterNav.classList.toggle('is-scrolled-end', isEnd);
  };

  filterList.addEventListener('scroll', updateScrollEnd, { passive: true });
  window.addEventListener('resize', updateScrollEnd, { passive: true });
  updateScrollEnd();
}
