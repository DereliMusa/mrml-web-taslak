import { useDB } from '~/server/utils/db'
export default defineEventHandler(() =>
  useDB().prepare(`SELECT * FROM research_areas ORDER BY order_index, id`).all()
)
