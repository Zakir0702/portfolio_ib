export function Brands({ brands }) {
  return (
    <section className="brands-section">
      <div className="brands-container">
        <p className="brands-label">Trusted by creators & brands</p>
        <div className="brands-grid">
          {brands.map(brand => <div className="brand-item" key={brand}>{brand}</div>)}
        </div>
      </div>
    </section>
  );
}

