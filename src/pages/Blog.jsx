import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import { posts, formatDate } from '../data/posts.js'

export default function Blog() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Writing — Srujana Challuri'
  }, [])

  return (
    <>
      <Nav />
      <main>
        <header className="blog-hero">
          <div className="container">
            <span className="eyebrow reveal in">Writing</span>
            <h1 className="blog-hero-title reveal in">
              Notes on ML, LLMs &amp; <em>shipping software</em>
            </h1>
            <p className="blog-hero-lede reveal in">
              Deep dives on the projects I build — drug-discovery models, LLM evaluation, and
              full-stack systems. Written to be useful, not to impress.
            </p>
          </div>
        </header>

        <section className="section blog-list-section">
          <div className="container">
            <div className="post-list">
              {posts.map((p) => (
                <Link className="post-row" to={`/blog/${p.slug}`} key={p.slug}>
                  <span className="post-row-cover" aria-hidden="true">{p.cover}</span>
                  <div className="post-row-body">
                    <div className="post-meta">
                      <span>{formatDate(p.date)}</span>
                      {p.readingTime && <span>· {p.readingTime}</span>}
                    </div>
                    <h2 className="post-row-title">{p.title}</h2>
                    <p className="post-excerpt">{p.excerpt}</p>
                    <div className="post-tags">
                      {p.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <span className="post-row-arrow arrow" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
