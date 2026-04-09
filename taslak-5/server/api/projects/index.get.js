import { useDB } from '~/server/utils/db'
export default defineEventHandler(() =>
  useDB().prepare(`SELECT p.*, r.name as research_area_name FROM projects p LEFT JOIN research_areas r ON p.research_area_id = r.id ORDER BY p.created_at DESC`).all()
)
