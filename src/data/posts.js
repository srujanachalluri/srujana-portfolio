// Blog posts are markdown files in src/content/blog/*.md.
// Add a new .md file with frontmatter and it shows up automatically — no code changes.

// Vite loads every markdown file as a raw string at build time.
const modules = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true })

// Tiny YAML-ish frontmatter parser — supports strings and simple [a, b] arrays.
// Kept dependency-free on purpose (gray-matter needs a Buffer polyfill in the browser).
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

export const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw)
    return {
      slug: slugFromPath(path),
      title: data.title || slugFromPath(path),
      date: data.date || '',
      readingTime: data.readingTime || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      excerpt: data.excerpt || '',
      cover: data.cover || '📝',
      body,
    }
  })
  // Newest first.
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export function getPost(slug) {
  return posts.find((p) => p.slug === slug)
}

export function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
