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
    { label: 'Home', url: 'index.html', id: 'home' },
    { label: 'Services', url: 'services.html', id: 'services' },
    { label: 'Case Studies', url: 'case-studies.html', id: 'case-studies' },
    { 
      label: 'White-Label', 
      id: 'white-label',
      dropdown: [
        { label: 'SEO', url: 'white-label/seo.html', id: 'seo' },
        { label: 'Website Development', url: 'white-label/website-development.html', id: 'website-development' }
      ]
    },
    { label: 'Free Resources', url: 'free-resources.html', id: 'free-resources' }
  ],
  cta: {
    label: 'Book a Discovery Call',
    url: 'contact.html',
    id: 'contact'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const toggleBtn = document.querySelector('.navbar__toggle');
  const navMenu = document.querySelector('.navbar__menu');
  const dropdownItems = document.querySelectorAll('.navbar__item--dropdown');

  // 1. Determine Current Page Active State
  const currentPath = window.location.pathname.toLowerCase();
  
  const updateActiveStates = () => {
    const navLinks = document.querySelectorAll('.navbar__link');
    const dropdownLinks = document.querySelectorAll('.navbar__dropdown-link');

    // Determine if current view is homepage
    const isHomePage = currentPath === '/' || 
      currentPath.endsWith('/index.html') || 
      currentPath.endsWith('/crewify/') || 
      currentPath.endsWith('/crewify') ||
      currentPath.split('/').filter(Boolean).pop() === 'index.html';

    dropdownLinks.forEach(link => {
      const href = link.getAttribute('href')?.toLowerCase() || '';
      if (href && !isHomePage && (currentPath.endsWith(href) || currentPath.includes(href.replace('.html', '')))) {
        link.classList.add('navbar__dropdown-link--active');
        link.closest('.navbar__item--dropdown')?.querySelector('.navbar__link')?.classList.add('navbar__link--active');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href')?.toLowerCase() || '';
      if (href === 'index.html') {
        if (isHomePage) {
          link.classList.add('navbar__link--active');
        } else {
          link.classList.remove('navbar__link--active');
        }
      } else if (href && href !== '#' && !isHomePage && (currentPath.endsWith(href) || currentPath.includes(href.replace('.html', '')))) {
        link.classList.add('navbar__link--active');
      }
    });
  };

  updateActiveStates();

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
