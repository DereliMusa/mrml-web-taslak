// server/api/blog/index.post.js
import { requireAuth } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
import { slugify } from '~/server/utils/helpers'
export default defineEventHandler(async (event) => {
  requireAuth(event)
  const b = await readBody(event)
  if (!b.title) throw createError({ statusCode: 400, message: 'Baslik zorunludur.' })
  const r = useDB().prepare('INSERT INTO blog_posts (title, slug, content, author_id, category, tags, cover_image, status, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(b.title, b.slug || slugify(b.title), b.content || '', b.author_id || null, b.category || '', b.tags || '', b.cover_image || '', b.status || 'draft', b.status === 'published' ? new Date().toISOString().split('T')[0] : null)
  return { success: true, id: r.lastInsertRowid }
})
