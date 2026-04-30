gsap.registerPlugin(ScrollTrigger);

/* ===== APPEAR ON LOAD ===== */
function initAppearAnimations() {
  const heroContent = document.querySelector('[data-appear]');
  const heroVisual = document.querySelector('[data-appear-delay]');

  requestAnimationFrame(() => {
    if (heroContent) heroContent.classList.add('visible');
    if (heroVisual) heroVisual.classList.add('visible');
  });
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.section-tag, .section-heading, .stat-card, .working-card, .working-header, .about-content, .stats-grid, .footer-links'
  );

  revealElements.forEach(el => {
    el.classList.add('reveal-up');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    observer.observe(el);
  });
}

/* ===== ANIMATED COUNTERS ===== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = current + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ===== NAVBAR ===== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  const links = document.querySelectorAll('.mobile-link');

  // Toggle mobile menu
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Navbar background on scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      navbar.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
    } else {
      navbar.style.boxShadow = 'none';
    }
    lastScroll = currentScroll;
  });
}

/* ===== VIDEO HOVER PLAY ===== */
function initVideoHover() {
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    const video = card.querySelector('.project-video video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
}

/* ===== GSAP SCROLL ANIMATIONS ===== */
function initGSAPAnimations() {
  // 3D Container Scroll Animation (like Aceternity ContainerScroll)
  const isMobile = window.innerWidth <= 768;

  // Rotate from 20deg to 0deg as you scroll
  gsap.fromTo('.hero-scroll-container', 
    { rotateX: 20, scale: isMobile ? 0.7 : 1.05 },
    {
      rotateX: 0,
      scale: isMobile ? 0.9 : 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-visual',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.8
      }
    }
  );

  // Hero title moves up as card comes into view
  gsap.fromTo('.hero-content',
    { y: 0 },
    {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-visual',
        start: 'top 80%',
        end: 'bottom 30%',
        scrub: 0.8
      }
    }
  );

  // About section text reveal
  gsap.from('.about-name', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 70%'
    }
  });

  gsap.from('.about-description', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 70%'
    }
  });

  // Stagger hike cards
  gsap.fromTo('.hike-card',
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 85%'
      }
    }
  );

  // Project cards slide in
  gsap.fromTo('.project-card',
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top 85%'
      }
    }
  );

  // Testimonial cards
  gsap.fromTo('.testimonial-card', 
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.testimonials-grid',
        start: 'top 85%'
      }
    }
  );

  // Brands strip
  gsap.from('.brand-item', {
    y: 20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.brands-section',
      start: 'top 85%'
    }
  });

  // Reel section
  gsap.from('.reel-video-wrap', {
    y: 40,
    opacity: 0,
    scale: 0.96,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.reel-section',
      start: 'top 75%'
    }
  });

  // Footer CTA
  gsap.from('.footer-cta', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.footer-section',
      start: 'top 80%'
    }
  });
}

/* ===== SERVICE DEMO MODAL ===== */
function initServiceModal() {
  const overlay = document.getElementById('serviceModal');
  const modalTitle = document.getElementById('serviceModalTitle');
  const modalDesc = document.getElementById('serviceModalDesc');
  const modalTools = document.getElementById('serviceModalTools');
  const modalHighlights = document.getElementById('serviceModalHighlights');
  const modalClose = document.getElementById('serviceModalClose');
  const videosGrid = document.getElementById('serviceVideosGrid');

  if (!overlay) return;

  // Open modal on service card click
  document.querySelectorAll('.hike-card[data-service]').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();

      // Populate modal
      modalTitle.textContent = card.dataset.serviceTitle || '';
      modalDesc.textContent = card.dataset.serviceDesc || '';

      // Multiple Videos Grid
      videosGrid.innerHTML = '';
      const videos = card.dataset.serviceVideos ? card.dataset.serviceVideos.split(',') : [];
      const labels = card.dataset.serviceVideoLabels ? card.dataset.serviceVideoLabels.split(',') : [];

      videos.forEach((src, index) => {
        const item = document.createElement('div');
        item.className = 'service-video-item';

        const video = document.createElement('video');
        video.src = src.trim();
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.preload = 'metadata';

        const playOverlay = document.createElement('div');
        playOverlay.className = 'video-play-overlay';
        playOverlay.innerHTML = '<div class="video-play-icon"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div>';

        const label = document.createElement('div');
        label.className = 'service-video-label';
        label.textContent = labels[index] ? labels[index].trim() : `Demo ${index + 1}`;

        item.appendChild(video);
        item.appendChild(playOverlay);
        item.appendChild(label);

        // Play/Pause on click
        item.addEventListener('click', () => {
          if (video.paused) {
            // Pause all other videos in the grid
            videosGrid.querySelectorAll('video').forEach(v => {
              if (v !== video) { v.pause(); v.currentTime = 0; }
            });
            videosGrid.querySelectorAll('.service-video-item').forEach(i => i.classList.remove('playing'));
            video.play().catch(() => {});
            item.classList.add('playing');
          } else {
            video.pause();
            item.classList.remove('playing');
          }
        });

        // Hover play preview
        item.addEventListener('mouseenter', () => {
          if (video.paused) {
            video.play().catch(() => {});
          }
        });

        item.addEventListener('mouseleave', () => {
          if (!item.classList.contains('playing')) {
            video.pause();
            video.currentTime = 0;
          }
        });

        videosGrid.appendChild(item);
      });

      // Tools tags
      modalTools.innerHTML = '';
      if (card.dataset.serviceTools) {
        card.dataset.serviceTools.split(',').forEach(tool => {
          const tag = document.createElement('span');
          tag.className = 'modal-tool-tag';
          tag.textContent = tool.trim();
          modalTools.appendChild(tag);
        });
      }

      // Highlights
      modalHighlights.innerHTML = '';
      if (card.dataset.serviceHighlights) {
        card.dataset.serviceHighlights.split(';').forEach(item => {
          const li = document.createElement('li');
          li.textContent = item.trim();
          modalHighlights.appendChild(li);
        });
      }

      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  function closeServiceModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    // Pause all videos
    videosGrid.querySelectorAll('video').forEach(v => {
      v.pause();
      v.src = '';
    });
    videosGrid.innerHTML = '';
  }

  modalClose.addEventListener('click', closeServiceModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeServiceModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeServiceModal();
  });
}

/* ===== DARK MODE ===== */
function initDarkMode() {
  const toggle = document.getElementById('darkModeToggle');
  if (!toggle) return;

  // Check for saved preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  toggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    localStorage.setItem('theme', newTheme);
  });
}

/* ===== PROJECT MODAL ===== */
function initProjectModal() {
  const overlay = document.getElementById('projectModal');
  const modalVideo = document.getElementById('modalVideo');
  const modalTitle = document.getElementById('modalTitle');
  const modalClient = document.getElementById('modalClient');
  const modalDate = document.getElementById('modalDate');
  const modalDesc = document.getElementById('modalDesc');
  const modalTools = document.getElementById('modalTools');
  const modalHighlights = document.getElementById('modalHighlights');
  const modalClose = document.getElementById('modalClose');

  if (!overlay) return;

  // Open modal on View Details click
  document.querySelectorAll('.project-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.project-card');
      if (!card) return;

      // Populate modal content from data attributes
      modalTitle.textContent = card.dataset.title || '';
      modalClient.textContent = card.dataset.client || '';
      modalDate.textContent = card.dataset.date || '';
      modalDesc.textContent = card.dataset.desc || '';

      // Video
      if (card.dataset.video) {
        modalVideo.src = card.dataset.video;
        modalVideo.play().catch(() => {});
      }

      // Tools tags
      modalTools.innerHTML = '';
      if (card.dataset.tools) {
        card.dataset.tools.split(',').forEach(tool => {
          const tag = document.createElement('span');
          tag.className = 'modal-tool-tag';
          tag.textContent = tool.trim();
          modalTools.appendChild(tag);
        });
      }

      // Highlights
      modalHighlights.innerHTML = '';
      if (card.dataset.highlights) {
        card.dataset.highlights.split(';').forEach(item => {
          const li = document.createElement('li');
          li.textContent = item.trim();
          modalHighlights.appendChild(li);
        });
      }

      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    modalVideo.pause();
    modalVideo.src = '';
  }

  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
  });
}

/* ===== SMOOTH SCROLL ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ===== CAROUSEL PAUSE ON HOVER ===== */
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });

  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
}

/* ===== INIT ALL ===== */
window.addEventListener('load', () => {
  // Hide preloader after one full animation cycle (5s)
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hidden');
      // Remove from DOM after fade-out transition
      setTimeout(() => preloader.remove(), 600);
    }
  }, 5000);

  initAppearAnimations();
  initNavbar();
  initDarkMode();
  initScrollReveal();
  initCounters();
  initVideoHover();
  initServiceModal();
  initProjectModal();
  initGSAPAnimations();
  initSmoothScroll();
  initCarousel();
  ScrollTrigger.refresh();
});
