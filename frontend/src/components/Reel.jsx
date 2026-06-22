export function Reel({ reel }) {
  return (
    <section className="reel-section">
      <div className="reel-container">
        <div className="reel-header">
          <span className="section-tag">Showreel</span>
          <h2 className="section-heading">See my work in motion</h2>
          <p className="reel-subtitle">A quick look at some of my recent cinematic edits, brand films, and creative storytelling pieces.</p>
        </div>
        <div className="reel-video-wrap">
          <video className="reel-video" src={reel.url} poster={reel.poster || undefined} autoPlay loop muted controls playsInline preload="metadata" />
        </div>
      </div>
    </section>
  );
}

