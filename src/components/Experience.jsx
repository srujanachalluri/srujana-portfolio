import { experience } from '../data/portfolio.js'

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-head reveal">
          <span className="section-num">02 —</span>
          <h2 className="section-title">
            Selected <em>experience</em>
          </h2>
        </div>

        <div className="exp-list">
          {experience.map((job) => (
            <article className="exp-item reveal" key={job.role}>
              <div className="exp-meta">
                <div className="exp-period">{job.period}</div>
                <div className="exp-org">{job.org}</div>
                <div className="exp-loc">{job.location}</div>
              </div>
              <div className="exp-detail">
                <h3 className="exp-role">{job.role}</h3>
                <ul className="exp-points">
                  {job.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
                <div className="tags">
                  {job.tags.map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
