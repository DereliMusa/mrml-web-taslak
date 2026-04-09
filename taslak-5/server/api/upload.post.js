// server/api/upload.post.js
// Multipart file upload handler
import { requireAuth } from '~/server/utils/auth'
import { mkdirSync, existsSync, writeFileSync } from 'fs'
import { join, extname } from 'path'
import { randomBytes } from 'crypto'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const contentType = getHeader(event, 'content-type') || ''
  if (!contentType.includes('multipart/form-data')) {
    throw createError({ statusCode: 400, message: 'multipart/form-data bekleniyor.' })
  }

  const boundary = contentType.split('boundary=')[1]
  if (!boundary) throw createError({ statusCode: 400, message: 'Boundary bulunamadi.' })

  const chunks = []
  const rawBody = await readRawBody(event, false)
  const buf = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody || '')

  const boundaryBuf = Buffer.from('--' + boundary)
  const parts = []
  let start = 0
  while (true) {
    const idx = buf.indexOf(boundaryBuf, start)
    if (idx === -1) break
    if (start > 0) parts.push(buf.slice(start, idx - 2))
    start = idx + boundaryBuf.length + 2
  }

  let fileData = null
  let fileName = 'upload'
  for (const part of parts) {
    const headerEnd = part.indexOf('\r\n\r\n')
    if (headerEnd === -1) continue
    const headerStr = part.slice(0, headerEnd).toString()
    const body = part.slice(headerEnd + 4)
    if (headerStr.includes('filename=')) {
      const fnMatch = headerStr.match(/filename="([^"]+)"/)
      if (fnMatch) fileName = fnMatch[1]
      fileData = body
    }
  }

  if (!fileData || fileData.length === 0) {
    throw createError({ statusCode: 400, message: 'Dosya bulunamadi.' })
  }

  const uploadDir = join(process.cwd(), 'public', 'uploads')
  if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true })

  const ext = extname(fileName) || '.bin'
  const safeName = Date.now() + '_' + randomBytes(6).toString('hex') + ext
  writeFileSync(join(uploadDir, safeName), fileData)

  return { success: true, url: `/uploads/${safeName}`, filename: safeName }
})
