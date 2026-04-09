import { requireAdmin } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
export default defineEventHandler((event) => {
  requireAdmin(event)
  useDB().prepare('DELETE FROM projects WHERE id = ?').run(getRouterParam(event, 'id'))
  return { success: true }
})
