/**
 * particles.js - Ultra-subtle Floating Background Particles
 */

class HeroParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 30;
    
    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas(), { passive: true });

    // Create subtle particles matching #C97A2B
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

    this.animate();
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.clientWidth;
      this.canvas.height = parent.clientHeight;
    }
  }

  animate() {
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

      // Render glowing dot with #C97A2B
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(201, 122, 43, ${p.alpha})`;
      this.ctx.shadowBlur = 5;
      this.ctx.shadowColor = 'rgba(201, 122, 43, 0.3)';
      this.ctx.fill();
    }

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new HeroParticleSystem('heroCanvas');
});
