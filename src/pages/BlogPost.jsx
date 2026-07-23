import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Nav from '../components/Nav.jsx'
import { getPost, formatDate } from '../data/posts.js'

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = post ? `${post.title} — Srujana Challuri` : 'Not found'
  }, [post])

  if (!post) {
    return (
      <>
        <Nav />
        <main className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
          <h1 className="section-title">Post not found</h1>
          <p style={{ marginTop: '1rem' }}>
            <Link to="/blog" className="btn btn-ghost">← Back to writing</Link>
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
          <div className="container post-container">
            <Link to="/blog" className="post-back">← All writing</Link>

            <div className="post-head">
              <span className="post-head-cover" aria-hidden="true">{post.cover}</span>
              <div className="post-meta">
                <span>{formatDate(post.date)}</span>
                {post.readingTime && <span>· {post.readingTime}</span>}
              </div>
              <h1 className="post-head-title">{post.title}</h1>
              <div className="post-tags">
                {post.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>

            <div className="post-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
            </div>

            <div className="post-foot">
              <Link to="/blog" className="btn btn-ghost">← Back to all writing</Link>
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
