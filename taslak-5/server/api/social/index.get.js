import { useDB } from '~/server/utils/db'
export default defineEventHandler(() =>
  useDB().prepare(`SELECT * FROM social_links ORDER BY order_index`).all()
)
