// Case studies are markdown files in src/content/case-studies/*.md.
// Same loader shape as posts.js — drop in a new .md with frontmatter and it appears.

const modules = import.meta.glob('../content/case-studies/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: raw }

  const [, fm, body] = match
  const data = {}
  for (const line of fm.split('\n')) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!m) continue
    const key = m[1]
    let value = m[2].trim()

    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    } else {
      value = value.replace(/^["']|["']$/g, '')
    }
    data[key] = value
  }
  return { data, body: body.trim() }
}

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '')
}

// A case study can be split into tabbed chapters by dropping
// `<!--chapter:Title-->` markers into the markdown. Anything before the first
// marker becomes the intro of the first chapter. No markers means one chapter.
function splitChapters(body) {
  const marker = /<!--\s*chapter:\s*([^>]*?)\s*-->/g
  const chapters = []
  let last = null
  let cursor = 0
  let m

  while ((m = marker.exec(body)) !== null) {
    if (last) last.body = body.slice(cursor, m.index).trim()
    else if (body.slice(0, m.index).trim()) {
      chapters.push({ id: 'intro', title: 'Intro', body: body.slice(0, m.index).trim() })
    }
    last = { id: slugify(m[1]), title: m[1], body: '' }
    chapters.push(last)
    cursor = m.index + m[0].length
  }

  if (last) last.body = body.slice(cursor).trim()
  if (!chapters.length) return [{ id: 'overview', title: 'Overview', body }]
  return chapters
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export const caseStudies = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw)
    return {
      slug: slugFromPath(path),
      title: data.title || slugFromPath(path),
      subtitle: data.subtitle || '',
      role: data.role || '',
      period: data.period || '',
      readingTime: data.readingTime || '',
      stack: Array.isArray(data.stack) ? data.stack : [],
      excerpt: data.excerpt || '',
      cover: data.cover || '🔧',
      body,
      chapters: splitChapters(body),
    }
  })
  .sort((a, b) => (a.title < b.title ? -1 : 1))

export function getCaseStudy(slug) {
  return caseStudies.find((c) => c.slug === slug)
}
