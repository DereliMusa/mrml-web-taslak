import { useDB } from '~/server/utils/db'
export default defineEventHandler(() =>
  useDB().prepare(`SELECT b.*, m.name as author_name FROM blog_posts b LEFT JOIN members m ON b.author_id = m.id ORDER BY b.created_at DESC`).all()
)
