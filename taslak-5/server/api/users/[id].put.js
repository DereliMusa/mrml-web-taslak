// server/api/users/[id].put.js
import bcrypt from 'bcryptjs'
import { requireAdmin } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const b = await readBody(event)
  const db = useDB()
  if (b.password) {
    const hash = bcrypt.hashSync(b.password, 12)
    db.prepare("UPDATE users SET username=?, email=?, password_hash=?, role=?, is_active=?, updated_at=datetime('now') WHERE id=?")
      .run(b.username, b.email, hash, b.role || 'member', b.is_active ?? 1, id)
  } else {
    db.prepare("UPDATE users SET username=?, email=?, role=?, is_active=?, updated_at=datetime('now') WHERE id=?")
      .run(b.username, b.email, b.role || 'member', b.is_active ?? 1, id)
  }
  return { success: true }
})
