import { useDB } from '~/server/utils/db'
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const row = useDB().prepare(`SELECT p.*, r.name as research_area_name FROM projects p LEFT JOIN research_areas r ON p.research_area_id = r.id WHERE p.id = ? OR p.slug = ?`).get(id, id)
  if (!row) throw createError({ statusCode: 404, message: 'Proje bulunamadi.' })
  return row
})
