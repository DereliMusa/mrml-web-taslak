// server/api/stats.get.js
import { requireAuth } from '~/server/utils/auth'
import { useDB } from '~/server/utils/db'

export default defineEventHandler((event) => {
  requireAuth(event)
  const db = useDB()
  return {
    members:       db.prepare('SELECT COUNT(*) as c FROM members WHERE is_active = 1').get().c,
    equipment:     db.prepare('SELECT COUNT(*) as c FROM equipment WHERE is_active = 1').get().c,
    publications:  db.prepare('SELECT COUNT(*) as c FROM publications').get().c,
    projects:      db.prepare("SELECT COUNT(*) as c FROM projects WHERE status = 'active'").get().c,
    blog_published:db.prepare("SELECT COUNT(*) as c FROM blog_posts WHERE status = 'published'").get().c,
    blog_draft:    db.prepare("SELECT COUNT(*) as c FROM blog_posts WHERE status = 'draft'").get().c,
    news_published:db.prepare("SELECT COUNT(*) as c FROM news WHERE status = 'published'").get().c,
    research_areas:db.prepare('SELECT COUNT(*) as c FROM research_areas WHERE is_active = 1').get().c,
  }
})
