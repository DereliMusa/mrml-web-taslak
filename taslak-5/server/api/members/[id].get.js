// server/api/members/[id].get.js
import { useDB } from '~/server/utils/db'
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const row = useDB().prepare('SELECT * FROM members WHERE id = ? OR slug = ?').get(id, id)
  if (!row) throw createError({ statusCode: 404, message: 'Uye bulunamadi.' })
  return row
})
