export function ToolsMarquee({ tools }) {
  const renderRow = keyPrefix => (
    <div className="marquee-content">
      {tools.map(tool => (
        <span className="tool-fragment" key={`${keyPrefix}-${tool}`}>
          <span className="tool-item">{tool}</span>
          <span className="tool-dot" />
        </span>
      ))}
    </div>
  );

  return (
    <section className="tools-marquee">
      <div className="marquee-track">
        {renderRow('a')}
        <div aria-hidden="true">{renderRow('b')}</div>
      </div>
    </section>
  );
}
