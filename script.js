gsap.registerPlugin(ScrollTrigger);

/* ===== HELPERS ===== */
const isMobile = window.innerWidth < 768;
const isTablet = window.innerWidth >= 768 && window.innerWidth < 1280;

const particleCountForHero = isMobile ? 200 : (isTablet ? 400 : 800);
const particleCountForContact = isMobile ? 320 : (isTablet ? 700 : 1200);

function createParticleField(canvas, options) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.z = options.cameraZ || 80;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(options.count * 3);
  const velocity = [];

  for (let i = 0; i < options.count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * options.spreadX;
    positions[i3 + 1] = (Math.random() - 0.5) * options.spreadY;
    positions[i3 + 2] = (Math.random() - 0.5) * options.spreadZ;
    velocity.push(options.baseSpeed + Math.random() * options.speedVariance);
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: options.size || 1.5,
    transparent: true,
    opacity: options.opacity || 0.8
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const pointer = { x: 0, y: 0 };

  function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
  }

  if (options.enableParallax) {
    window.addEventListener("mousemove", onPointerMove);
  }

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  resize();

  let rafId;
  function animate() {
    const arr = geometry.attributes.position.array;
    for (let i = 0; i < options.count; i++) {
      const i3 = i * 3;
      arr[i3 + 1] += velocity[i];
      if (arr[i3 + 1] > options.limitY) {
        arr[i3 + 1] = -options.limitY;
      }
    }
    geometry.attributes.position.needsUpdate = true;

    if (options.enableParallax) {
      points.rotation.y += ((pointer.x / 20) - points.rotation.y) * 0.03;
      points.rotation.x += ((-pointer.y / 20) - points.rotation.x) * 0.03;
      camera.rotation.y += ((pointer.x / 30) - camera.rotation.y) * 0.02;
      camera.rotation.x += ((-pointer.y / 30) - camera.rotation.x) * 0.02;
    }

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener("resize", resize);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    window.removeEventListener("mousemove", onPointerMove);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}

function createAboutOrbit(canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 430;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const pointsCount = 200;
  const radius = 170;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(pointsCount * 3);

  for (let i = 0; i < pointsCount; i++) {
    const angle = (i / pointsCount) * Math.PI * 2;
    const i3 = i * 3;
    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = Math.sin(angle) * radius;
    positions[i3 + 2] = 0;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    transparent: true,
    opacity: 0.8
  });

  const orbit = new THREE.Points(geometry, material);
  scene.add(orbit);

  function resize() {
    const size = canvas.clientWidth;
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }

  resize();
  window.addEventListener("resize", resize);

  let rafId;
  function animate() {
    orbit.rotation.y += 0.004;
    orbit.rotation.x += 0.001;
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }
  animate();

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}

/* ===== SECTION: CURSOR ===== */
function initCustomCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const ring = document.querySelector(".cursor-ring");
  const dot = document.querySelector(".cursor-dot");
  const hoverables = document.querySelectorAll(".hoverable");

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const target = { ...pos };

  window.addEventListener("mousemove", (e) => {
    target.x = e.clientX;
    target.y = e.clientY;
  });

  hoverables.forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-active"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-active"));
  });

  function render() {
    pos.x += (target.x - pos.x) * 0.16;
    pos.y += (target.y - pos.y) * 0.16;

    ring.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
    dot.style.transform = `translate(${target.x}px, ${target.y}px) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  }
  render();
}

/* ===== SECTION: MAGNETIC BUTTONS ===== */
function initMagneticButtons() {
  const magnets = document.querySelectorAll(".magnetic");
  magnets.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: gsap.utils.clamp(-8, 8, relX * 0.18),
        y: gsap.utils.clamp(-8, 8, relY * 0.18),
        duration: 0.25,
        ease: "power2.out"
      });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" });
    });
  });
}

/* ===== SECTION: LOADER & HERO ENTRANCE ===== */
function initLoaderAndHero() {
  const loaderName = document.getElementById("loaderName");
  const name = "Ibrahim Shamshad";
  loaderName.innerHTML = name.split("").map((char) => {
    const safeChar = char === " " ? "&nbsp;" : char;
    return `<span class="loader-char">${safeChar}</span>`;
  }).join("");

  const heroTl = gsap.timeline({ paused: true });
  heroTl
    .to(".hero-line", {
      y: 0,
      opacity: 1,
      duration: 1.15,
      stagger: 0.25,
      ease: "power4.out"
    })
    .to(".hero-subtext", { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" }, "-=0.6")
    .to(".hero-cta", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.55");

  const loaderTl = gsap.timeline();
  loaderTl
    .to(".loader-char", {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.05,
      ease: "power3.out"
    })
    .to("#loaderBar", {
      width: "100%",
      duration: 2,
      ease: "power1.inOut"
    }, "-=0.2")
    .to("#loader", {
      opacity: 0,
      duration: 0.75,
      ease: "power2.out",
      onComplete: () => {
        const loader = document.getElementById("loader");
        loader.style.pointerEvents = "none";
        loader.style.display = "none";
        heroTl.play();
      }
    });
}

/* ===== SECTION: NAVBAR & MOBILE MENU ===== */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = mobileMenu.querySelectorAll(".mobile-link");
  let menuOpen = false;

  gsap.to(navbar, {
    backgroundColor: "rgba(8,8,8,0.85)",
    backdropFilter: "blur(20px)",
    borderBottomColor: "rgba(255,255,255,0.08)",
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top -80",
      end: "top -81",
      toggleActions: "play none none reverse"
    }
  });

  function openMenu() {
    menuOpen = true;
    hamburger.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    mobileMenu.classList.add("active");
    document.body.classList.add("menu-open");
    gsap.fromTo(mobileLinks, { y: 28, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    });
  }

  function closeMenu() {
    menuOpen = false;
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    gsap.to(mobileLinks, {
      y: 16,
      opacity: 0,
      duration: 0.2,
      stagger: 0.05,
      onComplete: () => mobileMenu.classList.remove("active")
    });
  }

  hamburger.addEventListener("click", () => {
    if (menuOpen) closeMenu();
    else openMenu();
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

/* ===== SECTION: SERVICES HOVER ===== */
function initServiceCards() {
  const cards = document.querySelectorAll(".service-card");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, { y: -6, duration: 0.32, ease: "power2.out" });
      card.style.borderColor = "rgba(201,168,76,0.65)";
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { y: 0, duration: 0.32, ease: "power2.out" });
      card.style.borderColor = "rgba(255,255,255,0.08)";
    });
  });
}

/* ===== SECTION: PROJECTS FILTER + HOVERS ===== */
function initProjects() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = Array.from(document.querySelectorAll(".project-card"));

  cards.forEach((card) => {
    const overlay = card.querySelector(".project-overlay");
    const thumb = card.querySelector(".project-thumb");
    card.addEventListener("mouseenter", () => {
      gsap.to(overlay, { y: "0%", duration: 0.5, ease: "power3.out" });
      gsap.to(card, { scale: 1.02, duration: 0.4, ease: "power2.out" });
      gsap.to(thumb, { scale: 1.06, duration: 0.5, ease: "power2.out" });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(overlay, { y: "100%", duration: 0.45, ease: "power3.inOut" });
      gsap.to(card, { scale: 1, duration: 0.35, ease: "power2.out" });
      gsap.to(thumb, { scale: 1, duration: 0.45, ease: "power2.out" });
    });
  });

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        if (match) {
          card.style.display = "";
          gsap.fromTo(card, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.42, ease: "power2.out" });
        } else {
          gsap.to(card, {
            autoAlpha: 0,
            scale: 0.94,
            duration: 0.3,
            onComplete: () => { card.style.display = "none"; }
          });
        }
      });
    });
  });
}

/* ===== SECTION: HOVER VIDEO ON PROJECT CARDS ===== */
function initHoverVideos() {
  const cards = document.querySelectorAll('.project-card[data-hover-video]');
  cards.forEach((card) => {
    const video = card.querySelector('.project-hover-video');
    const muteBtn = card.querySelector('.card-mute-toggle');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
      video.pause();
      video.muted = true;
      if (muteBtn) muteBtn.textContent = 'ðŸ”‡';
    });

    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? 'ðŸ”‡' : 'ðŸ”Š';
        muteBtn.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
      });
    }
  });
}

/* ===== SECTION: REEL ===== */
function initReel() {
  const reelWrap = document.getElementById("reelWrap");
  const overlay = document.getElementById("reelOverlay");
  const video = document.getElementById("reelVideo");
  const playBtn = document.getElementById("playReel");
  const muteToggle = document.getElementById("muteToggle");
  const reelPlayer = reelWrap.querySelector(".reel-player");
  let hasEnded = false;

  function updateMuteIcon() {
    const isMuted = video.muted;
    muteToggle.textContent = isMuted ? "ðŸ”‡" : "ðŸ”Š";
    muteToggle.setAttribute("aria-label", isMuted ? "Unmute reel audio" : "Mute reel audio");
  }

  gsap.to(reelWrap, {
    scale: 1,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: reelWrap,
      start: "top 80%"
    }
  });

  playBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
    video.classList.add("active");
    muteToggle.classList.add("active");
    video.muted = false;
    hasEnded = false;
    updateMuteIcon();
    video.play().catch(() => {});
  });

  muteToggle.addEventListener("click", () => {
    video.muted = !video.muted;
    updateMuteIcon();
  });

  video.addEventListener("ended", () => {
    hasEnded = true;
  });

  reelPlayer.addEventListener("click", (event) => {
    if (!hasEnded) return;
    if (event.target === muteToggle || event.target === playBtn) return;
    video.currentTime = 0;
    hasEnded = false;
    video.play().catch(() => {});
  });
}

/* ===== SECTION: TESTIMONIALS ===== */
function initTestimonials() {
  const cards = Array.from(document.querySelectorAll(".testimonial-card"));
  const dots = Array.from(document.querySelectorAll(".dot-btn"));
  let current = 0;
  let intervalId;

  function show(index) {
    cards.forEach((card, i) => {
      card.classList.toggle("active", i === index);
    });
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    gsap.fromTo(cards[index], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
    current = index;
  }

  function startAuto() {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      const next = (current + 1) % cards.length;
      show(next);
    }, 4000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      show(i);
      startAuto();
    });
  });

  show(0);
  startAuto();
}

/* ===== SECTION: SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
  gsap.from(".service-card", {
    y: 50,
    opacity: 0,
    stagger: 0.1,
    duration: 0.75,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#services",
      start: "top 75%"
    }
  });

  gsap.from(".project-card", {
    y: 46,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#projects",
      start: "top 72%"
    }
  });

  const statValues = document.querySelectorAll(".stat-value");
  statValues.forEach((el) => {
    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || "";
    const val = { n: 0 };
    ScrollTrigger.create({
      trigger: "#statsGrid",
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(val, {
          n: target,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${Math.round(val.n)}${suffix}`;
          }
        });
      }
    });
  });

  if (window.innerWidth >= 1280) {
    const track = document.getElementById("processTrack");
    gsap.to(track, {
      xPercent: -75,
      ease: "none",
      scrollTrigger: {
        trigger: "#process",
        start: "top top",
        end: () => `+=${window.innerWidth * 3}`,
        scrub: true,
        pin: true,
        invalidateOnRefresh: true
      }
    });
  }

  gsap.to(".contact-title .line", {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.2,
    ease: "power4.out",
    scrollTrigger: {
      trigger: "#contact",
      start: "top 72%"
    }
  });
}

/* ===== SECTION: THREE SCENES ===== */
const cleanups = [];
function initThreeScenes() {
  const heroCanvas = document.getElementById("hero-canvas");
  const contactCanvas = document.getElementById("contact-canvas");
  const orbitCanvas = document.getElementById("about-orbit-canvas");

  cleanups.push(createParticleField(heroCanvas, {
    count: particleCountForHero,
    spreadX: 180,
    spreadY: 180,
    spreadZ: 220,
    baseSpeed: 0.03,
    speedVariance: 0.02,
    limitY: 90,
    size: 1.5,
    opacity: 0.8,
    cameraZ: 110,
    enableParallax: true
  }));

  cleanups.push(createAboutOrbit(orbitCanvas));

  cleanups.push(createParticleField(contactCanvas, {
    count: particleCountForContact,
    spreadX: 210,
    spreadY: 210,
    spreadZ: 270,
    baseSpeed: 0.02,
    speedVariance: 0.015,
    limitY: 110,
    size: 1.2,
    opacity: 0.68,
    cameraZ: 125,
    enableParallax: false
  }));
}

/* ===== SECTION: CONTACT MODAL ===== */
// function initContactModal() {
//   // âœ… Formsubmit.co â€” FREE, no signup needed!
//   // IMPORTANT: Replace with YOUR Gmail address below
//   // First submission will send a confirmation email to activate.
//   const YOUR_EMAIL = 'ibrahimshamshad@gmail.com';

//   const modal = document.getElementById("contactModal");
//   const closeBtn = document.getElementById("closeModalBtn");
//   const contactForm = document.getElementById("contactForm");
//   const formMessage = document.getElementById("formMessage");
//   const successAck = document.getElementById("successAck");
//   const successDetails = document.getElementById("successDetails");
//   const successCloseBtn = document.getElementById("successCloseBtn");

//   // Replace mailto links for "Book a Free Call" with modal trigger
//   const bookCallBtns = Array.from(document.querySelectorAll('.btn')).filter(btn => btn.textContent.includes('Book a Free Call'));
  
//   bookCallBtns.forEach(btn => {
//     btn.addEventListener('click', (e) => {
//       e.preventDefault();
//       modal.classList.add("active");
//       document.body.style.overflow = "hidden";
//       formMessage.className = "form-message";
//       formMessage.textContent = "";
//       contactForm.style.display = "";
//       successAck.classList.remove("active");
//     });
//   });

//   function closeModal() {
//     modal.classList.remove("active");
//     document.body.style.overflow = "";
//     setTimeout(() => {
//       contactForm.style.display = "";
//       successAck.classList.remove("active");
//     }, 350);
//   }

//   closeBtn.addEventListener("click", closeModal);
//   successCloseBtn.addEventListener("click", closeModal);
  
//   modal.addEventListener("click", (e) => {
//     if (e.target === modal) closeModal();
//   });

//   // Confetti burst animation
//   function burstConfetti(container) {
//     const colors = ['#4ff5a7', '#c9a84c', '#f5f0e8', '#ff6b6b', '#48dbfb'];
//     for (let i = 0; i < 20; i++) {
//       const dot = document.createElement('div');
//       dot.className = 'confetti-dot';
//       dot.style.background = colors[Math.floor(Math.random() * colors.length)];
//       dot.style.left = '50%';
//       dot.style.top = '30%';
//       container.appendChild(dot);
//       gsap.to(dot, {
//         x: (Math.random() - 0.5) * 260,
//         y: (Math.random() - 0.5) * 200,
//         opacity: 1,
//         scale: Math.random() * 1.5 + 0.5,
//         duration: 0.5,
//         ease: 'power2.out',
//         onComplete: () => {
//           gsap.to(dot, {
//             opacity: 0,
//             y: '+=40',
//             duration: 0.6,
//             delay: 0.3,
//             ease: 'power2.in',
//             onComplete: () => dot.remove()
//           });
//         }
//       });
//     }
//   }

//   // Show success acknowledgement
//   function showSuccess(name, email, phone) {
//     contactForm.style.display = 'none';
//     successDetails.innerHTML = `
//       <div class="success-detail-row"><span class="success-detail-label">Name</span><span class="success-detail-value">${name}</span></div>
//       <div class="success-detail-row"><span class="success-detail-label">Email</span><span class="success-detail-value">${email}</span></div>
//       <div class="success-detail-row"><span class="success-detail-label">Phone</span><span class="success-detail-value">${phone}</span></div>
//     `;
//     successAck.classList.add('active');
//     burstConfetti(document.getElementById('modalContent'));
//     gsap.fromTo(successAck, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
//   }

//   contactForm.addEventListener("submit", (e) => {
//     e.preventDefault();
    
//     const name = document.getElementById("formName").value.trim();
//     const email = document.getElementById("formEmail").value.trim();
//     const phone = document.getElementById("formPhone").value.trim();
//     const desc = document.getElementById("formDesc").value.trim();
    
//     // Basic validation
//     if (!name || !email || !phone || !desc) {
//       formMessage.textContent = "Please fill out all required fields.";
//       formMessage.className = "form-message error";
//       return;
//     }
    
//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       formMessage.textContent = "Please enter a valid email address.";
//       formMessage.className = "form-message error";
//       return;
//     }

//     // Phone validation
//     const phoneClean = phone.replace(/[\s\-\(\)]/g, '');
//     if (phoneClean.length < 8) {
//       formMessage.textContent = "Please enter a valid phone number.";
//       formMessage.className = "form-message error";
//       return;
//     }

//     const submitBtn = contactForm.querySelector('.form-submit');
//     const originalText = submitBtn.textContent;
//     submitBtn.textContent = "Sending...";
//     submitBtn.style.opacity = "0.7";
//     submitBtn.style.pointerEvents = "none";

//     // Send via Formsubmit.co (free, no signup)
//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('email', email);
//     formData.append('phone', phone);
//     formData.append('message', desc);
//     formData.append('_subject', `ðŸŽ¬ New Call Booking from ${name}`);
//     formData.append('_template', 'table');
//     formData.append('_captcha', 'false');

//     fetch(`https://formsubmit.co/ajax/${YOUR_EMAIL}`, {
//       method: 'POST',
//       body: formData
//     })
//       .then(res => res.json())
//       .then(data => {
//         contactForm.reset();
//         submitBtn.textContent = originalText;
//         submitBtn.style.opacity = "1";
//         submitBtn.style.pointerEvents = "auto";
//         formMessage.className = "form-message";
//         formMessage.textContent = "";
//         showSuccess(name, email, phone);
//       })
//       .catch((error) => {
//         console.error('Form Error:', error);
//         formMessage.textContent = "Something went wrong. Please try again.";
//         formMessage.className = "form-message error";
//         submitBtn.textContent = originalText;
//         submitBtn.style.opacity = "1";
//         submitBtn.style.pointerEvents = "auto";
//       });
//   });
// }

/* ===== INIT ===== */
window.addEventListener("load", () => {
  initCustomCursor();
  initMagneticButtons();
  initLoaderAndHero();
  initNavbar();
  initServiceCards();
  initProjects();
  initHoverVideos();
  initReel();
  initTestimonials();
  initScrollAnimations();
  initThreeScenes();
  initContactModal();
  ScrollTrigger.refresh();
});

window.addEventListener("beforeunload", () => {
  cleanups.forEach((cleanup) => {
    if (typeof cleanup === "function") cleanup();
  });
});
