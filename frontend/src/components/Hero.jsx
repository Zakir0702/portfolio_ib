import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { splitIntoChars } from '../utils/splitChars.js';

export function Hero({ heroImage, preloaderDone }) {
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const visualRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!preloaderDone || !titleRef.current) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const chars = splitIntoChars(titleRef.current);

    contentRef.current?.classList.add('visible');

    if (reduceMotion) {
      gsap.set(chars, { clearProps: 'all' });
      return undefined;
    }

    gsap.set(chars, { yPercent: 120, opacity: 0 });
    gsap.to(chars, {
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.022,
      ease: 'power3.out',
    });

    return undefined;
  }, [preloaderDone]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;

      gsap.fromTo(
        '.hero-scroll-container',
        { rotateX: 20, scale: isMobile ? 0.7 : 1.05 },
        {
          rotateX: 0,
          scale: isMobile ? 0.9 : 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-visual',
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 0.8,
          },
        }
      );

      gsap.fromTo(
        '.hero-content',
        { y: 0 },
        {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-visual',
            start: 'top 80%',
            end: 'bottom 30%',
            scrub: 0.8,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!preloaderDone || !visualRef.current) return;

    visualRef.current.classList.add('visible');
    ScrollTrigger.refresh();
  }, [preloaderDone]);

  const scrollTo = id => event => {
    event.preventDefault();
    const target = document.querySelector(id);

    if (target) {
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header className="hero" id="hero" ref={containerRef}>
      <div className="hero-container">
        <div className="hero-content" data-appear="" ref={contentRef}>
          <div className="hero-text">
            <h1 className="hero-title" data-char-split="" ref={titleRef}>
              <span className="muted">Video editor</span> crafting Cinematic Experiences
            </h1>
            <p className="hero-description">Beautifully edited, easy-to-watch videos that help you stand out and connect with your audience.</p>
          </div>
          <div className="hero-buttons">
            <a href="#contact" className="btn-primary" onClick={scrollTo('#contact')}>
              <span className="btn-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.25 4.5C16.818 5.176 18.824 7.182 19.5 9.75" /><path d="M13.5 7.5C15.049 7.914 16.086 8.951 16.5 10.5" /><path d="M14.662 14.375C14.873 14.235 15.14 14.211 15.373 14.311L19.794 16.292C20.1 16.422 20.284 16.739 20.244 17.07C19.943 19.321 18.021 21.001 15.75 21C8.708 21 3 15.291 3 8.25C2.998 5.978 4.679 4.057 6.93 3.755C7.26 3.716 7.577 3.899 7.708 4.205L9.689 8.63C9.788 8.861 9.765 9.126 9.627 9.336L7.624 11.718C7.479 11.937 7.46 12.215 7.573 12.451C8.348 14.038 9.989 15.659 11.581 16.427C11.818 16.539 12.097 16.518 12.315 16.371Z" /></svg>
              </span>
              <span className="btn-text btn-label-wrap">
                <span className="btn-label-top">Let's Talk</span>
                <span className="btn-label-bot">Let's Talk</span>
              </span>
            </a>
            <a href="mailto:ibrahimshamshad@gmail.com" className="btn-secondary">
              <span className="btn-text btn-label-wrap">
                <span className="btn-label-top">Email Me</span>
                <span className="btn-label-bot">Email Me</span>
              </span>
            </a>
          </div>
        </div>
        <div className="hero-visual" data-appear-delay="" ref={visualRef}>
          <div className="hero-scroll-container">
            <div className="hero-image-container">
              <img src={heroImage.url} alt="Cinematic frame from Ibrahim's work" className="hero-image" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

