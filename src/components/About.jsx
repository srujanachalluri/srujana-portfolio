import { about } from '../data/portfolio.js'

export default function About() {
  return (
    <section className="section about" id="about">
      {/* Decorative: drifting aurora glows + faint grid, behind all content. */}
      <div className="about-bg" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
        <span className="about-grid-lines" />
      </div>

      <div className="container about-content">
        <div className="section-head reveal">
          <span className="eyebrow">About</span>
          <h2 className="section-title">
            Building software that <em>actually ships</em>
          </h2>
        </div>

        <div className="about-grid">
          <aside className="about-aside reveal">
            <span className="eyebrow">Focus areas</span>
            <ul className="about-focus">
              {about.focus.map((f, i) => (
                <li key={f} style={{ '--d': `${i * 90}ms` }}>
                  <span className="about-focus-num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="about-focus-label">{f}</span>
                  <span className="about-focus-arrow">→</span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="about-body reveal">
            {about.paragraphs.map((p, i) => (
              <p key={i}>
                {i === 0 ? <span className="drop">{p.charAt(0)}</span> : null}
                {i === 0 ? p.slice(1) : p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
