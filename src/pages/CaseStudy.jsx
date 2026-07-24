import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Nav from '../components/Nav.jsx'
import Mermaid from '../components/Mermaid.jsx'
import { getCaseStudy } from '../data/caseStudies.js'

// Route ```mermaid fences to the diagram renderer. This has to be handled on
// `pre`, not `code` — otherwise the diagram renders inside the dark <pre> shell
// used for real code blocks.
const components = {
  pre({ children, ...props }) {
    const child = Array.isArray(children) ? children[0] : children
    const className = child?.props?.className || ''
    if (/language-mermaid/.test(className)) {
      return <Mermaid chart={String(child.props.children).trim()} />
    }
    return <pre {...props}>{children}</pre>
  },
}

function chapterFromHash(chapters) {
  const id = window.location.hash.replace(/^#/, '')
  const i = chapters.findIndex((c) => c.id === id)
  return i === -1 ? 0 : i
}

export default function CaseStudy() {
  const { slug } = useParams()
  const study = getCaseStudy(slug)
  const chapters = study?.chapters || []
  const [active, setActive] = useState(() => (chapters.length ? chapterFromHash(chapters) : 0))
  const bodyTop = useRef(null)
  const firstRender = useRef(true)

  useEffect(() => {
    document.title = study ? `${study.title} · Srujana Challuri` : 'Not found'
  }, [study])

  // Deep links and the browser back button both drive the active chapter.
  useEffect(() => {
    if (!chapters.length) return
    const onHash = () => setActive(chapterFromHash(chapters))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [chapters])

  // On a chapter switch, put the reader at the top of the new chapter rather
  // than leaving them mid-page. The first render is left alone so a deep link
  // does not fight the browser's own scroll restoration.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      window.scrollTo(0, 0)
      return
    }
    const el = bodyTop.current
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 90
    window.scrollTo({ top: y, behavior: 'smooth' })
  }, [active])

  if (!study) {
    return (
      <>
        <Nav />
        <main className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
          <h1 className="section-title">Case study not found</h1>
          <p style={{ marginTop: '1rem' }}>
            <Link to="/case-studies" className="btn btn-ghost">← Back to case studies</Link>
          </p>
        </main>
      </>
    )
  }

  const go = (i) => {
    setActive(i)
    if (chapters[i]) window.history.replaceState(null, '', `#${chapters[i].id}`)
  }

  const chapter = chapters[active] || { body: study.body }
  const prev = chapters[active - 1]
  const next = chapters[active + 1]

  return (
    <>
      <Nav />
      <main>
        <article className="post">
          <div className="container post-container cs-container">
            <Link to="/case-studies" className="post-back">← All case studies</Link>

            <div className="post-head">
              <span className="post-head-cover" aria-hidden="true">{study.cover}</span>
              <div className="post-meta">
                {study.role && <span>{study.role}</span>}
                {study.period && <span>· {study.period}</span>}
                {study.readingTime && <span>· {study.readingTime}</span>}
              </div>
              <h1 className="post-head-title">{study.title}</h1>
              {study.subtitle && <p className="cs-subtitle">{study.subtitle}</p>}
              <div className="post-tags">
                {study.stack.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>

            {chapters.length > 1 && (
              <nav className="cs-tabs" aria-label="Case study sections">
                <div className="cs-tabs-track">
                  {chapters.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`cs-tab${i === active ? ' is-active' : ''}`}
                      aria-current={i === active ? 'page' : undefined}
                      onClick={() => go(i)}
                    >
                      <span className="cs-tab-num">{String(i + 1).padStart(2, '0')}</span>
                      {c.title}
                    </button>
                  ))}
                </div>
              </nav>
            )}

            <div className="post-body" ref={bodyTop}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {chapter.body}
              </ReactMarkdown>
            </div>

            {chapters.length > 1 && (
              <div className="cs-pager">
                {prev ? (
                  <button type="button" className="cs-pager-btn" onClick={() => go(active - 1)}>
                    <span className="cs-pager-dir">← Previous</span>
                    <span className="cs-pager-title">{prev.title}</span>
                  </button>
                ) : <span />}
                {next ? (
                  <button type="button" className="cs-pager-btn is-next" onClick={() => go(active + 1)}>
                    <span className="cs-pager-dir">Next →</span>
                    <span className="cs-pager-title">{next.title}</span>
                  </button>
                ) : <span />}
              </div>
            )}

            <div className="post-foot">
              <Link to="/case-studies" className="btn btn-ghost">← All case studies</Link>
              <Link to="/#contact" className="btn btn-primary">
                Get in touch <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </article>
      </main>
    </>
  )
}
