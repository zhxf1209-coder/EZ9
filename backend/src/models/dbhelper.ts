import { Database } from 'sql.js'
import { saveDB } from './db.js'

let db: Database

export function setDb(database: Database) {
  db = database
}

export function prepare(sql: string) {
  return {
    run: (...params: any[]) => {
      db.run(sql, params)
      saveDB()
      const result = db.exec("SELECT last_insert_rowid() as id")
      const lastInsertRowid = result[0]?.values[0]?.[0] || 0
      return { lastInsertRowid }
    },
    get: (...params: any[]) => {
      const stmt = db.prepare(sql)
      stmt.bind(params)
      if (stmt.step()) {
        const row = stmt.getAsObject()
        stmt.free()
        return row
      }
      stmt.free()
      return undefined
    },
    all: (...params: any[]) => {
      const results: any[] = []
      const stmt = db.prepare(sql)
      stmt.bind(params)
      while (stmt.step()) {
        results.push(stmt.getAsObject())
      }
      stmt.free()
      return results
    }
  }
}

export default { prepare }
