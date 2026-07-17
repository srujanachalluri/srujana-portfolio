import { about } from '../data/portfolio.js'

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
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
              {about.focus.map((f) => (
                <li key={f}>{f}</li>
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
