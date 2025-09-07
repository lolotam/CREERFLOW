/**
 * CareerFlow Animation Core Library
 * Advanced animation utilities for smooth, performant interactions
 */

class ScrollAnimator {
  constructor() {
    this.observer = null;
    this.animatedElements = new Set();
    this.init();
  }

  init() {
    // Create intersection observer for scroll-triggered animations
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersect(entries),
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all elements with scroll-reveal classes
    this.observeElements();
    
    // Re-observe on DOM changes
    this.setupMutationObserver();
  }

  handleIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
        this.animateElement(entry.target);
        this.animatedElements.add(entry.target);
      }
    });
  }

  animateElement(element) {
    // Add animation class with delay based on data attribute
    const delay = element.dataset.delay || 0;
    
    setTimeout(() => {
      element.classList.add('animate-in');
      
      // Trigger custom animation event
      element.dispatchEvent(new CustomEvent('scrollAnimationStart', {
        detail: { element }
      }));
    }, parseInt(delay));
  }

  observeElements() {
    const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
    elements.forEach(el => this.observer.observe(el));
  }

  setupMutationObserver() {
    const mutationObserver = new MutationObserver(() => {
      this.observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

class ParticleSystem {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    
    this.options = {
      particleCount: options.particleCount || 50,
      particleSize: options.particleSize || 2,
      particleSpeed: options.particleSpeed || 0.5,
      particleColor: options.particleColor || 'rgba(59, 130, 246, 0.3)',
      connectionDistance: options.connectionDistance || 100,
      ...options
    };

    this.init();
  }

  init() {
    this.resizeCanvas();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.options.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.options.particleSpeed,
        vy: (Math.random() - 0.5) * this.options.particleSpeed,
        size: Math.random() * this.options.particleSize + 1
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    this.particles.forEach(particle => {
      this.updateParticle(particle);
      this.drawParticle(particle);
    });

    // Draw connections
    this.drawConnections();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  updateParticle(particle) {
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Bounce off edges
    if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

    // Keep within bounds
    particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
    particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
  }

  drawParticle(particle) {
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fillStyle = this.options.particleColor;
    this.ctx.fill();
  }

  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.options.connectionDistance) {
          const opacity = 1 - (distance / this.options.connectionDistance);
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.2})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.resizeCanvas);
  }
}

class ProgressiveForm {
  constructor(formElement) {
    this.form = formElement;
    this.steps = [...formElement.querySelectorAll('.form-step')];
    this.currentStep = 0;
    this.progressBar = formElement.querySelector('.progress-bar');
    this.nextButtons = [...formElement.querySelectorAll('.btn-next')];
    this.prevButtons = [...formElement.querySelectorAll('.btn-prev')];
    
    this.init();
  }

  init() {
    this.showStep(0);
    this.updateProgressBar();
    this.bindEvents();
  }

  bindEvents() {
    this.nextButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.nextStep();
      });
    });

    this.prevButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.prevStep();
      });
    });
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.hideStep(this.currentStep, 'slide-out-left');
      this.currentStep++;
      this.showStep(this.currentStep, 'slide-in-right');
      this.updateProgressBar();
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.hideStep(this.currentStep, 'slide-out-right');
      this.currentStep--;
      this.showStep(this.currentStep, 'slide-in-left');
      this.updateProgressBar();
    }
  }

  showStep(index, animationClass = 'fade-in') {
    const step = this.steps[index];
    step.style.display = 'block';
    step.classList.add(animationClass);
    
    // Remove animation class after animation completes
    setTimeout(() => {
      step.classList.remove(animationClass);
    }, 500);
  }

  hideStep(index, animationClass = 'fade-out') {
    const step = this.steps[index];
    step.classList.add(animationClass);
    
    setTimeout(() => {
      step.style.display = 'none';
      step.classList.remove(animationClass);
    }, 500);
  }

  updateProgressBar() {
    if (this.progressBar) {
      const progress = ((this.currentStep + 1) / this.steps.length) * 100;
      this.progressBar.style.width = `${progress}%`;
    }
  }
}

class CountingNumbers {
  constructor(element, options = {}) {
    this.element = element;
    this.finalValue = parseInt(element.dataset.count) || parseInt(element.textContent);
    this.duration = options.duration || 2000;
    this.startValue = options.startValue || 0;
    this.suffix = options.suffix || '';
    this.prefix = options.prefix || '';
    
    this.hasAnimated = false;
    this.init();
  }

  init() {
    // Set initial value
    this.element.textContent = this.prefix + this.startValue + this.suffix;
    
    // Start animation when element comes into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.animate();
          this.hasAnimated = true;
        }
      });
    });

    observer.observe(this.element);
  }

  animate() {
    const startTime = performance.now();
    const startValue = this.startValue;
    const endValue = this.finalValue;
    const duration = this.duration;

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);
      
      this.element.textContent = this.prefix + currentValue.toLocaleString() + this.suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }
}

// Utility functions
const AnimationUtils = {
  // Add ripple effect to element
  addRippleEffect(element) {
    element.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  },

  // Smooth scroll to element
  smoothScrollTo(element, offset = 0) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  },

  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Check if element is in viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize scroll animations
  new ScrollAnimator();

  // Initialize counting numbers
  document.querySelectorAll('[data-count]').forEach(el => {
    new CountingNumbers(el);
  });

  // Initialize progressive forms
  document.querySelectorAll('.progressive-form').forEach(form => {
    new ProgressiveForm(form);
  });

  // Add ripple effects to buttons
  document.querySelectorAll('.ripple-effect').forEach(btn => {
    AnimationUtils.addRippleEffect(btn);
  });

  // Initialize particle systems
  document.querySelectorAll('.particle-canvas').forEach(canvas => {
    new ParticleSystem(canvas);
  });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ScrollAnimator,
    ParticleSystem,
    ProgressiveForm,
    CountingNumbers,
    AnimationUtils
  };
}
