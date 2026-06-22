import { useEffect } from 'react';

function ProjectCard({ project, resolveMedia, onOpen }) {
  const image = resolveMedia(project.imageKey);
  const video = resolveMedia(project.videoKey);

  return (
    <div className="project-card">
      <div className="project-content">
        <div className="project-details">
          <div className="project-header">
            <div className="project-logo">
              <img src={image.url} alt={`${project.title} thumbnail`} />
            </div>
            <div className="project-info-text">
              <h3 className="project-name">{project.title}</h3>
              <p className="project-desc">{project.summary}</p>
            </div>
          </div>
          <div className="project-meta">
            <div className="meta-item">
              <span className="meta-label">Client</span>
              <span className="meta-value">{project.client}</span>
            </div>
            <div className="meta-divider" />
            <div className="meta-item">
              <span className="meta-label">Date</span>
              <span className="meta-value">{project.date}</span>
            </div>
          </div>
        </div>
        <button className="btn-primary full-width project-btn" type="button" onClick={() => onOpen(project)}>
          <span className="btn-text">View Details</span>
        </button>
      </div>
      <div className="project-video">
        <video src={video.url} poster={video.poster || image.url} loop muted autoPlay playsInline preload="metadata" />
      </div>
    </div>
  );
}

export function ProjectModal({ project, resolveMedia, onClose }) {
  useEffect(() => {
    if (!project) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  if (!project) return null;

  const video = resolveMedia(project.videoKey);
  const image = resolveMedia(project.imageKey);

  return (
    <div className="project-modal-overlay active" id="projectModal" onMouseDown={event => event.target.id === 'projectModal' && onClose()}>
      <div className="project-modal">
        <div className="modal-header">
          <video src={video.url} poster={video.poster || image.url} loop muted autoPlay playsInline controls />
          <button className="modal-close" type="button" id="modalClose" onClick={onClose}>x</button>
        </div>
        <div className="modal-body">
          <h2 className="modal-title">{project.title}</h2>
          <div className="modal-meta">
            <div className="modal-meta-item">
              <span className="modal-meta-label">Client</span>
              <span className="modal-meta-value">{project.client}</span>
            </div>
            <div className="modal-meta-divider" />
            <div className="modal-meta-item">
              <span className="modal-meta-label">Date</span>
              <span className="modal-meta-value">{project.date}</span>
            </div>
          </div>
          <p className="modal-description">{project.description}</p>
          <div className="modal-tools">
            <span className="modal-tools-label">Tools Used</span>
            <div className="modal-tools-tags">
              {project.tools.map(tool => <span className="modal-tool-tag" key={tool}>{tool}</span>)}
            </div>
          </div>
          <div className="modal-highlights">
            <span className="modal-highlights-label">Key Highlights</span>
            <ul className="modal-highlights-list">
              {project.highlights.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Projects({ projects, resolveMedia, onOpen }) {
  return (
    <main className="projects-section" id="projects">
      <div className="projects-container">
        <div className="projects-header">
          <div className="projects-headline">
            <span className="section-tag">Projects</span>
            <h2 className="section-heading">A curated collection of creative work built with purpose</h2>
          </div>
          <a href="#projects" className="btn-secondary btn-with-arrow">
            <span className="btn-text">All Projects</span>
            <span className="btn-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M8.25 12H15.75" /><path d="M12.75 9L15.75 12L12.75 15" /></svg>
            </span>
          </a>
        </div>
        <div className="projects-grid">
          {projects.map(project => (
            <ProjectCard project={project} resolveMedia={resolveMedia} onOpen={onOpen} key={project.key} />
          ))}
        </div>
      </div>
    </main>
  );
}

