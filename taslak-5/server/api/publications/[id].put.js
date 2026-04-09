// server/api/publications/[id].put.js
import { requireAuth } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
import { slugify } from '~/server/utils/helpers'
export default defineEventHandler(async (event) => {
  requireAuth(event)
  const id = getRouterParam(event, 'id')
  const b = await readBody(event)
  useDB().prepare("UPDATE publications SET title=?, slug=?, authors=?, journal=?, year=?, pub_type=?, doi=?, abstract=?, keywords=?, research_area_id=?, is_featured=?, updated_at=datetime('now') WHERE id=?")
    .run(b.title, b.slug || slugify(b.title), b.authors || '', b.journal || '', b.year || new Date().getFullYear(), b.pub_type || 'article', b.doi || '', b.abstract || '', b.keywords || '', b.research_area_id || null, b.is_featured ? 1 : 0, id)
  return { success: true }
})
