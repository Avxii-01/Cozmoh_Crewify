/**
 * navbar.js - Global Reusable Navbar Component for CREWIIFY
 * 
 * Features:
 * - Single Source of Truth for navigation items & routes
 * - Automatic active-page state detection across multiple pages
 * - Desktop hover & keyboard-accessible White-Label dropdown
 * - Mobile expandable accordion for White-Label
 * - Sticky header glassmorphism on scroll
 */

// Central Navigation Structure (Single Source of Truth)
const NAV_CONFIG = {
  brand: {
    name: 'CREWIIFY',
    logo: 'assets/logos/c-logo-optimized.png',
    homeUrl: 'index.html'
  },
  items: [
    { label: 'Home', url: 'index.html', id: 'home', enabled: true },
    { label: 'Services', url: 'services.html', id: 'services', enabled: true },
    { label: 'Case Studies', url: 'case-studies.html', id: 'case-studies', enabled: true },
    { 
      label: 'White-Label', 
      id: 'white-label',
      enabled: false,
      dropdown: [
        { label: 'SEO', url: 'white-label/seo.html', id: 'seo', enabled: false },
        { label: 'Website Development', url: 'white-label/website-development.html', id: 'website-development', enabled: false }
      ]
    },
    { label: 'Free Resources', url: 'free-resources.html', id: 'free-resources', enabled: false }
  ],
  cta: {
    label: 'Book a Discovery Call',
    url: 'index.html#contact',
    id: 'contact',
    enabled: true
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const toggleBtn = document.querySelector('.navbar__toggle');
  const navMenu = document.querySelector('.navbar__menu');
  const navbarActions = document.querySelector('.navbar__actions');

  // Determine if current view is homepage
  const currentPath = window.location.pathname.toLowerCase();
  const isHomePage = currentPath === '/' || 
    currentPath.endsWith('/index.html') || 
    currentPath.endsWith('/crewify/') || 
    currentPath.endsWith('/crewify') ||
    currentPath.split('/').filter(Boolean).pop() === 'index.html' ||
    currentPath.split('/').filter(Boolean).pop() === '';

  // 1. Dynamic Rendering & Filtering of Navigation Items based on NAV_CONFIG
  const renderNavMenu = () => {
    if (!navMenu) return;

    const itemsHTML = NAV_CONFIG.items
      .filter(item => item.enabled)
      .map(item => {
        if (item.dropdown && item.dropdown.length > 0) {
          const enabledChildren = item.dropdown.filter(child => child.enabled);
          if (enabledChildren.length === 0) return ''; // Hide dropdown if no children are enabled

          const isParentActive = enabledChildren.some(child => 
            !isHomePage && (currentPath.endsWith(child.url) || currentPath.includes(child.url.replace('.html', '')))
          );

          return `
            <li class="navbar__item navbar__item--dropdown">
              <a href="#" class="navbar__link navbar__link--dropdown-trigger ${isParentActive ? 'navbar__link--active' : ''}" aria-haspopup="true" aria-expanded="false">
                ${item.label} <span class="navbar__caret" aria-hidden="true">▼</span>
              </a>
              <ul class="navbar__dropdown" aria-label="${item.label} submenu">
                ${enabledChildren.map(child => {
                  const isChildActive = !isHomePage && (currentPath.endsWith(child.url) || currentPath.includes(child.url.replace('.html', '')));
                  return `
                    <li class="navbar__dropdown-item">
                      <a href="${child.url}" class="navbar__dropdown-link ${isChildActive ? 'navbar__dropdown-link--active' : ''}">${child.label}</a>
                    </li>
                  `;
                }).join('')}
              </ul>
            </li>
          `;
        }

        const isCurrent = (item.url === 'index.html' && isHomePage) || 
          (item.url !== 'index.html' && !isHomePage && (currentPath.endsWith(item.url) || currentPath.includes(item.url.replace('.html', ''))));

        return `
          <li class="navbar__item">
            <a href="${item.url}" class="navbar__link ${isCurrent ? 'navbar__link--active' : ''}">${item.label}</a>
          </li>
        `;
      }).join('');

    const ctaTargetUrl = isHomePage ? '#contact' : NAV_CONFIG.cta.url;
    const ctaHTML = NAV_CONFIG.cta.enabled ? `
      <li class="navbar__item navbar__mobile-cta">
        <a href="${ctaTargetUrl}" class="btn btn--primary" style="width: 100%;">${NAV_CONFIG.cta.label}</a>
      </li>
    ` : '';

    navMenu.innerHTML = itemsHTML + ctaHTML;

    // Update Desktop Actions CTA if present
    if (navbarActions && NAV_CONFIG.cta.enabled) {
      navbarActions.innerHTML = `
        <a href="${ctaTargetUrl}" class="btn btn--nav-cta">
          ${NAV_CONFIG.cta.label}
        </a>
      `;
    }
  };

  renderNavMenu();

  const dropdownItems = document.querySelectorAll('.navbar__item--dropdown');

  // 2. Sticky Header Glass Effect on Scroll
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header?.classList.add('header--scrolled');
    } else {
      header?.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // 3. Mobile Menu Toggle
  const toggleMobileMenu = (forceClose = false) => {
    if (!toggleBtn || !navMenu) return;
    const isExpanded = forceClose ? false : toggleBtn.getAttribute('aria-expanded') !== 'true';
    toggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    navMenu.classList.toggle('navbar__menu--mobile-open', isExpanded);

    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Collapse any open mobile submenus
      dropdownItems.forEach(item => item.classList.remove('is-mobile-expanded'));
    }
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => toggleMobileMenu());
  }

  // 4. White-Label Dropdown Interactions (Desktop & Mobile/Tablet)
  const isMobileOrTablet = () => window.matchMedia('(max-width: 992px)').matches;

  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.navbar__link--dropdown-trigger');
    const dropdown = item.querySelector('.navbar__dropdown');

    if (!trigger) return;

    // Mobile/Tablet click behavior: expand accordion
    trigger.addEventListener('click', (e) => {
      if (isMobileOrTablet()) {
        e.preventDefault();
        e.stopPropagation();
        item.classList.toggle('is-mobile-expanded');
        const isExpanded = item.classList.contains('is-mobile-expanded');
        trigger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      }
    });

    // Keyboard navigation (Enter / Space to toggle)
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.classList.toggle('is-open');
        const isOpen = item.classList.contains('is-open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      } else if (e.key === 'Escape') {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  });

  // Close desktop dropdown and mobile menu on clicking outside or Esc
  document.addEventListener('click', (e) => {
    dropdownItems.forEach(item => {
      if (!item.contains(e.target)) {
        item.classList.remove('is-open');
        item.querySelector('.navbar__link--dropdown-trigger')?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownItems.forEach(item => {
        item.classList.remove('is-open');
        item.querySelector('.navbar__link--dropdown-trigger')?.setAttribute('aria-expanded', 'false');
      });
      if (navMenu?.classList.contains('navbar__menu--mobile-open')) {
        toggleMobileMenu(true);
      }
    }
  });

  // Close mobile menu when clicking any leaf link
  const leafLinks = document.querySelectorAll('.navbar__link:not(.navbar__link--dropdown-trigger), .navbar__dropdown-link, .navbar__mobile-cta a');
  leafLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isMobileOrTablet() && navMenu?.classList.contains('navbar__menu--mobile-open')) {
        toggleMobileMenu(true);
      }
    });
  });
});
