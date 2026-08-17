// case-studies.js - Case Studies Editorial Counters & Interactive Audio Testimonial

document.addEventListener('DOMContentLoaded', () => {
  initEditorialAnimations();
  initAudioPlayer();
});

/* ==========================================================================
   VIEWPORT-TRIGGERED ANIMATED COUNTER
   ========================================================================== */

function initEditorialAnimations() {
  const section = document.getElementById('credibility');
  if (!section) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters(prefersReducedMotion);
        observer.unobserve(section);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -40px 0px'
  });

  observer.observe(section);
}

// Animate Numerical Counter (0 -> 400)
function animateCounters(reducedMotion) {
  const counterEl = document.querySelector('.cs-stat-hero__num');
  if (!counterEl) return;

  const target = parseInt(counterEl.getAttribute('data-target') || '400', 10);
  if (reducedMotion) {
    counterEl.textContent = target;
    return;
  }

  const duration = 1600; // 1.6 seconds
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.floor(easeProgress * target);

    counterEl.textContent = currentVal;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counterEl.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

/* ==========================================================================
   INTERACTIVE AUDIO PLAYER & WAVEFORM VISUALIZER
   ========================================================================== */

function initAudioPlayer() {
  const audioBtn = document.getElementById('csCredAudioBtn');
  const waveform = document.getElementById('csCredWaveform');
  const timeDisplay = document.getElementById('csCredTime');

  if (!audioBtn || !waveform || !timeDisplay) return;

  // Waveform Bar Pattern (28 bars of natural heights)
  const barHeights = [
    6, 10, 14, 8, 16, 22, 12, 18, 24, 14, 20, 22, 16, 10, 18, 22, 
    14, 24, 20, 12, 16, 20, 14, 18, 10, 14, 8, 6
  ];

  // Generate waveform bars dynamically
  waveform.innerHTML = '';
  barHeights.forEach((h, i) => {
    const bar = document.createElement('div');
    bar.className = 'cs-waveform-bar';
    bar.style.height = `${h}px`;
    bar.style.animationDelay = `${(i * 0.04).toFixed(2)}s`;
    waveform.appendChild(bar);
  });

  const bars = waveform.querySelectorAll('.cs-waveform-bar');
  let isPlaying = false;
  let currentSeconds = 24; // 0:24 total
  let playbackSeconds = 0;
  let playInterval = null;

  audioBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;

    if (isPlaying) {
      audioBtn.classList.add('is-playing');
      audioBtn.setAttribute('aria-label', 'Pause audio testimonial');
      audioBtn.innerHTML = `
        <svg class="cs-audio-player__icon" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      `;

      playInterval = setInterval(() => {
        playbackSeconds++;
        const remaining = Math.max(0, currentSeconds - playbackSeconds);
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        timeDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

        // Progressively illuminate bars
        const progress = playbackSeconds / currentSeconds;
        bars.forEach((b, idx) => {
          if (idx / bars.length <= progress) {
            b.style.backgroundColor = '#C4B5FD';
          }
        });

        if (playbackSeconds >= currentSeconds) {
          stopAudio();
        }
      }, 1000);
    } else {
      pauseAudio();
    }
  });

  function pauseAudio() {
    isPlaying = false;
    audioBtn.classList.remove('is-playing');
    audioBtn.setAttribute('aria-label', 'Play audio testimonial');
    audioBtn.innerHTML = `
      <svg class="cs-audio-player__icon" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    `;
    if (playInterval) clearInterval(playInterval);
  }

  function stopAudio() {
    pauseAudio();
    playbackSeconds = 0;
    timeDisplay.textContent = '0:24';
    bars.forEach(b => {
      b.style.backgroundColor = '';
    });
  }
}
