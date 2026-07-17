import { profile } from '../data/portfolio.js'

export default function Hero() {
  return (
    <header className="hero container" id="top">
      <div className="hero-roles reveal">
        {profile.roles.map((r) => (
          <span key={r}>{r}</span>
        ))}
      </div>

      <h1 className="reveal">
        Srujana
        <span className="line2">Challuri</span>
      </h1>

      <p className="hero-lede reveal">
        I build reliable software across the stack — enterprise backends,
        full-stack web apps, and <span className="em">AI systems</span> — and I
        care about work that actually ships and creates impact.
      </p>

      <div className="hero-meta reveal">
        <a href="#work" className="btn btn-primary">
          View selected work <span className="arrow">↗</span>
        </a>
        <a href={`mailto:${profile.email}`} className="btn btn-ghost">
          {profile.email}
        </a>
      </div>
    </header>
  )
}
