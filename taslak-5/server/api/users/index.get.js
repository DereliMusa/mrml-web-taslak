// server/api/users/index.get.js
import { requireAdmin } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
export default defineEventHandler((event) => {
  requireAdmin(event)
  return useDB().prepare('SELECT id, username, email, role, is_active, created_at FROM users ORDER BY role, username').all()
})
