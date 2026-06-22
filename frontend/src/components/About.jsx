export function About({ stats }) {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-content reveal-up revealed">
          <div className="about-text">
            <p className="about-name">I'm Ibrahim Shamshad</p>
            <p className="about-description">A video editor with a passion for crafting videos that feel clear, engaging, and human. With a strong sense of pacing and storytelling, I bring a thoughtful balance of creativity and strategy to every edit.</p>
            <div className="about-tools">
              <span className="about-tool-label">Tools I use daily:</span>
              <div className="about-tool-tags">
                {['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Photoshop', 'Audition'].map(tool => (
                  <span className="tool-tag" key={tool}>{tool}</span>
                ))}
              </div>
            </div>
          </div>
          <a href="#contact" className="btn-inverse"><span className="btn-text">About me</span></a>
        </div>
        <div className="stats-grid reveal-up revealed">
          {[0, 2].map(start => (
            <div className="stats-row" key={start}>
              {stats.slice(start, start + 2).map(stat => (
                <div className="stat-card" key={stat.label}>
                  <div className="stat-top">
                    <span className="stat-number">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                  <div className="stat-divider" />
                  <p className="stat-desc">{stat.description}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

