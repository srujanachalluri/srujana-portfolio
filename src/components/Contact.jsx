import { profile } from '../data/portfolio.js'

export default function Contact() {
  const year = new Date().getFullYear()
  return (
    <section className="contact" id="contact">
      <div className="container contact-inner">
        <span className="eyebrow reveal">Open to opportunities</span>
        <h2 className="reveal" style={{ marginTop: '1.4rem' }}>
          Let&rsquo;s build<br />
          something <em>that ships.</em>
        </h2>

        <a href={`mailto:${profile.email}`} className="contact-mail reveal">
          {profile.email} <span className="arrow">↗</span>
        </a>

        <div className="contact-socials reveal">
          {profile.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
              {s.label} ↗
            </a>
          ))}
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--ink-faint)' }}>
            {profile.location}
          </span>
        </div>
      </div>

      <footer className="footer">
        <span>© {year} {profile.name}</span>
        <span>AI/ML Engineer · Software Developer</span>
        <span>Designed &amp; built with care</span>
      </footer>
    </section>
  )
}
