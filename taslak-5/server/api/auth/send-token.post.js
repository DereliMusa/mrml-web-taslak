// server/api/auth/send-token.post.js
import { randomBytes } from 'crypto'
import { requireAdmin } from '~/server/utils/auth'
import { useDB, getSetting } from '~/server/utils/db'
import { sendOTPEmail } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const { email, scope } = await readBody(event)
  if (!email) throw createError({ statusCode: 400, message: 'E-posta adresi gereklidir.' })

  const db = useDB()
  const expireHours = parseInt(getSetting('otp_expire_hours') || '24')
  const expiresAt = new Date(Date.now() + expireHours * 60 * 60 * 1000)
    .toISOString().replace('T', ' ').split('.')[0]
  const token = randomBytes(16).toString('hex')

  db.prepare('INSERT INTO temp_tokens (token, email, scope, expires_at) VALUES (?, ?, ?, ?)')
    .run(token, email, scope || 'blog', expiresAt)

  await sendOTPEmail(email, token, scope || 'blog')

  const mode = getSetting('smtp_mode')
  return {
    success: true,
    message: `Token olusturuldu ve ${email} adresine ${mode === 'smtp' ? 'e-posta ile gonderildi' : 'gonderildi (log modu -- konsola yazildi)'}.`,
  }
})
