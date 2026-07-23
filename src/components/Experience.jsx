import { experience } from '../data/portfolio.js'

// "Concordia Bible Institute" -> "CB", "Accenture" -> "AC"
function initials(org) {
  const words = org.split('·')[0].trim().split(/\s+/).filter(Boolean)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Experience</span>
          <h2 className="section-title">
            Where I&rsquo;ve <em>made an impact</em>
          </h2>
        </div>

        <div className="exp-timeline">
          <span className="exp-rail" aria-hidden="true" />

          {experience.map((job, i) => (
            <article className="exp-item reveal" key={job.role}>
              <div className="exp-node" aria-hidden="true">
                <span className="exp-node-dot" />
              </div>

              <div className="exp-card">
                <div className="exp-card-head">
                  <span className="exp-mono" aria-hidden="true">{initials(job.org)}</span>
                  <div className="exp-head-text">
                    <h3 className="exp-role">{job.role}</h3>
                    <div className="exp-org">{job.org}</div>
                  </div>
                  <div className="exp-when">
                    <span className="exp-period">{job.period}</span>
                    <span className="exp-loc">{job.location}</span>
                  </div>
                </div>

                {job.summary && <p className="exp-summary">{job.summary}</p>}

                <ul className="exp-points">
                  {job.points.map((pt, j) => (
                    <li key={j}>{pt}</li>
                  ))}
                </ul>

                <div className="tags">
                  {job.tags.map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>

                <span className="exp-index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
