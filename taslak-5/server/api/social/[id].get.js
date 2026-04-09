import { useDB } from '~/server/utils/db'
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const row = useDB().prepare(`SELECT * FROM social_links WHERE id = ?`).get(id, id)
  if (!row) throw createError({ statusCode: 404, message: 'Kayit bulunamadi.' })
  return row
})
