// server/api/settings/index.get.js
import { requireAuth } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
export default defineEventHandler((event) => {
  requireAuth(event)
  return useDB().prepare('SELECT * FROM site_settings ORDER BY group_name, key').all()
})
