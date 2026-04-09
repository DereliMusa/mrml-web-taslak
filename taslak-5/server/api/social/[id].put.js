// server/api/social/[id].put.js
import { requireAdmin } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const b = await readBody(event)
  useDB().prepare('UPDATE social_links SET url=?, is_active=?, order_index=? WHERE id=?')
    .run(b.url || '', b.is_active ?? 1, b.order_index || 0, id)
  return { success: true }
})
