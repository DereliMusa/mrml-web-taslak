import { requireAdmin } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
export default defineEventHandler((event) => {
  requireAdmin(event)
  useDB().prepare('DELETE FROM social_links WHERE id = ?').run(getRouterParam(event, 'id'))
  return { success: true }
})
