import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import { caseStudies } from '../data/caseStudies.js'

export default function CaseStudies() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Case studies · Srujana Challuri'
  }, [])

  return (
    <>
      <Nav />
      <main>
        <header className="blog-hero">
          <div className="container">
            <span className="eyebrow">Case studies</span>
            <h1 className="blog-hero-title">
              How I <em>actually built it</em>
            </h1>
            <p className="blog-hero-lede">
              Engineering deep dives on the systems I&rsquo;ve delivered. Architecture,
              flow design, code, commands, and the trade-offs behind each decision.
            </p>
          </div>
        </header>

        <section className="blog-list-section">
          <div className="container">
            <div className="post-list">
              {caseStudies.map((c) => (
                <Link className="post-row" to={`/case-studies/${c.slug}`} key={c.slug}>
                  <span className="post-row-cover" aria-hidden="true">{c.cover}</span>
                  <div>
                    <div className="post-meta">
                      {c.role && <span>{c.role}</span>}
                      {c.period && <span>· {c.period}</span>}
                      {c.readingTime && <span>· {c.readingTime}</span>}
                    </div>
                    <h2 className="post-row-title">{c.title}</h2>
                    <p className="post-excerpt">{c.excerpt}</p>
                    <div className="post-tags">
                      {c.stack.slice(0, 6).map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <span className="post-row-arrow" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
