// server/api/projects/index.post.js
import { requireAdmin } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
import { slugify } from '~/server/utils/helpers'
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const b = await readBody(event)
  if (!b.title) throw createError({ statusCode: 400, message: 'Baslik zorunludur.' })
  const r = useDB().prepare('INSERT INTO projects (title, slug, summary, description, status, funding_source, funding_amount, start_date, end_date, research_area_id, is_featured, cover_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(b.title, b.slug || slugify(b.title), b.summary || '', b.description || '', b.status || 'active', b.funding_source || '', b.funding_amount || '', b.start_date || '', b.end_date || '', b.research_area_id || null, b.is_featured ? 1 : 0, b.cover_image || '')
  return { success: true, id: r.lastInsertRowid }
})
