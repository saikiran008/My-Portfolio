/* ============================================================
   STEVE.DEV — GLOBAL JAVASCRIPT
   Handles: theme toggle, navbar scroll, mobile menu,
            scroll reveal animations, toast notifications,
            and portfolio localStorage operations.
   ============================================================ */

/* ── 1. THEME TOGGLE (Dark / Light mode) ── */

/**
 * Reads saved theme from localStorage and applies it on page load.
 * Run this IMMEDIATELY (before DOM fully loads) to avoid flash.
 */
(function applyThemeEarly() {
  const saved = localStorage.getItem('steve-theme');
  if (saved === 'light') {
    document.documentElement.classList.add('light');
  }
})();

/**
 * Sets up the toggle button click handler.
 * Toggles 'light' class on <html> and saves preference.
 */
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  // Set correct icon based on current theme
  updateToggleIcon(btn);

  btn.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    const isLight = document.documentElement.classList.contains('light');
    localStorage.setItem('steve-theme', isLight ? 'light' : 'dark');
    updateToggleIcon(btn);
  });
}

/** Updates the moon/sun icon on the toggle button */
function updateToggleIcon(btn) {
  const isLight = document.documentElement.classList.contains('light');
  btn.textContent = isLight ? '🌙' : '☀️';
  btn.setAttribute('title', isLight ? 'Switch to dark mode' : 'Switch to light mode');
}


/* ── 2. NAVBAR SCROLL EFFECT ── */

/**
 * Adds .scrolled class to navbar when user scrolls down.
 * This triggers the frosted glass background via CSS.
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once on load in case page is already scrolled
}


/* ── 3. MOBILE HAMBURGER MENU ── */

/**
 * Opens/closes the full-screen mobile navigation drawer.
 */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  });

  const closeMenu = () => {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (mobileClose) mobileClose.addEventListener('click', closeMenu);

  // Also close when any mobile nav link is clicked
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}


/* ── 4. SCROLL REVEAL ANIMATIONS ── */

/**
 * Uses IntersectionObserver to watch .reveal elements.
 * When they enter the viewport, .visible class is added
 * which triggers the CSS transition (opacity + translateY).
 */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stop observing after it's been revealed
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((el) => observer.observe(el));
}


/* ── 5. TOAST NOTIFICATIONS ── */

/**
 * Shows a toast message at the bottom right of the screen.
 * @param {string} message - Text to display
 * @param {number} duration - How long to show (ms), default 3000
 */
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');

  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}


/* ── 6. PORTFOLIO DATA (localStorage) ── */

const STORAGE_KEY = 'stevedev-portfolio-v1';

/** Returns all saved portfolio projects as an array */
function getProjects() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

/** Saves the full projects array back to localStorage */
function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

/** Adds a new project to the front of the list */
function addProject(project) {
  const projects = getProjects();
  projects.unshift(project); // Add to beginning so newest shows first
  saveProjects(projects);
}

/** Removes a project by its index */
function deleteProject(index) {
  const projects = getProjects();
  projects.splice(index, 1);
  saveProjects(projects);
}


/* ── 7. COUNTER ANIMATION ── */

/**
 * Animates a number counting up from 0 to target.
 * @param {HTMLElement} el - The element to update
 * @param {number} target - The final number
 * @param {string} suffix - Optional suffix like '+' or '%'
 * @param {number} duration - Animation duration in ms
 */
function animateCounter(el, target, suffix = '', duration = 1500) {
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
  }, 16);
}


/* ── 8. FAQ ACCORDION ── */

/**
 * Toggles open/close state on an FAQ item.
 * Closes other open items first (accordion behaviour).
 */
function toggleFaq(clickedQ) {
  const item = clickedQ.closest('.faq-item');
  const allItems = document.querySelectorAll('.faq-item');

  // Close all other items
  allItems.forEach((other) => {
    if (other !== item) {
      other.classList.remove('open');
    }
  });

  // Toggle the clicked item
  item.classList.toggle('open');
}


/* ── 9. CONTACT FORM HANDLER ── */

/**
 * Validates and "submits" the contact form.
 * (In production, replace with real form submission / EmailJS)
 */
function handleContactForm() {
  const name    = document.getElementById('cfName')?.value.trim();
  const phone   = document.getElementById('cfPhone')?.value.trim();
  const type    = document.getElementById('cfType')?.value.trim();
  const message = document.getElementById('cfMessage')?.value.trim();

  if (!name || !phone) {
    showToast('⚠️ Please fill in your name and phone number.');
    return;
  }

  // TODO: Replace with EmailJS or backend form submission
  showToast('✅ Message sent! I\'ll reply within a few hours.');

  // Clear form fields after submission
  ['cfName', 'cfPhone', 'cfEmail', 'cfType', 'cfMessage'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}


/* ── 10. INIT — Run everything on DOM ready ── */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbarScroll();
  initMobileMenu();
  initScrollReveal();
});
