export function Navbar({ avatar, theme, mobileOpen, onToggleTheme, onToggleMobile, onCloseMobile }) {
  const links = [
    ['#projects', 'Projects'],
    ['#about', 'About'],
    ['#services', 'Services'],
    ['#contact', 'Contact'],
    ['/admin', 'Admin'],
  ];

  return (
    <>
      <nav className="navbar" id="navbar">
        <div className="nav-container">
          <a href="#hero" className="nav-brand" onClick={onCloseMobile}>
            <div className="nav-avatar">
              <img src={avatar.url} alt="Ibrahim Shamshad" />
            </div>
            <span className="nav-name">Ibrahim Shamshad</span>
          </a>
          <div className="nav-links-desktop">
            {links.map(([href, label]) => (
              <a href={href} className="nav-link" key={href}>{label}</a>
            ))}
          </div>
          <div className="nav-right-actions">
            <button className="dark-mode-toggle" id="darkModeToggle" type="button" aria-label="Toggle dark mode" onClick={onToggleTheme}>
              {theme === 'dark' ? (
                <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              ) : (
                <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /></svg>
              )}
            </button>
            <button className={`nav-toggle ${mobileOpen ? 'active' : ''}`} type="button" id="navToggle" aria-label="Toggle menu" onClick={onToggleMobile}>
              <div className="toggle-bar" />
            </button>
          </div>
        </div>
      </nav>
      <div className={`mobile-menu ${mobileOpen ? 'active' : ''}`} id="mobileMenu">
        <a href="#hero" className="mobile-link" onClick={onCloseMobile}>Home</a>
        {links.map(([href, label]) => (
          <a href={href} className="mobile-link" key={href} onClick={onCloseMobile}>{label}</a>
        ))}
      </div>
    </>
  );
}

