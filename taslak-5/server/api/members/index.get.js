// server/api/members/index.get.js
import { useDB } from '~/server/utils/db'
export default defineEventHandler(() =>
  useDB().prepare('SELECT * FROM members ORDER BY order_index, id').all()
)
