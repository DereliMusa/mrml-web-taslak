// server/api/auth/me.get.js
import { getSessionUser } from '~/server/utils/auth'

export default defineEventHandler((event) => {
  const user = getSessionUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Oturum bulunamadi.' })
  return { user: { id: user.user_id, username: user.username, email: user.email, role: user.role } }
})
