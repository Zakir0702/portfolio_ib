export function Testimonials({ testimonials }) {
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <span className="section-tag">Testimonials</span>
          <h2 className="section-heading">Kind words from happy clients</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map(item => (
            <div className="testimonial-card" key={item.name}>
              <div className="testimonial-stars">{item.stars}</div>
              <p className="testimonial-text">"{item.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{item.initials}</div>
                <div>
                  <h4 className="author-name">{item.name}</h4>
                  <p className="author-role">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

