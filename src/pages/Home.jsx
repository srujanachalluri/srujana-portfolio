import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useReveal } from '../useReveal.js'
import Nav from '../components/Nav.jsx'
import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import Experience from '../components/Experience.jsx'
import Projects from '../components/Projects.jsx'
import Skills from '../components/Skills.jsx'
import Writing from '../components/Writing.jsx'
import Resources from '../components/Resources.jsx'
import Education from '../components/Education.jsx'
import Contact from '../components/Contact.jsx'

export default function Home() {
  useReveal()
  const location = useLocation()

  // When arriving with a hash (e.g. /#contact from another page), scroll to it.
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        // Let the reveal/layout settle first.
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth' }))
      }
    }
  }, [location])

  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Writing />
        <Resources />
        <Education />
        <Contact />
      </main>
    </>
  )
}
