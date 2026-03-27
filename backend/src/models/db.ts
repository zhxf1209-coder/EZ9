import initSqlJs, { Database } from 'sql.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '../../data')

if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

const dbPath = join(dataDir, 'bazi.db')

let db: Database

export async function initDB() {
  const SQL = await initSqlJs()
  
  if (existsSync(dbPath)) {
    const buffer = readFileSync(dbPath)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      ai_provider TEXT DEFAULT 'doubao',
      api_key TEXT DEFAULT '',
      model_name TEXT DEFAULT '',
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  try {
    db.run(`ALTER TABLE settings ADD COLUMN model_name TEXT DEFAULT ''`)
  } catch (e) {
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      birth_date TEXT,
      birth_time TEXT,
      gender TEXT,
      partner_birth_date TEXT,
      partner_birth_time TEXT,
      partner_gender TEXT,
      bazi_data TEXT,
      ai_result TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT DEFAULT '本人',
      gender TEXT DEFAULT 'male',
      birth_date TEXT NOT NULL,
      birth_time TEXT NOT NULL,
      location TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS site_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      config_key TEXT UNIQUE NOT NULL,
      config_value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  const existingAdmin = db.exec("SELECT id FROM admins WHERE username = 'admin'")
  if (existingAdmin.length === 0 || existingAdmin[0].values.length === 0) {
    const bcrypt = await import('bcryptjs')
    const hashedPassword = await bcrypt.default.hash('aa631631', 10)
    db.run("INSERT INTO admins (username, password) VALUES (?, ?)", ['admin', hashedPassword])
    console.log('Default admin account created: admin / aa631631')
  }

  const configKeys = ['wechat_qrcode', 'contact_text', 'contact_title']
  for (const key of configKeys) {
    const existing = db.exec(`SELECT id FROM site_config WHERE config_key = '${key}'`)
    if (existing.length === 0 || existing[0].values.length === 0) {
      db.run("INSERT INTO site_config (config_key, config_value) VALUES (?, ?)", [key, ''])
    }
  }

  saveDB()
  console.log('Database initialized')
}

export function saveDB() {
  const data = db.export()
  const buffer = Buffer.from(data)
  writeFileSync(dbPath, buffer)
}

export function getDb(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.')
  }
  return db
}
