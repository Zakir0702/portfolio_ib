export function Footer({ avatar }) {
  return (
    <footer className="footer-section" id="contact">
      <div className="footer-container">
        <div className="footer-cta">
          <div className="footer-cta-header">
            <div className="footer-avatar">
              <img src={avatar.url} alt="Ibrahim Shamshad" />
            </div>
            <div className="footer-cta-text">
              <h3 className="footer-title">Ready to create with purpose?</h3>
              <p className="footer-subtitle">If you're looking for a creative partner who listens, understands, and brings intention to every edit, let's start the conversation.</p>
            </div>
          </div>
          <div className="footer-buttons">
            <a href="tel:+919839390586" className="btn-inverse">
              <span className="btn-text">Let's Talk</span>
            </a>
            <a href="mailto:ibrahimshamshad@gmail.com" className="btn-dark">
              <span className="btn-text">Email Me</span>
            </a>
          </div>
        </div>
        <div className="footer-links">
          <div className="footer-nav-main">
            <a href="#hero">Home</a>
            <a href="#projects">Projects</a>
            <a href="#about">About</a>
          </div>
          <div className="footer-nav-social">
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="social-link">Instagram</a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="social-link">YouTube</a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">&copy; 2025 All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}

