// server/api/settings/[key].put.js
import { requireAdmin } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const key = getRouterParam(event, 'key')
  const { value } = await readBody(event)
  useDB().prepare("UPDATE site_settings SET value=?, updated_at=datetime('now') WHERE key=?").run(value || '', key)
  return { success: true }
})
