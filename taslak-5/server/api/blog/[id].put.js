// server/api/blog/[id].put.js
import { requireAuth } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
import { slugify } from '~/server/utils/helpers'
export default defineEventHandler(async (event) => {
  requireAuth(event)
  const id = getRouterParam(event, 'id')
  const b = await readBody(event)
  useDB().prepare("UPDATE blog_posts SET title=?, slug=?, content=?, author_id=?, category=?, tags=?, cover_image=?, status=?, published_at=COALESCE(CASE WHEN ? = 'published' THEN datetime('now') END, published_at), updated_at=datetime('now') WHERE id=?")
    .run(b.title, b.slug || slugify(b.title), b.content || '', b.author_id || null, b.category || '', b.tags || '', b.cover_image || '', b.status || 'draft', b.status, id)
  return { success: true }
})
