gsap.registerPlugin(ScrollTrigger);


/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.section-tag, .stat-card, .working-card, .working-header, .about-content, .stats-grid, .footer-links'
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

  // Stagger hike cards — Studio375-style rise from below
  gsap.fromTo('.hike-card',
    { y: 80, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.75,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 88%'
      }
    }
  );

  // Project cards — dramatic entrance
  gsap.fromTo('.project-card',
    { y: 100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.18,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top 88%'
      }
    }
  );

  // Testimonial cards
  gsap.fromTo('.testimonial-card',
    { y: 80, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.75,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.testimonials-grid',
        start: 'top 88%'
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

/* ===== CUSTOM CURSOR ===== */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor) return;

  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display = 'none';
    return;
  }

  document.addEventListener('mousemove', e => {
    cursor.style.transform = `translate(-50%, -50%) translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    cursor.classList.add('visible');
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
}

/* ===== CHAR SPLIT HELPER ===== */
function splitIntoChars(el) {
  function processNode(node, parent) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      const fragment = document.createDocumentFragment();
      // Split by spaces so each word is wrapped in a no-break container —
      // this prevents the browser from breaking a line mid-word.
      const parts = text.split(' ');
      parts.forEach((word, idx) => {
        if (word.length > 0) {
          const wordSpan = document.createElement('span');
          wordSpan.className = 'char-word';
          for (let i = 0; i < word.length; i++) {
            const clip = document.createElement('span');
            clip.className = 'char-clip';
            const inner = document.createElement('span');
            inner.className = 'split-char';
            inner.textContent = word[i];
            clip.appendChild(inner);
            wordSpan.appendChild(clip);
          }
          fragment.appendChild(wordSpan);
        }
        if (idx < parts.length - 1) {
          fragment.appendChild(document.createTextNode(' '));
        }
      });
      parent.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(child => processNode(child, node));
    }
  }
  Array.from(el.childNodes).forEach(child => processNode(child, el));
  return el.querySelectorAll('.split-char');
}

/* ===== HERO CHAR ANIMATION ===== */
function initHeroCharAnimation() {
  const heroTitle = document.querySelector('[data-char-split].hero-title');
  const aboutName = document.querySelector('[data-char-split].about-name');

  if (heroTitle) {
    const chars = splitIntoChars(heroTitle);
    gsap.set(chars, { yPercent: 120, opacity: 0 });
    // Fire right after preloader fades (5s timeout + ~200ms buffer)
    gsap.to(chars, {
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.022,
      ease: 'power3.out',
      delay: 5.2
    });
  }

  if (aboutName) {
    const chars = splitIntoChars(aboutName);
    gsap.set(chars, { yPercent: 120, opacity: 0 });
    gsap.to(chars, {
      yPercent: 0,
      opacity: 1,
      duration: 0.75,
      stagger: 0.03,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: aboutName,
        start: 'top 88%'
      }
    });
  }
}

/* ===== LINE REVEAL (section headings) ===== */
function initLineReveal() {
  document.querySelectorAll('[data-line-reveal]').forEach(heading => {
    const text = heading.textContent.trim();
    const words = text.split(/\s+/);
    heading.innerHTML = words
      .map(word => `<span class="word-clip"><span class="word-slide">${word}</span></span>`)
      .join(' ');

    gsap.fromTo(
      heading.querySelectorAll('.word-slide'),
      { yPercent: 120 },
      {
        yPercent: 0,
        duration: 0.85,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 90%'
        }
      }
    );
  });
}

/* ===== WORD PARALLAX (about description) ===== */
function initWordParallax() {
  document.querySelectorAll('[data-word-parallax]').forEach(el => {
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    el.innerHTML = words
      .map(word => `<span class="parallax-word">${word}</span>`)
      .join(' ');

    gsap.fromTo(
      el.querySelectorAll('.parallax-word'),
      { opacity: 0.15 },
      {
        opacity: 1,
        stagger: { each: 0.08, from: 'start' },
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'bottom 30%',
          scrub: 1.2
        }
      }
    );
  });
}

/* ===== BUTTON TEXT SLIDE HOVER ===== */
function initButtonHoverEffect() {
  document.querySelectorAll(
    '.btn-primary .btn-text, .btn-inverse .btn-text, .btn-dark .btn-text, .btn-secondary .btn-text'
  ).forEach(span => {
    const text = span.textContent;
    span.innerHTML = `<span class="btn-label-top">${text}</span><span class="btn-label-bot">${text}</span>`;
    span.classList.add('btn-label-wrap');
  });
}

/* ===== INIT ALL ===== */
window.addEventListener('load', () => {
  // Initialise everything that doesn't require the page to be visible yet
  initNavbar();
  initDarkMode();
  initScrollReveal();
  initCounters();
  initVideoHover();
  initServiceModal();
  initProjectModal();
  initGSAPAnimations();
  initHeroCharAnimation();   // sets up chars + triggers delayed anim
  initLineReveal();
  initCustomCursor();
  initButtonHoverEffect();
  initSmoothScroll();
  initCarousel();
  ScrollTrigger.refresh();

  // Hide preloader after one full animation cycle (5s)
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 600);
    }
    // Reveal hero image + remaining content after preloader fades
    requestAnimationFrame(() => {
      const heroVisual = document.querySelector('[data-appear-delay]');
      if (heroVisual) heroVisual.classList.add('visible');
    });
  }, 5000);

  // Hero content appears immediately (hidden under preloader anyway)
  requestAnimationFrame(() => {
    const heroContent = document.querySelector('[data-appear]');
    if (heroContent) heroContent.classList.add('visible');
  });
});
