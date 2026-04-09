// server/api/auth/logout.post.js
import { useDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const auth = getHeader(event, 'authorization') || ''
  const token = auth.replace('Bearer ', '').trim()
  if (token) useDB().prepare('DELETE FROM sessions WHERE token = ?').run(token)
  return { success: true }
})
