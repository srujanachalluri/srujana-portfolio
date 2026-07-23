import { Link } from 'react-router-dom'
import { posts, formatDate } from '../data/posts.js'

export default function Writing() {
  const latest = posts.slice(0, 3)

  return (
    <section className="section" id="writing">
      <div className="container">
        <div className="section-head reveal writing-head">
          <div>
            <span className="eyebrow">Writing</span>
            <h2 className="section-title">
              Notes from the <em>work</em>
            </h2>
          </div>
          <Link to="/blog" className="btn btn-ghost writing-all">
            Read all <span className="arrow">→</span>
          </Link>
        </div>

        <div className="post-grid reveal">
          {latest.map((p) => (
            <Link className="post-card" to={`/blog/${p.slug}`} key={p.slug}>
              <span className="post-cover" aria-hidden="true">{p.cover}</span>
              <div className="post-meta">
                <span>{formatDate(p.date)}</span>
                {p.readingTime && <span>· {p.readingTime}</span>}
              </div>
              <h3 className="post-title">{p.title}</h3>
              <p className="post-excerpt">{p.excerpt}</p>
              <div className="post-tags">
                {p.tags.slice(0, 3).map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
