// server/api/equipment/index.post.js
import { requireAdmin } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
import { slugify } from '~/server/utils/helpers'
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const b = await readBody(event)
  if (!b.name) throw createError({ statusCode: 400, message: 'Ad zorunludur.' })
  const r = useDB().prepare('INSERT INTO equipment (name, slug, category, description, specs, photo_url, is_active, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(b.name, b.slug || slugify(b.name), b.category || 'lab', b.description || '', b.specs || '', b.photo_url || '', b.is_active ?? 1, b.order_index || 0)
  return { success: true, id: r.lastInsertRowid }
})
