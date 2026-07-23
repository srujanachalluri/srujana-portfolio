import { featuredResource, resourceLinks } from '../data/portfolio.js'

export default function Resources() {
  const r = featuredResource

  return (
    <section className="section resources" id="resources">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Resources</span>
          <h2 className="section-title">
            Tools &amp; things worth <em>sharing</em>
          </h2>
        </div>

        <div className="res-grid reveal">
          {/* Featured: AI Interview Coach */}
          <article className="res-feature">
            <span className="res-feature-emoji" aria-hidden="true">{r.emoji}</span>
            <span className="res-feature-flag">{r.live ? 'Featured tool' : 'Coming soon'}</span>
            <h3 className="res-feature-title">{r.title}</h3>
            <p className="res-feature-tagline">{r.tagline}</p>
            <p className="res-feature-desc">{r.description}</p>
            <div className="res-feature-stack">
              {r.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
            <a
              className={`btn ${r.live ? 'btn-primary' : 'btn-ghost'} res-feature-cta`}
              href={r.href}
              target="_blank"
              rel="noreferrer"
              aria-disabled={!r.live}
            >
              {r.live ? r.ctaLive : r.ctaSoon} <span className="arrow">→</span>
            </a>
          </article>

          {/* Curated links */}
          <div className="res-links">
            {resourceLinks.map((l) => (
              <a className="res-link" href={l.href} target="_blank" rel="noreferrer" key={l.title}>
                <div className="res-link-top">
                  <h4>{l.title}</h4>
                  <span className="arrow">↗</span>
                </div>
                <p>{l.note}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
