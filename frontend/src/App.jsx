import { useEffect, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { fetchMedia, mapMediaByKey, mergeMedia } from './api/media.js';
import { fallbackMedia, tools, stats, workingImages, services, projects, testimonials, brands } from './data/portfolio.js';
import { applyThemePreference, readStoredTheme } from './theme.js';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { ToolsMarquee } from './components/ToolsMarquee.jsx';
import { About } from './components/About.jsx';
import { Working } from './components/Working.jsx';
import { Services, ServiceModal } from './components/Services.jsx';
import { Projects, ProjectModal } from './components/Projects.jsx';
import { Testimonials } from './components/Testimonials.jsx';
import { Brands } from './components/Brands.jsx';
import { Reel } from './components/Reel.jsx';
import { Footer } from './components/Footer.jsx';

gsap.registerPlugin(ScrollTrigger);

function Preloader({ hidden }) {
  if (hidden) return null;
  return (
    <div className="preloader" id="preloader">
      <div className="loader">
        <div className="ph1">
          <div className="record" />
          <div className="record-text">REC</div>
        </div>
        <div className="ph2">
          <div className="laptop-b" />
          <svg className="laptop-t" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 30">
            <path d="M21 1H5C2.78 1 1 2.78 1 5V25a4 4 90 004 4H37a4 4 90 004-4V5c0-2.22-1.8-4-4-4H21" pathLength="100" strokeWidth="2" stroke="currentColor" fill="none" />
          </svg>
        </div>
        <div className="icon" />
      </div>
    </div>
  );
}

function usePortfolioAnimations() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo('.hike-card', { y: 60, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.services-grid', start: 'top 88%' },
      });

      gsap.fromTo('.project-card', { y: 70, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.projects-grid', start: 'top 88%' },
      });

      gsap.from('.reel-video-wrap', {
        y: 40,
        opacity: 0,
        scale: 0.96,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.reel-section', start: 'top 75%' },
      });
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);
}

export default function App() {
  const [apiMedia, setApiMedia] = useState({});
  const [mediaStatus, setMediaStatus] = useState('loading');
  const [theme, setTheme] = useState(() => readStoredTheme());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [preloaderHidden, setPreloaderHidden] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [activeProject, setActiveProject] = useState(null);

  usePortfolioAnimations();

  useEffect(() => {
    applyThemePreference(theme);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    fetchMedia()
      .then(media => {
        if (!cancelled) {
          setApiMedia(mapMediaByKey(media));
          setMediaStatus('cloudinary');
        }
      })
      .catch(() => {
        if (!cancelled) setMediaStatus('local');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setPreloaderHidden(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        setActiveService(null);
        setActiveProject(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const media = useMemo(() => mergeMedia(Object.values(apiMedia), fallbackMedia), [apiMedia]);
  const resolveMedia = key => media[key] || { key, url: '', poster: null, type: 'unknown' };

  const heroImage = resolveMedia('hero-image');
  const avatar = resolveMedia('avatar');
  const reel = resolveMedia('demo-reel');

  return (
    <>
      <Preloader hidden={preloaderHidden} />
      <Navbar
        avatar={avatar}
        theme={theme}
        mobileOpen={mobileOpen}
        onToggleTheme={() => setTheme(current => current === 'dark' ? 'light' : 'dark')}
        onToggleMobile={() => setMobileOpen(open => !open)}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <Hero heroImage={heroImage} preloaderDone={preloaderHidden} />
      <ToolsMarquee tools={tools} />
      <About stats={stats} />
      <Working imageKeys={workingImages} resolveMedia={resolveMedia} />
      <Services services={services} resolveMedia={resolveMedia} onOpen={setActiveService} />
      <Projects projects={projects} resolveMedia={resolveMedia} onOpen={setActiveProject} />
      <Testimonials testimonials={testimonials} />
      <Brands brands={brands} />
      <Reel reel={reel} />
      <Footer avatar={avatar} />
      <ServiceModal service={activeService} resolveMedia={resolveMedia} onClose={() => setActiveService(null)} />
      <ProjectModal project={activeProject} resolveMedia={resolveMedia} onClose={() => setActiveProject(null)} />
      <div className="media-source" data-status={mediaStatus} aria-hidden="true" />
    </>
  );
}

