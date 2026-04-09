// server/api/users/index.post.js
import bcrypt from 'bcryptjs'
import { requireAdmin } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const b = await readBody(event)
  if (!b.username || !b.email || !b.password) {
    throw createError({ statusCode: 400, message: 'Kullanici adi, e-posta ve sifre gereklidir.' })
  }
  const hash = bcrypt.hashSync(b.password, 12)
  try {
    const r = useDB().prepare('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)')
      .run(b.username, b.email, hash, b.role || 'member')
    return { success: true, id: r.lastInsertRowid }
  } catch {
    throw createError({ statusCode: 400, message: 'Bu kullanici adi veya e-posta zaten kayitli.' })
  }
})
