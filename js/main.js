/**
 * main.js - Main Application Entry Script, Dual Coordinated Metallic Light Sweeps & 20% Local Interaction Radius
 *
 * Performance optimization (P1):
 * - Watermark light sweep pauses when hero section scrolls out of viewport
 * - Resumes smoothly from current animation state when hero becomes visible again
 *
 * Seamless cursor-to-autoscan handoff:
 * - Shared state coordinates both cursor spotlight and auto sweep.
 * - When cursor leaves interaction zone, auto scan continues LEFT -> RIGHT directly
 *   from the cursor's last illuminated position with zero jump or delay.
 */

document.addEventListener('DOMContentLoaded', () => {
  const heroSection = document.getElementById('hero');
  const ghostWrapper = document.getElementById('heroGhostWrapper');

  if (!heroSection || !ghostWrapper) return;

  // 1. Organic Metallic Dual Light Sweep
  let scanProgress = 0;
  const scanSpeed = 0.0015; // ~9s base cycle duration
  let isHoveringWatermark = false;
  let rafScanId = null;
  let isHeroVisible = true; // Track hero visibility for pause/resume

  /**
   * Converts a horizontal percentage across the watermark (-15% to 115%)
   * to the exact scanProgress (0 to 1) corresponding to that point.
   */
  function cursorPercentToScanProgress(cursorXPercent) {
    const clampedX = Math.max(-15, Math.min(115, cursorXPercent));
    const easeProgress = (clampedX + 15) / 130;
    const cosValue = Math.max(-1, Math.min(1, 1 - 2 * easeProgress));
    return Math.acos(cosValue) / Math.PI;
  }

  function updateScanCssVariables(ease) {
    // Primary Warm Purple Light Sweep Position (-15% to 115%)
    const primaryX = -15 + ease * 130;
    const primaryY = 115 - ease * 130;

    // Secondary Coordinated Purple Reflection Trail Position (Trailing behind)
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

    if (!isHoveringWatermark) {
      // Organic progress deceleration across central letter crossings (0.35 - 0.65)
      let currentStep = scanSpeed;
      if (scanProgress > 0.35 && scanProgress < 0.65) {
        currentStep *= 0.75;
      }

      scanProgress += currentStep;
      if (scanProgress > 1) {
        scanProgress = 0;
      }

      // Smooth Cubic Cosine Ease-In-Out Progress Calculation
      const easeProgress = 0.5 - Math.cos(scanProgress * Math.PI) / 2;
      updateScanCssVariables(easeProgress);
    }

    rafScanId = requestAnimationFrame(animateTravellingLight);
  }

  // Start continuous dual light sweep
  rafScanId = requestAnimationFrame(animateTravellingLight);

  // Hero Visibility Observer — pause/resume sweep when hero enters/leaves viewport
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

  // 2. Local Interaction Zone Detection (20% radius of the CREWIIFY watermark)
  document.addEventListener('mousemove', (e) => {
    if (!isHeroVisible) return;

    const rect = ghostWrapper.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const wrapperCenterX = rect.left + rect.width / 2;
    const wrapperCenterY = rect.top + rect.height / 2;
    const paddingX = rect.width * 0.70;  // ~20% radius extension horizontally
    const paddingY = rect.height * 0.75; // ~25% radius extension vertically

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

      // Set cursor-mode properties
      ghostWrapper.style.setProperty('--mouse-x', `${relX.toFixed(1)}px`);
      ghostWrapper.style.setProperty('--mouse-y', `${relY.toFixed(1)}px`);

      // Keep shared scan state perfectly aligned with current cursor position
      const cursorPercentX = (relX / rect.width) * 100;
      scanProgress = cursorPercentToScanProgress(cursorPercentX);
      const easeProgress = 0.5 - Math.cos(scanProgress * Math.PI) / 2;
      updateScanCssVariables(easeProgress);

    } else if (isHoveringWatermark) {
      // Cursor has left the interaction zone -> immediately resume auto-scan from current position
      isHoveringWatermark = false;
      ghostWrapper.classList.remove('is-cursor-active');
    }
  }, { passive: true });

  console.log('CREWIIFY Landing Page & Metallic Dual Light Sweep initialized smoothly.');
});
