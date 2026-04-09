// server/api/users/[id].delete.js
import { requireAdmin, getSessionUser } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
export default defineEventHandler((event) => {
  const admin = requireAdmin(event)
  const id = parseInt(getRouterParam(event, 'id'))
  if (id === admin.user_id) throw createError({ statusCode: 400, message: 'Kendi hesabinizi silemezsiniz.' })
  useDB().prepare('DELETE FROM users WHERE id = ?').run(id)
  return { success: true }
})
