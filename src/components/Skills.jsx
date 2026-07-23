import { tools } from '../data/portfolio.js'

// Each row is rendered twice inside the track. The track scrolls exactly -50%,
// so the second copy lands where the first started — a seamless loop.
function Row({ items, dir, duration }) {
  const group = (dup) => (
    <div className="marquee-group" aria-hidden={dup ? 'true' : undefined}>
      {items.map((item) => (
        <span className="tool-pill" key={`${item}-${dup}`}>
          <span className="tool-dot" />
          {item}
        </span>
      ))}
    </div>
  )

  return (
    <div className="marquee">
      <div
        className={`marquee-track marquee-${dir}`}
        style={{ '--duration': `${duration}s` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section className="section" id="skills">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Toolkit</span>
          <h2 className="section-title">
            Tools that I <em>work with</em>
          </h2>
        </div>
      </div>

      <div className="marquee-wrap reveal">
        {tools.rows.map((row, i) => (
          <Row
            key={i}
            items={row}
            dir={i % 2 === 0 ? 'left' : 'right'}
            duration={44 + i * 8}
          />
        ))}
      </div>
    </section>
  )
}
