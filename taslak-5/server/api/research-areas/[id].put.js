// server/api/research-areas/[id].put.js
import { requireAdmin } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
import { slugify } from '~/server/utils/helpers'
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const b = await readBody(event)
  useDB().prepare("UPDATE research_areas SET name=?, slug=?, description=?, icon=?, color=?, order_index=?, is_active=?, updated_at=datetime('now') WHERE id=?")
    .run(b.name, b.slug || slugify(b.name), b.description || '', b.icon || 'fa-solid fa-flask', b.color || '#6366f1', b.order_index || 0, b.is_active ?? 1, id)
  return { success: true }
})
