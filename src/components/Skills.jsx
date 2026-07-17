import { skills } from '../data/portfolio.js'

export default function Skills() {
  return (
    <section className="section" id="skills">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Toolkit</span>
          <h2 className="section-title">
            Tools &amp; <em>technologies</em>
          </h2>
        </div>

        <div className="skills-grid">
          {skills.map((col) => (
            <div className="skill-col reveal" key={col.group}>
              <div className="skill-head">{col.group}</div>
              <ul>
                {col.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
