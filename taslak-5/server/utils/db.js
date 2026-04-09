// server/utils/db.js
// SQLite singleton -- tum nitro route'larinda useDB() ile kullan

import Database from 'better-sqlite3'
import { join } from 'path'
import { existsSync } from 'fs'

let _db = null

export function useDB() {
  if (_db) return _db

  const dbPath = join(process.cwd(), 'db', 'mrml.db')

  if (!existsSync(dbPath)) {
    throw new Error('Veritabani bulunamadi. Once "node db/seed.js" calistirin.')
  }

  _db = new Database(dbPath)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')
  return _db
}

export function getSetting(key) {
  return useDB().prepare('SELECT value FROM site_settings WHERE key = ?').get(key)?.value || ''
}
