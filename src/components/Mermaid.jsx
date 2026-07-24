import { useEffect, useRef, useState } from 'react'

// Mermaid is ~2MB, so it is imported dynamically and only ever loads on a page
// that actually contains a diagram. The home page bundle is unaffected.
let mermaidPromise = null
function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((mod) => {
      const mermaid = mod.default
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        fontFamily: 'Poppins, system-ui, sans-serif',
        theme: 'base',
        themeVariables: {
          background: '#ffffff',
          primaryColor: '#e6fcfd',
          primaryBorderColor: '#33d9e4',
          primaryTextColor: '#0f1720',
          lineColor: '#4a5a6a',
          secondaryColor: '#f5fdfe',
          tertiaryColor: '#ffffff',
          fontSize: '15px',
        },
        flowchart: { curve: 'basis', padding: 20, nodeSpacing: 45, rankSpacing: 50, useMaxWidth: true },
        sequence: { useMaxWidth: true },
      })
      return mermaid
    })
  }
  return mermaidPromise
}

let idCounter = 0

export default function Mermaid({ chart }) {
  const ref = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const id = `mermaid-${++idCounter}`

    loadMermaid()
      .then((mermaid) => mermaid.render(id, chart))
      .then(({ svg }) => {
        if (!cancelled && ref.current) ref.current.innerHTML = svg
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Diagram failed to render')
      })

    return () => {
      cancelled = true
    }
  }, [chart])

  if (error) {
    // Fall back to the diagram source rather than showing nothing.
    return (
      <pre className="mermaid-fallback">
        <code>{chart}</code>
      </pre>
    )
  }

  return <div className="mermaid-diagram" ref={ref} />
}
