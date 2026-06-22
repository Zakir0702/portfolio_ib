export function Hero({ heroImage }) {
  return (
    <header className="hero" id="hero">
      <div className="hero-container">
        <div className="hero-content visible" data-appear="">
          <div className="hero-text">
            <h1 className="hero-title" data-char-split="">
              <span className="muted">Video editor</span> crafting Cinematic Experiences
            </h1>
            <p className="hero-description">Beautifully edited, easy-to-watch videos that help you stand out and connect with your audience.</p>
          </div>
          <div className="hero-buttons">
            <a href="#contact" className="btn-primary">
              <span className="btn-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.25 4.5C16.818 5.176 18.824 7.182 19.5 9.75" /><path d="M13.5 7.5C15.049 7.914 16.086 8.951 16.5 10.5" /><path d="M14.662 14.375C14.873 14.235 15.14 14.211 15.373 14.311L19.794 16.292C20.1 16.422 20.284 16.739 20.244 17.07C19.943 19.321 18.021 21.001 15.75 21C8.708 21 3 15.291 3 8.25C2.998 5.978 4.679 4.057 6.93 3.755C7.26 3.716 7.577 3.899 7.708 4.205L9.689 8.63C9.788 8.861 9.765 9.126 9.627 9.336L7.624 11.718C7.479 11.937 7.46 12.215 7.573 12.451C8.348 14.038 9.989 15.659 11.581 16.427C11.818 16.539 12.097 16.518 12.315 16.371Z" /></svg>
              </span>
              <span className="btn-text">Let's Talk</span>
            </a>
            <a href="mailto:ibrahimshamshad@gmail.com" className="btn-secondary">
              <span className="btn-text">Email Me</span>
            </a>
          </div>
        </div>
        <div className="hero-visual visible" data-appear-delay="">
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

