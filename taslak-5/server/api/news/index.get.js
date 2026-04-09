import { useDB } from '~/server/utils/db'
export default defineEventHandler(() =>
  useDB().prepare(`SELECT * FROM news ORDER BY created_at DESC`).all()
)
