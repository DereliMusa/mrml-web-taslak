// server/api/research-areas/index.post.js
import { requireAdmin } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
import { slugify } from '~/server/utils/helpers'
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const b = await readBody(event)
  if (!b.name) throw createError({ statusCode: 400, message: 'Ad zorunludur.' })
  const r = useDB().prepare('INSERT INTO research_areas (name, slug, description, icon, color, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(b.name, b.slug || slugify(b.name), b.description || '', b.icon || 'fa-solid fa-flask', b.color || '#6366f1', b.order_index || 0, b.is_active ?? 1)
  return { success: true, id: r.lastInsertRowid }
})
