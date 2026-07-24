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
    }
  })
  .sort((a, b) => (a.title < b.title ? -1 : 1))

export function getCaseStudy(slug) {
  return caseStudies.find((c) => c.slug === slug)
}
