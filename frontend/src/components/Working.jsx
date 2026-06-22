export function Working({ imageKeys, resolveMedia }) {
  const slides = [...imageKeys, ...imageKeys];

  return (
    <section className="working-section">
      <div className="working-container">
        <div className="working-header reveal-up revealed">
          <span className="section-tag">Now Working On</span>
          <h2 className="section-heading">Projects I'm working on right now</h2>
        </div>
        <div className="working-card reveal-up revealed">
          <div className="working-carousel">
            <div className="carousel-track" id="carouselTrack">
              {slides.map((key, index) => {
                const media = resolveMedia(key);
                return (
                  <div className="carousel-slide" key={`${key}-${index}`}>
                    <img src={media.url} alt={media.title || 'Project preview'} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="working-details">
            <div className="working-info-header">
              <div className="status-tag">
                <span className="status-dot" />
                <span>In Progress</span>
              </div>
              <div className="working-info-text">
                <h3 className="working-title">Crafting cinematic brand films</h3>
                <p className="working-desc">Building compelling visual narratives for brands. Refining storytelling, pacing, and color grading to deliver premium cinematic content.</p>
              </div>
            </div>
            <a href="#projects" className="btn-primary full-width">
              <span className="btn-text">View Projects</span>
              <span className="btn-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M8.25 12H15.75" /><path d="M12.75 9L15.75 12L12.75 15" /></svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

