import { projects } from '../data/portfolio.js'

export default function Projects() {
  return (
    <section className="section" id="work">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Selected work</span>
          <h2 className="section-title">
            Projects &amp; <em>research</em>
          </h2>
        </div>

        <div className="proj-grid reveal">
          {projects.map((p) => (
            <article className="proj-card" key={p.title}>
              <div className="proj-top">
                <span className="proj-num">{p.number}</span>
                <span className="proj-kind">{p.kind}</span>
              </div>
              <h3 className="proj-title">{p.title}</h3>
              <p className="proj-blurb">{p.blurb}</p>
              <div className="proj-stack">
                {p.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
