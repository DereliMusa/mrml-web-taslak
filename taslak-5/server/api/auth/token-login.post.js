// server/api/auth/token-login.post.js
import { randomBytes } from 'crypto'
import { useDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const { token } = await readBody(event)
  if (!token) throw createError({ statusCode: 400, message: 'Token gereklidir.' })

  const db = useDB()
  const tempToken = db.prepare(
    "SELECT * FROM temp_tokens WHERE token = ? AND used = 0 AND expires_at > datetime('now')"
  ).get(token)

  if (!tempToken) throw createError({ statusCode: 401, message: 'Gecersiz veya suresi dolmus token.' })

  db.prepare('UPDATE temp_tokens SET used = 1 WHERE id = ?').run(tempToken.id)

  // Kullanici bul veya olustur
  let memberUser = db.prepare('SELECT * FROM users WHERE email = ?').get(tempToken.email)
  if (!memberUser) {
    const res = db.prepare('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)')
      .run(tempToken.email, tempToken.email, '', 'member')
    memberUser = db.prepare('SELECT * FROM users WHERE id = ?').get(res.lastInsertRowid)
  }

  const sessionToken = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString().replace('T', ' ').split('.')[0]

  db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(sessionToken, memberUser.id, expiresAt)

  return { token: sessionToken, scope: tempToken.scope, user: { email: memberUser.email, role: memberUser.role } }
})
