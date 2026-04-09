import { useDB } from '~/server/utils/db'
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const row = useDB().prepare(`SELECT * FROM publications WHERE id = ? OR slug = ?`).get(id, id)
  if (!row) throw createError({ statusCode: 404, message: 'Yayin bulunamadi.' })
  return row
})
