import { education } from '../data/portfolio.js'

export default function Education() {
  return (
    <section className="section" id="education">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Education</span>
          <h2 className="section-title">
            Academic <em>foundation</em>
          </h2>
        </div>

        <div className="edu-list">
          {education.map((e) => (
            <article className="edu-item reveal" key={e.school}>
              <div>
                <h3 className="edu-school">{e.school}</h3>
                <div className="edu-grade">{e.grade}</div>
              </div>
              <div>
                <div className="edu-degree">{e.degree}</div>
                <p className="edu-detail">{e.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
