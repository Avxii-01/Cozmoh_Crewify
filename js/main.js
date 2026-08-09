/**
 * main.js - Main Application Entry Script, Dual Coordinated Metallic Light Sweeps & 20% Local Interaction Radius
 */

document.addEventListener('DOMContentLoaded', () => {
  const heroSection = document.getElementById('hero');
  const ghostWrapper = document.getElementById('heroGhostWrapper');

  if (!heroSection || !ghostWrapper) return;

  // 1. Slow Organic Metallic Dual Light Sweep (8-10 Seconds Cycle with subtle letter-crossing deceleration)
  let scanProgress = 0;
  const scanSpeed = 0.0015; // ~9s base cycle duration
  let isHoveringWatermark = false;
  let rafScanId = null;

  function animateTravellingLight() {
    if (!isHoveringWatermark) {
      // Organic progress deceleration across central letter crossings (0.35 - 0.65)
      let currentStep = scanSpeed;
      if (scanProgress > 0.35 && scanProgress < 0.65) {
        currentStep *= 0.75; // Slower crossing central letters
      }

      scanProgress += currentStep;
      if (scanProgress > 1) {
        scanProgress = 0;
      }

      // Smooth Cubic Cosine Ease-In-Out Progress Calculation
      const easeProgress = 0.5 - Math.cos(scanProgress * Math.PI) / 2;

      // Primary Warm Orange Light Sweep Position (-15% to 115%)
      const primaryX = -15 + easeProgress * 130;
      const primaryY = 115 - easeProgress * 130;

      // Secondary Coordinated Amber Reflection Trail Position (Trailing ~180px behind)
      const trailProgress = Math.max(0, easeProgress - 0.14);
      const trailX = -15 + trailProgress * 130;
      const trailY = 115 - trailProgress * 130;

      ghostWrapper.style.setProperty('--scan-x', `${primaryX.toFixed(1)}%`);
      ghostWrapper.style.setProperty('--scan-y', `${primaryY.toFixed(1)}%`);
      ghostWrapper.style.setProperty('--trail-x', `${trailX.toFixed(1)}%`);
      ghostWrapper.style.setProperty('--trail-y', `${trailY.toFixed(1)}%`);
    }

    rafScanId = requestAnimationFrame(animateTravellingLight);
  }

  // Start continuous dual light sweep
  rafScanId = requestAnimationFrame(animateTravellingLight);

  // 2. Local Interaction Zone Detection (Only within 20% radius of the CREWIFY watermark)
  document.addEventListener('mousemove', (e) => {
    const rect = ghostWrapper.getBoundingClientRect();
    
    // Calculate distance from cursor to watermark center with 20% padding zone
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

      ghostWrapper.style.setProperty('--mouse-x', `${relX.toFixed(1)}px`);
      ghostWrapper.style.setProperty('--mouse-y', `${relY.toFixed(1)}px`);
    } else if (isHoveringWatermark) {
      // Cursor left local interaction zone -> Smooth 600ms fade back and resume travelling light from current position
      ghostWrapper.classList.remove('is-cursor-active');
      setTimeout(() => {
        isHoveringWatermark = false;
      }, 600);
    }
  }, { passive: true });

  console.log('CREWIIFY Landing Page & Metallic Dual Light Sweep initialized smoothly.');
});
