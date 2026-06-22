import { useEffect } from 'react';

function ServiceCard({ service, onOpen }) {
  return (
    <button className="hike-card" type="button" onClick={() => onOpen(service)}>
      <div className="hike-card-header">
        <h3 className="hike-card-title">{service.title}</h3>
        <svg className="hike-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
      </div>
      <div className="hike-images">
        {service.images.map((src, index) => (
          <div className="hike-img" style={{ '--i': index }} key={src}>
            <img src={src} alt={`${service.title} preview ${index + 1}`} />
          </div>
        ))}
      </div>
      <div className="hike-stats">
        <div className="hike-stat"><span>{service.tools[0]}</span></div>
        <div className="hike-stat"><span>{service.tools[1]}</span></div>
      </div>
      <p className="hike-desc">{service.description}</p>
    </button>
  );
}

export function ServiceModal({ service, resolveMedia, onClose }) {
  useEffect(() => {
    if (!service) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [service]);

  if (!service) return null;

  return (
    <div className="service-modal-overlay active" id="serviceModal" onMouseDown={event => event.target.id === 'serviceModal' && onClose()}>
      <div className="service-modal">
        <button className="modal-close service-modal-close-btn" type="button" id="serviceModalClose" onClick={onClose}>x</button>
        <div className="service-modal-body">
          <h2 className="modal-title">{service.title}</h2>
          <p className="modal-description">{service.detail}</p>
          <div className="service-videos-grid" id="serviceVideosGrid">
            {service.videos.map((key, index) => {
              const media = resolveMedia(key);
              return (
                <div className="service-video-item" key={`${key}-${index}`}>
                  <video src={media.url} poster={media.poster || undefined} loop muted playsInline preload="metadata" controls />
                  <div className="service-video-label">{service.labels[index]}</div>
                </div>
              );
            })}
          </div>
          <div className="modal-tools">
            <span className="modal-tools-label">Tools Used</span>
            <div className="modal-tools-tags">
              {service.tools.map(tool => <span className="modal-tool-tag" key={tool}>{tool}</span>)}
            </div>
          </div>
          <div className="modal-highlights">
            <span className="modal-highlights-label">What You'll See</span>
            <ul className="modal-highlights-list">
              {service.highlights.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Services({ services, onOpen }) {
  return (
    <section className="services-section" id="services">
      <div className="services-container">
        <div className="services-header">
          <span className="section-tag">Services</span>
          <h2 className="section-heading">End-to-end video production services</h2>
        </div>
        <div className="services-grid">
          {services.map(service => <ServiceCard service={service} onOpen={onOpen} key={service.key} />)}
        </div>
      </div>
    </section>
  );
}

