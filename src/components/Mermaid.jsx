import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

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
        sequence: { useMaxWidth: true, actorFontFamily: 'Poppins, system-ui, sans-serif' },
      })
      return mermaid
    })
  }
  return mermaidPromise
}

let idCounter = 0

const MIN_SCALE = 0.4
const MAX_SCALE = 8

export default function Mermaid({ chart }) {
  const ref = useRef(null)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)
  const [zoomSvg, setZoomSvg] = useState(null)

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

  // The zoom view gets its own render pass so the two copies never share
  // element ids (mermaid namespaces arrow markers by render id).
  const openZoom = useCallback(() => {
    setOpen(true)
    if (zoomSvg) return
    loadMermaid()
      .then((mermaid) => mermaid.render(`mermaid-zoom-${++idCounter}`, chart))
      .then(({ svg }) => setZoomSvg(svg))
      .catch(() => setZoomSvg(null))
  }, [chart, zoomSvg])

  if (error) {
    // Fall back to the diagram source rather than showing nothing.
    return (
      <pre className="mermaid-fallback">
        <code>{chart}</code>
      </pre>
    )
  }

  return (
    <>
      <figure className="diagram">
        <button
          type="button"
          className="diagram-surface"
          onClick={openZoom}
          aria-label="Open diagram full screen"
        >
          <div className="mermaid-diagram" ref={ref} />
          <span className="diagram-hint">
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M11 8v6M8 11h6M16.5 16.5L21 21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Click to zoom
          </span>
        </button>
      </figure>
      {open && <DiagramViewer svg={zoomSvg} onClose={() => setOpen(false)} />}
    </>
  )
}

function DiagramViewer({ svg, onClose }) {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const [view, setView] = useState({ k: 1, x: 0, y: 0 })
  const fit = useRef({ k: 1, x: 0, y: 0 })
  const drag = useRef(null)
  const pointers = useRef(new Map())
  const pinch = useRef(null)

  const clamp = (k) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, k))

  // Open on a sensible view rather than the middle of a tall diagram: shrink to
  // fit if that keeps the labels readable, otherwise start at the top and let
  // the reader scroll down through it.
  useEffect(() => {
    if (!svg || !canvasRef.current || !stageRef.current) return
    const ch = canvasRef.current.offsetHeight
    const sh = stageRef.current.clientHeight
    if (!ch || !sh) return
    const k = Math.max(0.6, Math.min(1, (sh - 24) / ch))
    const overflow = ch * k - sh
    fit.current = { k, x: 0, y: overflow > 0 ? overflow / 2 + 12 : 0 }
    setView(fit.current)
  }, [svg])

  const reset = useCallback(() => setView(fit.current), [])

  const zoomBy = useCallback((factor, cx, cy) => {
    setView((v) => {
      const k = clamp(v.k * factor)
      if (k === v.k) return v
      const r = k / v.k
      // Keep the point under the cursor fixed while the scale changes.
      return { k, x: cx - (cx - v.x) * r, y: cy - (cy - v.y) * r }
    })
  }, [])

  // Escape closes, +/- zoom, 0 resets.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === '+' || e.key === '=') zoomBy(1.25, 0, 0)
      else if (e.key === '-' || e.key === '_') zoomBy(0.8, 0, 0)
      else if (e.key === '0') reset()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, zoomBy, reset])

  // Wheel has to be bound manually: React's synthetic handler is passive, so it
  // cannot preventDefault and the page would scroll behind the viewer.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const cx = e.clientX - rect.left - rect.width / 2
      const cy = e.clientY - rect.top - rect.height / 2
      zoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15, cx, cy)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomBy])

  const onPointerDown = (e) => {
    const el = stageRef.current
    el.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y) }
      drag.current = null
    } else {
      drag.current = { x: e.clientX - view.x, y: e.clientY - view.y }
    }
  }

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      const rect = stageRef.current.getBoundingClientRect()
      const cx = (a.x + b.x) / 2 - rect.left - rect.width / 2
      const cy = (a.y + b.y) / 2 - rect.top - rect.height / 2
      zoomBy(dist / pinch.current.dist, cx, cy)
      pinch.current.dist = dist
      return
    }

    if (drag.current) {
      setView((v) => ({ ...v, x: e.clientX - drag.current.x, y: e.clientY - drag.current.y }))
    }
  }

  const endPointer = (e) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinch.current = null
    if (pointers.current.size === 0) drag.current = null
  }

  return createPortal(
    <div className="dv" role="dialog" aria-modal="true" aria-label="Diagram viewer">
      <div className="dv-bar">
        <span className="dv-tip">Drag to move · scroll or pinch to zoom</span>
        <div className="dv-actions">
          <button type="button" onClick={() => zoomBy(0.8, 0, 0)} aria-label="Zoom out">−</button>
          <span className="dv-level">{Math.round(view.k * 100)}%</span>
          <button type="button" onClick={() => zoomBy(1.25, 0, 0)} aria-label="Zoom in">+</button>
          <button type="button" onClick={reset} className="dv-reset">Reset</button>
          <button type="button" onClick={onClose} className="dv-close" aria-label="Close diagram">✕</button>
        </div>
      </div>

      <div
        className="dv-stage"
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onDoubleClick={(e) => {
          const rect = stageRef.current.getBoundingClientRect()
          zoomBy(1.6, e.clientX - rect.left - rect.width / 2, e.clientY - rect.top - rect.height / 2)
        }}
      >
        {svg ? (
          <div
            className="dv-canvas"
            ref={canvasRef}
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})` }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="dv-loading">Rendering diagram…</div>
        )}
      </div>
    </div>,
    document.body,
  )
}
