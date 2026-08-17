/**
 * particles.js - Ultra-subtle Floating Background Particles System
 * Supports both Hero canvas and CTA section canvas.
 *
 * Performance optimizations (P1):
 * - Hero particles pause when hero section scrolls out of viewport
 * - CTA particles defer initialization until CTA approaches viewport
 * - Both systems resume smoothly when re-entering viewport
 */

class ParticleSystem {
  constructor(canvasId, particleCount = 30) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = particleCount;
    this.rafId = null;
    this.isRunning = false;
    
    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas(), { passive: true });

    // Create subtle particles matching #8B5CF6
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.35 + 0.08,
        fadeSpeed: (Math.random() * 0.004 + 0.0015) * (Math.random() > 0.5 ? 1 : -1)
      });
    }

    this.start();
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.clientWidth;
      this.canvas.height = parent.clientHeight;
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.fadeSpeed;

      // Pulse alpha smoothly
      if (p.alpha > 0.4 || p.alpha < 0.08) {
        p.fadeSpeed = -p.fadeSpeed;
      }

      // Boundary reset
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      // Render glowing dot with purple #8B5CF6
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
      this.ctx.shadowBlur = 5;
      this.ctx.shadowColor = 'rgba(139, 92, 246, 0.35)';
      this.ctx.fill();
    }

    this.rafId = requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Hero Particles — initialize immediately but pause when hero is off-screen
  const heroCanvas = document.getElementById('heroCanvas') || document.getElementById('csHeroCanvas');
  if (heroCanvas) {
    const heroSystem = new ParticleSystem(heroCanvas.id, 24);
    const heroSection = document.getElementById('hero') || document.getElementById('case-studies-hero');

    if (heroSystem.canvas && heroSection) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            heroSystem.start();
          } else {
            heroSystem.pause();
          }
        });
      }, { rootMargin: '100px' });

      heroObserver.observe(heroSection);
    }
  }

  // CTA Particles — defer initialization until CTA approaches viewport
  const ctaCanvas = document.getElementById('ctaCanvas');
  if (ctaCanvas) {
    let ctaSystem = null;
    const ctaSection = ctaCanvas.closest('section') || ctaCanvas.parentElement;

    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!ctaSystem) {
            // First time entering viewport — initialize the particle system
            ctaSystem = new ParticleSystem('ctaCanvas', 18);
          } else {
            ctaSystem.start();
          }
        } else if (ctaSystem) {
          ctaSystem.pause();
        }
      });
    }, { rootMargin: '200px' });

    ctaObserver.observe(ctaSection);
  }
});
