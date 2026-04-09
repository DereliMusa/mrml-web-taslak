// server/api/members/index.post.js
import { requireAdmin } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'
import { slugify } from '~/server/utils/helpers'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const b = await readBody(event)
  if (!b.name) throw createError({ statusCode: 400, message: 'Ad zorunludur.' })
  const result = useDB().prepare(
    'INSERT INTO members (name, slug, title, role, bio, photo_url, email, research_areas, social_scholar, social_orcid, social_linkedin, social_github, social_researchgate, is_active, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(b.name, b.slug || slugify(b.name), b.title||'', b.role||'phd', b.bio||'', b.photo_url||'', b.email||'', b.research_areas||'[]', b.social_scholar||'', b.social_orcid||'', b.social_linkedin||'', b.social_github||'', b.social_researchgate||'', b.is_active??1, b.order_index||0)
  return { success: true, id: result.lastInsertRowid }
})
