/**
 * navbar.js - Sticky Header Glass Effect & Mobile Drawer Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const toggleBtn = document.querySelector('.navbar__toggle');
  const navMenu = document.querySelector('.navbar__menu');
  const navLinks = document.querySelectorAll('.navbar__link');

  // Sticky header glass effect on scroll
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header?.classList.add('header--scrolled');
    } else {
      header?.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Toggle Mobile Menu
  const toggleMobileMenu = () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('navbar__menu--mobile-open');

    // Prevent body scrolling when mobile menu is open
    if (!isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu on clicking any navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('navbar__menu--mobile-open')) {
        toggleMobileMenu();
      }
    });
  });
});
