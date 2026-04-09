// server/api/auth/login.post.js
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { useDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)
  if (!username || !password) {
    throw createError({ statusCode: 400, message: 'Kullanici adi ve sifre gereklidir.' })
  }

  const db = useDB()
  const user = db.prepare(
    'SELECT * FROM users WHERE (username = ? OR email = ?) AND is_active = 1'
  ).get(username, username)

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    throw createError({ statusCode: 401, message: 'Kullanici adi veya sifre yanlis.' })
  }

  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString().replace('T', ' ').split('.')[0]

  db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(token, user.id, expiresAt)

  return { token, user: { id: user.id, username: user.username, email: user.email, role: user.role } }
})
