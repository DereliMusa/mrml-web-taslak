// server/utils/auth.js
// Session-tabanli kimlik dogrulama yardimcilari

import { useDB } from './db'

export function getSessionUser(event) {
  const auth = getHeader(event, 'authorization') || ''
  const token = auth.replace('Bearer ', '').trim()
  if (!token) return null

  const session = useDB().prepare(
    `SELECT s.*, u.id as user_id, u.username, u.email, u.role
     FROM sessions s
     JOIN users u ON s.user_id = u.id
     WHERE s.token = ? AND s.expires_at > datetime('now')`
  ).get(token)

  return session || null
}

export function requireAuth(event) {
  const user = getSessionUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Yetkisiz erisim. Lutfen giris yapin.' })
  }
  return user
}

export function requireAdmin(event) {
  const user = requireAuth(event)
  if (user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Bu islem icin admin yetkisi gereklidir.' })
  }
  return user
}
