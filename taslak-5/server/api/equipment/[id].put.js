// server/api/equipment/[id].put.js
import { requireAdmin } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
import { slugify } from '~/server/utils/helpers'
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const b = await readBody(event)
  useDB().prepare("UPDATE equipment SET name=?, slug=?, category=?, description=?, specs=?, photo_url=?, is_active=?, order_index=?, updated_at=datetime('now') WHERE id=?")
    .run(b.name, b.slug || slugify(b.name), b.category || 'lab', b.description || '', b.specs || '', b.photo_url || '', b.is_active ?? 1, b.order_index || 0, id)
  return { success: true }
})
