import { stats } from '../data/portfolio.js'

export default function Stats() {
  return (
    <section className="container" aria-label="At a glance">
      <div className="stats reveal">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat-value">
              <em>{s.value}</em>
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
