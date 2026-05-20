/* =============================================
   PROGRAMA ARCA - Main JavaScript
   ============================================= */

(function () {
  'use strict';

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initCounters();
    initCarousel();
    initSmoothScroll();
  }


  /* =============================================
     NAVBAR - Scroll shadow & active link
     ============================================= */
  function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset;

      // Add shadow on scroll
      if (currentScroll > 10) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });

    // Active link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    if (sections.length && navLinks.length) {
      window.addEventListener('scroll', function () {
        let current = '';
        sections.forEach(function (section) {
          const sectionTop = section.offsetTop - 100;
          if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
          }
        });

        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
          }
        });
      }, { passive: true });
    }
  }


  /* =============================================
     MOBILE MENU
     ============================================= */
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburgerBtn');
    const menu = document.getElementById('navMenu');
    const overlay = document.getElementById('menuOverlay');

    if (!hamburger || !menu) return;

    hamburger.addEventListener('click', function () {
      const isOpen = menu.classList.contains('open');

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Close menu on link click
    menu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
      }
    });

    function openMenu() {
      menu.classList.add('open');
      if (overlay) overlay.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }


  /* =============================================
     SCROLL REVEAL ANIMATIONS
     ============================================= */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }


  /* =============================================
     ANIMATED COUNTERS
     ============================================= */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });

    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      function update() {
        current += step;
        if (current >= target) {
          el.textContent = formatNumber(target);
          return;
        }
        el.textContent = formatNumber(Math.floor(current));
        requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    }

    function formatNumber(num) {
      return num.toLocaleString('pt-BR');
    }
  }


  /* =============================================
     TESTIMONIAL CAROUSEL
     ============================================= */
  function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselNav');

    if (!track) return;

    const slides = track.querySelectorAll('.carousel__slide');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel__dot') : [];
    let currentSlide = 0;
    let autoplayInterval;

    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      currentSlide = index;
      track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';

      // Update dots
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goToSlide(currentSlide - 1);
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goToSlide(currentSlide + 1);
        resetAutoplay();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goToSlide(parseInt(this.getAttribute('data-slide'), 10));
        resetAutoplay();
      });
    });

    // Autoplay
    function startAutoplay() {
      autoplayInterval = setInterval(function () {
        goToSlide(currentSlide + 1);
      }, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    startAutoplay();

    // Pause on hover
    var carousel = document.getElementById('testimonialCarousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', function () {
        clearInterval(autoplayInterval);
      });
      carousel.addEventListener('mouseleave', function () {
        startAutoplay();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (!carousel) return;
      var rect = carousel.getBoundingClientRect();
      var isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isVisible) return;

      if (e.key === 'ArrowLeft') {
        goToSlide(currentSlide - 1);
        resetAutoplay();
      } else if (e.key === 'ArrowRight') {
        goToSlide(currentSlide + 1);
        resetAutoplay();
      }
    });

    // Touch swipe
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(currentSlide + 1);
        } else {
          goToSlide(currentSlide - 1);
        }
        resetAutoplay();
      }
    }
  }


  /* =============================================
     SMOOTH SCROLL
     ============================================= */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          var offset = 80; // Account for fixed header
          var top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;

          window.scrollTo({
            top: top,
            behavior: 'smooth'
          });
        }
      });
    });
  }


  /* =============================================
     TOAST NOTIFICATIONS (global utility)
     ============================================= */
  window.showToast = function (message, type) {
    type = type || 'info';
    var container = document.getElementById('toastContainer');
    if (!container) return;

    var icons = {
      success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    var toast = document.createElement('div');
    toast.className = 'toast toast--' + type;
    toast.innerHTML =
      '<div class="toast__icon">' + (icons[type] || icons.info) + '</div>' +
      '<span class="toast__message">' + message + '</span>' +
      '<button class="toast__close" aria-label="Fechar">&times;</button>';

    container.appendChild(toast);

    // Close button
    toast.querySelector('.toast__close').addEventListener('click', function () {
      removeToast(toast);
    });

    // Auto dismiss
    setTimeout(function () {
      removeToast(toast);
    }, 5000);

    function removeToast(el) {
      el.style.animation = 'fadeIn 0.3s ease reverse';
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 300);
    }
  };


  /* =============================================
     MODAL SYSTEM (global utility)
     ============================================= */
  window.openModal = function (modalId) {
    var modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Close on overlay click
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        window.closeModal(modalId);
      }
    });

    // Close on Escape
    var escHandler = function (e) {
      if (e.key === 'Escape') {
        window.closeModal(modalId);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  };

  window.closeModal = function (modalId) {
    var modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Initialize modal close buttons
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-modal-close]')) {
      var modalId = e.target.closest('[data-modal-close]').getAttribute('data-modal-close');
      window.closeModal(modalId);
    }
    if (e.target.closest('[data-modal-open]')) {
      var openId = e.target.closest('[data-modal-open]').getAttribute('data-modal-open');
      window.openModal(openId);
    }
  });

})();
