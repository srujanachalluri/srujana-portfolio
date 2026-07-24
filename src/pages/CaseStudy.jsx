import { useEffect } from 'react'
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

export default function CaseStudy() {
  const { slug } = useParams()
  const study = getCaseStudy(slug)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = study ? `${study.title} — Srujana Challuri` : 'Not found'
  }, [study])

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

            <div className="post-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {study.body}
              </ReactMarkdown>
            </div>

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
