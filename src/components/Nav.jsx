import { Link, useLocation, useNavigate } from 'react-router-dom'
import { profile } from '../data/portfolio.js'

// Section links live on the home page as anchors.
const sectionLinks = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'resources', label: 'Resources' },
]

export default function Nav() {
  const location = useLocation()
  const navigate = useNavigate()
  const onHome = location.pathname === '/'

  // Scroll to a section if we're on home; otherwise route home, then scroll.
  const goToSection = (e, id) => {
    e.preventDefault()
    if (onHome) {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      history.replaceState(null, '', `#${id}`)
    } else {
      navigate({ pathname: '/', hash: `#${id}` })
    }
  }

  const brandClick = (e) => {
    if (onHome) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      e.preventDefault()
      navigate('/')
    }
  }

  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="/" className="nav-brand" onClick={brandClick}>
          <span className="dot" />
          {profile.name}
        </a>
        <div className="nav-links">
          {sectionLinks.map((l) => (
            <a
              key={l.id}
              href={`/#${l.id}`}
              onClick={(e) => goToSection(e, l.id)}
            >
              {l.label}
            </a>
          ))}
          <Link to="/case-studies">Case Studies</Link>
          <Link to="/blog">Writing</Link>
          <a href="/#contact" onClick={(e) => goToSection(e, 'contact')} className="nav-cta">
            Get in touch
          </a>
        </div>
      </div>
    </nav>
  )
}
