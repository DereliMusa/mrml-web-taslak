import { useDB } from '~/server/utils/db'
export default defineEventHandler(() =>
  useDB().prepare(`SELECT * FROM equipment ORDER BY order_index, id`).all()
)
