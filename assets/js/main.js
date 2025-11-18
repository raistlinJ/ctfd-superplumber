/* Super Mario Theme - Main JavaScript */

// Import CSS
import '../css/main.scss';

// Import Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import Alpine.js
import Alpine from 'alpinejs';

// Import other dependencies
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Configure dayjs
dayjs.extend(relativeTime);

// Make Alpine available globally
window.Alpine = Alpine;

// Initialize Alpine
Alpine.start();

// Mario Theme Specific Features
class MarioTheme {
  constructor() {
    this.init();
  }

  init() {
    this.addCoinSound();
    this.addBlockAnimations();
    this.addPowerUpEffects();
    this.initializeScoreAnimations();
  }

  // Add coin sound effect on score changes
  addCoinSound() {
    // Observe score changes and add visual feedback
    const scoreElements = document.querySelectorAll('.score-display, [data-score]');
    
    scoreElements.forEach(element => {
      const observer = new MutationObserver(() => {
        this.playCoinAnimation(element);
      });
      
      observer.observe(element, {
        childList: true,
        characterData: true,
        subtree: true
      });
    });
  }

  playCoinAnimation(element) {
    element.classList.add('coin-animation');
    setTimeout(() => {
      element.classList.remove('coin-animation');
    }, 500);
  }

  // Add block bump animation to buttons
  addBlockAnimations() {
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        btn.style.animation = 'block-bump 0.3s ease';
        setTimeout(() => {
          btn.style.animation = '';
        }, 300);
      });
    });
  }

  // Add power-up effect to success messages
  addPowerUpEffects() {
    document.addEventListener('DOMContentLoaded', () => {
      const alerts = document.querySelectorAll('.alert-success');
      alerts.forEach(alert => {
        alert.style.animation = 'coin-bounce 0.5s ease';
      });
    });
  }

  // Initialize score animations
  initializeScoreAnimations() {
    const scores = document.querySelectorAll('[data-score]');
    scores.forEach(score => {
      const value = parseInt(score.dataset.score);
      this.animateScore(score, 0, value, 1000);
    });
  }

  animateScore(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  }
}

// CTFd Integration Helpers
class CTFdHelpers {
  static formatDate(date) {
    return dayjs(date).fromNow();
  }

  static sanitizeHTML(html) {
    return DOMPurify.sanitize(html);
  }

  static parseMarkdown(markdown) {
    return marked.parse(markdown);
  }

  static showNotification(message, type = 'info') {
    const alertClass = `alert-${type}`;
    const notification = document.createElement('div');
    notification.className = `alert ${alertClass} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    notification.style.zIndex = '9999';
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  static copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showNotification('Copied to clipboard! 🪙', 'success');
    }).catch(() => {
      this.showNotification('Failed to copy', 'danger');
    });
  }
}

// Make helpers available globally
window.CTFdHelpers = CTFdHelpers;

// Initialize Mario theme
document.addEventListener('DOMContentLoaded', () => {
  new MarioTheme();
  
  // Add copy buttons to code blocks
  document.querySelectorAll('pre code').forEach(block => {
    const button = document.createElement('button');
    button.className = 'btn btn-sm btn-warning position-absolute top-0 end-0 m-2';
    button.innerHTML = '📋 Copy';
    button.onclick = () => {
      CTFdHelpers.copyToClipboard(block.textContent);
    };
    
    const pre = block.parentElement;
    pre.style.position = 'relative';
    pre.appendChild(button);
  });
  
  // Add hover effects to challenge cards
  document.querySelectorAll('.challenge-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
  
  // Add question mark animation to unsolved challenges
  document.querySelectorAll('.challenge-card:not(.challenge-solved)').forEach(card => {
    setInterval(() => {
      const questionMark = card.querySelector('::before');
      card.style.animation = 'block-bump 0.5s ease';
      setTimeout(() => {
        card.style.animation = '';
      }, 500);
    }, 5000);
  });
});

// Export for use in templates
export { MarioTheme, CTFdHelpers };