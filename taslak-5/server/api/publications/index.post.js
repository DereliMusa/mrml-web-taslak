// server/api/publications/index.post.js
import { requireAuth } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
import { slugify } from '~/server/utils/helpers'
export default defineEventHandler(async (event) => {
  requireAuth(event)
  const b = await readBody(event)
  if (!b.title || !b.authors) throw createError({ statusCode: 400, message: 'Baslik ve yazarlar zorunludur.' })
  const r = useDB().prepare('INSERT INTO publications (title, slug, authors, journal, year, pub_type, doi, abstract, keywords, research_area_id, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(b.title, b.slug || slugify(b.title), b.authors, b.journal || '', b.year || new Date().getFullYear(), b.pub_type || 'article', b.doi || '', b.abstract || '', b.keywords || '', b.research_area_id || null, b.is_featured ? 1 : 0)
  return { success: true, id: r.lastInsertRowid }
})
